const fs = require("fs");
const path = require("path");

const POSTS = "./pages/posts";
const files = fs
  .readdirSync(path.resolve(__dirname, POSTS))
  .filter(file => file.endsWith(".md") || file.endsWith(".mdx"));

const metadata = files
  .map((file, index) => {
    const name = path.resolve(__dirname, POSTS, file);
    const contents = fs.readFileSync(name, "utf-8");
    const META = /export\s+const\s+meta\s+=\s+({[\s\S]*?\n})/;
    const match = META.exec(contents);

    if (!match || typeof match[1] !== "string") {
      throw new Error(`${name} needs to export const meta = {}`);
    }

    // eslint-disable-next-line no-eval
    const meta = eval("(" + match[1] + ")");

    return {
      ...meta,
      path: "/posts/" + file.replace(/\.mdx?$/, ""),
      index
    };
  })
  .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

fs.writeFileSync(
  path.resolve(__dirname, "__posts.js"),
  `export default [
  ${metadata.map(data => JSON.stringify(data)).join(",\n")}
];`
);
