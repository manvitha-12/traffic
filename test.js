import { mergeConfig } from "vite";

const tanstackStartDefaults = {
  importProtection: {
    behavior: "error",
    client: {
      files: ["**/server/**"],
      specifiers: ["server-only"]
    }
  }
};

const userConfig = {
  server: { preset: "vercel" },
  router: { entry: "./router.tsx" }
};

console.log(JSON.stringify(mergeConfig(tanstackStartDefaults, userConfig), null, 2));
