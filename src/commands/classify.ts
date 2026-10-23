import OpenAI from "openai";
import { extractPrompt, systemPrompt, classifyPrompt } from "../prompt";
import { chatWithTool, CompletionOption, createCompletion, getMessages } from "../utils";
import { ALL_TOOLS, toolExecutor } from "../tools";
import { CommandOptions } from "./chat";

export const classifyCommand = (
  input: string,
  history?: OpenAI.ChatCompletionMessageParam[],
  options?: CommandOptions
) => {
  const messages = getMessages(input, [], classifyPrompt);
  return createCompletion(messages, {
    temperature: 0,
  });
};
