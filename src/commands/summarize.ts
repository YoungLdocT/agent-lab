import OpenAI from "openai";
import { summarizePrompt, systemPrompt } from "../prompt";
import { CompletionOption, createCompletion, getMessages } from "../utils";
import { CommandOptions } from "./chat";

export const summarizeCommand = async (
  input: string,
  history: OpenAI.ChatCompletionMessageParam[],
  options?: CommandOptions
) => {
  const { audience = "" } = options ?? {};
  const summarizedPrompt = summarizePrompt(input, length, audience);

  const messages = getMessages(summarizedPrompt, history, systemPrompt);

  return createCompletion(messages, {
    temperature: 0.2,
  });
};
