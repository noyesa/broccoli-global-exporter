[![Build Status](https://travis-ci.org/noyesa/broccoli-global-exporter.svg?branch=master)](https://travis-ci.org/noyesa/broccoli-global-exporter)
[![codecov.io](https://codecov.io/github/noyesa/broccoli-global-exporter/coverage.svg?branch=master)](https://codecov.io/github/noyesa/broccoli-global-exporter?branch=master)

# broccoli-global-exporter
Exports global variables using ES6 module syntax.

This is useful for working in a code base that is stuck with code that doesn't use modules, such as legacy or vendor code that we do not own, so I wrote this plugin to shim them and import them using modules. This doesn't provide any mechanism for specifying imports or requires, though I welcome additions.

Shimming dependency management is, in my experience, a very error prone approach, with a near guarantee of breaking. The goal of this module isn't to make non-modules walk like modules, but to allow them to be included via module loaders to free client code written as modules from the burden of having to import something from the global namespace, and enable you to inject a better dependency later on without changing the consumers.

## Example usage

In your `Brocfile.js`:

```js
var exportGlobals = require('broccoli-global-exporter');

module.exports = exportGlobals('src', 'foo.js', {
  defaultExport: 'Foo',
  exports: ['bar', 'baz']
});
```

this will augment the input file (`foo.js`) with the following export statements:

```js
export default Foo;
export bar;
export baz;
```

Optionally, if you don't want to target ES6 exports, the modules can be output in AMD or CJS by specifying `moduleType` in the options:

```js
var exported = exportGlobals('src', 'foo.js', {
  defaultExport: 'Foo',
  moduleType: 'amd'
});
```

The accepted module types are `amd` and `common`. Babel is used for this transformation, and operates on the entire file with only the `es6.modules` transformer enabled, so beware it could transform source code if it already has exports/imports.
