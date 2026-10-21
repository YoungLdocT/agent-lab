import OpenAI from "openai";
import { extractPrompt, systemPrompt } from "../prompt";
import { CompletionOption, createCompletion, getMessages } from "../utils";

export interface CommandOptions extends CompletionOption {
  systemPrompt?: string;
  audience?: string;
}

export const defaultCommand = (
  input: string,
  history: OpenAI.ChatCompletionMessageParam[],
  options?: CommandOptions
) => {
  const messages = getMessages(input, history, systemPrompt);

  return createCompletion(messages, {
    temperature: 0.5,
  });
};
