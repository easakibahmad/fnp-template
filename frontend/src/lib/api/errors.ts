export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public detail?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function parseApiError(res: Response): Promise<ApiError> {
  let detail: string | undefined;
  try {
    const body = (await res.json()) as { detail?: string | { msg?: string }[] };
    if (typeof body.detail === "string") {
      detail = body.detail;
    } else if (Array.isArray(body.detail)) {
      detail = body.detail.map((d) => d.msg ?? JSON.stringify(d)).join(", ");
    }
  } catch {
    detail = res.statusText;
  }
  return new ApiError(detail ?? `Request failed (${res.status})`, res.status, detail);
}
