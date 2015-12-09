var util = require('util'),
    path = require('path'),
    fs = require('fs');

var BroccoliPlugin = require('broccoli-plugin'),
    first = require('lodash.first'),
    includes = require('lodash.includes'),
    defaults = require('lodash.defaults');
    babel = require('babel');

var GlobalExporter = require('./global-exporter');

module.exports = GlobalExportWriter;

/**
 * Broccoli plugin that adds ES6 export statements to files.
 */
function GlobalExportWriter(inputNodes, fileName, options) {
  if (!(this instanceof GlobalExportWriter)) {
    return new GlobalExportWriter(inputNodes, fileName, options);
  }

  options = defaults(options || {}, {
    moduleType: 'es2015',
    exports: []
  });

  if (Array.isArray(inputNodes)) {
    throw new TypeError('Does not support more than one input tree');
  }

  BroccoliPlugin.call(this, [inputNodes], {
    annotations: options.annotations
  });

  this.fileName = fileName;
  this.moduleType = options.moduleType;
  this.exporter = new GlobalExporter(options.defaultExport, options.exports);

  this.shouldTranspile = includes(['amd', 'common'], this.moduleType);
}

util.inherits(GlobalExportWriter, BroccoliPlugin);

GlobalExportWriter.prototype.build = function() {
  var inputPath = first(this.inputPaths),
      srcPath = path.join(inputPath, this.fileName),
      destPath = path.join(this.outputPath, this.fileName),
      sourceCode = fs.readFileSync(srcPath, 'utf8');

  sourceCode = this.exporter.processSourceCode(sourceCode);

  if (this.shouldTranspile) {
    sourceCode = this.transpile(sourceCode);
  }

  fs.writeFileSync(destPath, sourceCode);
};

GlobalExportWriter.prototype.transpile = function(sourceCode) {
  var transpiled = babel.transform(sourceCode, {
    whitelist: ['es6.modules'],
    modules: this.moduleType
  });

  return transpiled.code;
};
