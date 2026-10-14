import * as z from "zod";
import { get_completion } from "./llm";

export async function summarizeUserText(userText?: string) {
  const jsonSchema = z.object({
    summary: z.string().describe("对用户评论的简要总结"),
    sentiment: z.enum(["positive", "negative", "neutral"]).describe("情感倾向"),
    tags: z.array(z.string()).describe("标签列表"),
  });

  const stringSchema = z.string();

  const prompt = `
      请一步步推导
      判断学生的解答是否正确，
      

      问题：
      已知函数 \(f(x) = e^x - \frac{1}{2}ax^2 - x - 1\)，其中 \(a \in \mathbb{R}\)，e 为自然对数的底数。
      （1）若 \(a = 0\)，求曲线 \(y = f(x)\) 在点 \((1,\,f(1))\) 处的切线方程；
      （2）若当 \(x \geq 0\) 时，\(f(x) \geq 0\) 恒成立，求实数 a 的取值范围。

      学生的答案：\(\boldsymbol{(-\infty,\,5]}\)

      
      <userText>${userText?.replace(/<userText\b[^>]*>/gi, "") || ""}</userText>`;

  const response = await get_completion(prompt);

  console.log("原始结果：", response);
  const result = stringSchema.safeParse(response);

  if (!result.success) {
    console.log("失败：", result.error);
  } else {
    console.log("成功：", result.data);
  }
}


