import path from 'path';

export default function({ types: t }) {
  function getValue(src, name, key) {
    const basePath = path.resolve(src);
    const pkg = require(path.join(basePath, '..', name));

    return pkg[key];
  }

  function isPackageJSON(node) {
    return t.isLiteral(node) && /package\.json$/.test(node.value);
  }

  return {
    visitor: {
      ImportDeclaration: function importDeclaration(treePath) {
        const node = treePath.node;
        const src = this.file.opts.filename;

        if (!isPackageJSON(node.source)) {
          return;
        }

        const variables = node.specifiers.filter(t.isImportSpecifier).map(specifier => {
          const value = getValue(src, node.source.value, specifier.local.name);

          return t.variableDeclaration('const', [t.variableDeclarator(specifier.local, t.valueToNode(value))]);
        });

        if (!variables.length) {
          return;
        }

        return treePath.replaceWithMultiple(variables);
      },

      MemberExpression: function MemberExpression(treePath) {
        const node = treePath.node;
        const src = this.file.opts.filename;

        if (!t.isCallExpression(node.object) ||
            !t.isIdentifier(node.object.callee, { name: 'require' }) ||
            !isPackageJSON(node.object.arguments[0])) {
          return;
        }

        const value = getValue(src, node.object.arguments[0].value, node.property.name);

        return treePath.replaceWith(t.expressionStatement(t.valueToNode(value)));
      }
    }
  }
};
