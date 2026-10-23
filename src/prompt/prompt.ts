import { get_completion } from "../utils/llm";
import { mockData1, mockData2 } from "../mock";

export const extractPrompt = (text: string) => `
      你的任务是从以下<userText>标签的内容中提取关键信息，生成摘要，

      用户评论：      
      <userText>${text?.replace(/<userText\b[^>]*>/gi, "") || ""}</userText>`;

export const summarizePrompt = (text: string, len: number, audience: string) => `
      你的任务是总结以下<userText>标签的内容，生成摘要，
      要求摘要的长度不超过${len}字,
      生成的摘要面向${audience}

      用户评论：      
      <userText>${text?.replace(/<userText\b[^>]*>/gi, "") || ""}</userText>`;

export const analyzePrompt = (text: string) => `
      你的任务是分析以下<userText>标签内容中的情绪，生成以"sentiment","topics","entities" 为键的JSON对象.
      sentiment的值为"positive","negative","neutral"之一，表示情感倾向。
      如果信息不存在，请使用 “未知” 作为值。

      文本：      
      <userText>${text?.replace(/<userText\b[^>]*>/gi, "") || ""}</userText>`;

export const transform = (text: string, targetFormat: string) => `
      你的任务是对以下<userText>标签中的内容进行处理, 你将按照以下步骤进行操作：
      1. 将其转换为${targetFormat}格式
      2. 分别展示正式和非正式的翻译结果

      文本：      
      <userText>${text?.replace(/<userText\b[^>]*>/gi, "") || ""}</userText>`;

export const expand = (text: string) => `
    你是客服ai助手, 你的任务根据<userText>标签中的客户评论给客户发送邮件回复，
    要求
    先根据客户评论判断客户情绪，
    如果是积极或中立的情绪，请感谢他们的支持，
    如果是负面的情绪，请道歉并建议他们联系客服
    请确保使用评论中的细节。

    客户评论：<userText>${text.replace(/<userText\b[^>]*>/gi, "")}</userText>
  `;
