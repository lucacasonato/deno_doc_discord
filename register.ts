const res = await fetch(
  "https://discord.com/api/v8/applications/791671375017279509/commands",
  {
    method: "POST",
    body: JSON.stringify({
      name: "deno",
      description: "A secure JavaScript and TypeScript runtime",
      options: [
        {
          type: 1,
          name: "doc",
          description: "Show auto-generated documentation for a module.",
          options: [
            {
              type: 3,
              name: "module",
              description: "The module to show documentation for.",
              required: true,
            },
            {
              type: 3,
              name: "filter",
              description: "Filter which nodes will be displayed.",
              required: true,
            },
          ],
        },
      ],
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bot ${Deno.env.get("DISCORD_BOT_TOKEN")}`,
    },
  }
);

console.log(res.status, await res.text());
