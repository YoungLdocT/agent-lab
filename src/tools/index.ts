import { keyof } from "zod";
import { weatherToolDefinition, mockWeatherTool } from "./weather";
import { dateToolDefinition, getDateTool } from "./date";

export const toolRegistry = {
  get_current_weather: {
    definition: weatherToolDefinition,
    handler: mockWeatherTool,
  },
  get_current_Date: {
    definition: dateToolDefinition,
    handler: getDateTool,
  },
} as const;

export const ALL_TOOLS = Object.values(toolRegistry).map((item) => item.definition);

export type ToolRegistryType = keyof typeof toolRegistry;

export const toolExecutor = (name: ToolRegistryType, args: any) => {
  const tool = toolRegistry[name];
  if (!tool) {
    throw new Error(`未注册的工具：${name}`);
  }

  return tool.handler(args);
};
