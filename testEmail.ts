import { Resend } from "resend";

const resend = new Resend("re_hLepYUV5_7YZoUfNJf9aB1FZdq9w6JdhL");

async function testEmail() {
  try {
    const result = await resend.emails.send({
      from: "test@resend.dev", // use dev email
      to: ["mprakhar07@gmail.com"], // your email
      subject: "Test Email from QuietHours",
      text: "This is a test email from Resend API using dev domain.",
    });
    console.log("Email sent:", result);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

testEmail();
