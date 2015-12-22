import Es6GlobalExporter from './exporters/es6';
import CjsGlobalExporter from './exporters/cjs';

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
