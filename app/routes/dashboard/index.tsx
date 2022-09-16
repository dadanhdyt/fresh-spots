import { Handlers, PageProps } from "$fresh/server.ts";

import State from "@/schemas/State.ts";
import db, { jsonb_agg } from "@/db/db.ts";
import { UserWithSocialProfiles } from "@/db/tables/CombinedTables.ts";
import Layout from "@/components/Layout.tsx";
import FreshMap from "@/islands/FreshMap.tsx";
import config from "@/utils/config.ts";
import Sidebar from "@/islands/Sidebar.tsx";
import { pageTitle } from "../../signals/index.ts";

export const handler: Handlers<UserWithSocialProfiles | null, State> = {
  async GET(req, ctx) {
    if (ctx.state.userId) {
      const user = await db
        .selectFrom("user")
        .selectAll()
        .select(
          (qb) =>
            jsonb_agg(
              qb.selectFrom("social_profile")
                .selectAll()
                .whereRef("social_profile.user_id", "=", "user.id"),
            )
              .as("social_profiles"),
        )
        .where("id", "=", ctx.state.userId)
        .executeTakeFirst();
      if (user) {
        return ctx.render(user as unknown as UserWithSocialProfiles);
      }
    }
    return Response.redirect(`${config.base_url}?message=UnAuthorized`);
  },
};

export default function Home(
  { data }: PageProps<UserWithSocialProfiles | null>,
) {
  pageTitle.value = 'Dashboard';
  // TODO: use a signal
  return (
    <Layout user={data}>
      <div class="mt-3 w-full flex flex-col justify-center items-center">
        <a href="/dashboard/edit/abc123" class="btn btn-lg btn-info">
          CREATE A LIST
        </a>
        <h2>You have not created any lists!</h2>
      </div>
    </Layout>
  );
}