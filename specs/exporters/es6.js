import { expect } from 'chai';

import Es6GlobalExporter from '../../src/exporters/es6';
import BaseGlobalExporter from '../../src/exporters/base';

describe('Es6GlobalExporter', () => {
  it('is a thing', () => {
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
