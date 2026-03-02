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

type BrowserAuthResponse = { data: unknown; error: { message: string } | null };

type SupabaseClientLike = {
  auth: {
    signInWithOtp: (payload: BrowserOtpPayload) => Promise<BrowserAuthResponse>;
    signInWithOAuth: (payload: BrowserOAuthPayload) => Promise<BrowserAuthResponse>;
  };
};

let supabaseSdkPromise: Promise<{ createClient: (url: string, key: string) => SupabaseClientLike }> | null = null;

async function loadSupabaseSdk() {
  if (!supabaseSdkPromise) {
    const dynamicImport = new Function("moduleUrl", "return import(moduleUrl);") as (moduleUrl: string) => Promise<{ createClient: (url: string, key: string) => SupabaseClientLike }>;
    supabaseSdkPromise = dynamicImport("https://esm.sh/@supabase/supabase-js@2");
  }
  return supabaseSdkPromise;
}

export function createSupabaseBrowserAuthClient(url: string, anonKey: string) {
  const baseUrl = String(url || "").trim().replace(/\/$/, "");
  const apiKey = String(anonKey || "").trim();
  let cachedClient: SupabaseClientLike | null = null;

  const getClient = async () => {
    if (cachedClient) return cachedClient;
    const { createClient } = await loadSupabaseSdk();
    cachedClient = createClient(baseUrl, apiKey);
    return cachedClient;
  };

  return {
    auth: {
      async signInWithOtp(payload: BrowserOtpPayload) {
        const client = await getClient();
        return client.auth.signInWithOtp(payload);
      },
      async signInWithOAuth(payload: BrowserOAuthPayload) {
        const client = await getClient();
        return client.auth.signInWithOAuth(payload);
      },
    },
  };
}
