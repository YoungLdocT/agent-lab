import OpenAI from "openai";
import { extractPrompt, systemPrompt } from "../prompt";
import { get_completion_from_messages } from "../utils";

export type historyType = OpenAI.ChatCompletionMessageParam[];

export const extractCommand = async (input: string, history: historyType) => {
  const extractedPrompt = extractPrompt(input);

  return get_completion_from_messages(
    extractedPrompt,
    {
      systemPrompt,
      history,
    },
    0.2
  );
};
