import { expect } from 'chai';
import BaseGlobalExporter from '../../src/exporters/base';

describe('BaseGlobalExporter', () => {
  it('is a thing', () => expect(BaseGlobalExporter).to.be.a('function'));

  describe('construction', () => {
    it('throws an exception when instantiated without arguments', () => {
      expect(() => new BaseGlobalExporter()).to.throw(Error);
    });

    it('instantiates without error when defaultExport is specified', function() {
      expect(function() {
        new BaseGlobalExporter('Foo');
      }).to.not.throw(Error);
    });

    it('sets the property defaultExports with the first argument', function() {
      const exporter = new BaseGlobalExporter('Foo');
      expect(exporter)
        .to.have.property('defaultExport')
        .that.equals('Foo');
    });

    it('sets exports to an empty array when not provided', function() {
      const exporter = new BaseGlobalExporter('Foo');
      expect(exporter)
        .to.have.property('exports')
        .that.is.an('array')
        .that.is.empty;
    });

    it('sets exports to the passed exports when provided', function() {
      const exporter = new BaseGlobalExporter('Foo', ['bar', 'baz']);
      expect(exporter)
        .to.have.property('exports')
        .that.is.an('array')
        .that.deep.equals(['bar', 'baz']);
    });

    it('can be constructed without passing a default export', function() {
      const exporter = new BaseGlobalExporter(undefined, ['foo', 'bar']);

      expect(exporter)
        .to.have.property('defaultExport')
        .that.is.undefined;

      expect(exporter)
        .to.have.property('exports')
        .that.is.an('array')
        .that.deep.equals(['foo', 'bar']);
    });
  });

  describe('getDefaultExport', () => {
    it('is abstract', () => {
      const exporter = new BaseGlobalExporter('Foo');
      expect(() => exporter.getDefaultExport()).to.throw(Error);
    });
  });

  describe('getNamedExports', () => {
    it('is abstract', () => {
      const exporter = new BaseGlobalExporter('Foo');
      expect(() => exporter.getNamedExports()).to.throw(Error);
    });
  });

  function buildExporter() {
    const exporter = new BaseGlobalExporter('Foo', ['bar', 'baz']);
    exporter.getDefaultExport = () => 'coolDefault';
    exporter.getNamedExports = () => ['coolBar', 'coolBaz'];
    return exporter;
  }

  describe('getExports', () => {
    it('combines the default export and named exports', () => {
      const exports = buildExporter().getExports();
      expect(exports)
        .to.be.a('string')
        .that.contains('coolDefault;')
        .and.contains('coolBar;')
        .and.contains('coolBaz;');
    });

    it('throws an error when getNamedExports does not return an array', () => {
      const exporter = new BaseGlobalExporter('Foo', ['bar', 'baz']);
      exporter.getDefaultExport = () => 'coolDefault';
      exporter.getNamedExports = () => 'cool';
      expect(() => exporter.getExports()).to.throw(Error);
    });
  });

  describe('processSourceCode', () => {
    it('adds the default and named exports to the end of the source code passed in', () => {
      const sourceCode = 'var i = 0;';
      expect(buildExporter().processSourceCode(sourceCode))
        .to.be.a('string')
        .that.contains(sourceCode)
        .and.contains('coolDefault;')
        .and.contains('coolBar;')
        .and.contains('coolBaz;');
    });
  });
});
