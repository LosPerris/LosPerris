import fs from 'fs';
const techs = ['discord', 'nodedotjs', 'typescript', 'react', 'astro', 'express', 'tailwindcss', 'vercel'];
let output = 'export const icons: Record<string, string> = {\n';
for (const slug of techs) {
  const res = await fetch(`https://cdn.simpleicons.org/${slug}`);
  let svg = await res.text();
  svg = svg.replace('<svg ', '<svg class="w-8 h-8 fill-current transition-colors duration-300" ');
  output += `  "${slug}": \`${svg}\`,\n`;
}
output += '};\n';
fs.writeFileSync('src/data/icons.ts', output);
console.log('Icons fetched!');
