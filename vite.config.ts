import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";

// No aliases: adamo / adamo-react resolve purely through the published
// packages' "exports" maps, exactly as `npm install adamo adamo-react`
// gives you. This project is intentionally NOT an npm workspace member of
// adamo-ts, so npm can never silently link the local monorepo source here.
export default defineConfig({
  plugins: [react(), wasm()],
  server: {
    port: 5185,
  },
});
