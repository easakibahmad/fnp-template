import { getApiBaseUrl } from "@/lib/api/config";
import { parseApiError } from "@/lib/api/errors";

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export async function loginWithPassword(
  email: string,
  password: string,
): Promise<TokenResponse> {
  const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw await parseApiError(res);
  }

  const raw = (await res.json()) as {
    access_token: string;
    refresh_token: string;
    token_type: string;
  };

  return {
    accessToken: raw.access_token,
    refreshToken: raw.refresh_token,
    tokenType: raw.token_type,
  };
}

export async function bootstrapSystemAdmin(input: {
  email: string;
  password: string;
  name: string;
}): Promise<TokenResponse> {
  const res = await fetch(`${getApiBaseUrl()}/auth/bootstrap-system-admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!res.ok) {
    throw await parseApiError(res);
  }

  const raw = (await res.json()) as {
    access_token: string;
    refresh_token: string;
    token_type: string;
  };

  return {
    accessToken: raw.access_token,
    refreshToken: raw.refresh_token,
    tokenType: raw.token_type,
  };
}
