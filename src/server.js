import { createAppServer } from "./app.js";
import { config } from "./config.js";

const server = createAppServer();

server.listen(config.port, "0.0.0.0", () => {
  console.log(`Website is running at http://localhost:${config.port}`);
});
