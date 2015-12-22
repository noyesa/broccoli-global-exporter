import { expect } from 'chai';

import BaseGlobalExporter from '../src/exporters/base';
import { CjsGlobalExporter, Es6GlobalExporter } from '../src/global-exporter';

describe('Es6GlobalExporter', function() {
  it('is a thing', function() {
    expect(Es6GlobalExporter).to.be.a('function');
  });

  it('is a subclass of BaseGlobalExporter', () => {
    expect(Es6GlobalExporter.prototype).to.be.instanceof(BaseGlobalExporter);
  });

  describe('getDefaultExport', () => {
    it('builds an ES6 default export statement', () => {
      const exporter = new Es6GlobalExporter('Foo');
      expect(exporter.getDefaultExport()).to.equal('export default Foo');
    });

    it('returns nothing if there is no default export', () => {
      const exporter = new Es6GlobalExporter(undefined, ['foo', 'bar']);
      expect(exporter.getDefaultExport()).to.be.undefined;
    });
  });

  describe('getNamedExports', () => {
    const exporter = new Es6GlobalExporter(undefined, ['foo', 'bar']);
    expect(exporter.getNamedExports()).to.deep.equal(['export foo', 'export bar']);
  });
});

describe('CjsGlobalExporter', function() {
  it('is a thing', function() {
    expect(CjsGlobalExporter).to.be.a('function');
  });

  it('is a subclass of BaseGlobalExporter', () => {
    expect(CjsGlobalExporter.prototype).to.be.instanceof(BaseGlobalExporter);
  });

  describe('getDefaultExport', () => {
    it('returns the default export if there is one', () => {
      const exporter = new CjsGlobalExporter('Foo');
      expect(exporter.getDefaultExport())
        .to.contain('exports[\'default\'] = Foo')
        .and.contain('__esModule');
    });

    it('does not add the __esModule stuff if there is no default export', () => {
      const exporter = new CjsGlobalExporter(undefined, ['foo', 'bar']);
      expect(exporter.getDefaultExport()).to.be.undefined;
    });
  });

  describe('getNamedExports', () => {
    const exporter = new CjsGlobalExporter(undefined, ['foo', 'bar']);
    expect(exporter.getNamedExports()).to.deep.equal(['exports.foo = foo', 'exports.bar = bar']);
  });
});
