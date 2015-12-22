import BaseGlobalExporter from './exporters/base';

/**
 * Generates ES6 export statements.
 */
export class Es6GlobalExporter extends BaseGlobalExporter {
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

/**
 * Generates CommonJS export statements.
 */
export class CjsGlobalExporter extends BaseGlobalExporter {
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

/**
 * Factory function that returns a specific exporter type based on the
 * requested module type.
 * @param {string} moduleType The module type for which to get an Exporter instance
 * @returns {BaseGlobalExporter} Exporter instance
 */
export function getExporter(moduleType, ...args) {
  let Exporter = Es6GlobalExporter;
  if (moduleType === 'cjs') {
    Exporter = CjsGlobalExporter;
  }
  return new Exporter(...args);
}
