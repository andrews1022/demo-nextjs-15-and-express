import app from "./app";
import { config } from "@/config";

// Start the server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  console.log(`Make requests to http://localhost:${config.port}/api`);
  console.log(`Environment: ${config.nodeEnv || "development"}`); // Good for debugging
});
