/**
 * Generates the export statements for source code.
 * @param {string} defaultExport Name of the global variable to export as default
 * @param {string[]} [exports=[]] Named exports
 */
export class BaseGlobalExporter {
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
  getNamedExports() {}

  /**
   * Returns default export string.
   * @returns {string} Default export string
   * @abstract
   */
  getDefaultExport() {}

  /**
   * Gets array of all the export statements.
   * @returns {string[]} Gets array of all named exports
   * @private
   */
  getExports() {
    const exports = this.getNamedExports(),
          defaultExport = this.getDefaultExport();

    if (defaultExport) {
      exports.push(defaultExport);
    }

    return exports.join(';\n') + ';';
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
    return this.exports.map(namedExport => `exports.${namedExport} = ${namedExport};`);
  }

  /**
   * Returns default export string.
   * @returns {string} Default export string
   */
  getDefaultExport() {
    if (this.defaultExport) {
      return `
        Object.defineProperty(exports, '__esModule', {
          value: true;
        });
        exports['default'] = ${this.defaultExport};
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
