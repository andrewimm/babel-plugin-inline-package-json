import path from 'path';

export default function({ Plugin, types: t }) {
  return new Plugin('inline-package-json', {
    visitor: {
      MemberExpression: function MemberExpression(node, parent) {
        if (t.isCallExpression(node.object) &&
            t.isIdentifier(node.object.callee, { name: 'require' }) &&
            t.isLiteral(node.object.arguments[0]) &&
            node.object.arguments[0].value.match(/package\.json$/)) {
          let srcPath = path.resolve(this.state.opts.filenameRelative);
          let pkg = require(path.join(srcPath, '..', node.object.arguments[0].value));
          let value = pkg[node.property.name];
          return t.expressionStatement(t.valueToNode(value));
        }
      }
    }
  });
}
