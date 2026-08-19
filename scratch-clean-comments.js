import fs from "fs";
import path from "path";

const srcDir = path.join(process.cwd(), "src");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (
        file.endsWith(".ts") ||
        file.endsWith(".js") ||
        file.endsWith(".astro")
      ) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);

let modified = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  const original = content;

  // Solo quitamos los de tipo /** ... */ (jsdoc) y // (en TS/JS) que esten solos en una linea, para no romper astro
  // Remove block comments starting with /** or /*
  content = content.replace(/\/\*\*[\s\S]*?\*\//g, "");

  // En archivos TS, remover // (cuidado con URLs en strings)
  if (file.endsWith(".ts")) {
    content = content.replace(/^\s*\/\/.*$/gm, "");
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log("Cleaned:", file);
    modified++;
  }
}
console.log(`Cleaned comments from ${modified} files.`);
