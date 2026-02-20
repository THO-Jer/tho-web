import { Resend } from "resend";

export type Mail = { to: string; subject: string; text: string };

export async function sendMail(mail: Mail) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  const toDefault = process.env.MAIL_TO;

  if (!apiKey) throw new Error("Missing RESEND_API_KEY");
  if (!from) throw new Error("Missing MAIL_FROM");
  const to = mail.to || toDefault;
  if (!to) throw new Error("Missing MAIL_TO or mail.to");

  const resend = new Resend(apiKey);

  const result = await resend.emails.send({
    from,
    to,
    subject: mail.subject,
    text: mail.text,
  });

  return result;
}
