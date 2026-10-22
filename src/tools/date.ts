import * as z from "zod";

export const DateSchema = z.object({
  location: z.string(),
});

export const getDateTool = async (args: unknown) => {
  const result = DateSchema.safeParse(args);

  if (!result.success) {
    console.log(result.error);
    return;
  }

  const now = new Date();
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    currentTime: now,
  };
};

export const dateToolDefinition = {
  type: "function",
  function: {
    name: "get_current_Date",
    description: "获取今天日期",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. 北京",
        },
      },
      require: [],
    },
  },
} as const;
