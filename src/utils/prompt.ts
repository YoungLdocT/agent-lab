import * as z from "zod";
import { get_completion } from "./llm";
import { mockData1, mockData2 } from "../mock";

export async function summarizeUserText(prompt: string) {
  const response = await get_completion(prompt);

  return response;
}

// 摘要生成函数
export const summarize = async (
  text: string,
  { len, audience }: { len: number; audience: string }
) => {
  const prompt = `
      你的任务是从以下<userText>标签的内容中概括关键信息，生成摘要，该内容是电商平台上的用户评论，
      要求摘要的长度不超过${len}字,
      生成的摘要面向${audience}

      用户评论：      
      <userText>${text?.replace(/<userText\b[^>]*>/gi, "") || ""}</userText>`;

  return await get_completion(prompt);
};

export const extract = async (text: string, aspect: string) => {
  const prompt = `
      你的任务是从以下<userText>标签的内容中提取关键信息，生成摘要，该内容是电商平台上的用户评论，
      要求只提取${aspect}角度的信息, 不关注其他内容
      如果没有与该角度相关的信息, 请返回“未相关”

      用户评论：      
      <userText>${text?.replace(/<userText\b[^>]*>/gi, "") || ""}</userText>`;
  const response = await get_completion(prompt);

  return response;
};

export const analyze = async (text: string) => {
  const prompt = `
      你的任务是分析以下<userText>标签内容中的情绪，生成以"sentiment","topics","entities" 为键的JSON对象.
      sentiment的值为"positive","negative","neutral"之一，表示情感倾向。
      如果信息不存在，请使用 “未知” 作为值。

      文本：      
      <userText>${text?.replace(/<userText\b[^>]*>/gi, "") || ""}</userText>`;

  const jsonSchema = z.object({
    sentiment: z.enum(["positive", "negative", "neutral"]).describe("情感倾向"),
    topics: z.array(z.string()).describe("主题列表"),
    entities: z.array(z.string()).describe("实体列表"),
  });

  const response = await get_completion(prompt);

  const result = jsonSchema.safeParse(JSON.parse(response || "{}"));

  if (!result.success) {
    console.log("失败：", result.error);
  } else {
    console.log("成功：", result.data);
  }
};

export const transform = async (text: string, targetFormat: string) => {
  const prompt = `
      你的任务是对以下<userText>标签中的内容进行处理, 你将按照以下步骤进行操作：
      1. 将其转换为${targetFormat}格式
      2. 分别展示正式和非正式的翻译结果

      文本：      
      <userText>${text?.replace(/<userText\b[^>]*>/gi, "") || ""}</userText>`;

  const response = await get_completion(prompt);

  return response;
};

export const expand = async (text: string, tone: string) => {
  const prompt = `
    你是客服ai助手, 你的任务根据<userText>标签中的客户评论给客户发送邮件回复，
    要求
    先根据客户评论判断客户情绪，
    如果是积极或中立的情绪，请感谢他们的支持，
    如果是负面的情绪，请道歉并建议他们联系客服
    请确保使用评论中的细节，
    语气要${tone}。

    客户评论：<userText>${text.replace(/<userText\b[^>]*>/gi, "")}</userText>
  `;

  const response = await get_completion(prompt);

  return response;
};
