import { ZodError } from "zod";

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export function validationMessage(error: ZodError) {
  const issue = error.issues[0];
  if (!issue) return "Please check the form and try again.";
  const field = issue.path.join(" ");
  return `${field ? `${field}: ` : ""}${issue.message}`;
}

export function clientIp(request: Request) {
  return (
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "local"
  );
}
