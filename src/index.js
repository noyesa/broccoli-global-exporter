import isPlainObject from 'lodash.isplainobject';
import GlobalExportWriter, { MultiGlobalExportWriter } from './global-export-writer';

module.exports = exportGlobals;

/**
 * Accepts an argument list and determines whether the calling code is using
 * the deprecated single-file API for this plugin, or the new, object
 * hash-map API.
 * @param {Array} args Argument list passed to the plugin Factory
 * @param {Boolean} True if the argument list is for the old API, false for new
 */
function isOldApi(args) {
  const [inputTree, fileName, options = {}] = args;
  return typeof inputTree === 'object' &&
    typeof fileName === 'string' &&
    isPlainObject(options);
}

/**
 * Factory function that returns a Broccoli plugin that adds export statements
 * to JavaScript files. Type-checks argument list to figure out which API is
 * being used, the old one that supports only one file, or the new one that
 * accepts a hash of files.
 */
function exportGlobals(...args) {
  if (isOldApi(args)) {
    return new GlobalExportWriter(...args);
  } else {
    return new MultiGlobalExportWriter(...args);
  }
}
