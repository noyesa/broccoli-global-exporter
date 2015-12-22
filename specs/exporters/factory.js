import { expect } from 'chai';

import exporterFactory from '../../src/exporters/factory';
import Es6GlobalExporter from '../../src/exporters/es6';
import CjsGlobalExporter from '../../src/exporters/cjs';

describe('exporterFactory', () => {
  it('exists', () => expect(exporterFactory).to.be.a('function'));

  it('returns an Es6GlobalExporter instance when "es2015" is the module type', () => {
    const exporter = exporterFactory('es2015', 'Foo', ['foo', 'bar']);
    expect(exporter).to.be.an.instanceof(Es6GlobalExporter);
  });

  it('returns an Es6GlobalExporter instance when no module type is given', () => {
    const exporter = exporterFactory(undefined, 'Foo', ['foo', 'bar']);
    expect(exporter).to.be.an.instanceof(Es6GlobalExporter);
  });

  it('returns a CjsGlobalExporter instance when "cjs" is the module type', () => {
    const exporter = exporterFactory('cjs', 'Foo', ['foo', 'bar']);
    expect(exporter).to.be.an.instanceof(CjsGlobalExporter);
  });
});
