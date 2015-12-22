import Es6GlobalExporter from './es6';
import CjsGlobalExporter from './cjs';

/**
 * Factory function that returns a specific exporter type based on the
 * requested module type.
 * @param {string} moduleType The module type for which to get an Exporter instance
 * @returns {BaseGlobalExporter} Exporter instance
 */
export default function exporterFactory(moduleType, ...args) {
  let Exporter = Es6GlobalExporter;
  if (moduleType === 'cjs') {
    Exporter = CjsGlobalExporter;
  }
  return new Exporter(...args);
}
