# Contextify AI — Tasks

## Stack

| Concern | Choice |
|---|---|
| AI API | Anthropic Claude (`claude-sonnet-4-6`) |
| Embeddings | OpenAI `text-embedding-3-small` |
| Vector Store | ChromaDB (local) |
| PDF Parsing | `pdf-parse` |
| Web Crawling | `axios` + `cheerio` |
| Client State | `zustand` |
| Styling | Tailwind CSS v4 + `shadcn/ui` |

---

## Phase 1 — Basic Chat (No Context)

### Backend
- [ ] **1.1** Install `@anthropic-ai/sdk` in `server/`
- [ ] **1.2** Add `ANTHROPIC_API_KEY` to `server/.env` and `.env.example`
- [ ] **1.3** Create `server/src/services/ai.service.ts` — Anthropic SDK wrapper, `streamChat(messages)` returns async iterable of text chunks
- [ ] **1.4** Create `server/src/routes/chat.routes.ts` — `POST /chat`
- [ ] **1.5** Create `server/src/controllers/chat.controller.ts` — reads `{ message, history[] }`, calls ai.service, pipes SSE stream to response
- [ ] **1.6** Mount chat router in `server/src/index.ts` at `/api/chat`
- [ ] **1.7** Verify: `curl -N -X POST http://localhost:3000/api/chat -d '{"message":"hello"}'`

### UI
- [ ] **1.8** Install `zustand`, `axios`, `tailwindcss`, `react-markdown` in `client/`
- [ ] **1.9** Create `client/src/store/chat.store.ts` — state: `messages[]`, `isStreaming`; actions: `sendMessage`, `appendChunk`
- [ ] **1.10** Create `client/src/components/chat/ChatMessage.tsx` — single message bubble (user/assistant) with markdown rendering
- [ ] **1.11** Create `client/src/components/chat/ChatWindow.tsx` — scrollable message list, auto-scrolls on new message
- [ ] **1.12** Create `client/src/components/chat/ChatInput.tsx` — textarea + send button, disabled while streaming
- [ ] **1.13** Create `client/src/lib/api.ts` — `streamChat(message, history, onChunk)` using `fetch` + `ReadableStream` for SSE
- [ ] **1.14** Wire: `ChatInput → store.sendMessage → api.streamChat → store.appendChunk → ChatWindow`
- [ ] **1.15** Replace `App.tsx` with layout: sidebar + main chat area

---

## Phase 2 — URL Ingestion

### Backend
- [ ] **2.1** Install `axios`, `cheerio` in `server/`
- [ ] **2.2** Create `server/src/services/crawler.service.ts` — `crawlUrl(url): Promise<string>`, strips nav/footer/scripts via cheerio
- [ ] **2.3** Create `server/src/services/chunker.service.ts` — `chunkText(text, size?, overlap?): string[]`
- [ ] **2.4** Create `server/src/services/store.service.ts` — in-memory `Map<sessionId, Chunk[]>` (replaced in Phase 4)
- [ ] **2.5** Create `server/src/routes/ingest.routes.ts` — `POST /ingest/url`
- [ ] **2.6** Create `server/src/controllers/ingest.controller.ts` — crawler → chunker → store, returns `{ chunkCount, preview }`
- [ ] **2.7** Mount ingest router in `server/src/index.ts` at `/api/ingest`

### UI
- [ ] **2.8** Create `client/src/components/sources/UrlInput.tsx` — URL input + "Add URL" button, loading spinner during ingestion
- [ ] **2.9** Create `client/src/store/sources.store.ts` — state: `sources[]`; actions: `addUrl`, `addPdf`, `removeSource`
- [ ] **2.10** Add sources panel to sidebar with status badges per source
- [ ] **2.11** Add `api.ingestUrl(url)` to `client/src/lib/api.ts`
- [ ] **2.12** Show toast on success/failure (`sonner`)

---

## Phase 3 — PDF Upload

### Backend
- [ ] **3.1** Install `pdf-parse`, `multer` in `server/`
- [ ] **3.2** Create `server/src/utils/upload.ts` — multer config: memory storage, PDF-only, 10MB limit
- [ ] **3.3** Create `server/src/services/pdf.service.ts` — `parsePdf(buffer): Promise<string>`
- [ ] **3.4** Add `POST /ingest/pdf` to `ingest.routes.ts`
- [ ] **3.5** Add pdf controller to `ingest.controller.ts` — multer → pdf.service → chunker → store

### UI
- [ ] **3.6** Create `client/src/components/sources/PdfUpload.tsx` — drag-and-drop zone + file picker, shows filename on success
- [ ] **3.7** Add `api.ingestPdf(file)` using `FormData` to `client/src/lib/api.ts`
- [ ] **3.8** Unify `UrlInput` + `PdfUpload` into `SourcesPanel` with "URL" / "PDF" tabs
- [ ] **3.9** List sources in sidebar with remove button

---

## Phase 4 — RAG Retrieval

### Backend
- [ ] **4.1** Install `chromadb`, `openai` in `server/`
- [ ] **4.2** Create `server/src/services/embedding.service.ts` — `embed(text): Promise<number[]>` via OpenAI `text-embedding-3-small`
- [ ] **4.3** Create `server/src/services/vectorstore.service.ts` — ChromaDB wrapper: `upsertChunks`, `queryChunks`
- [ ] **4.4** Update `store.service.ts` to delegate to `vectorstore.service.ts`
- [ ] **4.5** Update `ai.service.ts` — `streamChat` accepts `context: string[]`, injects into system prompt
- [ ] **4.6** Update `chat.controller.ts` — embed query → retrieve top-K → pass context to `streamChat`

### UI
- [ ] **4.7** *(no new page needed — chat uses context automatically)*
- [ ] **4.8** Add collapsible "Sources used" section below each assistant message

---

## Phase 5 — Source Citations

### Backend
- [ ] **5.1** Update `vectorstore.service.ts` — return chunk metadata: `{ text, sourceUrl, chunkIndex, score }`
- [ ] **5.2** Send `sources: ChunkMeta[]` as a final SSE event after the text stream

### UI
- [ ] **5.3** Create `client/src/components/chat/SourceCitations.tsx` — collapsible cited chunk text + source URL
- [ ] **5.4** Render `SourceCitations` in `ChatMessage.tsx` when `message.sources` is present

---

## Phase 6 — Fake Review Detection

### Backend
- [ ] **6.1** Create `server/src/services/review.service.ts` — `analyzeReviews(reviews[]): ReviewAnalysis[]`; Claude returns `{ sentiment, fake_probability, flags }`
- [ ] **6.2** Create `server/src/routes/analyze.routes.ts` — `POST /analyze/reviews`
- [ ] **6.3** Create `server/src/controllers/analyze.controller.ts`
- [ ] **6.4** Mount analyze router at `/api/analyze`

### UI
- [ ] **6.5** Create `client/src/pages/ReviewAnalysis.tsx` — paste reviews or enter URL
- [ ] **6.6** Create `client/src/components/analysis/ReviewCard.tsx` — fake probability bar + flags
- [ ] **6.7** Add "Reviews" tab to navigation

---

## Phase 7 — Trust Score

### Backend
- [ ] **7.1** Create `server/src/services/trust.service.ts` — `computeTrustScore(chunks[]): TrustScore`; Claude returns `{ score, signals }`
- [ ] **7.2** Add `POST /analyze/trust` route and controller
- [ ] **7.3** Auto-compute + return trust score in ingest response

### UI
- [ ] **7.4** Create `client/src/components/analysis/TrustScore.tsx` — circular gauge (0–100), green/yellow/red
- [ ] **7.5** Show trust score badge on each source in sidebar

---

## Phase 8 — Compare Mode

### Backend
- [ ] **8.1** Create `server/src/services/compare.service.ts` — `compareSources(chunksA, chunksB): ComparisonResult`
- [ ] **8.2** Add `POST /analyze/compare` route expecting `{ sourceIdA, sourceIdB }`

### UI
- [ ] **8.3** Create `client/src/pages/ComparePage.tsx` — two source selectors + "Compare" button
- [ ] **8.4** Create `client/src/components/analysis/CompareResult.tsx` — two-column diff, pros/cons table, summary
- [ ] **8.5** Add "Compare" tab to navigation

---

## Phase 9 — ELI5 Mode

### Backend
- [ ] **9.1** Update `ai.service.ts` — accept `mode: 'normal' | 'eli5'`; prepend simplification instruction to system prompt when `eli5`

### UI
- [ ] **9.2** Add ELI5 toggle to `ChatInput.tsx`
- [ ] **9.3** Store `eli5Mode` in `chat.store.ts`, pass to `api.streamChat`
- [ ] **9.4** Show "ELI5" badge on messages answered in ELI5 mode

---

## Phase 10 — AI Agent Mode

### Backend
- [ ] **10.1** Define Claude tool definitions: `crawl_url`, `summarize_text`, `analyze_sentiment`
- [ ] **10.2** Create `server/src/services/agent.service.ts` — agentic loop with tool_use: query → tool call → result → repeat until text
- [ ] **10.3** Add `POST /agent/query` route; stream `{ type: "tool_call" | "tool_result" | "text_chunk" }` SSE events

### UI
- [ ] **10.4** Add "Agent Mode" toggle to chat
- [ ] **10.5** Create `client/src/components/chat/AgentSteps.tsx` — expandable tool call timeline
- [ ] **10.6** Stream and render tool steps before final answer

---

## Phase 11 — Session Memory

### Backend
- [ ] **11.1** Update `chat.controller.ts` — include last 10 messages from `history[]` in Claude messages array
- [ ] **11.2** Add `GET /session/:id` and `POST /session` routes using `bun:sqlite`

### UI
- [ ] **11.3** Send full `messages[]` history with each request from `chat.store.ts`
- [ ] **11.4** Create `client/src/components/layout/SessionList.tsx` — past sessions in sidebar
- [ ] **11.5** Add "New Chat" button to reset state

---

## Bonus

- [ ] **B.1** `POST /suggest-questions` → Claude returns 5 clickable question chips after ingestion
- [ ] **B.2** "Save insight" button on assistant messages → persisted to `bun:sqlite` → viewable panel

---

## Critical Files

| File | Purpose |
|---|---|
| `server/src/index.ts` | Mount all routers |
| `server/src/services/ai.service.ts` | Anthropic SDK wrapper |
| `server/src/services/vectorstore.service.ts` | ChromaDB integration |
| `server/src/services/chunker.service.ts` | Text splitting |
| `client/src/store/chat.store.ts` | Chat state |
| `client/src/lib/api.ts` | API calls + SSE streaming |
| `client/src/App.tsx` | Routing and layout |
