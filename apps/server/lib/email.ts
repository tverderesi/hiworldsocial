import nodemailer from "nodemailer";
import { Resend } from "resend";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

function getEmailTransport(): "resend" | "smtp" {
  return process.env.EMAIL_TRANSPORT === "smtp" ? "smtp" : "resend";
}

async function sendWithSmtp({ to, subject, html, from }: SendEmailInput) {
  // Dev uses Mailpit over SMTP so emails stay local and viewable in its inbox UI.
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "localhost",
    port: Number(process.env.SMTP_PORT ?? "1025"),
    secure: false,
  });

  return transporter.sendMail({
    from: from ?? process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
    to,
    subject,
    html,
  });
}

export async function sendEmail({ to, subject, html, from }: SendEmailInput) {
  if (getEmailTransport() === "smtp") {
    return sendWithSmtp({ to, subject, html, from });
  }

  // Production/default path: send through Resend's HTTP API.
  const resend = new Resend(getRequiredEnv("RESEND_API_KEY"));

  return resend.emails.send({
    from: from ?? process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
    to,
    subject,
    html,
  });
}
