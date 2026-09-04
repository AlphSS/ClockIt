import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCollegeVerificationEmail(collegeEmail, otp) {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: [collegeEmail],
    subject: "ClockIt College Email Verification",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 500px;
        margin: 40px auto;
        padding: 30px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
      ">
        <h2>Verify your college email</h2>

        <p>
          You requested to verify your college email address for ClockIt.
        </p>

        <p>Your verification code is:</p>

        <div style="
          margin: 25px 0;
          padding: 18px;
          background: #f3f4f6;
          border-radius: 8px;
          text-align: center;
        ">
          <span style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
          ">
            ${otp}
          </span>
        </div>

        <p>
          This code will expire in 10 minutes.
        </p>

        <p>
          If you did not request this verification, you can ignore this email.
        </p>

        <p>
          — ClockIt
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error("Unable to send verification email.");
  }

  return data;
}
