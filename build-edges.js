const fs = require("fs");
const path = require("path");

const mdx = require("@mdx-js/mdx");
const babel = require("@babel/core");
const traverse = require("@babel/traverse").default;

const utils = require("./build-utils.js");
const transformEdgeToMarkup = require("./transform-edge-to-markup.js");

const ABOUT = "./pages/about.md";
const ABOUT_PATH = path.resolve(__dirname, ABOUT);

const POSTS = "./pages/posts";

const posts = fs
  .readdirSync(path.resolve(__dirname, POSTS))
  .filter(file => file.endsWith(".md"))
  .map(file => [file, path.resolve(__dirname, POSTS, file)]);

const graph = {};

[...posts, [ABOUT, ABOUT_PATH]].forEach(([filepath, filename]) => {
  const contents = fs.readFileSync(filename, "utf-8");
  const jsx = mdx.sync(contents, { remarkPlugins: [transformEdgeToMarkup] });
  const ast = babel.parseSync(jsx, { presets: ["next/babel"], filename });
  traverse(ast, {
    JSXOpeningElement(path) {
      if (path.node.name.name === "Edge") {
        const attrs = path.node.attributes;
        let label = "";
        let identifier = "";
        attrs.forEach(attr => {
          const name = attr.name.name;
          if (name === "label") {
            label = attr.value.value;
          }

          if (name === "identifier") {
            identifier = attr.value.value;
          }
        });

        if (!label || !identifier) {
          throw new Error(`failed to parse Edge at file ${file}`);
        }

        if (!graph[identifier]) {
          graph[identifier] = {
            label,
            paths: []
          };
        }

        const route = utils.routeFromPath(filename);
        graph[identifier] = {
          ...graph[identifier],
          paths: [...graph[identifier].paths, route]
        };
      }
    }
  });
});

fs.writeFileSync(
  path.resolve(__dirname, "__edges.js"),
  `export default ${JSON.stringify(graph, null, 2)};`
);
