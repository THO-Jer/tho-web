type BrowserOtpPayload = {
  email: string;
  options?: {
    emailRedirectTo?: string;
    shouldCreateUser?: boolean;
  };
};

type BrowserOAuthPayload = {
  provider: string;
  options?: {
    redirectTo?: string;
    scopes?: string;
    queryParams?: Record<string, string>;
    skipBrowserRedirect?: boolean;
  };
};

type BrowserAuthResult<TData = unknown> = {
  data: TData | null;
  error: { status: number; message: string } | null;
  response?: Response;
};

export function createSupabaseBrowserAuthClient(url: string, anonKey: string) {
  const baseUrl = String(url || "").trim().replace(/\/$/, "");
  const apiKey = String(anonKey || "").trim();

  return {
    auth: {
      async signInWithOtp(payload: BrowserOtpPayload): Promise<BrowserAuthResult> {
        const res = await fetch(`${baseUrl}/auth/v1/otp`, {
          method: "POST",
          headers: {
            apikey: apiKey,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: payload.email,
            create_user: payload.options?.shouldCreateUser ?? true,
            email_redirect_to: payload.options?.emailRedirectTo,
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

      async signInWithOAuth(payload: BrowserOAuthPayload): Promise<BrowserAuthResult<{ provider: string; url: string }>> {
        const authorizeUrl = new URL(`${baseUrl}/auth/v1/authorize`);
        authorizeUrl.searchParams.set("provider", payload.provider);

        if (payload.options?.redirectTo) {
          authorizeUrl.searchParams.set("redirect_to", payload.options.redirectTo);
        }

        if (payload.options?.scopes) {
          authorizeUrl.searchParams.set("scopes", payload.options.scopes);
        }

        if (payload.options?.queryParams) {
          for (const [key, value] of Object.entries(payload.options.queryParams)) {
            authorizeUrl.searchParams.set(key, value);
          }
        }

        if (!payload.options?.skipBrowserRedirect && typeof window !== "undefined") {
          window.location.assign(authorizeUrl.toString());
        }

        return {
          data: { provider: payload.provider, url: authorizeUrl.toString() },
          error: null,
        };
      },
    },
  };
}
