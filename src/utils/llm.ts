import OpenAI from "openai";
import dotenv from "dotenv";

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function get_completion(prompt: string) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "deepseek-flash",
      stream: false,
    } as any);

    return completion.choices?.[0]?.message?.content;
  } catch (err: any) {
    // 重点：这里会打印真实错误原因！
    console.error("API调用失败！", err.status, err.message);
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function get_stream_completion(prompt: string) {
  try {
    const stream = (await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "deepseek-flash",
      stream: true,
    } as any)) as unknown as AsyncIterable<OpenAI.Chat.ChatCompletionChunk>;
    let fullContent = "";
    try {
      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta;
        if (delta?.content) {
          process.stdout.write(delta.content);
          await sleep(300); // 模拟处理延迟
          fullContent += delta.content;
        }
      }
      console.log("\n✅ 流式正常结束，完整内容：", fullContent, process.argv);
    } catch (streamErr: any) {
      console.warn("\n⚠️ 流式读取中途中断：", streamErr.message);
      console.log("已经获取到的部分内容：", fullContent);
    }
  } catch (err: any) {
    // 重点：这里会打印真实错误原因！
    console.error("API调用失败！", err.status, err.message);
    console.error(err);
  }
}

export interface CompletionOption {
  temperature?: number;
  tools?: OpenAI.ChatCompletionTool[];
  executor?: (name: string, args: unknown) => Promise<any>;
  maxTurns?: number;
}

export const getMessages = (
  input: string,
  history?: OpenAI.ChatCompletionMessageParam[],
  systemPrompt?: string
) => {
  return [
    ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
    ...(history ?? []),
    { role: "user", content: input },
  ] as OpenAI.ChatCompletionMessageParam[];
};

export const createCompletion = async (
  messages: OpenAI.ChatCompletionMessageParam[],
  option: CompletionOption = {}
) => {
  const { temperature = 0 } = option;

  const completion = await openai.chat.completions.create({
    messages,
    model: "deepseek-flash",
    stream: false,
    temperature: temperature,
  });

  return completion.choices?.[0]?.message?.content;
};

export const createCompletionWithTools = async (
  messages: OpenAI.ChatCompletionMessageParam[],
  option: CompletionOption = {}
) => {
  const { temperature = 0, tools } = option;

  const completion = await openai.chat.completions.create({
    messages,
    model: "deepseek-flash",
    stream: false,
    tools,
    temperature,
  });

  return completion.choices?.[0]?.message;
};
