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
  console.log(`Command: ${data}`);
  return { type: InteractionResponseType.ACKNOWLEDGE_WITH_SOURCE };
}

bot("e9ad7ee29f62085af14152d3a70c53b6a7f359996ba9acb668d0dd6e246a321e", {
  command,
});
