# 📄 Contextify AI

## Tagline

Turn any content into a conversation.

## One-line Pitch

A multi-source AI assistant that ingests websites, PDFs, and user data to answer questions, summarize content, detect fake reviews, and compare information.

---

# 🧾 PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. 🎯 Goal

Build a portfolio-grade fullstack AI product demonstrating:

* RAG-based retrieval
* Multi-source ingestion (URL + PDF)
* AI UX features (trust, explainability, comparison)

---

## 2. 👤 Target Users

* Developers / Recruiters (portfolio showcase)
* Students / Researchers
* General users analyzing content

---

## 3. 🧩 Core Features

### 3.1 Chat with Context

* Input: user query
* Output: AI-generated answer based on ingested data

### 3.2 URL Ingestion

* Crawl webpage
* Extract text
* Chunk + store

### 3.3 PDF Upload

* Parse PDF
* Extract text
* Chunk + store

---

## 4. 🚀 Advanced Features

### 4.1 Fake Review Detection

* Detect sentiment mismatch
* Identify repeated patterns
* Output fake probability score

### 4.2 Trust Score

* Score content reliability (0–100)
* Based on:

  * sentiment consistency
  * duplication
  * language patterns

### 4.3 Compare Mode

* Input: 2 URLs or PDFs
* Output:

  * differences
  * pros/cons
  * summary

### 4.4 ELI5 Mode

* Simplifies complex answers

### 4.5 Source Explanation

* Show extracted text chunks
* Highlight answer origin

### 4.6 AI Agent Mode

* Multi-step reasoning:

  * crawl → analyze → respond

---

## 5. 💡 Bonus Features

* Auto-generate questions
* Save insights
* Session memory

---

## 6. 🧱 Tech Requirements

### Frontend

* Chat UI
* Upload UI
* Streaming responses

### Backend

* API server
* Processing pipeline

### Storage

* Vector store (for embeddings)
* File storage (PDFs)

---

## 7. 📊 Success Metrics

* Accurate answers
* Fast response time
* Clear source attribution

---

# ⚙️ IMPLEMENTATION GUIDE (STEP-BY-STEP)

## 🧩 PHASE 1: Basic Chat (No Context)

### Goal

Simple chatbot using AI API

### Steps

1. Create backend endpoint `/chat`
2. Send user message → AI API
3. Return response

### Output

Basic chat working

---

## ⚡ PHASE 2: Streaming Responses

### Goal

Make responses stream like ChatGPT

### Steps

1. Enable streaming in API
2. Send chunks to frontend
3. Render progressively

---

## 🌐 PHASE 3: URL Ingestion

### Goal

Chat with website content

### Steps

1. Crawl webpage
2. Extract clean text
3. Split into chunks
4. Store chunks

---

## 📄 PHASE 4: PDF Support

### Goal

Chat with documents

### Steps

1. Upload PDF
2. Extract text
3. Chunk data
4. Store

---

## 🧠 PHASE 5: RAG (Retrieval)

### Goal

Answer using relevant context

### Steps

1. Convert chunks → embeddings
2. Store in vector DB
3. On query:

   * embed query
   * retrieve top chunks
   * send to AI

---

## 🚨 PHASE 6: Fake Review Detection

### Goal

Analyze reviews

### Steps

1. Extract reviews
2. Run sentiment analysis
3. Detect:

   * mismatch
   * repetition
4. Output score

---

## 📊 PHASE 7: Trust Score

### Goal

Quantify reliability

### Steps

1. Combine signals:

   * sentiment
   * duplication
   * language
2. Generate score (0–100)

---

## 🔁 PHASE 8: Compare Mode

### Goal

Compare two sources

### Steps

1. Ingest both inputs
2. Retrieve chunks
3. Ask AI:

   * differences
   * pros/cons

---

## 🪄 PHASE 9: ELI5 Mode

### Goal

Simplify responses

### Steps

1. Add toggle
2. Modify prompt:

   * "Explain simply"

---

## 🤖 PHASE 10: AI Agent Mode

### Goal

Multi-step reasoning

### Steps

1. Define tools:

   * crawl
   * summarize
   * analyze
2. Route tasks dynamically

---

## 🧠 PHASE 11: Memory

### Goal

Context awareness

### Steps

1. Store last messages
2. Send along with query

---

## 🎯 FINAL RESULT

You will have:

* Fullstack AI app
* RAG pipeline
* Advanced AI UX features
* Production-level architecture

---

## 🧠 NOTE ON RAG / FRAMEWORKS

Start simple:

* First implement manual pipeline
* Later decide abstraction layer

Avoid over-engineering early.

---

## 🚀 FINAL INTERVIEW LINE

“I built a multi-source AI assistant using RAG that analyzes websites, PDFs, and reviews with trust scoring, comparison, and agent workflows.”
