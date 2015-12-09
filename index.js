var util = require('util'),
    path = require('path'),
    fs = require('fs');

var BroccoliPlugin = require('broccoli-plugin'),
    first = require('lodash.first');

var GlobalExporter = require('./global-exporter');

module.exports = GlobalExportWriter;

/**
 * Broccoli plugin that adds ES6 export statements to files.
 */
function GlobalExportWriter(inputNodes, fileName, options) {
  options = options || {};

  if (Array.isArray(inputNodes)) {
    throw new TypeError('Does not support more than one input tree');
  }

  BroccoliPlugin.call(this, [inputNodes], {
    annotations: options.annotations
  });

  this.fileName = fileName;
  this.exporter = new GlobalExporter(options.defaultExport, options.exports);
}

util.inherits(GlobalExportWriter, BroccoliPlugin);

GlobalExportWriter.prototype.build = function() {
  var inputPath = first(this.inputPaths),
      srcPath = path.join(inputPath, this.fileName),
      destPath = path.join(this.outputPath, this.fileName),
      sourceCode = fs.readFileSync(srcPath, 'utf8');

  fs.writeFileSync(destPath, this.exporter.processSourceCode(sourceCode));
};
