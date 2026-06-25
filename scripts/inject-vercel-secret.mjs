import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const templatePath = path.join(root, "vercel.template.json");
const outputPath = path.join(root, "vercel.json");

const secret =
  process.env.INTERNAL_API_SECRET || process.env.internal_secret || "losperris_secure_api";

if (!process.env.INTERNAL_API_SECRET) {
  console.warn(
    "[vercel-config] INTERNAL_API_SECRET no definido; usando valor por defecto.",
  );
}

// Vercel lee vercel.json del repo al desplegar (no durante el build).
// Si cambias el secret, ejecuta `npm run vercel:config` y commitea vercel.json.

const template = fs.readFileSync(templatePath, "utf8");
const output = template.replaceAll("__INTERNAL_SECRET__", secret);

fs.writeFileSync(outputPath, output);
console.log("[vercel-config] vercel.json generado correctamente.");
