import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
const smtpUser = process.env.SMTP_USER || "nextaichatv1@gmail.com";
const smtpPass = process.env.SMTP_PASS || "akqp vrfu oxdg plhx";
const appBaseUrl = process.env.APP_BASE_URL || "http://localhost:3000";

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465, // true for 465, false for other ports
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

/**
 * Send Email Verification link to newly registered user
 */
export async function sendVerificationEmail({ toEmail, name, token }) {
  if (!toEmail) return false;

  const verifyUrl = `${appBaseUrl}/verify-email?token=${encodeURIComponent(token)}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your NextAiChat account</title>
      <style>
        body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030712; color: #f3f4f6; margin: 0; padding: 20px; }
        .container { max-width: 580px; margin: 0 auto; background: #0b0f19; border: 1px solid #2e1065; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(147, 51, 234, 0.15); }
        .logo { text-align: center; margin-bottom: 24px; }
        .logo h1 { font-size: 26px; font-weight: 900; background: linear-gradient(to right, #a855f7, #ec4899, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; }
        h2 { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; }
        p { font-size: 14px; line-height: 1.6; color: #9ca3af; }
        .btn-wrapper { text-align: center; margin: 32px 0; }
        .btn { display: inline-block; background: linear-gradient(90deg, #9333ea, #4f46e5); color: #ffffff !important; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 15px; box-shadow: 0 4px 20px rgba(147, 51, 234, 0.4); }
        .footer { border-top: 1px solid #1f2937; margin-top: 32px; padding-top: 16px; font-size: 12px; color: #6b7280; text-align: center; }
        .link-text { word-break: break-all; font-size: 12px; color: #a855f7; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="https://www.nextaichat.online/logo-landspace.png" alt="NextAiChat Logo" style="max-height: 102px; width: auto; display: inline-block;" />
        </div>
        <h2>Welcome to NextAiChat, ${name || 'User'}! 🚀</h2>
        <p>Thank you for signing up. Please verify your email address to confirm your registration and secure your account.</p>
        <div class="btn-wrapper">
          <a href="${verifyUrl}" class="btn" target="_blank">Verify Email Address</a>
        </div>
        <p>Or copy and paste this URL into your browser:</p>
        <p><a href="${verifyUrl}" class="link-text">${verifyUrl}</a></p>
        <p>This verification link will remain active for your account. If you did not sign up for NextAiChat, please ignore this email.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} NextAiChat Inc. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"NextAiChat Team" <${smtpUser}>`,
      to: toEmail,
      subject: "Verify your email - NextAiChat",
      html: htmlContent,
    });
    console.log("Verification email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
}

/**
 * Send Password Reset link to user who requested forgot password
 */
export async function sendPasswordResetEmail({ toEmail, name, token }) {
  if (!toEmail) return false;

  const resetUrl = `${appBaseUrl}/forgetPassword?token=${encodeURIComponent(token)}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset your password - NextAiChat</title>
      <style>
        body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030712; color: #f3f4f6; margin: 0; padding: 20px; }
        .container { max-width: 580px; margin: 0 auto; background: #0b0f19; border: 1px solid #2e1065; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(147, 51, 234, 0.15); }
        .logo { text-align: center; margin-bottom: 24px; }
        .logo h1 { font-size: 26px; font-weight: 900; background: linear-gradient(to right, #a855f7, #ec4899, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; }
        h2 { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; }
        p { font-size: 14px; line-height: 1.6; color: #9ca3af; }
        .btn-wrapper { text-align: center; margin: 32px 0; }
        .btn { display: inline-block; background: linear-gradient(90deg, #ec4899, #9333ea); color: #ffffff !important; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 15px; box-shadow: 0 4px 20px rgba(236, 72, 153, 0.4); }
        .footer { border-top: 1px solid #1f2937; margin-top: 32px; padding-top: 16px; font-size: 12px; color: #6b7280; text-align: center; }
        .link-text { word-break: break-all; font-size: 12px; color: #ec4899; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="https://www.nextaichat.online/logo-landspace.png" alt="NextAiChat Logo" style="max-height: 102px; width: auto; display: inline-block;" />
        </div>
        <h2>Reset Your Password</h2>
        <p>Hello ${name || 'User'},</p>
        <p>We received a request to reset your password for your NextAiChat account. Click the button below to choose a new password:</p>
        <div class="btn-wrapper">
          <a href="${resetUrl}" class="btn" target="_blank">Reset Password</a>
        </div>
        <p>Or copy and paste this URL into your browser:</p>
        <p><a href="${resetUrl}" class="link-text">${resetUrl}</a></p>
        <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} NextAiChat Inc. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"NextAiChat Team" <${smtpUser}>`,
      to: toEmail,
      subject: "Reset your password - NextAiChat",
      html: htmlContent,
    });
    console.log("Password reset email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
}
