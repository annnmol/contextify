import type { Request, Response } from "express";
import { readFileSync } from "fs";
import { join } from "path";

import { chatMessageBodySchema } from "../utils/validation";
import { generateMessage, generateStream } from "../services/llm.service";
import { pipeStreamToResponse } from "../utils/stream.util";
import { centralParkSystemPrompt } from "../utils/prompt";

const centralParkContent = readFileSync(
  join(import.meta.dir, "../utils/central-park.md"),
  "utf-8"
);
const systemPrompt = centralParkSystemPrompt.replace("{{central_park}}", centralParkContent);

function validate(req: Request, res: Response) {
  const result = chatMessageBodySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return null;
  }
  return result.data;
}

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const body = validate(req, res);
    if (!body) return;
    const { text, id } = await generateMessage({
      message: body.message,
      conversationId: body.conversationId,
    });
    return res.status(200).json({ message: text, id });
  } catch (error) {
    console.error("sendMessage error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessageWithContext = async (req: Request, res: Response) => {
  try {
    const body = validate(req, res);
    if (!body) return;
    const { text, id } = await generateMessage({
      message: body.message,
      conversationId: body.conversationId,
      systemPrompt,
      maxTokens: 500,
    });
    return res.status(200).json({ message: text, id });
  } catch (error) {
    console.error("sendMessageWithContext error", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const streamMessage = async (req: Request, res: Response) => {
  try {
    const body = validate(req, res);
    if (!body) return;
    const stream = await generateStream({
      message: body.message,
      conversationId: body.conversationId,
    });
    await pipeStreamToResponse(stream, res);
  } catch (error) {
    console.error("streamMessage error", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`);
      res.end();
    }
  }
};

export const streamMessageWithContext = async (req: Request, res: Response) => {
  try {
    const body = validate(req, res);
    if (!body) return;
    const stream = await generateStream({
      message: body.message,
      conversationId: body.conversationId,
      systemPrompt,
      maxTokens: 500,
    });
    await pipeStreamToResponse(stream, res);
  } catch (error) {
    console.error("streamMessageWithContext error", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`);
      res.end();
    }
  }
};
