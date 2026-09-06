/** Server-side calls prefer API_BASE_URL (Docker internal); browser uses NEXT_PUBLIC_API_BASE_URL. */
export function getApiBaseUrl(): string {
  const base =
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL;
  return base?.replace(/\/$/, "") || "http://localhost:8000/api/v1";
}
