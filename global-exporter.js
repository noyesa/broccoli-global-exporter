module.exports = GlobalExporter;

/**
 * Generates the export statements for source code.
 * @param {string} defaultExport Name of the global variable to export as default
 * @param {string[]} [exports=[]] Named exports
 */
function GlobalExporter(defaultExport, exports) {
  exports = exports || [];

  if (!(defaultExport || exports.length)) {
    throw new Error('Must provide either default or named exports, or both.');
  }

  this.defaultExport = defaultExport;
  this.exports = exports;
}

/**
 * Returns export strings for all the named exports.
 * @returns {string[]} Array of named export strings
 * @private
 */
GlobalExporter.prototype._getNamedExports = function() {
  return this.exports.map(function(namedExport) {
    return 'export ' + namedExport;
  });
};

/**
 * Returns default export string.
 * @returns {string} Default export string
 * @private
 */
GlobalExporter.prototype._getDefaultExport = function() {
  return 'export default ' + this.defaultExport;
};

/**
 * Gets array of all the export statements.
 * @returns {string[]} Gets array of all named exports
 * @private
 */
GlobalExporter.prototype._getExports = function() {
  var exports = this._getNamedExports();
  exports.push(this._getDefaultExport());
  return exports.join(';\n') + ';';
};

/**
 * Processes a source code file by adding export statements to the end of it.
 * @param {string} sourceCode The source code to add the export statements to
 * @returns {string} Source code with the exports added
 */
GlobalExporter.prototype.processSourceCode = function(sourceCode) {
  var exports = this._getExports();
  if (!/;\s*$/.test(sourceCode)) {
    sourceCode += ';';
  }
  return sourceCode + exports;
};
