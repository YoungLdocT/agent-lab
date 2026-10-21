import OpenAI from "openai";
import { defaultCommand, CommandOptions } from "./chat";
import { extractCommand } from "./extract";
import { summarizeCommand } from "./summarize";
import { weatherCommand } from "./weather";
import { CompletionOption } from "../utils";

export type HistoryType = OpenAI.ChatCompletionMessageParam[];

export type CommandHandler = (
  input: string,
  history: HistoryType,
  options?: CommandOptions
) => Promise<string | OpenAI.Chat.Completions.ChatCompletionMessage | null>;

export const commands: Record<string, CommandHandler> = {
  chat: defaultCommand,
  extract: extractCommand,
  summarize: summarizeCommand,
  withTool: weatherCommand,
};

export const DEFAULT_COMMAND = "chat";
