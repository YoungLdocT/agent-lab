import OpenAI from "openai";
import { defaultCommand, CommandOptions } from "./chat";
import { extractCommand } from "./extract";
import { summarizeCommand } from "./summarize";
import { withToolCommand } from "./withTool";
import { classifyCommand } from "./classify";
import { CompletionOption } from "../utils";
import { calculateCommand } from "./calculate";

export type HistoryType = OpenAI.ChatCompletionMessageParam[];

export type CommandHandler = (
  input: string,
  history: HistoryType,
  options?: CommandOptions
) => Promise<string | null>;

export const handleInput = async (input: string, history: OpenAI.ChatCompletionMessageParam[]) => {
  const response = await classifyCommand(input);
  console.log(`[分类结果] ${response}`);

  const handle = commands[response ?? ""] ?? defaultCommand;

  return handle(input, history, {});
};

export const commands: Record<string, CommandHandler> = {
  chat: defaultCommand,
  // extract: extractCommand,
  // summarize: summarizeCommand,
  withTool: withToolCommand,
  calculate: calculateCommand,
};
