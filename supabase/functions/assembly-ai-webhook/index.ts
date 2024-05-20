import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (request) => {
  let status = 500;
  try {
    const body = await request.json();
    const headers = await request.headers;
    const secret = headers.get("x-shared-secret");

    console.log(`Headers: ${JSON.stringify(Array.from(headers))}`);
    //const hdrs = Array.from(headers);
    //hdrs.forEach((p) => console.log(`p: ${JSON.stringify(p)}`));

    if (secret !== Deno.env.get("ASSEMBLY_AI_SHARED_SECRET")) {
      status = 401;

      console.log(
        `Invalid shared secret: ${secret} expect: ${Deno.env.get(
          "ASSEMBLY_AI_SHARED_SECRET"
        )}`
      );
    } else {
      console.log(`Received: ${JSON.stringify(body)}`);
      status = 200;
    }
  } catch (e) {
    console.log(e);
  } finally {
    return new Response(JSON.stringify({}), { status });
  }
});
