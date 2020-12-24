import { verify } from "https://deno.land/x/ed25519@1.0.1/mod.ts";
import type { FetchEvent } from "https://raw.githubusercontent.com/lucacasonato/deno-fetchevent/master/mod.ts";

// @ts-expect-error this is correct!
addEventListener("fetch", (event: FetchEvent) => {
  const url = new URL(event.request.url);
  console.log(url);
});

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function handle(request: Request): Promise<Response> {
  const signature = request.headers.get("X-Signature-Ed25519");
  const timestamp = request.headers.get("X-Signature-Timestamp");
  if (!signature || !timestamp) {
    return json("missing signature or timestamp", 400);
  }
  const body = await request.text();
  const valid = verify(
    signature,
    timestamp + body,
    "e9ad7ee29f62085af14152d3a70c53b6a7f359996ba9acb668d0dd6e246a321e"
  );
  if (!valid) {
    return json("invalid signature", 401);
  }

  const req = JSON.parse(body);
  console.log(JSON.stringify(req, undefined, 2));
  switch (req.type) {
    case 1:
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
