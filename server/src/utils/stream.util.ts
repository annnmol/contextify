import type { Response } from "express";
import type { ResponseStreamEvent } from "openai/resources/responses/responses.js";

export async function pipeStreamToResponse(
  stream: AsyncIterable<ResponseStreamEvent>,
  res: Response
): Promise<void> {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  let responseId: string | undefined;

  for await (const event of stream) {
    if (!responseId && (event as any).response?.id) {
      responseId = (event as any).response.id;
    }
    if (event.type === "response.output_text.delta") {
      res.write(`data: ${event.delta}\n\n`);
    }
    if (event.type === "response.completed") {
      responseId = (event as any).response?.id ?? responseId;
      res.write(`data: [DONE]:${responseId}\n\n`);
    }
  }

  res.end();
}
