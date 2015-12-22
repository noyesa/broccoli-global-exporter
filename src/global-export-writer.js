import path from 'path';
import fs from 'fs';

import BroccoliPlugin from 'broccoli-plugin';
import first from 'lodash.first';
import defaults from 'lodash.defaults';
import pairs from 'lodash.pairs';
import { sync as mkdirpSync } from 'mkdirp';

import { getExporter } from './global-exporter';

/**
 * Broccoli plugin that adds ES6 export statements to files.
 * @param {string|object} inputTree The tree that contains the file that exports will be added to
 * @param {string} fileName Name of the file in the input tree to add exports to
 * @param {object} [options={}] Configuration options for export writer
 * @param {string} [options.defaultExport] The name of the default export for the file
 * @param {string[]} [options.exports=[]] List of named exports
 * @param {string} [options.moduleType=es2015] Type of module exports
 */
export class GlobalExportWriter extends BroccoliPlugin {
  constructor(inputTree, fileName, options = {}) {
    defaults(options, {
      exports: [],
      moduleType: 'es2015'
    });

    if (Array.isArray(inputTree)) {
      throw new TypeError('Does not support more than one input tree');
    }

    super([inputTree], {
      annotations: options.annotations
    });

    this.fileName = fileName;
    this.exporter = getExporter(options.moduleType, options.defaultExport, options.exports);
  }

  /**
   * Adds exports to a source code file.
   */
  build() {
    const srcPath = path.join(first(this.inputPaths), this.fileName),
          destPath = path.join(this.outputPath, this.fileName),
          sourceCode = this.exporter.processSourceCode(fs.readFileSync(srcPath, 'utf8'));
    fs.writeFileSync(destPath, sourceCode);
  }
}

/**
 * Broccoli plugin that adds export statements to JavaScript files.
 */
export class MultiGlobalExportWriter extends BroccoliPlugin {
  /**
   * Implements new API that supports multiple files.
   * @param {object} inputTree Input tree containing files to add exports to
   * @param {object.<string, object>} files Object hash of file names and exports
   * @param {object} [options={}] Configuration options
   * @param {string} [options.moduleType=es2015] Output module type
   */
  constructor(inputTree, files, options = {}) {
    super([inputTree], {
      annotations: options.annotations
    });

    defaults(options, {
      moduleType: 'es2015'
    })

    this.moduleType = options.moduleType;
    this.exporters = this._buildExporters(files);
  }

  /**
   * Builds an array containing pairs mapping file names to exporters. The
   * exporter will be used to transform source code when the tree is built.
   * @param {object.<string, object>} A hash map of file names to configuration
   * @returns {Array.<Array>} An array of pairs mapping file name to exporter
   */
  _buildExporters(files) {
    return pairs(files).map(([fileName, options]) => {
      const exporter = getExporter(this.moduleType, options.defaultExport, options.exports);
      return [fileName, exporter];
    })
  }

  /**
   * Adds exports to all the source code files described in the files hash.
   */
  build() {
    const inputPath = first(this.inputPaths);
    this.exporters.forEach(([fileName, exporter]) => {
      const srcPath = path.join(inputPath, fileName);
      if (fs.existsSync(srcPath)) {
        const sourceCode = exporter.processSourceCode(fs.readFileSync(srcPath, 'utf8'));
        const destPath = path.join(this.outputPath, fileName);

        // Make sure the directory exists before writing it.
        mkdirpSync(path.dirname(destPath));
        fs.writeFileSync(destPath, sourceCode);
      }
    });
  }
}
