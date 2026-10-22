import OpenAI from "openai";
import { CompletionOption, createCompletionWithTools } from "./llm";
import { ToolRegistryType } from "../tools";

export const chatWithTool = async (
  messages: OpenAI.ChatCompletionMessageParam[],
  options: CompletionOption = {}
) => {
  //最多5轮，防止死循环
  for (let i = 0; i < 5; i++) {
    console.log(`\n===== 第 ${i + 1} 轮调用模型 =====`);

    // 调用大模型
    const response = (await createCompletionWithTools(
      messages,
      options
    )) as OpenAI.Chat.Completions.ChatCompletionMessage;

    // 打印模型原始返回
    console.log("模型原始响应：", JSON.stringify(response, null, 2));

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
    for (const toolCall of response?.tool_calls) {
      if (toolCall.type !== "function") continue;

      console.log(`执行工具：${toolCall.function.name}`);
      console.log("工具原始参数：", toolCall.function.arguments);

      const args = JSON.parse(toolCall.function.arguments);

      //mock 执行工具
      const result = await options.executor?.(toolCall.function?.name as ToolRegistryType, args);
      // 结果传给模型，tool_call_id
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
      console.log("已回传工具结果到模型");
    }
  }

  throw new Error("工具调用超过最大轮次，任务未完成");
};
