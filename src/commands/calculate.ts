import OpenAI from "openai";
import { calculatePrompt, extractPrompt, systemPrompt } from "../prompt";
import { CompletionOption, createCompletion, getMessages } from "../utils";
import { CommandOptions } from "./chat";

export const calculateCommand = async (
  input: string,
  history: OpenAI.ChatCompletionMessageParam[],
  option?: CommandOptions
) => {
  const extractedPrompt = extractPrompt(input);

  const messages = getMessages(extractedPrompt, history, calculatePrompt);

  return createCompletion(messages, {
    temperature: 0.2,
  });
};
