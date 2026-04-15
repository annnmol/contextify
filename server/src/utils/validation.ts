import z from "zod";

export const chatMessageBodySchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  conversationId: z.string(),
});

export type ChatMessageBody = z.infer<typeof chatMessageBodySchema>;
