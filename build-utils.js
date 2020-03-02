function routeFromPath(path) {
  const filename = path.split("/pages")[1];
  return filename.replace(/\..*$/, "");
}

module.exports = {
  routeFromPath
};
