import { summarize, analyze, transform, extract, expand, chatBot } from "./utils";
import { mockData1, mockData2, mockData3, mockData4, mockData5, mockData6 } from "./mock";

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

chatBot();
