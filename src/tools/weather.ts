import * as z from "zod";

const WeatherSchema = z.object({
  location: z.string(),
});

export async function mockWeatherTool(args: { location: string }) {
  const result = WeatherSchema.safeParse(args);

  if (!result.success) {
    console.log(result.error);
    return;
  }

  // 模拟延迟
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    location: result.data.location,
    temperature: "22℃",
    weather: "晴转多云",
    wind: "东北风3级",
    humidity: "45%",
    updateTime: "2026-10-21 14:00",
  };
}

export const weatherToolDefinition = {
  type: "function",
  function: {
    name: "get_current_weather",
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
} as const;
