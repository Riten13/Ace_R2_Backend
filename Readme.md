# Express Server Template

This project provides a basic setup for an Express.js server with common configurations and middleware. It serves as a starting point for building robust and secure APIs.

---

## Features

- **Environment Variables**: Managed using `dotenv`.
- **CORS Configuration**: Restricts access to specific domains.
- **Request Parsing**: Supports URL-encoded and JSON request bodies.
- **Security Enhancements**: Includes HTTP headers using `helmet`.
- **Routing**: Organized route handling with `/api/v1`.
- **Modularity**: Encourages separation of concerns for scalability.
- **TypeScript**: Added typescript for type safety.

---

## Prerequisites

Before you begin, ensure you have:

- [Node.js](https://nodejs.org/) installed.
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) installed.

---

## Installation

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
   Create a `.env` file in the root directory and define the following:
   ```env
   PORT=4000
   ```

---

## Usage

### Run the Server
Build & run the server with:
```bash
npm run build; npm run server
```
The server will run on the port specified in the `.env` file.

### Verify Setup
Visit `http://localhost:<PORT>` in your browser or use an API client (e.g., Postman) to see:
```
We are good to go!
```

---

## Project Structure

```plaintext
├── controllers/
│   └── index.ts        # Main controller file
├── routes/
│   └── index.ts        # Main route file
├── .env                # Environment variables
├── index.ts            # Entry point of the server
├── package.json        # Project dependencies and scripts
└── README.md           # Documentation
```

---

## Middleware

1. **Body Parsing**:
   - `express.urlencoded`: Parses URL-encoded bodies.
   - `express.json`: Parses JSON payloads.

2. **CORS**:
   Configured to allow requests only from the whitelisted domains:
   ```javascript
   const whitelist = ['http://localhost:3000']
   ```

3. **Helmet**:
   Secures HTTP headers.

---

## Routes

### Default Route
- **Endpoint**: `/`
- **Method**: GET
- **Response**: `We are good to go!`

### API Routes
All application-specific routes are prefixed with `/api/v1`.

---

## Customization

- **Whitelist Domains**:
  Update the `whitelist` array in `index.js` to include other allowed origins.

- **Add Routes**:
  Define additional routes in the `routes` directory and integrate them into `index.js`.
