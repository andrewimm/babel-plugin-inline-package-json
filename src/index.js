import path from 'path';

export default function({types: t}) {
  return {
    visitor: {
      MemberExpression: function MemberExpression(treePath) {
        const node = treePath.node;
        if (t.isCallExpression(node.object) &&
            t.isIdentifier(node.object.callee, { name: 'require' }) &&
            t.isLiteral(node.object.arguments[0]) &&
            node.object.arguments[0].value.match(/package\.json$/)) {
          let srcPath = path.resolve(this.file.opts.filename);
          let pkg = require(path.join(srcPath, '..', node.object.arguments[0].value));
          let value = pkg[node.property.name];
          treePath.replaceWith(t.expressionStatement(t.valueToNode(value)));
        }
      }
    }
  }
}
