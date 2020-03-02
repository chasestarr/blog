const fs = require("fs");
const path = require("path");

const utils = require("./build-utils.js");

const POSTS = "./pages/posts";
const files = fs
  .readdirSync(path.resolve(__dirname, POSTS))
  .filter(file => file.endsWith(".md"));

const metadata = files
  .map((file, index) => {
    const filepath = path.resolve(__dirname, POSTS, file);
    const contents = fs.readFileSync(filepath, "utf-8");
    const META = /export\s+const\s+meta\s+=\s+({[\s\S]*?\n})/;
    const match = META.exec(contents);

    if (!match || typeof match[1] !== "string") {
      throw new Error(`${filepath} needs to export const meta = {}`);
    }

    const meta = eval("(" + match[1] + ")");
    return {
      ...meta,
      path: utils.routeFromPath(filepath),
      index
    };
  })
  .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

fs.writeFileSync(
  path.resolve(__dirname, "__pages.js"),
  `export default [
  {
    "title": "About",
    "path": "/about",
    "index": -1,
  },
  ${metadata.map(data => JSON.stringify(data, null, 2)).join(",\n")}
];`
);
