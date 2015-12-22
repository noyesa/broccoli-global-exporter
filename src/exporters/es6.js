import BaseGlobalExporter from './base';

/**
 * Generates ES6 export statements.
 */
export default class Es6GlobalExporter extends BaseGlobalExporter {
  /**
   * Returns export strings for all the named exports.
   * @returns {string[]} Array of named export strings
   */
  getNamedExports() {
    return this.exports.map(namedExport => `export ${namedExport}`);
  }

  /**
   * Returns default export string.
   * @returns {string} Default export string
   */
  getDefaultExport() {
    if (this.defaultExport) {
      return `export default ${this.defaultExport}`;
    }
  }
}
