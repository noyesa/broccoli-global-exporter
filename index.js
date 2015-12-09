var util = require('util'),
    path = require('path'),
    fs = require('fs');

var BroccoliPlugin = require('broccoli-plugin'),
    first = require('lodash.first'),
    includes = require('lodash.includes'),
    defaults = require('lodash.defaults'),
    babel = require('babel');

var GlobalExporter = require('./global-exporter');

module.exports = GlobalExportWriter;

/**
 * Broccoli plugin that adds ES6 export statements to files.
 * @param {string|object} inputTree The tree that contains the file that exports will be added to
 * @param {string} fileName Name of the file in the input tree to add exports to
 * @param {object} [options={}] Configuration options for export writer
 * @param {string} [options.moduleType=es2015] Output module type: es2015, amd, or common
 * @param {string} [options.defaultExport] The name of the default export for the file
 * @param {string[]} [options.exports=[]] List of named exports
 */
function GlobalExportWriter(inputTree, fileName, options) {
  if (!(this instanceof GlobalExportWriter)) {
    return new GlobalExportWriter(inputTree, fileName, options);
  }

  options = defaults(options || {}, {
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
  this.exporter = new GlobalExporter(options.defaultExport, options.exports);
  this.shouldTranspile = includes(['amd', 'common'], this.moduleType);
}

util.inherits(GlobalExportWriter, BroccoliPlugin);

/**
 * Adds exports to a source code file.
 */
GlobalExportWriter.prototype.build = function() {
  var inputPath = first(this.inputPaths),
      srcPath = path.join(inputPath, this.fileName),
      destPath = path.join(this.outputPath, this.fileName),
      sourceCode = fs.readFileSync(srcPath, 'utf8');

  sourceCode = this.exporter.processSourceCode(sourceCode);

  if (this.shouldTranspile) {
    sourceCode = this._transpile(sourceCode);
  }

  fs.writeFileSync(destPath, sourceCode);
};

/**
 * Transpiles ES6 modules to a different type.
 * @private
 */
GlobalExportWriter.prototype._transpile = function(sourceCode) {
  var transpiled = babel.transform(sourceCode, {
    whitelist: ['es6.modules'],
    modules: this.moduleType
  });

  return transpiled.code;
};
