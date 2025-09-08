
# 📌 URL Shortener

This project is a simple **URL Shortener service** built with **Node.js + Express**, using a **JSON file** for storage instead of a database.
It also includes a **custom logging-middleware package** that sends structured logs to an external evaluation service.

---

## 📂 Project Structure

```
url-shortener/
│
├── backend/                # Main URL shortener service
│   ├── src/
│   │   ├── server.js       # Express server
│   │   ├── routes/urls.js  # Routes for short URLs
│   │   ├── models/Url.js   # In-memory / file-based storage
│   │   └── data.json       # JSON "database"
│   └── package.json
│
├── logging-middleware/     # Custom logger package
│   ├── index.js            # Implementation
│   ├── index.d.ts          # TypeScript declarations
│   └── package.json
│
└── README.md
```

---

## ⚡ Features

* Shorten URLs with expiry
* Redirect to original URL with click tracking
* Retrieve statistics for a short URL
* Logs all major events using the custom logger:

  * `INFO`, `WARN`, `ERROR`, `DEBUG`
  * Includes service name, module, and message
* File-based persistence (`data.json`) instead of MongoDB

---

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/MrApoorv/2201641690050
cd url-shortener
```

### 2. Install dependencies

#### For logging-middleware

```bash
cd logging-middleware
npm install
```

#### For backend

```bash
cd ../backend
npm install
npm install ../logging-middleware
```

---

### 3. Environment variables

In **backend/.env**:

```env
PORT=3000
AUTH_TOKEN=your-auth-token-here
```

---

### 4. Run the backend server

```bash
cd backend
npm start
```

The server will run at:

```
http://localhost:3000
```

---

## 🔗 API Endpoints

### Create short URL

```http
POST /shorturls
Content-Type: application/json

{
  "url": "https://example.com",
  "validity": 7,
  "shortcode": "exmpl"
}
```

### Get stats for a shortcode

```http
GET /shorturls/:shortcode
```

### Redirect to original URL

```http
GET /:shortcode
```

---

## 📝 Logging Middleware

### Usage

```js
import { Log } from "logging-middleware";

Log("url-service", "INFO", "urls.js", "Short URL created successfully");
```

### Parameters

* `stack` → service name (e.g. `"url-service"`)
* `level` → `"INFO" | "ERROR" | "WARN" | "DEBUG"`
* `pkg` → module/file name (e.g. `"urls.js"`)
* `message` → log message

### Example Log

```
[2025-09-08T12:34:56.789Z] [INFO] (url-service/urls.js): Short URL created successfully
```

Logs are also forwarded to the external evaluation service via `axios`.

---

## 📦 Development Notes

* If you update `logging-middleware`, reinstall it in backend:

  ```bash
  cd backend
  npm install ../logging-middleware
  ```
* TypeScript users get full IntelliSense thanks to `index.d.ts` in logger.