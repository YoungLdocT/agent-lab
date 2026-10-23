import OpenAI from "openai";
import { extractPrompt, systemPrompt } from "../prompt";
import { CompletionOption, getMessages, chatWithTool } from "../utils";
import { ALL_TOOLS, toolExecutor, toolRegistry } from "../tools";
import { CommandOptions } from "./chat";

export const withToolCommand = (
  input: string,
  history: OpenAI.ChatCompletionMessageParam[],
  options?: CommandOptions
) => {
  const messages = getMessages(input, history, systemPrompt);
  return chatWithTool(messages, {
    tools: ALL_TOOLS,
    temperature: 0.2,
    executor: toolExecutor,
  });
};
