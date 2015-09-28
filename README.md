# babel-plugin-inline-package-json

Babel plugin for inlining values from `package.json`

Input:
```js
var version = require('./package.json').version;
```
Output:
```js
var version = '1.0.0';
```

The plugin can be used to import any value from a `package.json` file: primitives, objects, or arrays will all be injected into your compiled source as literal expressions.

## Installation

```sh
$ npm install babel-plugin-inline-package-json
```

## Usage

### Via `.babelrc`

```json
{
  "plugins": ["inline-package-json"]
}
```

### Via CLI

```sh
$ babel --plugins inline-package-json script.js
```

### Via Node API

```js
require('babel-core').transform('code', {
  plugins: ['inline-package-json']
});
```