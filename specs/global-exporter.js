var expect = require('chai').expect,
    CjsGlobalExporter = require('../dist/global-exporter').CjsGlobalExporter,
    Es6GlobalExporter = require('../dist/global-exporter').Es6GlobalExporter;

describe('Es6GlobalExporter', function() {
  it('is a thing', function() {
    expect(Es6GlobalExporter).to.be.a('function');
  });

  describe('construction', function() {
    it('throws an exception when instantiated without arguments', function() {
      expect(function() {
        new Es6GlobalExporter();
      }).to.throw(Error);
    });

    it('instantiates without error when defaultExport is specified', function() {
      expect(function() {
        new Es6GlobalExporter('Foo');
      }).to.not.throw(Error);
    });

    it('sets the property defaultExports with the first argument', function() {
      var exporter = new Es6GlobalExporter('Foo');
      expect(exporter)
        .to.have.property('defaultExport')
        .that.equals('Foo');
    });

    it('sets exports to an empty array when not provided', function() {
      var exporter = new Es6GlobalExporter('Foo');
      expect(exporter)
        .to.have.property('exports')
        .that.is.an('array')
        .that.is.empty;
    });

    it('sets exports to the passed exports when provided', function() {
      var exporter = new Es6GlobalExporter('Foo', ['bar', 'baz']);
      expect(exporter)
        .to.have.property('exports')
        .that.is.an('array')
        .that.deep.equals(['bar', 'baz']);
    });

    it('can be constructed without passing a default export', function() {
      var exporter = new Es6GlobalExporter(undefined, ['foo', 'bar']);
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

  describe('construction', function() {
    it('throws an exception when instantiated without arguments', function() {
      expect(function() {
        new CjsGlobalExporter();
      }).to.throw(Error);
    });

    it('instantiates without error when defaultExport is specified', function() {
      expect(function() {
        new CjsGlobalExporter('Foo');
      }).to.not.throw(Error);
    });

    it('sets the property defaultExports with the first argument', function() {
      var exporter = new CjsGlobalExporter('Foo');
      expect(exporter)
        .to.have.property('defaultExport')
        .that.equals('Foo');
    });

    it('sets exports to an empty array when not provided', function() {
      var exporter = new CjsGlobalExporter('Foo');
      expect(exporter)
        .to.have.property('exports')
        .that.is.an('array')
        .that.is.empty;
    });

    it('sets exports to the passed exports when provided', function() {
      var exporter = new CjsGlobalExporter('Foo', ['bar', 'baz']);
      expect(exporter)
        .to.have.property('exports')
        .that.is.an('array')
        .that.deep.equals(['bar', 'baz']);
    });

    it('can be constructed without passing a default export', function() {
      var exporter = new CjsGlobalExporter(undefined, ['foo', 'bar']);
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
    it('adds default export statements to the source code', function() {
      var sourceCode = 'var foo = 1;',
          exporter = new CjsGlobalExporter('foo');

      expect(sourceCode).to.not.contain('exports[\'default\'] = foo;');
      expect(sourceCode).to.not.contain('__esModule');
      sourceCode = exporter.processSourceCode(sourceCode);
      expect(sourceCode).to.contain('exports[\'default\'] = foo;');
      expect(sourceCode).to.contain('__esModule');
    });

    it('adds named exports to the source code', function() {
      var sourceCode = 'var foo = 1;',
          exporter = new CjsGlobalExporter(undefined, ['foo']);

      expect(sourceCode).to.not.contain('exports.foo = foo;');
      sourceCode = exporter.processSourceCode(sourceCode);
      expect(sourceCode).to.contain('exports.foo = foo;');
    });
  });
});
