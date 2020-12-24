import {
  bot,
  BotHandlers,
  ApplicationCommandInteractionData,
  InteractionResponseCommand,
  InteractionResponseType,
} from "./discord/mod.ts";

async function command(
  data: ApplicationCommandInteractionData
): Promise<InteractionResponseCommand> {
  console.log(`Command: ${JSON.stringify(data)}`);
  switch (data.name) {
    case "deno":
      const subcommand = data.options?.[0];
      switch (subcommand?.name) {
        case "doc":
          const module = subcommand.options!.find((o) => o.name === "module")!
            .value as string;
          const filter = subcommand.options!.find((o) => o.name === "filter")!
            .value as string;

          let url: URL;
          try {
            url = new URL(module);
          } catch {
            return rts("Invalid module URL.");
          }
          const docURL = `https://doc.deno.land/api/docs?entrypoint=${encodeURIComponent(
            url.toString()
          )}`;
          let res: Response;
          try {
            res = await fetch(docURL);
            if (res.status == 404) {
              console.log(await res.text());
              return rts("Module not found.");
            } else if (res.status != 200) {
              console.log(await res.text());
              return rts("Failed to generate module documentation.");
            }
          } catch (err) {
            console.log(err);
            return rts("Failed to generate module documentation.");
          }
          const docs = await res.json();
          console.log(JSON.stringify(docs));

          return {
            type: InteractionResponseType.CHANNEL_MESSAGE,
            data: {
              content: "",
              embeds: [
                {
                  url: `https://doc.deno.land/https/${url.host}${url.pathname}`,
                  type: "rich",
                  provider: {
                    name: "deno doc",
                    url: "https://doc.deno.land",
                  },
                },
              ],
              tts: true,
            },
          };
      }
    default:
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE,
        data: { content: "Unknown command." },
      };
  }
}

function rts(message: string): InteractionResponseCommand {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE,
    data: {
      content: message,
      allowed_mentions: {
        parse: [],
        replied_user: false,
        roles: [],
        users: [],
      },
    },
  };
}

bot("e9ad7ee29f62085af14152d3a70c53b6a7f359996ba9acb668d0dd6e246a321e", {
  command,
});
