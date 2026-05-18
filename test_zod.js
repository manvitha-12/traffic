import { tanstackStartOptionsObjectSchema } from "@tanstack/start-plugin-core/dist/esm/schema.js";

const opts = { router: { entry: "./router.tsx" } };
console.log(JSON.stringify(tanstackStartOptionsObjectSchema.parse(opts)));
