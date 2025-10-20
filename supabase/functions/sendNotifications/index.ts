// File: supabase/functions/sendNotifications/index.ts

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

// ---------- CONFIG ----------
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const CRON_SECRET = Deno.env.get("X_CRON_SECRET")!;

// ---------- EMAIL TEMPLATE ----------
function buildQuietHoursEmail(
  fullName: string,
  blockTitle: string,
  startTime: string
) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Quiet Hours Reminder</title>
    <style>
      body { font-family: 'Segoe UI', Roboto, sans-serif; background:#f4f6f8; margin:0; padding:0; color:#333; }
      .container { max-width:600px; margin:20px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);}
      .header { background:#4f46e5; color:#fff; padding:20px; text-align:center; font-size:24px; font-weight:bold; }
      .content { padding:30px 20px; line-height:1.6; font-size:16px; }
      .content h2 { color:#111827; }
      .button { display:inline-block; margin-top:20px; padding:12px 24px; background:#4f46e5; color:#fff; text-decoration:none; border-radius:8px; font-weight:bold; }
      .footer { background:#f4f6f8; text-align:center; padding:15px; font-size:12px; color:#6b7280; }
      @media screen and (max-width:640px) { .container { margin:10px; } .content { padding:20px; } }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">⏰ Quiet Hours Reminder</div>
      <div class="content">
        <h2>Hello ${fullName},</h2>
        <p>Your study block <strong>"${blockTitle}"</strong> is starting soon.</p>
        <p><strong>Start Time:</strong> ${startTime}</p>
        <a class="button" href="#">View Schedule</a>
        <p>Stay focused and make the most of your quiet hours!</p>
      </div>
      <div class="footer">
        Quiet Hours • © 2025 Prakhar Mishra<br/>
        You are receiving this email because you scheduled a study block.
      </div>
    </div>
  </body>
  </html>
  `;
}

// ---------- EMAIL HELPER USING FETCH ----------
async function sendEmail(
  to: string,
  subject: string,
  fullName: string,
  blockTitle: string,
  startTime: string,
  retries = 3
) {
  const body = {
    from: "Quiet Hours <noreply@prakharhq.site>",
    to: [to],
    subject,
    html: buildQuietHoursEmail(fullName, blockTitle, startTime),
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Resend API error: ${res.status} ${text}`);
      }

      console.log(`✅ Email sent to ${to}`);
      return;
    } catch (err) {
      console.warn(`⚠️ Attempt ${attempt} failed for ${to}:`, err);
      if (attempt === retries) throw err;
    }
  }
}

// ---------- CRON HANDLER ----------
serve(async (req) => {
  try {
    // 1️⃣ Verify cron secret from header
    const secret = req.headers.get("x-cron-secret");
    if (!secret || secret !== CRON_SECRET) {
      console.warn("❌ Unauthorized cron attempt");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(
      "🚀 Quiet Hours Reminder cron triggered:",
      new Date().toISOString()
    );

    const now = new Date();
    const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);

    // 2️⃣ Fetch upcoming blocks
    const { data: blocks, error: fetchError } = await supabase
      .from("blocks")
      .select(
        `id, title, start_time, user_id, notified, profiles!inner(email, full_name)`
      )
      .eq("notified", false)
      .lte("start_time", tenMinutesLater.toISOString())
      .gte("start_time", now.toISOString());

    if (fetchError) throw fetchError;

    if (!blocks || blocks.length === 0) {
      console.log("ℹ️ No upcoming blocks to notify.");
      return new Response(
        JSON.stringify({ success: true, message: "No notifications" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log(`📦 Found ${blocks.length} blocks to notify.`);

    // 3️⃣ Send emails & log notifications
    for (const block of blocks) {
      const email = block.profiles?.email;
      const fullName = block.profiles?.full_name || "";

      if (!email) {
        console.warn(`⚠️ Block ${block.id} has no associated email.`);
        continue;
      }

      try {
        await sendEmail(
          email,
          "⏰ Quiet Hours Reminder",
          fullName,
          block.title,
          new Date(block.start_time).toLocaleString()
        );

        await supabase
          .from("blocks")
          .update({ notified: true })
          .eq("id", block.id)
          .eq("notified", false);

        await supabase.from("notifications").insert({
          block_id: block.id,
          user_id: block.user_id,
          user_email: email,
          send_at: new Date().toISOString(),
          status: "sent",
          notified_at: new Date().toISOString(),
        });

        console.log(
          `✅ Reminder logged for block ${block.id} (${block.title})`
        );
      } catch (err) {
        console.error(`❌ Error processing block ${block.id}:`, err);

        await supabase.from("notifications").insert({
          block_id: block.id,
          user_id: block.user_id,
          user_email: email,
          send_at: new Date().toISOString(),
          status: "failed",
          error_message: err.message || "Unknown error",
        });
      }
    }

    console.log("🎯 All reminders processed successfully.");
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("🚨 Cron job failed:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
