import { app } from "./index";

// Untuk Cloudflare Worker export handler
export default {
  fetch: app.handle
};
