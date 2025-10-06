type Config = {
  includeLeftSidebar: boolean;
  includeRightSidebar: boolean;
};

export const SYSTEM_PROMPT_PATH =
  process.env.AGENT_SYSTEM_PROMPT_PATH || "prompts/system_v2.md";

export const ESCAPE_PROMPT_PATH =
  process.env.AGENT_ESCAPE_PROMPT_PATH || "prompts/escape_v2.md";

export const WELCOME_PROMPT_PATH =
  process.env.AGENT_WELCOME_PROMPT_PATH || "prompts/welcome_v2.txt";

const config: Config = {
  includeLeftSidebar: process.env.NEXT_PUBLIC_INCLUDE_LEFT_SIDEBAR === "true",
  includeRightSidebar: process.env.NEXT_PUBLIC_INCLUDE_RIGHT_SIDEBAR === "true",
};

export default config;
