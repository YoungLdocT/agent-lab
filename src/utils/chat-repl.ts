import readline from "readline";
import OpenAI from "openai";
import { get_completion_from_messages } from "./llm";

export function chatBot() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const history: OpenAI.ChatCompletionMessageParam[] = [];

  const systemPrompt = "你是一个有礼貌的聊天机器人";

  const askQuestion = () => {
    rl.question("提问：", async (input) => {
      if (input == "结束提问") {
        rl.close();
        return;
      }

      const response = await get_completion_from_messages(input, {
        systemPrompt: systemPrompt,
        history,
      });

      history.push({
        role: "user",
        content: input,
      });
      history.push({
        role: "assistant",
        content: response,
      });

      console.log("AI:", response);

      askQuestion();
    });
  };

  console.log("聊天已开始，输入 结束提问 退出\n");
  askQuestion();

  rl.on("close", () => {
    console.log("对话已结束");
  });
}
