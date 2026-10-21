import OpenAI from "openai";
import { extractPrompt, systemPrompt } from "../prompt";
import { CompletionOption, getMessages, chatWithTool, weatherTool } from "../utils";

export const weatherCommand = (
  input: string,
  history: OpenAI.ChatCompletionMessageParam[],
  options?: CompletionOption
) => {
  const messages = getMessages(input, history, systemPrompt);
  return chatWithTool(messages, {
    tools: [...weatherTool],
    temperature: 0.5,
    executor: async () => {
      return {
        id: "0",
        content: "Cloudy 7~13°C",
      };
    },
  });
};
