import type { Session, User } from "@supabase/supabase-js";

type AuthResponseData = {
  user: User | null;
  session: Pick<Session, "user"> | null;
};

export function authenticatedUserFromResponse(data: AuthResponseData) {
  return data.session?.user ?? null;
}

export function campaignCreationRedirect(user: Pick<User, "id"> | null) {
  return user ? null : "/dashboard?next=/start";
}
