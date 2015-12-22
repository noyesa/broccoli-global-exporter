import { expect } from 'chai';
import { BaseGlobalExporter, CjsGlobalExporter, Es6GlobalExporter } from '../src/global-exporter';

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
      var exporter = new BaseGlobalExporter(undefined, ['foo', 'bar']);

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

  describe('getExports', () => {
    it('is abstract', () => {
      const exporter = new BaseGlobalExporter('Foo');
      expect(() => exporter.getExports()).to.throw(Error);
    })
  });
});

describe('Es6GlobalExporter', function() {
  it('is a thing', function() {
    expect(Es6GlobalExporter).to.be.a('function');
  });

  it('is a subclass of BaseGlobalExporter', () => {
    expect(Es6GlobalExporter.prototype).to.be.instanceof(BaseGlobalExporter);
  });

  describe('processSourceCode', function() {
    it('is a method', function() {
      var exporter = new Es6GlobalExporter('Foo');
      expect(exporter)
        .to.have.property('processSourceCode')
        .that.is.a('function');
    });

    it('adds default export statements to the source code', function() {
      var sourceCode = 'var foo = 1;',
          exporter = new Es6GlobalExporter('foo');

      expect(sourceCode).to.not.contain('export default foo;');
      sourceCode = exporter.processSourceCode(sourceCode);
      expect(sourceCode).to.contain('export default foo;');
    });

    it('adds named exports to the source code', function() {
      var sourceCode = 'var foo = 1;',
          exporter = new Es6GlobalExporter(undefined, ['foo']);

      expect(sourceCode).to.not.contain('export foo;');
      sourceCode = exporter.processSourceCode(sourceCode);
      expect(sourceCode).to.contain('export foo;');
    });
  });
});

describe('CjsGlobalExporter', function() {
  it('is a thing', function() {
    expect(CjsGlobalExporter).to.be.a('function');
  });

  it('is a subclass of BaseGlobalExporter', () => {
    expect(CjsGlobalExporter.prototype).to.be.instanceof(BaseGlobalExporter);
  });

  describe('processSourceCode', function() {
    it('adds default export statements to the source code', function() {
      var sourceCode = 'var foo = 1;',
          exporter = new CjsGlobalExporter('foo');

      expect(sourceCode).to.not.contain('exports[\'default\'] = foo;');
      expect(sourceCode).to.not.contain('__esModule');
      sourceCode = exporter.processSourceCode(sourceCode);
      expect(sourceCode).to.contain('exports[\'default\'] = foo');
      expect(sourceCode).to.contain('__esModule');
    });

    it('adds named exports to the source code', function() {
      var sourceCode = 'var foo = 1;',
          exporter = new CjsGlobalExporter(undefined, ['foo']);

      expect(sourceCode).to.not.contain('exports.foo = foo');
      sourceCode = exporter.processSourceCode(sourceCode);
      expect(sourceCode).to.contain('exports.foo = foo');
    });
  });
});
