import util from 'util';
import path from 'path';
import fs from 'fs';

import BroccoliPlugin from 'broccoli-plugin';
import first from 'lodash.first';
import includes from 'lodash.includes';
import defaults from 'lodash.defaults';
import assign from 'lodash.assign';
import babel from 'babel';

import GlobalExporter from './global-exporter';

/**
 * Broccoli plugin that adds ES6 export statements to files.
 * @param {string|object} inputTree The tree that contains the file that exports will be added to
 * @param {string} fileName Name of the file in the input tree to add exports to
 * @param {object} [options={}] Configuration options for export writer
 * @param {string} [options.moduleType=es2015] Output module type: es2015, amd, or common
 * @param {string} [options.defaultExport] The name of the default export for the file
 * @param {string[]} [options.exports=[]] List of named exports
 */
export default function GlobalExportWriter(inputTree, fileName, options = {}) {
  if (!(this instanceof GlobalExportWriter)) {
    return new GlobalExportWriter(inputTree, fileName, options);
  }

  options = defaults(options, {
    moduleType: 'es2015',
    exports: []
  });

  if (Array.isArray(inputTree)) {
    throw new TypeError('Does not support more than one input tree');
  }

  BroccoliPlugin.call(this, [inputTree], {
    annotations: options.annotations
  });

  this.fileName = fileName;
  this.moduleType = options.moduleType;
  this.babelConfig = options.babel || {};
  this.exporter = new GlobalExporter(options.defaultExport, options.exports);
  this.shouldTranspile = includes(['amd', 'common'], this.moduleType);
}

util.inherits(GlobalExportWriter, BroccoliPlugin);

assign(GlobalExportWriter.prototype, {
  /**
   * Adds exports to a source code file.
   */
  build() {
    const srcPath = path.join(first(this.inputPaths), this.fileName),
          destPath = path.join(this.outputPath, this.fileName);
    let sourceCode = fs.readFileSync(srcPath, 'utf8');

    sourceCode = this.exporter.processSourceCode(sourceCode);

    if (this.shouldTranspile) {
      sourceCode = this._transpile(sourceCode);
    }

    fs.writeFileSync(destPath, sourceCode);
  },

  /**
   * Transpiles ES6 modules to a different type.
   * @private
   */
  _transpile(sourceCode) {
    const transpiled = babel.transform(sourceCode, assign({}, this.babelConfig, {
      whitelist: ['es6.modules'],
      modules: this.moduleType,
      compact: false
    }));

    return transpiled.code;
  }
});
