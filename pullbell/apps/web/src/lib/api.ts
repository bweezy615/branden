// Helpers for Route Handlers (server only).
import { DEVICE_HEADER, deviceExists, isCategory, NotFoundError, type Category } from "@pullbell/db";

export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function requireDevice(request: Request): Promise<string> {
  const deviceId = request.headers.get(DEVICE_HEADER);
  if (!deviceId || !UUID.test(deviceId)) throw new HttpError(401, `Missing or invalid ${DEVICE_HEADER} header`);
  if (!(await deviceExists(deviceId))) throw new HttpError(401, "Unknown device");
  return deviceId;
}

// Reads the optional ?category= filter shared by the list endpoints.
export function categoryParam(params: URLSearchParams): Category | undefined {
  const value = params.get("category");
  if (value === null) return undefined;
  if (!isCategory(value)) throw new HttpError(400, `Unknown category: ${value}`);
  return value;
}

// Turns known errors into JSON error responses; anything else is a 500 and is rethrown to the logs.
export async function respond(run: () => Promise<unknown>): Promise<Response> {
  try {
    const body = await run();
    return body === undefined ? new Response(null, { status: 204 }) : Response.json(body);
  } catch (error) {
    if (error instanceof HttpError) return Response.json({ error: error.message }, { status: error.status });
    if (error instanceof NotFoundError) return Response.json({ error: error.message }, { status: 404 });
    throw error;
  }
}
