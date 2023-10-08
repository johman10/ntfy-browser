import { rawEmojis } from "./rawEmojis";

// Format emojis (see emoji.js)
export default Object.fromEntries(
  rawEmojis.flatMap((emoji) =>
    emoji.aliases.map((alias) => [alias, emoji.emoji]),
  ),
);
