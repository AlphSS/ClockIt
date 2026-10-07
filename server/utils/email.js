import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function sendVerificationEmail({
  to,
  username,
  verificationLink,
}) {
  return transporter.sendMail({
    from: `"ClockIt" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your ClockIt account",
    text: `Hi ${username},

Welcome to ClockIt!

Please verify your email by clicking the link below:

${verificationLink}

If you did not create this account, you can ignore this email.

Regards,
ClockIt Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Welcome to ClockIt 👋</h2>

        <p>Hi ${username},</p>

        <p>
          Thanks for creating your ClockIt account.
          Please verify your email address by clicking the button below.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a
            href="${verificationLink}"
            style="
              background: #2563eb;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              display: inline-block;
            "
          >
            Verify Email
          </a>
        </div>

        <p>
          If you did not create this account, you can safely ignore this email.
        </p>

        <p>
          Regards,<br>
          ClockIt Team
        </p>
      </div>
    `,
  });
}

export async function sendCollegeVerificationEmail({
  to,
  otp,
}) {
  return transporter.sendMail({
    from: `"ClockIt" <${process.env.EMAIL_USER}>`,
    to,
    subject: "ClockIt College Email Verification",
    text: `Your ClockIt college email verification code is: ${otp}

This code is valid for a limited time.

If you did not request this code, you can ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
        <h2>College Email Verification</h2>

        <p>Your ClockIt verification code is:</p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          text-align: center;
          margin: 30px 0;
        ">
          ${otp}
        </div>

        <p>This code is valid for a limited time.</p>

        <p>If you did not request this code, you can safely ignore this email.</p>

        <p>Regards,<br>ClockIt Team</p>
      </div>
    `,
  });
}