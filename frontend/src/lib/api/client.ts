import "server-only";

import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/api/config";
import { ApiError, parseApiError } from "@/lib/api/errors";

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
};

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, token, headers, ...rest } = options;
  const accessToken =
    token ?? (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    throw await parseApiError(res);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export async function requireApiAccess(): Promise<string> {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) {
    throw new ApiError("Not authenticated", 401);
  }
  return token;
}
