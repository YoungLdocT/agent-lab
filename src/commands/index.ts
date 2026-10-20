import OpenAI from "openai";
import { defaultCommand } from "./chat";
import { extractCommand } from "./extract";
import { summarizeCommand } from "./summarize";

export type historyType = OpenAI.ChatCompletionMessageParam[];

export type CommandHandler = (
  input: string,
  history: historyType,
  options?: {
    [key: string]: any;
  }
) => Promise<string | null>;

export const commands: Record<string, CommandHandler> = {
  chat: defaultCommand,
  extract: extractCommand,
  summarize: summarizeCommand,
};

export const DEFAULT_COMMAND = "chat";
