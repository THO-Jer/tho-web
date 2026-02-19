export type Mail = { to: string; subject: string; text: string };

export async function sendMail(_mail: Mail) {
  // MVP: sin proveedor de correo configurado.
  // En producción lo conectamos a un proveedor (Resend/Mailgun/SMTP).
  // Por ahora: no rompe nada; deja log en server.
  console.log("[MAIL STUB]", _mail.subject, "->", _mail.to);
  return { ok: true, stub: true };
}
