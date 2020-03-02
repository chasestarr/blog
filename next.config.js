const transformEdgeToMarkup = require("./transform-edge-to-markup.js");
const mdx = require("@next/mdx");

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [transformEdgeToMarkup]
  }
});

module.exports = withMDX({
  pageExtensions: ["js", "jsx", "md", "mdx"]
});
