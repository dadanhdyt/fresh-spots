import { Handlers } from "$fresh/server.ts";

import path from "path";
import Layout from "@/components/Layout.tsx";
import Landing from "@/components/Landing.tsx";
import config from "@/utils/config.ts";
import Alert from "@/components/Alert.tsx";
import { pageTitle } from "../signals/index.ts";

// Read all image names from directory
// Choose random one
// Show in page...

export const handler: Handlers = {
  async GET(req, ctx) {
    if (ctx.state.userId) {
      return Response.redirect(`${config.base_url}/dashboard`);
    }
    const params = new URLSearchParams(req.url.split("?")[1]);
    const images = [];
    for await (const image of Deno.readDir("./static/images/dinos")) {
      if (image.isFile) {
        images.push(image.name);
      }
    }
    return ctx.render({
      message: params.get("message"),
      image: images[Math.floor(images.length * Math.random())],
    });
  },
};

export default function Home({
  data,
}: {
  data: { message: string; image: string };
}) {
  pageTitle.value = "Fresh Spots";
  return (
    <Layout user={null} flexCol>
      {data.message && <Alert message={data.message} />}
      <Landing image={data.image} />
    </Layout>
  );
}
