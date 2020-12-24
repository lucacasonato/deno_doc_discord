import {
  bot,
  BotHandlers,
  ApplicationCommandInteractionData,
  InteractionResponseCommand,
  InteractionResponseType,
} from "./discord/mod.ts";
import {
  DocNode,
  expandNamespaces,
  flattenNamespaces,
  findNodeByScopedName,
  nodeName,
} from "./docs.ts";

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
          const data: DocsData = await res.json();
          console.log(JSON.stringify(data));

          const flattened = flattenNamespaces(expandNamespaces(data.nodes));
          const node = findNodeByScopedName(flattened, filter, []);
          if (!node) {
            return rts("No node matched the filter.");
          }

          const name = nodeName(node.name, node.scope);

          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: "",
              embeds: [
                {
                  type: "rich",
                  url: `${url.toString()}#L${node.location.line}`,
                  title: name,
                  description: node.jsDoc,
                  footer: {
                    text: `View online on [doc.deno.land](https://doc.deno.land/https/${url.host}${url.pathname}#${name}).`,
                  },
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

export interface DocsData {
  timestamp: string;
  nodes: DocNode[];
}

function rts(message: string): InteractionResponseCommand {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
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
