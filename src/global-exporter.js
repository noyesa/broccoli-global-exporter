import assign from 'lodash.assign';

/**
 * Generates the export statements for source code.
 * @param {string} defaultExport Name of the global variable to export as default
 * @param {string[]} [exports=[]] Named exports
 */
export default function GlobalExporter(defaultExport, exports = []) {
  if (!(this instanceof GlobalExporter)) {
    return new GlobalExporter(defaultExport, exports);
  }

  if (!(defaultExport || exports.length)) {
    throw new Error('Must provide either default or named exports, or both.');
  }

  this.defaultExport = defaultExport;
  this.exports = exports;
}

assign(GlobalExporter.prototype, {
  /**
   * Returns export strings for all the named exports.
   * @returns {string[]} Array of named export strings
   * @private
   */
  _getNamedExports() {
    return this.exports.map(namedExport => `export ${namedExport}`);
  },

  /**
   * Returns default export string.
   * @returns {string} Default export string
   * @private
   */
  _getDefaultExport() {
    if (this.defaultExport) {
      return `export default ${this.defaultExport}`;
    }
  },

  /**
   * Gets array of all the export statements.
   * @returns {string[]} Gets array of all named exports
   * @private
   */
  _getExports() {
    const exports = this._getNamedExports(),
          defaultExport = this._getDefaultExport();

    if (defaultExport) {
      exports.push(defaultExport);
    }

    return exports.join(';\n') + ';';
  },

  /**
   * Processes a source code file by adding export statements to the end of it.
   * @param {string} sourceCode The source code to add the export statements to
   * @returns {string} Source code with the exports added
   */
  processSourceCode(sourceCode) {
    const exports = this._getExports();

    // Add a leading semi-colon iff the last non-whitespace character is not one.
    if (!/;\s*$/.test(sourceCode)) {
      sourceCode += ';';
    }

    return `${sourceCode}\n${exports}`;
  }
});
