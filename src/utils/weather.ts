import OpenAI from "openai";
import { CompletionOption, createCompletionWithTools } from "./llm";

export const weatherTool = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "Get weather of a location, the user should supply a location first.",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. 北京",
          },
        },
        require: ["location"],
      },
    },
  } as const,
];

export const chatWithTool = async (
  messages: OpenAI.ChatCompletionMessageParam[],
  options: CompletionOption = {}
) => {
  //最多5轮，防止死循环
  for (let i = 0; i < 5; i++) {
    // 调用大模型
    const response = (await createCompletionWithTools(
      messages,
      options
    )) as OpenAI.Chat.Completions.ChatCompletionMessage;

    // 将回复加入历史
    const fullMsg = {
      role: "assistant",
      content: response.content ?? "",
      // 把推理思考内容完整存入消息
      reasoning_content: (response as any).reasoning_content,
      tool_calls: response.tool_calls,
    } as OpenAI.ChatCompletionMessageParam;
    messages.push(fullMsg);

    // 如果没有工具调用，结束循环
    if (!response?.tool_calls?.length) {
      return response.content;
    }

    // 有工具调用逐个执行
    for (const tool of response?.tool_calls) {
      if (tool.type !== "function") continue;
      //mock 执行工具  const result = await executor(call.function.name, args)
      const result = await options.executor?.(tool.function?.name, {});
      // 结果传给模型，tool_call_idyao
      messages.push({
        role: "tool",
        content: result.content,
        tool_call_id: result.id,
      });
    }
  }

  return null;
};
