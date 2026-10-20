import OpenAI from "openai";
import { summarizePrompt, systemPrompt } from "../prompt";
import { get_completion_from_messages } from "../utils";

export type historyType = OpenAI.ChatCompletionMessageParam[];

export const summarizeCommand = async (
  input: string,
  history: historyType,
  options?: {
    [key: string]: any;
  }
) => {
  const summarizedPrompt = summarizePrompt(input, length, options?.audience);

  return get_completion_from_messages(
    summarizedPrompt,
    {
      systemPrompt,
      history,
    },
    0.2
  );
};
