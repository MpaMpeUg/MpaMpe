export type AdminResponse = {
  message?: string;
  error?: string;
  [key: string]: unknown;
};

export async function readAdminResponse(response: Response): Promise<AdminResponse> {
  const body = await response.text();
  let result: AdminResponse = {};

  if (body) {
    try {
      result = JSON.parse(body) as AdminResponse;
    } catch {
      result = {};
    }
  }

  if (!response.ok) {
    throw new Error(
      result.error || result.message || `Admin action failed (${response.status}).`,
    );
  }

  return result;
}
