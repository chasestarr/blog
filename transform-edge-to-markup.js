const visit = require("unist-util-visit");

function transform() {
  return function transformer(tree) {
    visit(tree, "linkReference", function(node) {
      const matches = node.label.match(new RegExp(/:(.*?):/, "g"));
      if (matches && matches.length) {
        const label = node.label.slice(1, -1);
        const identifier = node.identifier.slice(1, -1);
        node.type = "jsx";
        node.value = `<Edge label="${label}" identifier="${identifier}" />`;
      }
    });
  };
}

module.exports = transform;
