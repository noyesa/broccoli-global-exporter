import GlobalExportWriter from './global-export-writer';

module.exports = exportGlobals;

/**
 * Broccoli plugin that adds ES6 export statements to files.
 * @param {string|object} inputTree The tree that contains the file that exports will be added to
 * @param {string} fileName Name of the file in the input tree to add exports to
 * @param {object} [options={}] Configuration options for export writer
 * @param {string} [options.defaultExport] The name of the default export for the file
 * @param {string[]} [options.exports=[]] List of named exports
 * @param {string} [options.moduleType=es2015] Type of module exports
 */
function exportGlobals(inputTree, fileName, options) {
  return new GlobalExportWriter(inputTree, fileName, options);
}
