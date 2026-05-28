export type Mail = { to: string; subject: string; text: string; html?: string };

const RESEND_API_URL = "https://api.resend.com/emails";

export async function sendMail(mail: Mail) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM || "THO Web <noreply@tho.cl>";

  if (!apiKey) {
    console.log("[MAIL STUB]", mail.subject, "->", mail.to);
    return { ok: true, stub: true };
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [mail.to],
      subject: mail.subject,
      text: mail.text,
      ...(mail.html ? { html: mail.html } : {}),
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Resend error (${response.status}): ${err}`);
  }

  return { ok: true, provider: "resend" };
}
