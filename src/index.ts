import { mockData1, mockData2, mockData3, mockData4, mockData5, mockData6 } from "./mock";
import readline from "readline";
import OpenAI from "openai";
import { output, trim } from "zod";
import { HistoryType } from "./commands";
import { commands, DEFAULT_COMMAND } from "./commands";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const parseInput = (input: string) => {
  const trimmed = input.trim();
  if (trimmed.startsWith("/")) {
    const [cmd, ...rest] = trimmed.slice(1).split(" ");
    return {
      cmd,
      args: rest.join(" "),
    };
  }
  return {
    cmd: DEFAULT_COMMAND,
    args: trimmed,
  };
};

const history: HistoryType = [];

const chat = () => {
  rl.question("提问：", async (input) => {
    if (input == "结束提问") {
      rl.close();
      return;
    }

    const parsedInput = parseInput(input);

    const handle = commands[parsedInput.cmd];

    try {
      const response = await handle(parsedInput.args, history);
      console.log("ai:", response);

      history.push({
        role: "user",
        content: parsedInput.args,
      });
      history.push({
        role: "assistant",
        content: typeof response == "string" ? response : response?.content,
      });
      chat();
    } catch (error) {}
  });
};

rl.on("close", () => {
  console.log("chat 已结束");
});

chat();

// const result = await summarize(mockData1, { len: 50, audience: "新用户" });
// console.log(result);

// const comments = [mockData1, mockData2, mockData3, mockData4];
// comments.forEach(async (comment, index) => {
//   const summary = await summarize(comment, { len: 50, audience: "新用户" });
//   console.log(`评论 ${index + 1} 的摘要:`, summary);
// });

// const analysis = await analyze(mockData2);
// console.log(analysis);

// const transformed = await transform(mockData5, "Markdown");
// console.log(transformed);

// const extractResult = await extract(mockData3, "天气");
// console.log(extractResult);

//
// const expanded = await expand(mockData6, "专业");
// console.log(expanded);

// chatBot();
