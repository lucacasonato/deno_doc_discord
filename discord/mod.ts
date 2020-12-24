import { verify } from "https://deno.land/x/ed25519@1.0.1/mod.ts";
import type { FetchEvent } from "https://raw.githubusercontent.com/lucacasonato/deno-fetchevent/master/mod.ts";
import {
  Interaction,
  InteractionType,
  InteractionResponseCommand,
  ApplicationCommandInteractionData,
} from "./types.ts";
export * from "./types.ts";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function handle(
  publicKey: string,
  handlers: BotHandlers,
  request: Request
): Promise<Response> {
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
    publicKey
  );
  console.log(
    `Signature valid? ${valid} -> ${signature} == ${timestamp + body}`
  );
  if (!valid) {
    return json("invalid signature", 401);
  }

  const req = JSON.parse(body) as Interaction;
  switch (req.type) {
    case InteractionType.PING:
      console.log(`Recieved ping request: ${req.id}`);
      return json({ type: 1 });
    case InteractionType.COMMAND:
      console.log(`Recieved command: ${JSON.stringify(req.data)}`);
      return json(await handlers.command(req.data));
    default:
      return json("unknown request type", 400);
  }
}

export interface BotHandlers {
  command(
    data: ApplicationCommandInteractionData
  ): Promise<InteractionResponseCommand>;
}

export function bot(publicKey: string, handlers: BotHandlers) {
  // @ts-expect-error this is correct!
  addEventListener("fetch", (event: FetchEvent) => {
    event.respondWith(handle(publicKey, handlers, event.request));
  });
}
