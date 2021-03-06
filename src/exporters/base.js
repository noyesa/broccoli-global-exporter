/**
 * Generates the export statements for source code.
 * @param {string} defaultExport Name of the global variable to export as default
 * @param {string[]} [exports=[]] Named exports
 */
export default class BaseGlobalExporter {
  constructor(defaultExport, exports = []) {
    if (!(defaultExport || exports.length)) {
      throw new Error('Must provide either default or named exports, or both.');
    }

    this.defaultExport = defaultExport;
    this.exports = exports;
  }

  /**
   * Returns export strings for all the named exports.
   * @returns {string[]} Array of named export strings
   * @abstract
   */
  getNamedExports() {
    throw new Error('not implemented');
  }

  /**
   * Returns default export string.
   * @returns {string} Default export string
   * @abstract
   */
  getDefaultExport() {
    throw new Error('not implemented');
  }

  /**
   * Gets array of all the export statements.
   * @returns {string[]} Gets array of all named exports
   */
  getExports() {
    const exports = this.getNamedExports(),
          defaultExport = this.getDefaultExport();

    if (!Array.isArray(exports)) {
      throw new TypeError('getNamedExports must return an array of strings');
    }

    if (defaultExport) {
      exports.push(defaultExport);
    }

    return `${exports.join(';\n')};`;
  }

  /**
   * Processes a source code file by adding export statements to the end of it.
   * @param {string} sourceCode The source code to add the export statements to
   * @returns {string} Source code with the exports added
   */
  processSourceCode(sourceCode) {
    const exports = this.getExports();

    // Add a leading semi-colon iff the last non-whitespace character is not one.
    if (!/;\s*$/.test(sourceCode)) {
      sourceCode += ';';
    }

    return `${sourceCode}\n${exports}`;
  }
}
