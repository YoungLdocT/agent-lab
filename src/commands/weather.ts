import OpenAI from "openai";
import { extractPrompt, systemPrompt } from "../prompt";
import { CompletionOption, getMessages, chatWithTool } from "../utils";
import { ALL_TOOLS, toolExecutor, toolRegistry } from "../tools";

export const weatherCommand = (
  input: string,
  history: OpenAI.ChatCompletionMessageParam[],
  options?: CompletionOption
) => {
  const messages = getMessages(input, history, systemPrompt);
  return chatWithTool(messages, {
    tools: ALL_TOOLS,
    temperature: 0.5,
    executor: toolExecutor,
  });
};
