import { h } from "https://deno.land/x/sift@0.1.1/mod.js";

export function Home() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>deno doc Discord Integration</title>
      </head>
      <body>
        <h1>deno doc Discord Integration</h1>
        <p>Press the link below to add the integration to your server.</p>
        <p>
          <a href="https://discord.com/api/oauth2/authorize?client_id=791671375017279509&scope=applications.commands">
            Add integration!
          </a>
        </p>
        <h2>Instructions</h2>
        <p>
          Enter the command `/deno doc
          module:https://deno.land/std@0.82.0/permissions/mod.ts filter:grant`
          to display documentation for a node.
        </p>
      </body>
    </html>
  );
}
