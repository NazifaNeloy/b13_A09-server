# IdeaVault Server

The robust backend engine for the **IdeaVault Startup Idea Sharing & Validation Platform**. Built with Node.js, Express, and MongoDB, this server implements JWT session signing, secure RESTful CRUD APIs, MongoDB aggregation algorithms, and activity logging.

## Core Technical Architecture

- **Runtime**: Node.js (v24+)
- **Framework**: Express.js
- **Database**: MongoDB Client
- **Authentication**: Firebase Client + Server-side JWT Validation
- **Middleware**: CORS, Cookie-Parser, Morgan Logs

---

## Technical Specifications & Endpoints

### 🔐 Authentication & Session Endpoints
* **`POST /jwt`**: Exchanges verified Firebase credentials for a server-signed JWT token. Sets token in HttpOnly cookies and returns as JSON.
* **`POST /logout`**: Purges HttpOnly JWT tokens and clears authorization state.

### 💡 Startup Ideas Endpoints
* **`POST /ideas`** *(Protected)*: Share a new startup idea deck (injects verified JWT email).
* **`GET /ideas`**: Fetch all ideas. Supports:
  - `search`: Case-insensitive regex title searching.
  - `category`: Filter by distinct industries (AI, Tech, FinTech, Health, etc.).
* **`GET /ideas/trending`**: MongoDB aggregate pipeline returns top 6 ideas sorted by bookmark likes counts and submission date.
* **`GET /ideas/:id`**: Get full launch specifications for a single idea.
* **`PUT /ideas/:id`** *(Protected)*: Updates existing pitch configurations (restricted to author owner).
* **`DELETE /ideas/:id`** *(Protected)*: Deletes an idea and its associated comments threads (restricted to author owner).
* **`PUT /ideas/:id/like`** *(Protected)*: Toggles like/bookmark statuses for a user.

### 💬 Comments & Community Interactions Endpoints
* **`GET /ideas/:ideaId/comments`**: Retrieves all feedback comment threads linked to an idea.
* **`POST /comments`** *(Protected)*: Submit a constructive validation comment.
* **`PATCH /comments/:id`** *(Protected)*: Edit feedback text (restricted to author).
* **`DELETE /comments/:id`** *(Protected)*: Delete feedback (restricted to author).

### 📊 Dashboard Analytics Endpoints
* **`GET /my-ideas`** *(Protected)*: Returns all pitches created by the verified JWT owner.
* **`GET /my-interactions`** *(Protected)*: Retrieves ideas where the user has contributed feedback comments.

---

## Quick Start Configuration

1. Clone or navigate to the directory:
   ```bash
   cd ideavault-server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_uri
   ACCESS_TOKEN_SECRET=your_jwt_private_key
   NODE_ENV=development
   ```
4. Seed the database with high-quality default trending ideas:
   ```bash
   node seed.js
   ```
5. Start development hot-reloading:
   ```bash
   npm run dev
   ```
