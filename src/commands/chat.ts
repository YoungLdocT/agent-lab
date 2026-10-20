import OpenAI from "openai";
import { extractPrompt, systemPrompt } from "../prompt";
import { get_completion_from_messages } from "../utils";

export type historyType = OpenAI.ChatCompletionMessageParam[];

export const defaultCommand = (input: string, history: historyType) => {
  return get_completion_from_messages(
    input,
    {
      systemPrompt,
      history,
    },
    0.5
  );
};
