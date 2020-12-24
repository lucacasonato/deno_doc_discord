import { verify, utils } from "https://deno.land/x/ed25519@1.0.1/mod.ts";
import type { FetchEvent } from "https://raw.githubusercontent.com/lucacasonato/deno-fetchevent/master/mod.ts";

// @ts-expect-error this is correct!
addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handle(event.request));
});

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function handle(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return json("method must be POST", 405);
  }

  const signature = request.headers.get("X-Signature-Ed25519");
  const timestamp = request.headers.get("X-Signature-Timestamp");
  if (!signature || !timestamp) {
    return json("missing signature or timestamp", 400);
  }
  const body = await request.text();
  const valid = await verify(
    signature,
    new TextEncoder().encode(`${timestamp}${body}`),
    "e9ad7ee29f62085af14152d3a70c53b6a7f359996ba9acb668d0dd6e246a321e"
  );
  console.log(
    `Signature valid? ${valid} -> ${signature} == ${timestamp + body}`
  );
  if (!valid) {
    return json("invalid signature", 401);
  }

  const req = JSON.parse(body);
  switch (req.type) {
    case 1:
      console.log(`Recieved ping request: ${req.id}`);
      return json({ type: 1 });
    case 2:
      switch (req.data.name) {
        case "ping":
          return json({
            type: 4,
            data: {
              content: "pong",
            },
          });
        default:
          return json("unhandled command type", 400);
      }
    default:
      return json("unknown request type", 400);
  }
}
