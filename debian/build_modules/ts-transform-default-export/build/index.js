"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
var path_1 = __importDefault(require("path"));
var typescript_1 = __importDefault(require("typescript"));
function removeDefaultExportModifiers(modifiers) {
    return modifiers.filter(function (modifier) {
        return modifier.kind !== typescript_1.default.SyntaxKind.ExportKeyword &&
            modifier.kind !== typescript_1.default.SyntaxKind.DefaultKeyword;
    });
}
function hasDefaultExportModifiers(node) {
    return (node.modifiers &&
        node.modifiers.find(function (m) { return m.kind === typescript_1.default.SyntaxKind.ExportKeyword; }) &&
        node.modifiers.find(function (m) { return m.kind === typescript_1.default.SyntaxKind.DefaultKeyword; }));
}
function convertDeclaration(node, addDeclare) {
    if (addDeclare === void 0) { addDeclare = false; }
    var modifiers = node.modifiers ? removeDefaultExportModifiers(node.modifiers) : [];
    if (addDeclare) {
        modifiers.unshift(typescript_1.default.createModifier(typescript_1.default.SyntaxKind.DeclareKeyword));
    }
    return __assign(__assign({}, node), { name: node.name || typescript_1.default.getGeneratedNameForNode(node), modifiers: modifiers });
}
function createExportAssignmentForNode(node, isExportEquals) {
    if (isExportEquals === void 0) { isExportEquals = false; }
    var name = typescript_1.default.isIdentifier(node)
        ? node
        : node.propertyName ||
            node.name ||
            typescript_1.default.getGeneratedNameForNode(node);
    return typescript_1.default.createExportAssignment(undefined, undefined, isExportEquals, name);
}
function visitor(isDeclarationFile, keepOriginalExport, context, node) {
    if (typescript_1.default.isExportDeclaration(node)) {
        // `export { foo as default, bar, baz as qux }` → `export = foo`
        var hasOtherSpecifiers_1 = false;
        var defaultSpecifier_1;
        node = typescript_1.default.visitEachChild(node, function (node) {
            return typescript_1.default.visitEachChild(node, function (node) {
                if (typescript_1.default.isExportSpecifier(node) &&
                    node.name && node.name.escapedText === 'default' &&
                    node.propertyName) {
                    defaultSpecifier_1 = node;
                    return keepOriginalExport ? node : undefined;
                }
                hasOtherSpecifiers_1 = true;
                return node;
            }, context);
        }, context);
        if (!defaultSpecifier_1) {
            return node;
        }
        var exportAssignment = createExportAssignmentForNode(defaultSpecifier_1, true);
        if (keepOriginalExport || hasOtherSpecifiers_1) {
            return [node, exportAssignment];
        }
        return exportAssignment;
    }
    if (hasDefaultExportModifiers(node) &&
        (typescript_1.default.isFunctionDeclaration(node) || typescript_1.default.isClassDeclaration(node))) {
        // `export default function foo() {}` → `declare function foo(): void; export = foo`
        // `export default class Bar {}` → `declare class Bar {}; export = Bar`
        var nodes = [
            convertDeclaration(node, isDeclarationFile),
            createExportAssignmentForNode(node, true),
        ];
        if (keepOriginalExport) {
            nodes.push(createExportAssignmentForNode(node));
        }
        return nodes;
    }
    if (typescript_1.default.isExportAssignment(node)) {
        // `export default fn` → `export = fn`
        var equalsAssignment = createExportAssignmentForNode(node.expression, true);
        if (keepOriginalExport) {
            return [node, equalsAssignment];
        }
        return equalsAssignment;
    }
    return node;
}
/**
 * Transforms default exports to `export =` so that they become `module.exports =`
 * when transpiled to CommonJS or UMD
 *
 * ```
 * export { foo as default }
 * //=> export = foo
 * ```
 *
 * ```
 * export default foo
 * //=> export = foo
 * ```
 *
 * ```
 * export default function foo() {}
 * //=> function foo() {}; export = foo
 * ```
 */
function transformDefaultExport(program, options) {
    if (options === void 0) { options = {}; }
    var typeChecker = program.getTypeChecker();
    var rootFiles = program.getRootFileNames();
    return function (context) {
        return function (file) {
            if (rootFiles.indexOf(file.fileName) === -1 &&
                rootFiles.indexOf(path_1.default.normalize(file.fileName)) === -1) {
                return file;
            }
            var moduleSymbol = typeChecker.getSymbolAtLocation(file);
            if (!moduleSymbol) {
                return file;
            }
            var hasDefaultExport = false;
            var hasNamedExports = false;
            typeChecker.getExportsOfModule(moduleSymbol).forEach(function (exp) {
                if (exp.escapedName === 'default') {
                    hasDefaultExport = true;
                }
                else {
                    hasNamedExports = true;
                }
            });
            if (!hasDefaultExport) {
                return file;
            }
            if (!options.allowNamedExports && hasNamedExports) {
                throw new Error("(ts-transform-default-export) Unable to transform the default export of the module \"" + file.fileName + "\"." +
                    ' The module has named exports, which could be lost during the transformation.' +
                    ' To ignore this, set the `allowNamedExports` option to `true`');
            }
            return typescript_1.default.visitEachChild(file, visitor.bind(null, file.isDeclarationFile, Boolean(options.keepOriginalExport), context), context);
        };
    };
}
exports.default = transformDefaultExport;
//# sourceMappingURL=index.js.map
