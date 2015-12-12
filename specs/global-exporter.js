var expect = require('chai').expect,
    GlobalExporter = require('../src/global-exporter');

describe('GlobalExporter', function() {
  it('is a thing', function() {
    expect(GlobalExporter).to.be.a('function');
  });

  describe('construction', function() {
    it('throws an exception when instantiated without arguments', function() {
      expect(function() {
        new GlobalExporter();
      }).to.throw(Error);
    });

    it('instantiates without error when defaultExport is specified', function() {
      expect(function() {
        new GlobalExporter('Foo');
      }).to.not.throw(Error);
    });

    it('can be instantiated without using the new keyword', function() {
      var exporter = GlobalExporter('Foo');
      expect(exporter).to.be.an.instanceof(GlobalExporter);
    });

    it('sets the property defaultExports with the first argument', function() {
      var exporter = new GlobalExporter('Foo');
      expect(exporter)
        .to.have.property('defaultExport')
        .that.equals('Foo');
    });

    it('sets exports to an empty array when not provided', function() {
      var exporter = new GlobalExporter('Foo');
      expect(exporter)
        .to.have.property('exports')
        .that.is.an('array')
        .that.is.empty;
    });

    it('sets exports to the passed exports when provided', function() {
      var exporter = new GlobalExporter('Foo', ['bar', 'baz']);
      expect(exporter)
        .to.have.property('exports')
        .that.is.an('array')
        .that.deep.equals(['bar', 'baz']);
    });

    it('can be constructed without passing a default export', function() {
      var exporter = new GlobalExporter(undefined, ['foo', 'bar']);
      expect(exporter)
        .to.have.property('defaultExport')
        .that.is.undefined;

      expect(exporter)
        .to.have.property('exports')
        .that.is.an('array')
        .that.deep.equals(['foo', 'bar']);
    });
  });

  describe('processSourceCode', function() {
    it('is a method', function() {
      var exporter = new GlobalExporter('Foo');
      expect(exporter)
        .to.have.property('processSourceCode')
        .that.is.a('function');
    });

    it('adds default export statements to the source code', function() {
      var sourceCode = 'var foo = 1;',
          exporter = new GlobalExporter('foo');

      expect(sourceCode).to.not.contain('export default foo;');
      sourceCode = exporter.processSourceCode(sourceCode);
      expect(sourceCode).to.contain('export default foo;');
    });

    it('adds named exports to the source code', function() {
      var sourceCode = 'var foo = 1;',
          exporter = new GlobalExporter(undefined, ['foo']);

      expect(sourceCode).to.not.contain('export foo;');
      sourceCode = exporter.processSourceCode(sourceCode);
      expect(sourceCode).to.contain('export foo;');
    });
  });
});
