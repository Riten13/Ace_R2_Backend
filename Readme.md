# ⚙️ Express + TypeScript Template

A clean and modular Express.js server boilerplate built with TypeScript. Designed for scalability, maintainability, and rapid API development.

---

## 🚀 Features

- 🛠 **TypeScript** for type safety and better DX.
- 🔐 **Helmet** for securing HTTP headers.
- 🌐 **CORS** with a customizable whitelist.
- ⚙️ **Middleware** structure for scalability.
- 📁 **Modular File Organization**.
- 🧩 **Environment Config** with `dotenv`.
- 📦 **Scripted Dev & Build Workflows**.

---

## 📦 Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## ⚙️ Installation

1. **Clone the Repository**:

```bash
git clone https://github.com/roshith-prakash/express-template.git
cd express-template
```

2. **Install Dependencies**:

```bash
npm install
```

3. **Set Up Environment Variables**:

Create a `.env` file in the root directory and define:

```env
PORT=4000
```

---

## 🧪 Usage

### Development Workflow

Use the following during development:

```bash
npm run devCompiler   # Compiles TypeScript in watch mode
npm run dev           # Runs the compiled server using nodemon
```

> 💡 Run `devCompiler` and `dev` in **two separate terminals** for a full development experience.

### Build the Project

Compile TypeScript to JavaScript:

```bash
npm run build
```

### Run the Server

Start the compiled server:

```bash
npm run server
```

---

## 📁 Project Structure

```
src/
│
├── constants/     # Constant values
├── controllers/   # Route handler logic
├── functions/     # Helper functions / reusable logic
├── middleware/    # Express middleware (e.g., error handling, auth)
├── routes/        # API route definitions
├── types/         # Custom TypeScript types and interfaces
├── utils/         # Utility functions (e.g., validators, formatters)
│
├── index.ts       # Main server entry point
```

---

## 🔧 Middleware Stack

- **Helmet** – Adds security-enhancing HTTP headers
- **CORS** – Restricts requests to whitelisted domains
  ```ts
  const whitelist = ["http://localhost:3000"];
  ```
- **Body Parsing** –
  - `express.json()` for JSON payloads
  - `express.urlencoded({ extended: true })` for form submissions

---

## 🌐 Routes

### Default Route

- **Endpoint**: `/`
- **Method**: `GET`
- **Response**:
  ```
  We are good to go!
  ```

### API Routes

- Prefixed with `/api/v1`
- Defined in `routes/` and handled by corresponding `controllers/`

---

## 🔧 Customization

- **Whitelist Domains**  
  Update the `whitelist` array in the CORS configuration in `index.ts`.

- **Add Routes**  
  Create a new route file in `routes/`, define your controller in `controllers/`, and register it in the main route file.

- **Add Middleware**  
  Drop middleware into the `middleware/` folder and wire it up in `index.ts`.

---

## 📜 Scripts

```json
"scripts": {
  "build": "npx tsc",
  "devCompiler": "npx tsc --watch",
  "dev": "nodemon dist/index.js",
  "server": "node dist/index.js"
}
```

---
