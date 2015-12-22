import { expect } from 'chai';
import CjsGlobalExporter from '../../src/exporters/cjs';
import BaseGlobalExporter from '../../src/exporters/base';

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
