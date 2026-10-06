const escapeRegex = (value) =>
  String(value).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

module.exports = escapeRegex;
