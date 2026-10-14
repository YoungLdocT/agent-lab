import OpenAI from "openai";
import dotenv from "dotenv";
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

async function chat() {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "hello" },
      ],
      model: "deepseek-flash",
      thinking: { type: "enabled" },
      reasoning_effort: "high",
      stream: false,
    } as any);
    console.log("完整返回体：", completion);
    console.log(completion.choices[0].message.content);
  } catch (err:any) {
    // 重点：这里会打印真实错误原因！
    console.error("API调用失败！", err.status, err.message);
    console.error(err);
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function streamChat() {
  try {
    const stream = (await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "hello" },
      ],
      model: "deepseek-flash",
      thinking: { type: "enabled" },
      reasoning_effort: "high",
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
     console.log("\n✅ 流式正常结束，完整内容：", fullContent);
   } catch (streamErr:any) {
     console.warn("\n⚠️ 流式读取中途中断：", streamErr.message);
     console.log("已经获取到的部分内容：", fullContent);
   }
  } catch (err:any) {
    // 重点：这里会打印真实错误原因！
    console.error("API调用失败！", err.status, err.message);
    console.error(err);
  }
}

streamChat();