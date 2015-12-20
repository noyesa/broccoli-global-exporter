import util from 'util';
import path from 'path';
import fs from 'fs';

import BroccoliPlugin from 'broccoli-plugin';
import first from 'lodash.first';
import defaults from 'lodash.defaults';
import assign from 'lodash.assign';

import { getExporter } from './global-exporter';

// This must be here because Babel 6 no longer does this when a module contains
// only a single default export.
module.exports = GlobalExportWriter;

/**
 * Broccoli plugin that adds ES6 export statements to files.
 * @param {string|object} inputTree The tree that contains the file that exports will be added to
 * @param {string} fileName Name of the file in the input tree to add exports to
 * @param {object} [options={}] Configuration options for export writer
 * @param {string} [options.defaultExport] The name of the default export for the file
 * @param {string[]} [options.exports=[]] List of named exports
 * @param {string} [options.moduleType=es2015] Type of module exports
 */
function GlobalExportWriter(inputTree, fileName, options = {}) {
  if (!(this instanceof GlobalExportWriter)) {
    return new GlobalExportWriter(inputTree, fileName, options);
  }

  options = defaults(options, {
    exports: [],
    moduleType: 'es2015'
  });

  if (Array.isArray(inputTree)) {
    throw new TypeError('Does not support more than one input tree');
  }

  BroccoliPlugin.call(this, [inputTree], {
    annotations: options.annotations
  });

  this.fileName = fileName;
  this.exporter = getExporter(options.moduleType, options.defaultExport, options.exports);
}

util.inherits(GlobalExportWriter, BroccoliPlugin);

assign(GlobalExportWriter.prototype, {
  /**
   * Adds exports to a source code file.
   */
  build() {
    const srcPath = path.join(first(this.inputPaths), this.fileName),
          destPath = path.join(this.outputPath, this.fileName),
          sourceCode = this.exporter.processSourceCode(fs.readFileSync(srcPath, 'utf8'));
    fs.writeFileSync(destPath, sourceCode);
  }
});
