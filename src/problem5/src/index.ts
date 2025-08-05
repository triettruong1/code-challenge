import { createServer } from "./app";

const server = createServer();

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
