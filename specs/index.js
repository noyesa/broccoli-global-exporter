import { expect } from 'chai';
import fixture from 'broccoli-fixture';

import exportGlobals from '../src/index';
import GlobalExportWriter, { MultiGlobalExportWriter } from '../src/global-export-writer';

describe('exportGlobals', () => {
  it('exists', () => {
    expect(exportGlobals).to.be.a('function');
  });

  it('returns the old tree type when given the old style arguments', () => {
    const node = new fixture.Node({
      'foo.js': 'function Foo() {}'
    });

    const writer = exportGlobals(node, 'foo.js', {
      defaultExport: 'Foo'
    });

    expect(writer).to.be.instanceof(GlobalExportWriter);
  });

  it('returns the new tree type when given the new-style arguments', () => {
    const node = new fixture.Node({
      'foo.js': 'function Foo() {}'
    });

    const writer = exportGlobals(node, {
      'foo.js': {
        defaultExport: 'Foo'
      }
    });

    expect(writer).to.be.instanceof(MultiGlobalExportWriter);
  });
});
