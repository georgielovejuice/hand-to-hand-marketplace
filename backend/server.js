import dotenv from "dotenv";

dotenv.config();

import { createApp } from "./src/app.js";
import { apiPort, nodeEnv } from "./src/config/credentials.js";

const PORT = apiPort;
const ENV = nodeEnv;

/**
 * Start the server
 */
async function startServer() {
  try {
    const app = await createApp();

    app.listen(PORT, () => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`\n✓ Server running on http://localhost:${PORT} (${ENV})\n`);
      }
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();