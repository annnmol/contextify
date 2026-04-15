import express, { type Request, type Response } from "express";
import {
  sendMessage,
  sendMessageWithContext,
  streamMessage,
  streamMessageWithContext,
} from "../controllers/chat";

const router = express.Router();

router.post("/chat", (req: Request, res: Response) => sendMessage(req, res));
router.post("/chat-with-context", (req: Request, res: Response) => sendMessageWithContext(req, res));
router.post("/chat-streaming", (req: Request, res: Response) => streamMessage(req, res));
router.post("/chat-with-context-streaming", (req: Request, res: Response) => streamMessageWithContext(req, res));

export default router;
