export type BrowserOtpPayload = {
  email: string;
  options?: {
    emailRedirectTo?: string;
    shouldCreateUser?: boolean;
  };
};

export function createSupabaseBrowserAuthClient(url: string, anonKey: string) {
  const baseUrl = String(url || "").trim().replace(/\/$/, "");
  const apiKey = String(anonKey || "").trim();

  return {
    auth: {
      async signInWithOtp(payload: BrowserOtpPayload) {
        const res = await fetch(`${baseUrl}/auth/v1/otp`, {
          method: "POST",
          headers: {
            apikey: apiKey,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: payload.email,
            create_user: payload.options?.shouldCreateUser ?? true,
            should_create_user: payload.options?.shouldCreateUser ?? true,
            options: {
              emailRedirectTo: payload.options?.emailRedirectTo,
              shouldCreateUser: payload.options?.shouldCreateUser ?? true,
            },
            email_redirect_to: payload.options?.emailRedirectTo,
            redirect_to: payload.options?.emailRedirectTo,
          }),
        });

        if (!res.ok) {
          return {
            data: null,
            error: {
              status: res.status,
              message: await res.text(),
            },
            response: res,
          };
        }

        const data = await res.json().catch(() => ({}));
        return { data, error: null, response: res };
      },
    },
  };
}
