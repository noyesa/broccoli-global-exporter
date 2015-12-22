import BaseGlobalExporter from './base';

/**
 * Generates CommonJS export statements.
 */
export default class CjsGlobalExporter extends BaseGlobalExporter {
  /**
   * Returns export strings for all the named exports.
   * @returns {string[]} Array of named export strings
   */
  getNamedExports() {
    return this.exports.map(namedExport => `exports.${namedExport} = ${namedExport}`);
  }

  /**
   * Returns default export string.
   * @returns {string} Default export string
   */
  getDefaultExport() {
    if (this.defaultExport) {
      return `
        Object.defineProperty(exports, '__esModule', {
          value: true
        });
        exports['default'] = ${this.defaultExport}
      `;
    }
  }
}
