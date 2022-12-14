'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var TSModule = require('typescript');

function _interopNamespace(e) {
	if (e && e.__esModule) return e;
	var n = Object.create(null);
	if (e) {
		Object.keys(e).forEach(function (k) {
			if (k !== 'default') {
				var d = Object.getOwnPropertyDescriptor(e, k);
				Object.defineProperty(n, k, d.get ? d : {
					enumerable: true,
					get: function () {
						return e[k];
					}
				});
			}
		});
	}
	n['default'] = e;
	return Object.freeze(n);
}

var TSModule__namespace = /*#__PURE__*/_interopNamespace(TSModule);

function cloneIdentifier(node, options) {
    return options.factory.createIdentifier(options.hook("text", node.text, node.text));
}

function cloneTypeAliasDeclaration(node, options) {
    return options.factory.createTypeAliasDeclaration(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("name", options.nextNode(node.name), node.name), options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("type", options.nextNode(node.type), node.type));
}

function cloneToken(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1t(node, options);
    }
    return v3Strategy$1s(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1s(node, options) {
    const typescript = options.typescript;
    return typescript.createToken(options.hook("kind", node.kind, node.kind));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1t(node, options) {
    return options.factory.createToken(options.hook("kind", node.kind, node.kind));
}

function cloneDecorator(node, options) {
    return options.factory.createDecorator(options.hook("expression", options.nextNode(node.expression), node.expression));
}

function cloneTypeParameterDeclaration(node, options) {
    return options.factory.createTypeParameterDeclaration(options.hook("name", options.nextNode(node.name), node.name), options.hook("constraint", options.nextNode(node.constraint), node.constraint), options.hook("default", options.nextNode(node.default), node.default));
}

function cloneQualifiedName(node, options) {
    return options.factory.createQualifiedName(options.hook("left", options.nextNode(node.left), node.left), options.hook("right", options.nextNode(node.right), node.right));
}

function cloneComputedPropertyName(node, options) {
    return options.factory.createComputedPropertyName(options.hook("expression", options.nextNode(node.expression), node.expression));
}

function cloneCallSignatureDeclaration(node, options) {
    return options.factory.createCallSignature(options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", options.nextNode(node.type), node.type));
}

function cloneConstructSignatureDeclaration(node, options) {
    return options.factory.createConstructSignature(options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", options.nextNode(node.type), node.type));
}

function cloneVariableDeclaration(node, options) {
    let clonedVariableDeclaration;
    if ("factory" in options.typescript) {
        clonedVariableDeclaration = v4Strategy$1s(node, options);
    }
    else {
        clonedVariableDeclaration = v3Strategy$1r(node, options);
    }
    // createVariableDeclaration may wrap the initializer expression in parentheses. We want to make sure that we're producing identical clones here,
    // so if the new VariableDeclaration has a ParenthesizedExpression that weren't there before, remove it.
    if (node.initializer != null &&
        clonedVariableDeclaration.initializer != null &&
        !options.typescript.isParenthesizedExpression(node.initializer) &&
        options.typescript.isParenthesizedExpression(clonedVariableDeclaration.initializer)) {
        clonedVariableDeclaration.initializer = clonedVariableDeclaration.initializer.expression;
    }
    return clonedVariableDeclaration;
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1r(node, options) {
    const typescript = options.typescript;
    return typescript.createVariableDeclaration(options.hook("name", options.nextNode(node.name), node.name), options.hook("type", options.nextNode(node.type), node.type), options.hook("initializer", options.nextNode(node.initializer), node.initializer));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1s(node, options) {
    return options.factory.createVariableDeclaration(options.hook("name", options.nextNode(node.name), node.name), options.hook("exclamationToken", options.nextNode(node.exclamationToken), node.exclamationToken), options.hook("type", options.nextNode(node.type), node.type), options.hook("initializer", options.nextNode(node.initializer), node.initializer));
}

function cloneVariableDeclarationList(node, options) {
    return options.factory.createVariableDeclarationList(options.hook("declarations", options.nextNodes(node.declarations), node.declarations), options.hook("flags", node.flags, node.flags));
}

function cloneVariableStatement(node, options) {
    return options.factory.createVariableStatement(options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("declarationList", options.nextNode(node.declarationList), node.declarationList));
}

function cloneParameterDeclaration(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1r(node, options);
    }
    return v3Strategy$1q(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1q(node, options) {
    const typescript = options.typescript;
    return typescript.createParameter(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("dotDotDotToken", options.nextNode(node.dotDotDotToken), node.dotDotDotToken), options.hook("name", options.nextNode(node.name), node.name), options.hook("questionToken", options.nextNode(node.questionToken), node.questionToken), options.hook("type", options.nextNode(node.type), node.type), options.hook("initializer", options.nextNode(node.initializer), node.initializer));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1r(node, options) {
    return options.factory.createParameterDeclaration(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("dotDotDotToken", options.nextNode(node.dotDotDotToken), node.dotDotDotToken), options.hook("name", options.nextNode(node.name), node.name), options.hook("questionToken", options.nextNode(node.questionToken), node.questionToken), options.hook("type", options.nextNode(node.type), node.type), options.hook("initializer", options.nextNode(node.initializer), node.initializer));
}

function cloneBindingElement(node, options) {
    return options.factory.createBindingElement(options.hook("dotDotDotToken", options.nextNode(node.dotDotDotToken), node.dotDotDotToken), options.hook("propertyName", options.nextNode(node.propertyName), node.propertyName), options.hook("name", options.nextNode(node.name), node.name), options.hook("initializer", options.nextNode(node.initializer), node.initializer));
}

function clonePropertySignature(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1q(node, options);
    }
    return v3Strategy$1p(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1p(node, options) {
    const typescript = options.typescript;
    return typescript.createPropertySignature(options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("name", options.nextNode(node.name), node.name), options.hook("questionToken", options.nextNode(node.questionToken), node.questionToken), options.hook("type", options.nextNode(node.type), node.type), options.hook("initializer", options.nextNode(node.initializer), node.initializer));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1q(node, options) {
    return options.factory.createPropertySignature(options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("name", options.nextNode(node.name), node.name), options.hook("questionToken", options.nextNode(node.questionToken), node.questionToken), options.hook("type", options.nextNode(node.type), node.type));
}

function clonePropertyDeclaration(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1p(node, options);
    }
    return v3Strategy$1o(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1o(node, options) {
    const typescript = options.typescript;
    return typescript.createProperty(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("name", options.nextNode(node.name), node.name), node.questionToken != null
        ? options.hook("questionToken", options.nextNode(node.questionToken), node.questionToken)
        : options.hook("exclamationToken", options.nextNode(node.exclamationToken), node.exclamationToken), options.hook("type", options.nextNode(node.type), node.type), options.hook("initializer", options.nextNode(node.initializer), node.initializer));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1p(node, options) {
    return options.factory.createPropertyDeclaration(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("name", options.nextNode(node.name), node.name), node.questionToken != null
        ? options.hook("questionToken", options.nextNode(node.questionToken), node.questionToken)
        : options.hook("exclamationToken", options.nextNode(node.exclamationToken), node.exclamationToken), options.hook("type", options.nextNode(node.type), node.type), options.hook("initializer", options.nextNode(node.initializer), node.initializer));
}

function clonePropertyAssignment(node, options) {
    const clonedPropertyAssignment = options.factory.createPropertyAssignment(options.hook("name", options.nextNode(node.name), node.name), options.hook("initializer", options.nextNode(node.initializer), node.initializer));
    // createPropertyAssignment may wrap the initializer expression in parentheses. We want to make sure that we're producing identical clones here,
    // so if the new PropertyAssignment has a ParenthesizedExpression that weren't there before, remove it.
    if (!options.typescript.isParenthesizedExpression(node.initializer) && options.typescript.isParenthesizedExpression(clonedPropertyAssignment.initializer)) {
        clonedPropertyAssignment.initializer = clonedPropertyAssignment.initializer.expression;
    }
    return clonedPropertyAssignment;
}

function cloneShorthandPropertyAssignment(node, options) {
    return options.factory.createShorthandPropertyAssignment(options.hook("name", options.nextNode(node.name), node.name), options.hook("objectAssignmentInitializer", options.nextNode(node.objectAssignmentInitializer), node.objectAssignmentInitializer));
}

function cloneSpreadAssignment(node, options) {
    return options.factory.createSpreadAssignment(options.hook("expression", options.nextNode(node.expression), node.expression));
}

function cloneObjectBindingPattern(node, options) {
    return options.factory.createObjectBindingPattern(options.hook("elements", options.nextNodes(node.elements), node.elements));
}

function cloneArrayBindingPattern(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1o(node, options);
    }
    return v3Strategy$1n(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1n(node, options) {
    const typescript = options.typescript;
    return typescript.createArrayBindingPattern(options.hook("elements", options.nextNodes(node.elements), node.elements));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1o(node, options) {
    return options.factory.createArrayBindingPattern(options.hook("elements", options.nextNodes(node.elements), node.elements));
}

function cloneFunctionDeclaration(node, options) {
    return options.factory.createFunctionDeclaration(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("asteriskToken", options.nextNode(node.asteriskToken), node.asteriskToken), options.hook("name", options.nextNode(node.name), node.name), options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", options.nextNode(node.type), node.type), options.hook("body", options.nextNode(node.body), node.body));
}

function isNodeArray(item) {
    // tslint:disable-next-line
    return item != null && Array.isArray(item) && "pos" in item;
}

function ensureNodeArray(item, factory) {
    if (item == null || isNodeArray(item))
        return item;
    return factory.createNodeArray(item);
}

function cloneMethodSignature(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1n(node, options);
    }
    return v3Strategy$1m(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1m(node, options) {
    const typescript = options.typescript;
    const updatedMethodSignature = typescript.createMethodSignature(options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", options.nextNode(node.type), node.type), options.hook("name", options.nextNode(node.name), node.name), options.hook("questionToken", options.nextNode(node.questionToken), node.questionToken));
    // Make sure to also update the modifiers
    // Workaround for: https://github.com/microsoft/TypeScript/issues/35959
    updatedMethodSignature.modifiers = ensureNodeArray(options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.factory);
    return updatedMethodSignature;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1n(node, options) {
    return options.factory.createMethodSignature(options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("name", options.nextNode(node.name), node.name), options.hook("questionToken", options.nextNode(node.questionToken), node.questionToken), options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", options.nextNode(node.type), node.type));
}

function cloneMethodDeclaration(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1m(node, options);
    }
    return v3Strategy$1l(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1l(node, options) {
    const typescript = options.typescript;
    return typescript.createMethod(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("asteriskToken", options.nextNode(node.asteriskToken), node.asteriskToken), options.hook("name", options.nextNode(node.name), node.name), options.hook("questionToken", options.nextNode(node.questionToken), node.questionToken), options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", options.nextNode(node.type), node.type), options.hook("body", options.nextNode(node.body), node.body));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1m(node, options) {
    return options.factory.createMethodDeclaration(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("asteriskToken", options.nextNode(node.asteriskToken), node.asteriskToken), options.hook("name", options.nextNode(node.name), node.name), options.hook("questionToken", options.nextNode(node.questionToken), node.questionToken), options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", options.nextNode(node.type), node.type), options.hook("body", options.nextNode(node.body), node.body));
}

function cloneConstructorDeclaration(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1l(node, options);
    }
    return v3Strategy$1k(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1k(node, options) {
    const typescript = options.typescript;
    return typescript.createConstructor(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("body", options.nextNode(node.body), node.body));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1l(node, options) {
    return options.factory.createConstructorDeclaration(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("body", options.nextNode(node.body), node.body));
}

function cloneSemicolonClassElement(_node, options) {
    return options.factory.createSemicolonClassElement();
}

function cloneGetAccessorDeclaration(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1k(node, options);
    }
    return v3Strategy$1j(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1j(node, options) {
    const typescript = options.typescript;
    return typescript.createGetAccessor(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("name", options.nextNode(node.name), node.name), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", options.nextNode(node.type), node.type), options.hook("body", options.nextNode(node.body), node.body));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1k(node, options) {
    return options.factory.createGetAccessorDeclaration(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("name", options.nextNode(node.name), node.name), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", options.nextNode(node.type), node.type), options.hook("body", options.nextNode(node.body), node.body));
}

function cloneSetAccessorDeclaration(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1j(node, options);
    }
    return v3Strategy$1i(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1i(node, options) {
    const typescript = options.typescript;
    return typescript.createSetAccessor(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("name", options.nextNode(node.name), node.name), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("body", options.nextNode(node.body), node.body));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1j(node, options) {
    return options.factory.createSetAccessorDeclaration(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("name", options.nextNode(node.name), node.name), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("body", options.nextNode(node.body), node.body));
}

function cloneIndexSignatureDeclaration(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1i(node, options);
    }
    return v3Strategy$1h(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1h(node, options) {
    const typescript = options.typescript;
    return typescript.createIndexSignature(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", options.nextNode(node.type), node.type));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1i(node, options) {
    return options.factory.createIndexSignature(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", options.nextNode(node.type), node.type));
}

/**
 * Returns true if the given Node is a KeywordTypeNode
 */
function isKeywordTypeNode(node, typescript) {
    switch (node.kind) {
        case typescript.SyntaxKind.AnyKeyword:
        case typescript.SyntaxKind.UnknownKeyword:
        case typescript.SyntaxKind.BigIntKeyword:
        case typescript.SyntaxKind.ObjectKeyword:
        case typescript.SyntaxKind.BooleanKeyword:
        case typescript.SyntaxKind.StringKeyword:
        case typescript.SyntaxKind.SymbolKeyword:
        case typescript.SyntaxKind.VoidKeyword:
        case typescript.SyntaxKind.UndefinedKeyword:
        case typescript.SyntaxKind.NullKeyword:
        case typescript.SyntaxKind.NeverKeyword:
            return true;
    }
    return false;
}

function cloneKeywordTypeNode(node, options) {
    return options.factory.createKeywordTypeNode(options.hook("kind", node.kind, node.kind));
}

function cloneImportTypeNode(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1h(node, options);
    }
    return v3Strategy$1g(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1g(node, options) {
    const typescript = options.typescript;
    return typescript.createImportTypeNode(options.hook("argument", options.nextNode(node.argument), node.argument), options.hook("qualifier", options.nextNode(node.qualifier), node.qualifier), options.hook("typeArguments", options.nextNodes(node.typeArguments), node.typeArguments), options.hook("isTypeOf", node.isTypeOf, node.isTypeOf));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1h(node, options) {
    return options.factory.createImportTypeNode(options.hook("argument", options.nextNode(node.argument), node.argument), options.hook("qualifier", options.nextNode(node.qualifier), node.qualifier), options.hook("typeArguments", options.nextNodes(node.typeArguments), node.typeArguments), options.hook("isTypeOf", node.isTypeOf, node.isTypeOf));
}

function cloneThisTypeNode(_node, options) {
    return options.factory.createThisTypeNode();
}

function cloneFunctionTypeNode(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1g(node, options);
    }
    return v3Strategy$1f(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1f(node, options) {
    const typescript = options.typescript;
    return typescript.createFunctionTypeNode(options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", options.nextNode(node.type), node.type));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1g(node, options) {
    return options.factory.createFunctionTypeNode(options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", options.nextNode(node.type), node.type));
}

function cloneConstructorTypeNode(node, options) {
    const updatedNode = options.factory.createConstructorTypeNode(options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", options.nextNode(node.type), node.type));
    // Make sure to also update the modifiers. The constructor function doesn't support this.
    updatedNode.modifiers = ensureNodeArray(options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.factory);
    return updatedNode;
}

function cloneTypeReferenceNode(node, options) {
    return options.factory.createTypeReferenceNode(options.hook("typeName", options.nextNode(node.typeName), node.typeName), options.hook("typeArguments", options.nextNodes(node.typeArguments), node.typeArguments));
}

function cloneTypePredicateNode(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1f(node, options);
    }
    return v3Strategy$1e(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1e(node, options) {
    const typescript = options.typescript;
    return typescript.createTypePredicateNode(options.hook("parameterName", options.nextNode(node.parameterName), node.parameterName), options.hook("type", options.nextNode(node.type), node.type));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1f(node, options) {
    return options.factory.createTypePredicateNode(options.hook("assertsModifier", options.nextNode(node.assertsModifier), node.assertsModifier), options.hook("parameterName", options.nextNode(node.parameterName), node.parameterName), options.hook("type", options.nextNode(node.type), node.type));
}

function cloneSourceFile(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1e(node, options);
    }
    return v3Strategy$1d(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1d(node, options) {
    const typescript = options.typescript;
    const updatedSourceFile = typescript.updateSourceFileNode(node, options.hook("statements", options.nextNodes(node.statements), node.statements), node.isDeclarationFile, node.referencedFiles, node.typeReferenceDirectives, node.hasNoDefaultLib, node.libReferenceDirectives);
    updatedSourceFile.pos = -1;
    updatedSourceFile.end = -1;
    return updatedSourceFile;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1e(node, options) {
    // Support TypeScript 3.x which uses updateSourceFileNode, whereas TypeScript 4.x uses updateSourceFile
    const updatedSourceFile = options.factory.updateSourceFile(node, options.hook("statements", options.nextNodes(node.statements), node.statements), node.isDeclarationFile, node.referencedFiles, node.typeReferenceDirectives, node.hasNoDefaultLib, node.libReferenceDirectives);
    updatedSourceFile.pos = -1;
    updatedSourceFile.end = -1;
    return updatedSourceFile;
}

function cloneTypeQueryNode(node, options) {
    return options.factory.createTypeQueryNode(options.hook("exprName", options.nextNode(node.exprName), node.exprName));
}

function cloneTypeLiteralNode(node, options) {
    return options.factory.createTypeLiteralNode(options.hook("members", options.nextNodes(node.members), node.members));
}

function cloneArrayTypeNode(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1d(node, options);
    }
    return v3Strategy$1c(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1c(node, options) {
    const typescript = options.typescript;
    return typescript.createArrayTypeNode(options.hook("elementType", node.elementType, node.elementType));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1d(node, options) {
    return options.factory.createArrayTypeNode(options.hook("elementType", node.elementType, node.elementType));
}

function cloneTupleTypeNode(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1c(node, options);
    }
    return v3Strategy$1b(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1b(node, options) {
    const typescript = options.typescript;
    return typescript.createTupleTypeNode(options.hook("elementTypes", options.nextNodes(node.elementTypes), node.elementTypes));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1c(node, options) {
    return options.factory.createTupleTypeNode(options.hook("elements", options.nextNodes(node.elements), node.elements));
}

function cloneOptionalTypeNode(node, options) {
    return options.factory.createOptionalTypeNode(options.hook("type", options.nextNode(node.type), node.type));
}

/**
 * Returns true if the given Node is an OptionalTypeNode
 */
function isOptionalTypeNode(node, typescript) {
    // TypeScript 4.x
    if (("isOptionalTypeNode" in typescript)) {
        return typescript.isOptionalTypeNode(node);
    }
    return node.kind === typescript.SyntaxKind.OptionalType;
}

function cloneRestTypeNode(node, options) {
    return options.factory.createRestTypeNode(options.hook("type", options.nextNode(node.type), node.type));
}

/**
 * Returns true if the given Node is a RestTypeNode
 */
function isRestTypeNode(node, typescript) {
    // TypeScript 4.x
    if (("isRestTypeNode" in typescript)) {
        return typescript.isRestTypeNode(node);
    }
    return node.kind === typescript.SyntaxKind.RestType;
}

function cloneUnionTypeNode(node, options) {
    return options.factory.createUnionTypeNode(options.hook("types", options.nextNodes(node.types), node.types));
}

function cloneIntersectionTypeNode(node, options) {
    return options.factory.createIntersectionTypeNode(options.hook("types", options.nextNodes(node.types), node.types));
}

function cloneLiteralTypeNode(node, options) {
    return options.factory.createLiteralTypeNode(options.hook("literal", options.nextNode(node.literal), node.literal));
}

function cloneStringLiteral(node, options) {
    return options.factory.createStringLiteral(options.hook("text", node.text, node.text));
}

/**
 * Returns true if the given Node is either the boolean Literal 'true' or 'false'
 */
function isBooleanLiteral(node, typescript) {
    switch (node.kind) {
        case typescript.SyntaxKind.TrueKeyword:
        case typescript.SyntaxKind.FalseKeyword:
            return true;
        default:
            return false;
    }
}

function cloneBooleanLiteral(node, options) {
    if (node.kind === options.typescript.SyntaxKind.TrueKeyword) {
        return options.factory.createTrue();
    }
    return options.factory.createFalse();
}

function clonePrefixUnaryExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1b(node, options);
    }
    return v3Strategy$1a(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1a(node, options) {
    const typescript = options.typescript;
    return typescript.createPrefix(options.hook("operator", node.operator, node.operator), options.hook("operand", options.nextNode(node.operand), node.operand));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1b(node, options) {
    return options.factory.createPrefixUnaryExpression(options.hook("operator", node.operator, node.operator), options.hook("operand", options.nextNode(node.operand), node.operand));
}

function cloneRegularExpressionLiteral(node, options) {
    return options.factory.createRegularExpressionLiteral(options.hook("text", node.text, node.text));
}

function cloneNoSubstitutionTemplateLiteral(node, options) {
    return options.factory.createNoSubstitutionTemplateLiteral(options.hook("text", node.text, node.text), options.hook("rawText", node.rawText, node.text));
}

function cloneNumericLiteral(node, options) {
    return options.factory.createNumericLiteral(options.hook("text", node.text, node.text));
}

function cloneBigIntLiteral(node, options) {
    return options.factory.createBigIntLiteral(options.hook("text", node.text, node.text));
}

function cloneConditionalTypeNode(node, options) {
    return options.factory.createConditionalTypeNode(options.hook("checkType", options.nextNode(node.checkType), node.checkType), options.hook("extendsType", options.nextNode(node.extendsType), node.extendsType), options.hook("trueType", options.nextNode(node.trueType), node.trueType), options.hook("falseType", options.nextNode(node.falseType), node.falseType));
}

function cloneInferTypeNode(node, options) {
    return options.factory.createInferTypeNode(options.hook("typeParameter", options.nextNode(node.typeParameter), node.typeParameter));
}

function cloneBlock(node, options) {
    return options.factory.createBlock(options.hook("statements", options.nextNodes(node.statements), node.statements));
}

function cloneThrowStatement(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1a(node, options);
    }
    return v3Strategy$19(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$19(node, options) {
    const typescript = options.typescript;
    return typescript.createThrow(options.hook("expression", options.nextNode(node.expression), node.expression));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1a(node, options) {
    return options.factory.createThrowStatement(options.hook("expression", options.nextNode(node.expression), node.expression));
}

function cloneNewExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$19(node, options);
    }
    return v3Strategy$18(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$18(node, options) {
    const typescript = options.typescript;
    return typescript.createNew(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("typeArguments", options.nextNodes(node.typeArguments), node.typeArguments), options.hook("arguments", options.nextNodes(node.arguments), node.arguments));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$19(node, options) {
    return options.factory.createNewExpression(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("typeArguments", options.nextNodes(node.typeArguments), node.typeArguments), options.hook("arguments", options.nextNodes(node.arguments), node.arguments));
}

function cloneCallExpression(node, options) {
    let clonedCallExpression;
    if ("factory" in options.typescript) {
        clonedCallExpression = v4Strategy$18(node, options);
    }
    else {
        clonedCallExpression = v3Strategy$17(node, options);
    }
    // createCallExpression may wrap the arguments in parentheses. We want to make sure that we're producing identical clones here,
    // so if the arguments of the new CallExpression has a ParenthesizedExpression that weren't there before, remove it.
    for (let i = 0; i < clonedCallExpression.arguments.length; i++) {
        const argument = clonedCallExpression.arguments[i];
        if (!options.typescript.isParenthesizedExpression(node.arguments[i]) && options.typescript.isParenthesizedExpression(argument)) {
            clonedCallExpression.arguments[i] = argument.expression;
        }
    }
    return clonedCallExpression;
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$17(node, options) {
    const typescript = options.typescript;
    return typescript.createCall(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("typeArguments", options.nextNodes(node.typeArguments), node.typeArguments), options.hook("arguments", options.nextNodes(node.arguments), node.arguments));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$18(node, options) {
    return options.factory.createCallExpression(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("typeArguments", options.nextNodes(node.typeArguments), node.typeArguments), options.hook("arguments", options.nextNodes(node.arguments), node.arguments));
}

function cloneExpressionStatement(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$17(node, options);
    }
    return v3Strategy$16(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$16(node, options) {
    const typescript = options.typescript;
    return typescript.createExpressionStatement(options.hook("expression", options.nextNode(node.expression), node.expression));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$17(node, options) {
    return options.factory.createExpressionStatement(options.hook("expression", options.nextNode(node.expression), node.expression));
}

function cloneExpressionWithTypeArguments(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$16(node, options);
    }
    return v3Strategy$15(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$15(node, options) {
    const typescript = options.typescript;
    return typescript.createExpressionWithTypeArguments(options.hook("typeArguments", options.nextNodes(node.typeArguments), node.typeArguments), options.hook("expression", options.nextNode(node.expression), node.expression));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$16(node, options) {
    return options.factory.createExpressionWithTypeArguments(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("typeArguments", options.nextNodes(node.typeArguments), node.typeArguments));
}

function clonePropertyAccessExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$15(node, options);
    }
    return v3Strategy$14(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$14(node, options) {
    const typescript = options.typescript;
    return typescript.createPropertyAccess(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("name", options.nextNode(node.name), node.name));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$15(node, options) {
    return options.factory.createPropertyAccessExpression(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("name", options.nextNode(node.name), node.name));
}

function cloneElementAccessExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$14(node, options);
    }
    return v3Strategy$13(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$13(node, options) {
    const typescript = options.typescript;
    return typescript.createElementAccess(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("argumentExpression", options.nextNode(node.argumentExpression), node.argumentExpression));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$14(node, options) {
    return options.factory.createElementAccessExpression(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("argumentExpression", options.nextNode(node.argumentExpression), node.argumentExpression));
}

function cloneArrayLiteralExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$13(node, options);
    }
    return v3Strategy$12(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$12(node, options) {
    const typescript = options.typescript;
    return typescript.createArrayLiteral(options.hook("elements", options.nextNodes(node.elements), node.elements));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$13(node, options) {
    return options.factory.createArrayLiteralExpression(options.hook("elements", options.nextNodes(node.elements), node.elements));
}

function cloneObjectLiteralExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$12(node, options);
    }
    return v3Strategy$11(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$11(node, options) {
    const typescript = options.typescript;
    return typescript.createObjectLiteral(options.hook("properties", options.nextNodes(node.properties), node.properties));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$12(node, options) {
    return options.factory.createObjectLiteralExpression(options.hook("properties", options.nextNodes(node.properties), node.properties));
}

function cloneTemplateExpression(node, options) {
    return options.factory.createTemplateExpression(options.hook("head", options.nextNode(node.head), node.head), options.hook("templateSpans", options.nextNodes(node.templateSpans), node.templateSpans));
}

function cloneTemplateSpan(node, options) {
    return options.factory.createTemplateSpan(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("literal", options.nextNode(node.literal), node.literal));
}

function cloneTemplateHead(node, options) {
    return options.factory.createTemplateHead(options.hook("text", node.text, node.text), options.hook("rawText", node.rawText, node.rawText));
}

function cloneTemplateMiddle(node, options) {
    return options.factory.createTemplateMiddle(options.hook("text", node.text, node.text), options.hook("rawText", node.rawText, node.rawText));
}

function cloneTemplateTail(node, options) {
    return options.factory.createTemplateTail(options.hook("text", node.text, node.text), options.hook("rawText", node.rawText, node.rawText));
}

function cloneConditionalExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$11(node, options);
    }
    return v3Strategy$10(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$10(node, options) {
    const typescript = options.typescript;
    return typescript.createConditional(options.hook("condition", options.nextNode(node.condition), node.condition), options.hook("questionToken", options.nextNode(node.questionToken), node.questionToken), options.hook("whenTrue", options.nextNode(node.whenTrue), node.whenTrue), options.hook("colonToken", options.nextNode(node.colonToken), node.colonToken), options.hook("whenFalse", options.nextNode(node.whenFalse), node.whenFalse));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$11(node, options) {
    return options.factory.createConditionalExpression(options.hook("condition", options.nextNode(node.condition), node.condition), options.hook("questionToken", options.nextNode(node.questionToken), node.questionToken), options.hook("whenTrue", options.nextNode(node.whenTrue), node.whenTrue), options.hook("colonToken", options.nextNode(node.colonToken), node.colonToken), options.hook("whenFalse", options.nextNode(node.whenFalse), node.whenFalse));
}

function cloneBinaryExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$10(node, options);
    }
    return v3Strategy$$(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$$(node, options) {
    const typescript = options.typescript;
    return typescript.createBinary(options.hook("left", options.nextNode(node.left), node.left), options.hook("operatorToken", options.nextNode(node.operatorToken), node.operatorToken), options.hook("right", options.nextNode(node.right), node.right));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$10(node, options) {
    return options.factory.createBinaryExpression(options.hook("left", options.nextNode(node.left), node.left), options.hook("operatorToken", options.nextNode(node.operatorToken), node.operatorToken), options.hook("right", options.nextNode(node.right), node.right));
}

function cloneParenthesizedExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$$(node, options);
    }
    return v3Strategy$_(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$_(node, options) {
    const typescript = options.typescript;
    return typescript.createParen(options.hook("expression", options.nextNode(node.expression), node.expression));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$$(node, options) {
    return options.factory.createParenthesizedExpression(options.hook("expression", options.nextNode(node.expression), node.expression));
}

function cloneParenthesizedTypeNode(node, options) {
    return options.factory.createParenthesizedType(options.hook("type", options.nextNode(node.type), node.type));
}

function cloneArrowFunction(node, options) {
    return options.factory.createArrowFunction(options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", options.nextNode(node.type), node.type), options.hook("equalsGreaterThanToken", options.nextNode(node.equalsGreaterThanToken), node.equalsGreaterThanToken), options.hook("body", options.nextNode(node.body), node.body));
}

function cloneClassDeclaration(node, options) {
    return options.factory.createClassDeclaration(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("name", options.nextNode(node.name), node.name), options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("heritageClauses", options.nextNodes(node.heritageClauses), node.heritageClauses), options.hook("members", options.nextNodes(node.members), node.members));
}

function cloneClassExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$_(node, options);
    }
    return v3Strategy$Z(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$Z(node, options) {
    const typescript = options.typescript;
    return typescript.createClassExpression(options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("name", options.nextNode(node.name), node.name), options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("heritageClauses", options.nextNodes(node.heritageClauses), node.heritageClauses), options.hook("members", options.nextNodes(node.members), node.members));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$_(node, options) {
    return options.factory.createClassExpression(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("name", options.nextNode(node.name), node.name), options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("heritageClauses", options.nextNodes(node.heritageClauses), node.heritageClauses), options.hook("members", options.nextNodes(node.members), node.members));
}

function cloneEnumDeclaration(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$Z(node, options);
    }
    return v3Strategy$Y(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$Y(node, options) {
    const typescript = options.typescript;
    return typescript.createEnumDeclaration(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("name", options.nextNode(node.name), node.name), options.hook("members", options.nextNodes(node.members), node.members));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$Z(node, options) {
    return options.factory.createEnumDeclaration(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("name", options.nextNode(node.name), node.name), options.hook("members", options.nextNodes(node.members), node.members));
}

function cloneInterfaceDeclaration(node, options) {
    return options.factory.createInterfaceDeclaration(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("name", options.nextNode(node.name), node.name), options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("heritageClauses", options.nextNodes(node.heritageClauses), node.heritageClauses), options.hook("members", options.nextNodes(node.members), node.members));
}

function cloneEnumMember(node, options) {
    return options.factory.createEnumMember(options.hook("name", options.nextNode(node.name), node.name), options.hook("initializer", options.nextNode(node.initializer), node.initializer));
}

function cloneHeritageClause(node, options) {
    return options.factory.createHeritageClause(options.hook("token", node.token, node.token), options.hook("types", options.nextNodes(node.types), node.types));
}

function cloneEmptyStatement(_node, options) {
    return options.factory.createEmptyStatement();
}

function cloneTypeOperatorNode(node, options) {
    return options.factory.createTypeOperatorNode(options.hook("operator", node.operator, node.operator), options.hook("type", options.nextNode(node.type), node.type));
}

function cloneIndexedAccessTypeNode(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$Y(node, options);
    }
    return v3Strategy$X(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$X(node, options) {
    const typescript = options.typescript;
    return typescript.createIndexedAccessTypeNode(options.hook("objectType", options.nextNode(node.objectType), node.objectType), options.hook("indexType", options.nextNode(node.indexType), node.indexType));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$Y(node, options) {
    return options.factory.createIndexedAccessTypeNode(options.hook("objectType", options.nextNode(node.objectType), node.objectType), options.hook("indexType", options.nextNode(node.indexType), node.indexType));
}

function cloneMappedTypeNode(node, options) {
    // If `createMappedTypeNode` takes four arguments, this is TypeScript before v4.1
    if (options.factory.createMappedTypeNode.length === 4) {
        const legacyFactory = options.factory;
        return legacyFactory.createMappedTypeNode(options.hook("readonlyToken", options.nextNode(node.readonlyToken), node.readonlyToken), options.hook("typeParameter", options.nextNode(node.typeParameter), node.typeParameter), options.hook("questionToken", options.nextNode(node.questionToken), node.questionToken), options.hook("type", options.nextNode(node.type), node.type));
    }
    // Otherwise, this is TypeScript 4.1 or newer
    else {
        return options.factory.createMappedTypeNode(options.hook("readonlyToken", options.nextNode(node.readonlyToken), node.readonlyToken), options.hook("typeParameter", options.nextNode(node.typeParameter), node.typeParameter), options.hook("nameType", options.nextNode(node.nameType), node.nameType), options.hook("questionToken", options.nextNode(node.questionToken), node.questionToken), options.hook("type", options.nextNode(node.type), node.type));
    }
}

function cloneOmittedExpression(_node, options) {
    return options.factory.createOmittedExpression();
}

function clonePartiallyEmittedExpression(node, options) {
    return options.factory.createPartiallyEmittedExpression(options.hook("expression", options.nextNode(node.expression), node.expression));
}

/**
 * Returns true if the given Node is a PartiallyEmittedExpression
 */
function isPartiallyEmittedExpression(node, typescript) {
    // TypeScript 4.x
    if (("isPartiallyEmittedExpression" in typescript)) {
        return typescript.isPartiallyEmittedExpression(node);
    }
    return node.kind === typescript.SyntaxKind.PartiallyEmittedExpression;
}

function clonePostfixUnaryExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$X(node, options);
    }
    return v3Strategy$W(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$W(node, options) {
    const typescript = options.typescript;
    return typescript.createPostfix(options.hook("operand", options.nextNode(node.operand), node.operand), options.hook("operator", node.operator, node.operator));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$X(node, options) {
    return options.factory.createPostfixUnaryExpression(options.hook("operand", options.nextNode(node.operand), node.operand), options.hook("operator", node.operator, node.operator));
}

/**
 * Returns true if the given Node is the literal 'null'
 */
function isNullLiteral(node, typescript) {
    return node.kind === typescript.SyntaxKind.NullKeyword;
}

function cloneNullLiteral(_node, options) {
    return options.factory.createNull();
}

/**
 * Returns true if the given Node is a ThisExpression
 */
function isThisExpression(node, typescript) {
    return node.kind === typescript.SyntaxKind.ThisKeyword;
}

function cloneThisExpression(_node, options) {
    return options.factory.createThis();
}

function cloneReturnStatement(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$W(node, options);
    }
    return v3Strategy$V(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$V(node, options) {
    const typescript = options.typescript;
    return typescript.createReturn(options.hook("expression", options.nextNode(node.expression), node.expression));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$W(node, options) {
    return options.factory.createReturnStatement(options.hook("expression", options.nextNode(node.expression), node.expression));
}

function isSuperExpression(node, typescript) {
    return node.kind === typescript.SyntaxKind.SuperKeyword;
}

function cloneSuperExpression(_node, options) {
    return options.factory.createSuper();
}

function cloneDeleteExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$V(node, options);
    }
    return v3Strategy$U(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$U(node, options) {
    const typescript = options.typescript;
    return typescript.createDelete(options.hook("expression", options.nextNode(node.expression), node.expression));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$V(node, options) {
    return options.factory.createDeleteExpression(options.hook("expression", options.nextNode(node.expression), node.expression));
}

function cloneAsExpression(node, options) {
    return options.factory.createAsExpression(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("type", options.nextNode(node.type), node.type));
}

function cloneTypeAssertion(node, options) {
    return options.factory.createTypeAssertion(options.hook("type", options.nextNode(node.type), node.type), options.hook("expression", options.nextNode(node.expression), node.expression));
}

function cloneAwaitExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$U(node, options);
    }
    return v3Strategy$T(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$T(node, options) {
    const typescript = options.typescript;
    return typescript.createAwait(options.hook("expression", options.nextNode(node.expression), node.expression));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$U(node, options) {
    return options.factory.createAwaitExpression(options.hook("expression", options.nextNode(node.expression), node.expression));
}

function cloneYieldExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$T(node, options);
    }
    return v3Strategy$S(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$S(node, options) {
    const typescript = options.typescript;
    return typescript.createYield(options.hook("asteriskToken", options.nextNode(node.asteriskToken), node.asteriskToken), options.hook("expression", options.nextNode(node.expression), node.expression));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$T(node, options) {
    return options.factory.createYieldExpression(options.hook("asteriskToken", options.nextNode(node.asteriskToken), node.asteriskToken), options.hook("expression", options.nextNode(node.expression), node.expression));
}

function cloneForOfStatement(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$S(node, options);
    }
    return v3Strategy$R(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$R(node, options) {
    const typescript = options.typescript;
    return typescript.createForOf(options.hook("awaitModifier", options.nextNode(node.awaitModifier), node.awaitModifier), options.hook("initializer", options.nextNode(node.initializer), node.initializer), options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("statement", options.nextNode(node.statement), node.statement));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$S(node, options) {
    return options.factory.createForOfStatement(options.hook("awaitModifier", options.nextNode(node.awaitModifier), node.awaitModifier), options.hook("initializer", options.nextNode(node.initializer), node.initializer), options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("statement", options.nextNode(node.statement), node.statement));
}

function cloneForInStatement(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$R(node, options);
    }
    return v3Strategy$Q(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$Q(node, options) {
    const typescript = options.typescript;
    return typescript.createForIn(options.hook("initializer", options.nextNode(node.initializer), node.initializer), options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("statement", options.nextNode(node.statement), node.statement));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$R(node, options) {
    return options.factory.createForInStatement(options.hook("initializer", options.nextNode(node.initializer), node.initializer), options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("statement", options.nextNode(node.statement), node.statement));
}

function cloneForStatement(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$Q(node, options);
    }
    return v3Strategy$P(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$P(node, options) {
    const typescript = options.typescript;
    return typescript.createFor(options.hook("initializer", options.nextNode(node.initializer), node.initializer), options.hook("condition", options.nextNode(node.condition), node.condition), options.hook("incrementor", options.nextNode(node.incrementor), node.incrementor), options.hook("statement", options.nextNode(node.statement), node.statement));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$Q(node, options) {
    return options.factory.createForStatement(options.hook("initializer", options.nextNode(node.initializer), node.initializer), options.hook("condition", options.nextNode(node.condition), node.condition), options.hook("incrementor", options.nextNode(node.incrementor), node.incrementor), options.hook("statement", options.nextNode(node.statement), node.statement));
}

function cloneWhileStatement(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$P(node, options);
    }
    return v3Strategy$O(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$O(node, options) {
    const typescript = options.typescript;
    return typescript.createWhile(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("statement", options.nextNode(node.statement), node.statement));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$P(node, options) {
    return options.factory.createWhileStatement(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("statement", options.nextNode(node.statement), node.statement));
}

function cloneLabeledStatement(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$O(node, options);
    }
    return v3Strategy$N(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$N(node, options) {
    const typescript = options.typescript;
    return typescript.createLabel(options.hook("label", options.nextNode(node.label), node.label), options.hook("statement", options.nextNode(node.statement), node.statement));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$O(node, options) {
    return options.factory.createLabeledStatement(options.hook("label", options.nextNode(node.label), node.label), options.hook("statement", options.nextNode(node.statement), node.statement));
}

function cloneBreakStatement(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$N(node, options);
    }
    return v3Strategy$M(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$M(node, options) {
    const typescript = options.typescript;
    return typescript.createBreak(options.hook("label", options.nextNode(node.label), node.label));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$N(node, options) {
    return options.factory.createBreakStatement(options.hook("label", options.nextNode(node.label), node.label));
}

function cloneContinueStatement(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$M(node, options);
    }
    return v3Strategy$L(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$L(node, options) {
    const typescript = options.typescript;
    return typescript.createContinue(options.hook("label", options.nextNode(node.label), node.label));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$M(node, options) {
    return options.factory.createContinueStatement(options.hook("label", options.nextNode(node.label), node.label));
}

function cloneIfStatement(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$L(node, options);
    }
    return v3Strategy$K(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$K(node, options) {
    const typescript = options.typescript;
    return typescript.createIf(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("thenStatement", options.nextNode(node.thenStatement), node.thenStatement), options.hook("elseStatement", options.nextNode(node.elseStatement), node.elseStatement));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$L(node, options) {
    return options.factory.createIfStatement(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("thenStatement", options.nextNode(node.thenStatement), node.thenStatement), options.hook("elseStatement", options.nextNode(node.elseStatement), node.elseStatement));
}

function cloneDoStatement(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$K(node, options);
    }
    return v3Strategy$J(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$J(node, options) {
    const typescript = options.typescript;
    return typescript.createDo(options.hook("statement", options.nextNode(node.statement), node.statement), options.hook("expression", options.nextNode(node.expression), node.expression));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$K(node, options) {
    return options.factory.createDoStatement(options.hook("statement", options.nextNode(node.statement), node.statement), options.hook("expression", options.nextNode(node.expression), node.expression));
}

function cloneNonNullExpression(node, options) {
    return options.factory.createNonNullExpression(options.hook("expression", options.nextNode(node.expression), node.expression));
}

function cloneTypeOfExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$J(node, options);
    }
    return v3Strategy$I(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$I(node, options) {
    const typescript = options.typescript;
    return typescript.createTypeOf(options.hook("expression", options.nextNode(node.expression), node.expression));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$J(node, options) {
    return options.factory.createTypeOfExpression(options.hook("expression", options.nextNode(node.expression), node.expression));
}

function cloneVoidExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$I(node, options);
    }
    return v3Strategy$H(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$H(node, options) {
    const typescript = options.typescript;
    return typescript.createVoid(options.hook("expression", options.nextNode(node.expression), node.expression));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$I(node, options) {
    return options.factory.createVoidExpression(options.hook("expression", options.nextNode(node.expression), node.expression));
}

function cloneFunctionExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$H(node, options);
    }
    return v3Strategy$G(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$G(node, options) {
    const typescript = options.typescript;
    return typescript.createFunctionExpression(options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("asteriskToken", options.nextNode(node.asteriskToken), node.asteriskToken), options.hook("name", options.nextNode(node.name), node.name), options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", options.nextNode(node.type), node.type), options.hook("body", options.nextNode(node.body), node.body));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$H(node, options) {
    return options.factory.createFunctionExpression(options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("asteriskToken", options.nextNode(node.asteriskToken), node.asteriskToken), options.hook("name", options.nextNode(node.name), node.name), options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", options.nextNode(node.type), node.type), options.hook("body", options.nextNode(node.body), node.body));
}

function cloneSpreadElement(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$G(node, options);
    }
    return v3Strategy$F(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$F(node, options) {
    const typescript = options.typescript;
    return typescript.createSpread(options.hook("expression", options.nextNode(node.expression), node.expression));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$G(node, options) {
    return options.factory.createSpreadElement(options.hook("expression", options.nextNode(node.expression), node.expression));
}

function cloneTaggedTemplateExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$F(node, options);
    }
    return v3Strategy$E(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$E(node, options) {
    const typescript = options.typescript;
    return typescript.createTaggedTemplate(options.hook("tag", options.nextNode(node.tag), node.tag), options.hook("typeArguments", options.nextNodes(node.typeArguments), node.typeArguments), options.hook("template", options.nextNode(node.template), node.template));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$F(node, options) {
    return options.factory.createTaggedTemplateExpression(options.hook("tag", options.nextNode(node.tag), node.tag), options.hook("typeArguments", options.nextNodes(node.typeArguments), node.typeArguments), options.hook("template", options.nextNode(node.template), node.template));
}

function cloneMetaProperty(node, options) {
    return options.factory.createMetaProperty(options.hook("keywordToken", node.keywordToken, node.keywordToken), options.hook("name", options.nextNode(node.name), node.name));
}

function cloneJsxElement(node, options) {
    return options.factory.createJsxElement(options.hook("openingElement", options.nextNode(node.openingElement), node.openingElement), options.hook("children", options.nextNodes(node.children), node.children), options.hook("closingElement", options.nextNode(node.closingElement), node.closingElement));
}

function cloneJsxAttributes(node, options) {
    return options.factory.createJsxAttributes(options.hook("properties", options.nextNodes(node.properties), node.properties));
}

function cloneJsxOpeningElement(node, options) {
    return options.factory.createJsxOpeningElement(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("typeArguments", options.nextNodes(node.typeArguments), node.typeArguments), options.hook("attributes", options.nextNode(node.attributes), node.attributes));
}

function cloneJsxSelfClosingElement(node, options) {
    return options.factory.createJsxSelfClosingElement(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("typeArguments", options.nextNodes(node.typeArguments), node.typeArguments), options.hook("attributes", options.nextNode(node.attributes), node.attributes));
}

function cloneJsxFragment(node, options) {
    return options.factory.createJsxFragment(options.hook("openingFragment", options.nextNode(node.openingFragment), node.openingFragment), options.hook("children", options.nextNodes(node.children), node.children), options.hook("closingFragment", options.nextNode(node.closingFragment), node.closingFragment));
}

function cloneJsxOpeningFragment(_node, options) {
    return options.factory.createJsxOpeningFragment();
}

function cloneJsxClosingFragment(_node, options) {
    return options.factory.createJsxJsxClosingFragment();
}

function cloneJsxAttribute(node, options) {
    return options.factory.createJsxAttribute(options.hook("name", options.nextNode(node.name), node.name), options.hook("initializer", options.nextNode(node.initializer), node.initializer));
}

function cloneJsxSpreadAttribute(node, options) {
    return options.factory.createJsxSpreadAttribute(options.hook("expression", options.nextNode(node.expression), node.expression));
}

function cloneJsxClosingElement(node, options) {
    return options.factory.createJsxClosingElement(options.hook("tagName", options.nextNode(node.tagName), node.tagName));
}

function cloneJsxExpression(node, options) {
    return options.factory.createJsxExpression(options.hook("dotDotDotToken", options.nextNode(node.dotDotDotToken), node.dotDotDotToken), options.hook("expression", options.nextNode(node.expression), node.expression));
}

function cloneJsxText(node, options) {
    return options.factory.createJsxText(options.hook("text", node.text, node.text), options.hook("containsOnlyTriviaWhiteSpaces", node.containsOnlyTriviaWhiteSpaces, node.containsOnlyTriviaWhiteSpaces));
}

/**
 * Returns true if the given Node is a NotEmittedStatement
 */
function isNotEmittedStatement(node, typescript) {
    // TypeScript 4.x
    if (("isNotEmittedStatement" in typescript)) {
        return typescript.isNotEmittedStatement(node);
    }
    return node.kind === typescript.SyntaxKind.NotEmittedStatement;
}

function cloneNotEmittedStatement(node, options) {
    return options.factory.createNotEmittedStatement(node);
}

/**
 * Returns true if the given Node is a CommaListExpression
 */
function isCommaListExpression(node, typescript) {
    // TypeScript 4.x
    if (("isCommaListExpression" in typescript)) {
        return typescript.isCommaListExpression(node);
    }
    return node.kind === typescript.SyntaxKind.CommaListExpression;
}

function cloneCommaListExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$E(node, options);
    }
    return v3Strategy$D(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$D(node, options) {
    const typescript = options.typescript;
    return typescript.createCommaList(options.hook("elements", options.nextNodes(node.elements), node.elements));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$E(node, options) {
    return options.factory.createCommaListExpression(options.hook("elements", options.nextNodes(node.elements), node.elements));
}

function cloneDebuggerStatement(_node, options) {
    return options.factory.createDebuggerStatement();
}

function cloneWithStatement(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$D(node, options);
    }
    return v3Strategy$C(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$C(node, options) {
    const typescript = options.typescript;
    return typescript.createWith(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("statement", options.nextNode(node.statement), node.statement));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$D(node, options) {
    return options.factory.createWithStatement(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("statement", options.nextNode(node.statement), node.statement));
}

function cloneSwitchStatement(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$C(node, options);
    }
    return v3Strategy$B(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$B(node, options) {
    const typescript = options.typescript;
    return typescript.createSwitch(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("caseBlock", options.nextNode(node.caseBlock), node.caseBlock));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$C(node, options) {
    return options.factory.createSwitchStatement(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("caseBlock", options.nextNode(node.caseBlock), node.caseBlock));
}

function cloneCaseBlock(node, options) {
    return options.factory.createCaseBlock(options.hook("clauses", options.nextNodes(node.clauses), node.clauses));
}

function cloneCaseClause(node, options) {
    return options.factory.createCaseClause(options.hook("expression", options.nextNode(node.expression), node.expression), options.hook("statements", options.nextNodes(node.statements), node.statements));
}

function cloneDefaultClause(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$B(node, options);
    }
    return v3Strategy$A(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$A(node, options) {
    const typescript = options.typescript;
    return typescript.createDefaultClause(options.hook("statements", options.nextNodes(node.statements), node.statements));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$B(node, options) {
    return options.factory.createDefaultClause(options.hook("statements", options.nextNodes(node.statements), node.statements));
}

function cloneTryStatement(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$A(node, options);
    }
    return v3Strategy$z(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$z(node, options) {
    const typescript = options.typescript;
    return typescript.createTry(options.hook("tryBlock", options.nextNode(node.tryBlock), node.tryBlock), options.hook("catchClause", options.nextNode(node.catchClause), node.catchClause), options.hook("finallyBlock", options.nextNode(node.finallyBlock), node.finallyBlock));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$A(node, options) {
    return options.factory.createTryStatement(options.hook("tryBlock", options.nextNode(node.tryBlock), node.tryBlock), options.hook("catchClause", options.nextNode(node.catchClause), node.catchClause), options.hook("finallyBlock", options.nextNode(node.finallyBlock), node.finallyBlock));
}

function cloneCatchClause(node, options) {
    return options.factory.createCatchClause(options.hook("variableDeclaration", options.nextNode(node.variableDeclaration), node.variableDeclaration), options.hook("block", options.nextNode(node.block), node.block));
}

function cloneModuleDeclaration(node, options) {
    return options.factory.createModuleDeclaration(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("name", options.nextNode(node.name), node.name), options.hook("body", options.nextNode(node.body), node.body), options.hook("flags", node.flags, node.flags));
}

function cloneModuleBlock(node, options) {
    return options.factory.createModuleBlock(options.hook("statements", options.nextNodes(node.statements), node.statements));
}

function cloneImportDeclaration(node, options) {
    return options.factory.createImportDeclaration(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("importClause", options.nextNode(node.importClause), node.importClause), options.hook("moduleSpecifier", options.nextNode(node.moduleSpecifier), node.moduleSpecifier));
}

function cloneImportEqualsDeclaration(node, options) {
    if (options.factory.createImportEqualsDeclaration.length === 4) {
        const importEqualsDeclaration = options.factory.createImportEqualsDeclaration(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("name", options.nextNode(node.name), node.name), options.hook("moduleReference", options.nextNode(node.moduleReference), node.moduleReference));
        return importEqualsDeclaration;
    }
    else {
        return options.factory.createImportEqualsDeclaration(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("isTypeOnly", node.isTypeOnly, node.isTypeOnly), options.hook("name", options.nextNode(node.name), node.name), options.hook("moduleReference", options.nextNode(node.moduleReference), node.moduleReference));
    }
}

function cloneImportClause(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$z(node, options);
    }
    return v3Strategy$y(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$y(node, options) {
    const typescript = options.typescript;
    return typescript.createImportClause(options.hook("name", options.nextNode(node.name), node.name), options.hook("namedBindings", options.nextNode(node.namedBindings), node.namedBindings), options.hook("isTypeOnly", node.isTypeOnly, node.isTypeOnly));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$z(node, options) {
    return options.factory.createImportClause(options.hook("isTypeOnly", node.isTypeOnly, node.isTypeOnly), options.hook("name", options.nextNode(node.name), node.name), options.hook("namedBindings", options.nextNode(node.namedBindings), node.namedBindings));
}

function cloneNamedImports(node, options) {
    return options.factory.createNamedImports(options.hook("elements", options.nextNodes(node.elements), node.elements));
}

function cloneNamespaceImport(node, options) {
    return options.factory.createNamespaceImport(options.hook("name", options.nextNode(node.name), node.name));
}

function cloneImportSpecifier(node, options) {
    return options.factory.createImportSpecifier(options.hook("propertyName", options.nextNode(node.propertyName), node.propertyName), options.hook("name", options.nextNode(node.name), node.name));
}

function cloneExternalModuleReference(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$y(node, options);
    }
    return v3Strategy$x(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$x(node, options) {
    const typescript = options.typescript;
    return typescript.createExternalModuleReference(options.hook("expression", options.nextNode(node.expression), node.expression));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$y(node, options) {
    return options.factory.createExternalModuleReference(options.hook("expression", options.nextNode(node.expression), node.expression));
}

function cloneNamespaceExportDeclaration(node, options) {
    return options.factory.createNamespaceExportDeclaration(options.hook("name", options.nextNode(node.name), node.name));
}

function cloneExportDeclaration(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$x(node, options);
    }
    return v3Strategy$w(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$w(node, options) {
    const typescript = options.typescript;
    return typescript.createExportDeclaration(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("exportClause", options.nextNode(node.exportClause), node.exportClause), options.hook("moduleSpecifier", options.nextNode(node.moduleSpecifier), node.moduleSpecifier), options.hook("isTypeOnly", node.isTypeOnly, node.isTypeOnly));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$x(node, options) {
    return options.factory.createExportDeclaration(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("isTypeOnly", node.isTypeOnly, node.isTypeOnly), options.hook("exportClause", options.nextNode(node.exportClause), node.exportClause), options.hook("moduleSpecifier", options.nextNode(node.moduleSpecifier), node.moduleSpecifier));
}

function cloneNamedExports(node, options) {
    return options.factory.createNamedExports(options.hook("elements", options.nextNodes(node.elements), node.elements));
}

function cloneExportSpecifier(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$w(node, options);
    }
    return v3Strategy$v(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$v(node, options) {
    const typescript = options.typescript;
    return typescript.createExportSpecifier(options.hook("propertyName", options.nextNode(node.propertyName), node.propertyName), options.hook("name", options.nextNode(node.name), node.name));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$w(node, options) {
    return options.factory.createExportSpecifier(options.hook("propertyName", options.nextNode(node.propertyName), node.propertyName), options.hook("name", options.nextNode(node.name), node.name));
}

function cloneExportAssignment(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$v(node, options);
    }
    return v3Strategy$u(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$u(node, options) {
    const typescript = options.typescript;
    return typescript.createExportAssignment(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("isExportEquals", node.isExportEquals, node.isExportEquals), options.hook("expression", options.nextNode(node.expression), node.expression));
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$v(node, options) {
    return options.factory.createExportAssignment(options.hook("decorators", options.nextNodes(node.decorators), node.decorators), options.hook("modifiers", options.nextNodes(node.modifiers), node.modifiers), options.hook("isExportEquals", node.isExportEquals, node.isExportEquals), options.hook("expression", options.nextNode(node.expression), node.expression));
}

function toInternalOptions(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const typescript = (_a = options.typescript) !== null && _a !== void 0 ? _a : TSModule__namespace;
    return Object.assign(Object.assign({}, options), { typescript, factory: (_c = (_b = options.factory) !== null && _b !== void 0 ? _b : typescript.factory) !== null && _c !== void 0 ? _c : typescript, setParents: (_d = options.setParents) !== null && _d !== void 0 ? _d : false, setOriginalNodes: (_e = options.setOriginalNodes) !== null && _e !== void 0 ? _e : false, preserveSymbols: (_f = options.preserveSymbols) !== null && _f !== void 0 ? _f : false, preserveComments: (_g = options.preserveComments) !== null && _g !== void 0 ? _g : true, commentRanges: new Set(), debug: (_h = options.debug) !== null && _h !== void 0 ? _h : false, depth: 0, hook: (_j = options.hook) !== null && _j !== void 0 ? _j : (() => ({})), finalize: (_k = options.finalize) !== null && _k !== void 0 ? _k : (() => {
            // Noop
        }) });
}

/**
 * Returns true if the given Node is a JSDocComment
 */
function isJsDocComment(node, typescript) {
    // TypeScript 4.x
    if (("isJSDoc" in typescript)) {
        return typescript.isJSDoc(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocComment;
}

function cloneJsDoc(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$u(node, options);
    }
    return v3Strategy$t(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$t(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocComment, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tags = ensureNodeArray(options.hook("tags", options.nextNodes(node.tags), node.tags), options.factory);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$u(node, options) {
    const baseNode = options.factory.createJSDocComment(options.hook("comment", node.comment, node.comment), ensureNodeArray(options.hook("tags", options.nextNodes(node.tags), node.tags), options.factory));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocUnknownTag
 */
function isJsDocUnknownTag(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocUnknownTag" in typescript)) {
        return typescript.isJSDocUnknownTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocTag;
}

/**
 * Returns true if the given Node is a JSDocParameterTag
 */
function isJsDocParameterTag(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocParameterTag" in typescript)) {
        return typescript.isJSDocParameterTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocParameterTag;
}

function cloneJsDocParameterTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$t(node, options);
    }
    return v3Strategy$s(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$s(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocParameterTag, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tagName = options.hook("tagName", options.nextNode(node.tagName), node.tagName);
    baseNode.name = options.hook("name", options.nextNode(node.name), node.name);
    baseNode.typeExpression = options.hook("typeExpression", options.nextNode(node.typeExpression), node.typeExpression);
    baseNode.isNameFirst = options.hook("isNameFirst", node.isNameFirst, node.isNameFirst);
    baseNode.isBracketed = options.hook("isBracketed", node.isBracketed, node.isBracketed);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$t(node, options) {
    const baseNode = options.factory.createJSDocParameterTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("name", options.nextNode(node.name), node.name), options.hook("isBracketed", node.isBracketed, node.isBracketed), options.hook("typeExpression", options.nextNode(node.typeExpression), node.typeExpression), options.hook("isNameFirst", node.isNameFirst, node.isNameFirst), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocReturnTag
 */
function isJsDocReturnTag(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocReturnTag" in typescript)) {
        return typescript.isJSDocReturnTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocReturnTag;
}

function cloneJsDocReturnTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$s(node, options);
    }
    return v3Strategy$r(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$r(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocReturnTag, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tagName = options.hook("tagName", options.nextNode(node.tagName), node.tagName);
    baseNode.typeExpression = options.hook("typeExpression", options.nextNode(node.typeExpression), node.typeExpression);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$s(node, options) {
    const baseNode = options.factory.createJSDocReturnTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("typeExpression", options.nextNode(node.typeExpression), node.typeExpression), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocTypeExpression
 */
function isJsDocTypeExpression(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocTypeExpression" in typescript)) {
        return typescript.isJSDocTypeExpression(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocTypeExpression;
}

function cloneJsDocTypeExpression(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$r(node, options);
    }
    return v3Strategy$q(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$q(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocTypeExpression, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.type = options.hook("type", options.nextNode(node.type), node.type);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$r(node, options) {
    const baseNode = options.factory.createJSDocTypeExpression(options.hook("type", options.nextNode(node.type), node.type));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocEnumTag
 */
function isJsDocEnumTag(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocEnumTag" in typescript)) {
        return typescript.isJSDocEnumTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocEnumTag;
}

function cloneJsDocEnumTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$q(node, options);
    }
    return v3Strategy$p(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$p(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocEnumTag, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tagName = options.hook("tagName", options.nextNode(node.tagName), node.tagName);
    baseNode.typeExpression = options.hook("typeExpression", options.nextNode(node.typeExpression), node.typeExpression);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$q(node, options) {
    const baseNode = options.factory.createJSDocEnumTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("typeExpression", options.nextNode(node.typeExpression), node.typeExpression), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocTypeTag
 */
function isJsDocTypeTag(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocTypeTag" in typescript)) {
        return typescript.isJSDocTypeTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocTypeTag;
}

function cloneJsDocTypeTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$p(node, options);
    }
    return v3Strategy$o(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$o(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocTypeTag, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tagName = options.hook("tagName", options.nextNode(node.tagName), node.tagName);
    baseNode.typeExpression = options.hook("typeExpression", options.nextNode(node.typeExpression), node.typeExpression);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$p(node, options) {
    const baseNode = options.factory.createJSDocTypeTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("typeExpression", options.nextNode(node.typeExpression), node.typeExpression), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocAllType
 */
function isJsDocAllType(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocAllType" in typescript)) {
        return typescript.isJSDocAllType(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocAllType;
}

function cloneJsDocAllType(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$o(node, options);
    }
    return v3Strategy$n(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$n(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocAllType, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$o(node, options) {
    const baseNode = options.factory.createJSDocAllType();
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocUnknownType
 */
function isJsDocUnknownType(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocUnknownType" in typescript)) {
        return typescript.isJSDocUnknownType(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocUnknownType;
}

function cloneJsDocUnknownType(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$n(node, options);
    }
    return v3Strategy$m(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$m(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocUnknownType, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$n(node, options) {
    const baseNode = options.factory.createJSDocUnknownType();
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocNonNullableType
 */
function isJsDocNonNullableType(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocNonNullableType" in typescript)) {
        return typescript.isJSDocNonNullableType(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocNonNullableType;
}

function cloneJsDocNonNullableType(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$m(node, options);
    }
    return v3Strategy$l(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$l(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocNonNullableType, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.type = options.hook("type", options.nextNode(node.type), node.type);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$m(node, options) {
    const baseNode = options.factory.createJSDocNonNullableType(options.hook("type", options.nextNode(node.type), node.type));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocNullableType
 */
function isJsDocNullableType(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocNullableType" in typescript)) {
        return typescript.isJSDocNullableType(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocNullableType;
}

function cloneJsDocNullableType(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$l(node, options);
    }
    return v3Strategy$k(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$k(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocNullableType, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.type = options.hook("type", options.nextNode(node.type), node.type);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$l(node, options) {
    const baseNode = options.factory.createJSDocNullableType(options.hook("type", options.nextNode(node.type), node.type));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocOptionalType
 */
function isJsDocOptionalType(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocOptionalType" in typescript)) {
        return typescript.isJSDocOptionalType(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocOptionalType;
}

function cloneJsDocOptionalType(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$k(node, options);
    }
    return v3Strategy$j(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$j(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocOptionalType, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.type = options.hook("type", options.nextNode(node.type), node.type);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$k(node, options) {
    const baseNode = options.factory.createJSDocOptionalType(options.hook("type", options.nextNode(node.type), node.type));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocFunctionType
 */
function isJsDocFunctionType(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocFunctionType" in typescript)) {
        return typescript.isJSDocFunctionType(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocFunctionType;
}

function cloneJsDocFunctionType(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$j(node, options);
    }
    return v3Strategy$i(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$i(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocFunctionType, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$j(node, options) {
    const baseNode = options.factory.createJSDocFunctionType(options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", node.type, node.type));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocVariadicType
 */
function isJsDocVariadicType(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocVariadicType" in typescript)) {
        return typescript.isJSDocVariadicType(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocVariadicType;
}

function cloneJsDocVariadicType(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$i(node, options);
    }
    return v3Strategy$h(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$h(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocVariadicType, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.type = options.hook("type", options.nextNode(node.type), node.type);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$i(node, options) {
    const baseNode = options.factory.createJSDocVariadicType(options.hook("type", options.nextNode(node.type), node.type));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocNamepathType
 */
function isJsDocNamepathType(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocNamepathType" in typescript)) {
        return typescript.isJSDocNamepathType(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocNamepathType;
}

function cloneJsDocNamepathType(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$h(node, options);
    }
    return v3Strategy$g(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$g(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocNamepathType, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.type = options.hook("type", options.nextNode(node.type), node.type);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$h(node, options) {
    const baseNode = options.factory.createJSDocNamepathType(options.hook("type", options.nextNode(node.type), node.type));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

function cloneJsDocUnknownTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$g(node, options);
    }
    return v3Strategy$f(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$f(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocTag, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tagName = options.hook("tagName", options.nextNode(node.tagName), node.tagName);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$g(node, options) {
    const baseNode = options.factory.createJSDocUnknownTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocAugmentsTag
 */
function isJsDocAugmentsTag(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocAugmentsTag" in typescript)) {
        return typescript.isJSDocAugmentsTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocAugmentsTag;
}

function cloneJsDocAugmentsTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$f(node, options);
    }
    return v3Strategy$e(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$e(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocAugmentsTag, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tagName = options.hook("tagName", options.nextNode(node.tagName), node.tagName);
    baseNode.class = options.hook("class", options.nextNode(node.class), node.class);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$f(node, options) {
    const baseNode = options.factory.createJSDocAugmentsTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("class", options.nextNode(node.class), node.class), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocAuthorTag
 */
function isJsDocAuthorTag(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocAuthorTag" in typescript)) {
        return typescript.isJSDocAuthorTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocAuthorTag;
}

function cloneJsDocAuthorTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$e(node, options);
    }
    return v3Strategy$d(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$d(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocAuthorTag, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tagName = options.hook("tagName", options.nextNode(node.tagName), node.tagName);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$e(node, options) {
    const baseNode = options.factory.createJSDocAuthorTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocClassTag
 */
function isJsDocClassTag(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocClassTag" in typescript)) {
        return typescript.isJSDocClassTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocClassTag;
}

function cloneJsDocClassTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$d(node, options);
    }
    return v3Strategy$c(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$c(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocClassTag, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tagName = options.hook("tagName", options.nextNode(node.tagName), node.tagName);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$d(node, options) {
    const baseNode = options.factory.createJSDocClassTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocThisTag
 */
function isJsDocThisTag(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocThisTag" in typescript)) {
        return typescript.isJSDocThisTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocThisTag;
}

function cloneJsDocThisTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$c(node, options);
    }
    return v3Strategy$b(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$b(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocThisTag, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tagName = options.hook("tagName", options.nextNode(node.tagName), node.tagName);
    baseNode.typeExpression = options.hook("typeExpression", options.nextNode(node.typeExpression), node.typeExpression);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$c(node, options) {
    const baseNode = options.factory.createJSDocThisTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("typeExpression", options.nextNode(node.typeExpression), node.typeExpression), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocTemplateTag
 */
function isJsDocTemplateTag(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocTemplateTag" in typescript)) {
        return typescript.isJSDocTemplateTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocTemplateTag;
}

function cloneJsDocTemplateTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$b(node, options);
    }
    return v3Strategy$a(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$a(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocTemplateTag, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tagName = options.hook("tagName", options.nextNode(node.tagName), node.tagName);
    baseNode.constraint = options.hook("constraint", options.nextNode(node.constraint), node.constraint);
    baseNode.typeParameters = ensureNodeArray(options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.factory);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$b(node, options) {
    const baseNode = options.factory.createJSDocTemplateTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("constraint", options.nextNode(node.constraint), node.constraint), ensureNodeArray(options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.factory), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocTypedefTag
 */
function isJsDocTypedefTag(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocTypedefTag" in typescript)) {
        return typescript.isJSDocTypedefTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocTypedefTag;
}

function cloneJsDocTypedefTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$a(node, options);
    }
    return v3Strategy$9(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$9(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocTypedefTag, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tagName = options.hook("tagName", options.nextNode(node.tagName), node.tagName);
    baseNode.fullName = options.hook("fullName", options.nextNode(node.fullName), node.fullName);
    baseNode.name = options.hook("name", options.nextNode(node.name), node.name);
    baseNode.typeExpression = options.hook("typeExpression", options.nextNode(node.typeExpression), node.typeExpression);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$a(node, options) {
    const baseNode = options.factory.createJSDocTypedefTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("typeExpression", options.nextNode(node.typeExpression), node.typeExpression), options.hook("fullName", options.nextNode(node.fullName), node.fullName), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.name = options.hook("name", options.nextNode(node.name), node.name);
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocCallbackTag
 */
function isJsDocCallbackTag(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocCallbackTag" in typescript)) {
        return typescript.isJSDocCallbackTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocCallbackTag;
}

function cloneJsDocCallbackTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$9(node, options);
    }
    return v3Strategy$8(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$8(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocCallbackTag, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tagName = options.hook("tagName", options.nextNode(node.tagName), node.tagName);
    baseNode.fullName = options.hook("fullName", options.nextNode(node.fullName), node.fullName);
    baseNode.name = options.hook("name", options.nextNode(node.name), node.name);
    baseNode.typeExpression = options.hook("typeExpression", options.nextNode(node.typeExpression), node.typeExpression);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$9(node, options) {
    const baseNode = options.factory.createJSDocCallbackTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("typeExpression", options.nextNode(node.typeExpression), node.typeExpression), options.hook("fullName", options.nextNode(node.fullName), node.fullName), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.name = options.hook("name", options.nextNode(node.name), node.name);
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocSignature
 */
function isJsDocSignature(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocSignature" in typescript)) {
        return typescript.isJSDocSignature(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocSignature;
}

function cloneJsDocSignature(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$8(node, options);
    }
    return v3Strategy$7(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$7(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocSignature, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.type = options.hook("type", options.nextNode(node.type), node.type);
    baseNode.typeParameters = options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters);
    baseNode.parameters = options.hook("parameters", options.nextNodes(node.parameters), node.parameters);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$8(node, options) {
    const baseNode = options.factory.createJSDocSignature(options.hook("typeParameters", options.nextNodes(node.typeParameters), node.typeParameters), options.hook("parameters", options.nextNodes(node.parameters), node.parameters), options.hook("type", options.nextNode(node.type), node.type));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocPropertyTag
 */
function isJsDocPropertyTag(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocPropertyTag" in typescript)) {
        return typescript.isJSDocPropertyTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocPropertyTag;
}

function cloneJsDocPropertyTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$7(node, options);
    }
    return v3Strategy$6(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$6(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocPropertyTag, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tagName = options.hook("tagName", options.nextNode(node.tagName), node.tagName);
    baseNode.name = options.hook("name", options.nextNode(node.name), node.name);
    baseNode.typeExpression = options.hook("typeExpression", options.nextNode(node.typeExpression), node.typeExpression);
    baseNode.isNameFirst = options.hook("isNameFirst", node.isNameFirst, node.isNameFirst);
    baseNode.isBracketed = options.hook("isBracketed", node.isBracketed, node.isBracketed);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$7(node, options) {
    const baseNode = options.factory.createJSDocPropertyTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("name", options.nextNode(node.name), node.name), options.hook("isBracketed", node.isBracketed, node.isBracketed), options.hook("typeExpression", options.nextNode(node.typeExpression), node.typeExpression), options.hook("isNameFirst", node.isNameFirst, node.isNameFirst), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocTypeLiteral
 */
function isJsDocTypeLiteral(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocTypeLiteral" in typescript)) {
        return typescript.isJSDocTypeLiteral(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocTypeLiteral;
}

function cloneJsDocTypeLiteral(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$6(node, options);
    }
    return v3Strategy$5(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$5(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocTypeLiteral, -1, -1);
    baseNode.jsDocPropertyTags = options.hook("jsDocPropertyTags", options.nextNodes(node.jsDocPropertyTags), node.jsDocPropertyTags);
    baseNode.isArrayType = options.hook("isArrayType", node.isArrayType, node.isArrayType);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$6(node, options) {
    const baseNode = options.factory.createJSDocTypeLiteral(options.hook("jsDocPropertyTags", options.nextNodes(node.jsDocPropertyTags), node.jsDocPropertyTags), options.hook("isArrayType", node.isArrayType, node.isArrayType));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

function fixupParentReferences(rootNode, { deep, propertyName, typescript }) {
    let parent = rootNode;
    typescript.forEachChild(rootNode, visitNode);
    function visitNode(n) {
        if (n[propertyName] !== parent) {
            n[propertyName] = parent;
            const saveParent = parent;
            parent = n;
            if (deep) {
                typescript.forEachChild(n, visitNode);
            }
            if (n.jsDoc != null) {
                for (const jsDocComment of n.jsDoc) {
                    jsDocComment[propertyName] = n;
                    parent = jsDocComment;
                    typescript.forEachChild(jsDocComment, visitNode);
                }
            }
            parent = saveParent;
        }
    }
}
function setParents(node, options) {
    fixupParentReferences(node, options);
    return node;
}

function getOriginalNode(node, options) {
    var _a;
    if (node._original != null) {
        return getOriginalNode(node._original, options);
    }
    return (_a = options.typescript.getOriginalNode(node)) !== null && _a !== void 0 ? _a : node;
}

function formatCommentRange({ pos, end }) {
    return `${pos}:${end}`;
}
function getCommentRanges(node, options) {
    var _a, _b, _c;
    const comments = [];
    const originalNode = getOriginalNode(node, options);
    const sourceFile = originalNode.getSourceFile();
    if (sourceFile == null || originalNode.pos === -1 || originalNode.end === -1)
        return [];
    const sourceFileText = sourceFile.getFullText();
    const pos = originalNode.getFullStart();
    const end = originalNode.getEnd();
    const leadingCommentRanges = (_a = options.typescript.getLeadingCommentRanges(sourceFileText, pos)) !== null && _a !== void 0 ? _a : [];
    const trailingCommentRanges = (_b = options.typescript.getTrailingCommentRanges(sourceFileText, end)) !== null && _b !== void 0 ? _b : [];
    if (leadingCommentRanges.length < 1) {
        // There may be one anyway such as will be the case when looking at the StringLiteral "foo" inside the following
        // source text: /** @type {string} */ "foo"
        const fullTextTrimmed = originalNode.getFullText().trim();
        // If the text includes one or more comments, mark them as leading comment ranges
        if (fullTextTrimmed.startsWith("//") || fullTextTrimmed.startsWith("/*")) {
            leadingCommentRanges.push(...((_c = options.typescript.getTrailingCommentRanges(sourceFileText, pos)) !== null && _c !== void 0 ? _c : []));
        }
    }
    const commentRanges = [
        ...leadingCommentRanges.map(range => (Object.assign(Object.assign({}, range), { hasTrailingNewLine: Boolean(range.hasTrailingNewLine), isLeading: true }))),
        ...trailingCommentRanges.map(range => (Object.assign(Object.assign({}, range), { hasTrailingNewLine: Boolean(range.hasTrailingNewLine), isLeading: false })))
    ];
    for (const commentRange of commentRanges) {
        if (options.commentRanges.has(formatCommentRange(commentRange)))
            continue;
        options.commentRanges.add(formatCommentRange(commentRange));
        let text = sourceFile.text.substring(commentRange.pos, commentRange.end);
        if (!text.startsWith("//") && !text.startsWith("/*"))
            continue;
        const isUsingLineCarriages = text.includes("\r\n");
        const isJsDoc = text.startsWith("/**");
        text = text
            .split(/\r?\n/)
            .map(line => line.trim())
            .map(line => (!isJsDoc || line.startsWith("/**") ? line : ` ${line}`))
            .join(isUsingLineCarriages ? `\r\n` : `\n`);
        if (text.startsWith("/**")) {
            // 'addSyntheticLeadingComment' will place the leading '/*' and the trailing '*/', so these two parts must be stripped
            // from the text before passing it to TypeScript
            text = text.slice(2, text.length - 2);
        }
        else if (text.startsWith("/*")) {
            // 'addSyntheticLeadingComment' will place the leading '/*' and the trailing '*/', so these two parts must be stripped
            // from the text before passing it to TypeScript
            text = text.slice(2, text.length - 2);
        }
        else {
            // 'addSyntheticLeadingComment' will place the leading '//', so this part must be stripped
            // from the text before passing it to TypeScript
            text = text.slice(2);
        }
        comments.push(Object.assign(Object.assign({}, commentRange), { text }));
    }
    return comments;
}
function preserveAllComments(node, options) {
    if (!options.preserveComments)
        return;
    preserveCommentsForOriginalNode(node, options);
    options.typescript.forEachChild(node, child => {
        preserveAllComments(child, options);
    });
}
function preserveCommentsForOriginalNode(node, options) {
    if (options.typescript.isSourceFile(node))
        return;
    const originalNode = getOriginalNode(node, options);
    if (node !== originalNode)
        preserveComments(node, originalNode, options);
}
function preserveComments(node, oldNode, options) {
    if (!options.preserveComments)
        return node;
    if (node.pos > -1 && node.end >= -1) {
        return node;
    }
    if (node.jsDoc == null && oldNode.jsDoc != null) {
        node.jsDoc = oldNode.jsDoc;
    }
    const comments = getCommentRanges(oldNode, options);
    if (comments.length > 0) {
        options.typescript.setSyntheticLeadingComments(node, undefined);
        options.typescript.setSyntheticTrailingComments(node, undefined);
    }
    for (const { isLeading, text, hasTrailingNewLine, kind } of comments) {
        if (isLeading) {
            options.typescript.addSyntheticLeadingComment(node, kind, text, hasTrailingNewLine);
        }
        else {
            options.typescript.addSyntheticTrailingComment(node, kind, text, hasTrailingNewLine);
        }
    }
    return node;
}

function nextOptions(options) {
    return Object.assign(Object.assign({}, options), { depth: options.depth + 1 });
}

function payload({ depth }) {
    return { depth };
}

function cloneNamespaceExport(node, options) {
    return options.factory.createNamespaceExport(options.hook("name", options.nextNode(node.name), node.name));
}

/**
 * Returns true if the given Node is a JSDocReadonlyTag
 */
function isJsDocReadonlyTag(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocReadonlyTag" in typescript)) {
        return typescript.isJSDocReadonlyTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocReadonlyTag;
}

function cloneJsDocReadonlyTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$5(node, options);
    }
    return v3Strategy$4(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$4(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocReadonlyTag, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tagName = options.hook("tagName", options.nextNode(node.tagName), node.tagName);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$5(node, options) {
    const baseNode = options.factory.createJSDocReadonlyTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocSeeTag
 */
function isJsDocSeeTag(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocSeeTag" in typescript)) {
        return typescript.isJSDocSeeTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocSeeTag;
}

function cloneJsDocSeeTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$4(node, options);
    }
    throw new Error('No strategy for cloning JSDocSeeTag in TypeScript v3');
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$4(node, options) {
    const baseNode = options.factory.createJSDocSeeTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), 
    // NOTE: do we want to wrap around `node.name`, which is a
    // `JSDocNameReference`?
    options.hook("name", node.name, node.name), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocPrivateTag
 */
function isJsDocPrivateTag(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocPrivateTag" in typescript)) {
        return typescript.isJSDocPrivateTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocPrivateTag;
}

function cloneJsDocPrivateTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$3(node, options);
    }
    return v3Strategy$3(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$3(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocPrivateTag, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tagName = options.hook("tagName", options.nextNode(node.tagName), node.tagName);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$3(node, options) {
    const baseNode = options.factory.createJSDocPrivateTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocProtectedTag
 */
function isJsDocProtectedTag(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocProtectedTag" in typescript)) {
        return typescript.isJSDocProtectedTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocProtectedTag;
}

function cloneJsDocProtectedTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$2(node, options);
    }
    return v3Strategy$2(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$2(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocProtectedTag, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tagName = options.hook("tagName", options.nextNode(node.tagName), node.tagName);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$2(node, options) {
    const baseNode = options.factory.createJSDocProtectedTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a JSDocPublicTag
 */
function isJsDocPublicTag(node, typescript) {
    // TypeScript 4.x
    if (("isJSDocPublicTag" in typescript)) {
        return typescript.isJSDocPublicTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocPublicTag;
}

function cloneJsDocPublicTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy$1(node, options);
    }
    return v3Strategy$1(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy$1(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocPublicTag, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tagName = options.hook("tagName", options.nextNode(node.tagName), node.tagName);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy$1(node, options) {
    const baseNode = options.factory.createJSDocPublicTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

function clonePrivateIdentifier(node, options) {
    return options.factory.createPrivateIdentifier(options.hook("text", node.text, node.text));
}

function toSetParentNodesOptions(options) {
    var _a, _b, _c;
    return {
        typescript: (_a = options.typescript) !== null && _a !== void 0 ? _a : TSModule__namespace,
        propertyName: (_b = options.propertyName) !== null && _b !== void 0 ? _b : "parent",
        deep: (_c = options.deep) !== null && _c !== void 0 ? _c : true
    };
}

/**
 * Returns true if the given Node is a NamedTupleMember
 */
function isNamedTupleMember(node, typescript) {
    return typescript.SyntaxKind.NamedTupleMember != null && node.kind === typescript.SyntaxKind.NamedTupleMember;
}

function cloneNamedTupleMember(node, options) {
    return options.factory.createNamedTupleMember(options.hook("dotDotDotToken", options.nextNode(node.dotDotDotToken), node.dotDotDotToken), options.hook("name", options.nextNode(node.name), node.name), options.hook("questionToken", options.nextNode(node.questionToken), node.questionToken), options.hook("type", options.nextNode(node.type), node.type));
}

/**
 * Returns true if the given Node is a JSDocDeprecatedTag
 */
function isJsDocDeprecatedTag(node, typescript) {
    // TypeScript 4.x
    if (("JSDocDeprecatedTag" in typescript)) {
        return typescript.isJSDocDeprecatedTag(node);
    }
    return node.kind === typescript.SyntaxKind.JSDocDeprecatedTag;
}

function cloneJsDocDeprecatedTag(node, options) {
    if ("factory" in options.typescript) {
        return v4Strategy(node, options);
    }
    return v3Strategy(node, options);
}
/**
 * Relevant to TypeScript v3.x
 */
function v3Strategy(node, options) {
    const typescript = options.typescript;
    const baseNode = typescript.createNode(typescript.SyntaxKind.JSDocTypedefTag, -1, -1);
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    baseNode.comment = options.hook("comment", node.comment, node.comment);
    baseNode.tagName = options.hook("tagName", options.nextNode(node.tagName), node.tagName);
    return baseNode;
}
/**
 * Relevant to TypeScript v4.x
 */
function v4Strategy(node, options) {
    const baseNode = options.factory.createJSDocDeprecatedTag(options.hook("tagName", options.nextNode(node.tagName), node.tagName), options.hook("comment", node.comment, node.comment));
    baseNode.flags = options.hook("flags", (node.flags |= 8), (node.flags |= 8));
    return baseNode;
}

/**
 * Returns true if the given Node is a TemplateLiteralTypeNode
 */
function isTemplateLiteralTypeNode(node, typescript) {
    return typescript.SyntaxKind.TemplateLiteralType != null && node.kind === typescript.SyntaxKind.TemplateLiteralType;
}

function cloneTemplateLiteralTypeNode(node, options) {
    return options.factory.createTemplateLiteralType(options.hook("head", options.nextNode(node.head), node.head), options.hook("templateSpans", options.nextNodes(node.templateSpans), node.templateSpans));
}

/**
 * Returns true if the given Node is a TemplateLiteralTypeSpan
 */
function isTemplateLiteralTypeSpan(node, typescript) {
    return typescript.SyntaxKind.TemplateLiteralTypeSpan != null && node.kind === typescript.SyntaxKind.TemplateLiteralTypeSpan;
}

function cloneTemplateLiteralTypeSpan(node, options) {
    if ("casing" in node && options.factory.createTemplateLiteralTypeSpan.length === 3) {
        const legacyNode = node;
        const legacyCreateTemplateLiteralTypeSpan = options.factory.createTemplateLiteralTypeSpan;
        return legacyCreateTemplateLiteralTypeSpan(options.hook("casing", legacyNode.casing, legacyNode.casing), options.hook("type", options.nextNode(legacyNode.type), legacyNode.type), options.hook("literal", options.nextNode(legacyNode.literal), legacyNode.literal));
    }
    else {
        return options.factory.createTemplateLiteralTypeSpan(options.hook("type", options.nextNode(node.type), node.type), options.hook("literal", options.nextNode(node.literal), node.literal));
    }
}

function setParentNodes(node, options) {
    return setParents(node, toSetParentNodesOptions(options));
}
function preserveNode(node, oldNode, options = {}) {
    var _a, _b, _c;
    const internalOptions = toInternalOptions(options);
    executePreserveNode(node, oldNode, internalOptions);
    if (node != null) {
        const parentValue = (_c = (_b = (_a = node._parent) !== null && _a !== void 0 ? _a : node.parent) !== null && _b !== void 0 ? _b : oldNode === null || oldNode === void 0 ? void 0 : oldNode._parent) !== null && _c !== void 0 ? _c : oldNode === null || oldNode === void 0 ? void 0 : oldNode.parent;
        if (internalOptions.setParents) {
            node.parent = parentValue;
        }
        else {
            node._parent = parentValue;
        }
    }
    return node;
}
function cloneNode(node, options = {}) {
    var _a, _b, _c;
    if (node === undefined)
        return undefined;
    const internalOptions = toInternalOptions(options);
    const clone = nextNode(node, internalOptions);
    executePreserveNode(clone, node, internalOptions);
    if (clone != null) {
        const parentValue = (_c = (_b = (_a = node._parent) !== null && _a !== void 0 ? _a : node.parent) !== null && _b !== void 0 ? _b : clone._parent) !== null && _c !== void 0 ? _c : clone.parent;
        if (internalOptions.setParents) {
            clone.parent = parentValue;
        }
        else {
            clone._parent = parentValue;
        }
    }
    return clone;
}
function nextNode(node, options) {
    var _a, _b;
    if (node === undefined)
        return undefined;
    const hook = ((_a = options.hook(node, payload(options))) !== null && _a !== void 0 ? _a : {});
    const visitorOptions = Object.assign(Object.assign({}, options), { nextNode: (actualNode) => nextNode(actualNode, nextOptions(options)), nextNodes: ((actualNodes) => nextNodes(actualNodes, nextOptions(options))), hook: (key, newValue, oldValue) => {
            const callback = hook[key];
            if (callback != null) {
                return callback(newValue, oldValue);
            }
            else {
                return newValue;
            }
        } });
    const clone = executeCloneNode(node, visitorOptions);
    if (clone === undefined)
        return undefined;
    if (node.jsDoc != null) {
        clone.jsDoc = visitorOptions.hook("jsDoc", visitorOptions.nextNodes(node.jsDoc), node.jsDoc);
    }
    setOriginalNodes(clone, node, options);
    preserveSymbols(clone, node, options);
    return options.finalize == null ? clone : (_b = options.finalize(clone, node, payload(options))) !== null && _b !== void 0 ? _b : clone;
}
function executePreserveNode(node, oldNode, options) {
    if (node == null || oldNode == null || node === oldNode)
        return undefined;
    setParents(node, toSetParentNodesOptions(Object.assign(Object.assign({}, options), { propertyName: options.setParents ? "parent" : "_parent" })));
    // Prioritize leading over trailing comments
    preserveAllComments(node, options);
    preserveComments(node, oldNode, options);
    setOriginalNodes(node, oldNode, options);
    preserveSymbols(node, oldNode, options);
}
function setOriginalNodes(newNode, oldNode, options) {
    if (newNode === oldNode)
        return;
    if (options.setOriginalNodes) {
        options.typescript.setOriginalNode(newNode, oldNode);
        newNode._original = newNode.original;
    }
    else {
        newNode._original = oldNode;
    }
}
function preserveSymbols(node, otherNode, options) {
    var _a;
    if (node === otherNode)
        return node;
    const otherSymbol = (_a = otherNode._symbol) !== null && _a !== void 0 ? _a : otherNode.symbol;
    if (otherSymbol != null) {
        node._symbol = otherSymbol;
    }
    if (options.preserveSymbols) {
        node.symbol = node._symbol;
    }
    return node;
}
function nextNodes(nodes, options) {
    if (nodes === undefined)
        return undefined;
    return nodes.map(node => nextNode(node, options));
}
function executeCloneNode(node, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (node == null)
        return undefined;
    if (options.typescript.isSourceFile(node)) {
        return cloneSourceFile(node, options);
    }
    else if (options.typescript.isIdentifier(node)) {
        return cloneIdentifier(node, options);
    }
    // Note: isPrivateIdentifier may not be supported by the provided TypeScript version, so the invocation is optional.
    else if ((_b = (_a = options.typescript).isPrivateIdentifier) === null || _b === void 0 ? void 0 : _b.call(_a, node)) {
        return clonePrivateIdentifier(node, options);
    }
    else if (options.typescript.isTypeAliasDeclaration(node)) {
        return cloneTypeAliasDeclaration(node, options);
    }
    else if (options.typescript.isTypeParameterDeclaration(node)) {
        return cloneTypeParameterDeclaration(node, options);
    }
    else if (options.typescript.isDecorator(node)) {
        return cloneDecorator(node, options);
    }
    else if (options.typescript.isQualifiedName(node)) {
        return cloneQualifiedName(node, options);
    }
    else if (options.typescript.isComputedPropertyName(node)) {
        return cloneComputedPropertyName(node, options);
    }
    else if (options.typescript.isCallSignatureDeclaration(node)) {
        return cloneCallSignatureDeclaration(node, options);
    }
    else if (options.typescript.isConstructSignatureDeclaration(node)) {
        return cloneConstructSignatureDeclaration(node, options);
    }
    else if (options.typescript.isVariableDeclaration(node)) {
        return cloneVariableDeclaration(node, options);
    }
    else if (options.typescript.isVariableDeclarationList(node)) {
        return cloneVariableDeclarationList(node, options);
    }
    else if (options.typescript.isVariableStatement(node)) {
        return cloneVariableStatement(node, options);
    }
    else if (options.typescript.isParameter(node)) {
        return cloneParameterDeclaration(node, options);
    }
    else if (options.typescript.isBindingElement(node)) {
        return cloneBindingElement(node, options);
    }
    else if (options.typescript.isPropertySignature(node)) {
        return clonePropertySignature(node, options);
    }
    else if (options.typescript.isPropertyDeclaration(node)) {
        return clonePropertyDeclaration(node, options);
    }
    else if (options.typescript.isPropertyAssignment(node)) {
        return clonePropertyAssignment(node, options);
    }
    else if (options.typescript.isShorthandPropertyAssignment(node)) {
        return cloneShorthandPropertyAssignment(node, options);
    }
    else if (options.typescript.isSpreadAssignment(node)) {
        return cloneSpreadAssignment(node, options);
    }
    else if (options.typescript.isObjectBindingPattern(node)) {
        return cloneObjectBindingPattern(node, options);
    }
    else if (options.typescript.isArrayBindingPattern(node)) {
        return cloneArrayBindingPattern(node, options);
    }
    else if (options.typescript.isFunctionDeclaration(node)) {
        return cloneFunctionDeclaration(node, options);
    }
    else if (options.typescript.isMethodSignature(node)) {
        return cloneMethodSignature(node, options);
    }
    else if (options.typescript.isMethodDeclaration(node)) {
        return cloneMethodDeclaration(node, options);
    }
    else if (options.typescript.isConstructorDeclaration(node)) {
        return cloneConstructorDeclaration(node, options);
    }
    else if (options.typescript.isSemicolonClassElement(node)) {
        return cloneSemicolonClassElement(node, options);
    }
    else if (options.typescript.isGetAccessorDeclaration(node)) {
        return cloneGetAccessorDeclaration(node, options);
    }
    else if (options.typescript.isSetAccessorDeclaration(node)) {
        return cloneSetAccessorDeclaration(node, options);
    }
    else if (options.typescript.isIndexSignatureDeclaration(node)) {
        return cloneIndexSignatureDeclaration(node, options);
    }
    else if (isKeywordTypeNode(node, options.typescript)) {
        return cloneKeywordTypeNode(node, options);
    }
    else if (options.typescript.isImportTypeNode(node)) {
        return cloneImportTypeNode(node, options);
    }
    else if (options.typescript.isThisTypeNode(node)) {
        return cloneThisTypeNode(node, options);
    }
    else if (options.typescript.isFunctionTypeNode(node)) {
        return cloneFunctionTypeNode(node, options);
    }
    else if (options.typescript.isConstructorTypeNode(node)) {
        return cloneConstructorTypeNode(node, options);
    }
    else if (options.typescript.isTypeReferenceNode(node)) {
        return cloneTypeReferenceNode(node, options);
    }
    else if (options.typescript.isTypePredicateNode(node)) {
        return cloneTypePredicateNode(node, options);
    }
    else if (options.typescript.isTypeQueryNode(node)) {
        return cloneTypeQueryNode(node, options);
    }
    else if (options.typescript.isTypeLiteralNode(node)) {
        return cloneTypeLiteralNode(node, options);
    }
    else if (options.typescript.isArrayTypeNode(node)) {
        return cloneArrayTypeNode(node, options);
    }
    else if (options.typescript.isTupleTypeNode(node)) {
        return cloneTupleTypeNode(node, options);
    }
    else if (isOptionalTypeNode(node, options.typescript)) {
        return cloneOptionalTypeNode(node, options);
    }
    else if (isRestTypeNode(node, options.typescript)) {
        return cloneRestTypeNode(node, options);
    }
    else if (options.typescript.isUnionTypeNode(node)) {
        return cloneUnionTypeNode(node, options);
    }
    else if (options.typescript.isIntersectionTypeNode(node)) {
        return cloneIntersectionTypeNode(node, options);
    }
    else if (options.typescript.isConditionalTypeNode(node)) {
        return cloneConditionalTypeNode(node, options);
    }
    else if (options.typescript.isInferTypeNode(node)) {
        return cloneInferTypeNode(node, options);
    }
    else if (options.typescript.isLiteralTypeNode(node)) {
        return cloneLiteralTypeNode(node, options);
    }
    else if (options.typescript.isStringLiteral(node)) {
        return cloneStringLiteral(node, options);
    }
    else if (isBooleanLiteral(node, options.typescript)) {
        return cloneBooleanLiteral(node, options);
    }
    else if (options.typescript.isRegularExpressionLiteral(node)) {
        return cloneRegularExpressionLiteral(node, options);
    }
    else if (options.typescript.isNoSubstitutionTemplateLiteral(node)) {
        return cloneNoSubstitutionTemplateLiteral(node, options);
    }
    else if (options.typescript.isNumericLiteral(node)) {
        return cloneNumericLiteral(node, options);
    }
    // Note: isBigIntLiteral may not be supported by the provided TypeScript version, so the invocation is optional.
    else if ((_d = (_c = options.typescript).isBigIntLiteral) === null || _d === void 0 ? void 0 : _d.call(_c, node)) {
        return cloneBigIntLiteral(node, options);
    }
    else if (options.typescript.isArrayLiteralExpression(node)) {
        return cloneArrayLiteralExpression(node, options);
    }
    else if (options.typescript.isObjectLiteralExpression(node)) {
        return cloneObjectLiteralExpression(node, options);
    }
    else if (options.typescript.isPrefixUnaryExpression(node)) {
        return clonePrefixUnaryExpression(node, options);
    }
    else if (options.typescript.isBlock(node)) {
        return cloneBlock(node, options);
    }
    else if (options.typescript.isThrowStatement(node)) {
        return cloneThrowStatement(node, options);
    }
    else if (options.typescript.isReturnStatement(node)) {
        return cloneReturnStatement(node, options);
    }
    else if (options.typescript.isNewExpression(node)) {
        return cloneNewExpression(node, options);
    }
    else if (options.typescript.isCallExpression(node)) {
        return cloneCallExpression(node, options);
    }
    else if (options.typescript.isExpressionStatement(node)) {
        return cloneExpressionStatement(node, options);
    }
    else if (options.typescript.isExpressionWithTypeArguments(node)) {
        return cloneExpressionWithTypeArguments(node, options);
    }
    else if (options.typescript.isPropertyAccessExpression(node)) {
        return clonePropertyAccessExpression(node, options);
    }
    else if (options.typescript.isElementAccessExpression(node)) {
        return cloneElementAccessExpression(node, options);
    }
    else if (options.typescript.isTemplateExpression(node)) {
        return cloneTemplateExpression(node, options);
    }
    else if (options.typescript.isTemplateSpan(node)) {
        return cloneTemplateSpan(node, options);
    }
    else if (options.typescript.isTemplateHead(node)) {
        return cloneTemplateHead(node, options);
    }
    else if (options.typescript.isTemplateMiddle(node)) {
        return cloneTemplateMiddle(node, options);
    }
    else if (options.typescript.isTemplateTail(node)) {
        return cloneTemplateTail(node, options);
    }
    else if (options.typescript.isConditionalExpression(node)) {
        return cloneConditionalExpression(node, options);
    }
    else if (options.typescript.isBinaryExpression(node)) {
        return cloneBinaryExpression(node, options);
    }
    else if (options.typescript.isParenthesizedExpression(node)) {
        return cloneParenthesizedExpression(node, options);
    }
    else if (options.typescript.isParenthesizedTypeNode(node)) {
        return cloneParenthesizedTypeNode(node, options);
    }
    else if (options.typescript.isArrowFunction(node)) {
        return cloneArrowFunction(node, options);
    }
    else if (options.typescript.isClassDeclaration(node)) {
        return cloneClassDeclaration(node, options);
    }
    else if (options.typescript.isClassExpression(node)) {
        return cloneClassExpression(node, options);
    }
    else if (options.typescript.isEnumDeclaration(node)) {
        return cloneEnumDeclaration(node, options);
    }
    else if (options.typescript.isEnumMember(node)) {
        return cloneEnumMember(node, options);
    }
    else if (options.typescript.isInterfaceDeclaration(node)) {
        return cloneInterfaceDeclaration(node, options);
    }
    else if (options.typescript.isHeritageClause(node)) {
        return cloneHeritageClause(node, options);
    }
    else if (options.typescript.isEmptyStatement(node)) {
        return cloneEmptyStatement(node, options);
    }
    else if (options.typescript.isAsExpression(node)) {
        return cloneAsExpression(node, options);
    }
    else if (("isTypeAssertionExpression" in options.typescript && options.typescript.isTypeAssertionExpression(node)) || ("isTypeAssertion" in options.typescript && options.typescript.isTypeAssertion(node))) {
        return cloneTypeAssertion(node, options);
    }
    else if (options.typescript.isAwaitExpression(node)) {
        return cloneAwaitExpression(node, options);
    }
    else if (options.typescript.isYieldExpression(node)) {
        return cloneYieldExpression(node, options);
    }
    else if (options.typescript.isForOfStatement(node)) {
        return cloneForOfStatement(node, options);
    }
    else if (options.typescript.isForInStatement(node)) {
        return cloneForInStatement(node, options);
    }
    else if (options.typescript.isForStatement(node)) {
        return cloneForStatement(node, options);
    }
    else if (options.typescript.isWhileStatement(node)) {
        return cloneWhileStatement(node, options);
    }
    else if (options.typescript.isLabeledStatement(node)) {
        return cloneLabeledStatement(node, options);
    }
    else if (options.typescript.isBreakStatement(node)) {
        return cloneBreakStatement(node, options);
    }
    else if (options.typescript.isContinueStatement(node)) {
        return cloneContinueStatement(node, options);
    }
    else if (options.typescript.isIfStatement(node)) {
        return cloneIfStatement(node, options);
    }
    else if (options.typescript.isDoStatement(node)) {
        return cloneDoStatement(node, options);
    }
    else if (options.typescript.isNonNullExpression(node)) {
        return cloneNonNullExpression(node, options);
    }
    else if (options.typescript.isTypeOperatorNode(node)) {
        return cloneTypeOperatorNode(node, options);
    }
    else if (options.typescript.isIndexedAccessTypeNode(node)) {
        return cloneIndexedAccessTypeNode(node, options);
    }
    // Note: isMappedTypeNode may not be supported by the provided TypeScript version, so the invocation is optional.
    else if ((_f = (_e = options.typescript).isMappedTypeNode) === null || _f === void 0 ? void 0 : _f.call(_e, node)) {
        return cloneMappedTypeNode(node, options);
    }
    else if (options.typescript.isOmittedExpression(node)) {
        return cloneOmittedExpression(node, options);
    }
    else if (isPartiallyEmittedExpression(node, options.typescript)) {
        return clonePartiallyEmittedExpression(node, options);
    }
    else if (options.typescript.isPostfixUnaryExpression(node)) {
        return clonePostfixUnaryExpression(node, options);
    }
    else if (isNullLiteral(node, options.typescript)) {
        return cloneNullLiteral(node, options);
    }
    else if (isThisExpression(node, options.typescript)) {
        return cloneThisExpression(node, options);
    }
    else if (isSuperExpression(node, options.typescript)) {
        return cloneSuperExpression(node, options);
    }
    else if (options.typescript.isDeleteExpression(node)) {
        return cloneDeleteExpression(node, options);
    }
    else if (options.typescript.isTypeOfExpression(node)) {
        return cloneTypeOfExpression(node, options);
    }
    else if (options.typescript.isVoidExpression(node)) {
        return cloneVoidExpression(node, options);
    }
    else if (options.typescript.isFunctionExpression(node)) {
        return cloneFunctionExpression(node, options);
    }
    else if (options.typescript.isSpreadElement(node)) {
        return cloneSpreadElement(node, options);
    }
    else if (options.typescript.isTaggedTemplateExpression(node)) {
        return cloneTaggedTemplateExpression(node, options);
    }
    else if (options.typescript.isMetaProperty(node)) {
        return cloneMetaProperty(node, options);
    }
    else if (options.typescript.isJsxElement(node)) {
        return cloneJsxElement(node, options);
    }
    else if (options.typescript.isJsxAttributes(node)) {
        return cloneJsxAttributes(node, options);
    }
    else if (options.typescript.isJsxOpeningElement(node)) {
        return cloneJsxOpeningElement(node, options);
    }
    else if (options.typescript.isJsxSelfClosingElement(node)) {
        return cloneJsxSelfClosingElement(node, options);
    }
    else if (options.typescript.isJsxFragment(node)) {
        return cloneJsxFragment(node, options);
    }
    else if (options.typescript.isJsxOpeningFragment(node)) {
        return cloneJsxOpeningFragment(node, options);
    }
    else if (options.typescript.isJsxClosingFragment(node)) {
        return cloneJsxClosingFragment(node, options);
    }
    else if (options.typescript.isJsxAttribute(node)) {
        return cloneJsxAttribute(node, options);
    }
    else if (options.typescript.isJsxSpreadAttribute(node)) {
        return cloneJsxSpreadAttribute(node, options);
    }
    else if (options.typescript.isJsxClosingElement(node)) {
        return cloneJsxClosingElement(node, options);
    }
    else if (options.typescript.isJsxExpression(node)) {
        return cloneJsxExpression(node, options);
    }
    else if (options.typescript.isJsxText(node)) {
        return cloneJsxText(node, options);
    }
    else if (isNotEmittedStatement(node, options.typescript)) {
        return cloneNotEmittedStatement(node, options);
    }
    else if (isCommaListExpression(node, options.typescript)) {
        return cloneCommaListExpression(node, options);
    }
    else if (options.typescript.isDebuggerStatement(node)) {
        return cloneDebuggerStatement(node, options);
    }
    else if (options.typescript.isWithStatement(node)) {
        return cloneWithStatement(node, options);
    }
    else if (options.typescript.isSwitchStatement(node)) {
        return cloneSwitchStatement(node, options);
    }
    else if (options.typescript.isCaseBlock(node)) {
        return cloneCaseBlock(node, options);
    }
    else if (options.typescript.isCaseClause(node)) {
        return cloneCaseClause(node, options);
    }
    else if (options.typescript.isDefaultClause(node)) {
        return cloneDefaultClause(node, options);
    }
    else if (options.typescript.isTryStatement(node)) {
        return cloneTryStatement(node, options);
    }
    else if (options.typescript.isCatchClause(node)) {
        return cloneCatchClause(node, options);
    }
    else if (options.typescript.isModuleDeclaration(node)) {
        return cloneModuleDeclaration(node, options);
    }
    else if (options.typescript.isModuleBlock(node)) {
        return cloneModuleBlock(node, options);
    }
    else if (options.typescript.isImportEqualsDeclaration(node)) {
        return cloneImportEqualsDeclaration(node, options);
    }
    else if (options.typescript.isExternalModuleReference(node)) {
        return cloneExternalModuleReference(node, options);
    }
    else if (options.typescript.isImportDeclaration(node)) {
        return cloneImportDeclaration(node, options);
    }
    else if (options.typescript.isImportClause(node)) {
        return cloneImportClause(node, options);
    }
    else if (options.typescript.isNamedImports(node)) {
        return cloneNamedImports(node, options);
    }
    else if (options.typescript.isNamespaceImport(node)) {
        return cloneNamespaceImport(node, options);
    }
    else if (options.typescript.isImportSpecifier(node)) {
        return cloneImportSpecifier(node, options);
    }
    else if (options.typescript.isNamespaceExportDeclaration(node)) {
        return cloneNamespaceExportDeclaration(node, options);
    }
    else if (options.typescript.isExportDeclaration(node)) {
        return cloneExportDeclaration(node, options);
    }
    else if (options.typescript.isNamedExports(node)) {
        return cloneNamedExports(node, options);
    }
    // Note: isNamespaceExport may not be supported by the provided TypeScript version, so the invocation is optional.
    else if ((_h = (_g = options.typescript).isNamespaceExport) === null || _h === void 0 ? void 0 : _h.call(_g, node)) {
        return cloneNamespaceExport(node, options);
    }
    // Note: isNamedTupleMember may not be supported by the provided TypeScript version, so the invocation is optional.
    else if (isNamedTupleMember === null || isNamedTupleMember === void 0 ? void 0 : isNamedTupleMember(node, options.typescript)) {
        return cloneNamedTupleMember(node, options);
    }
    else if (options.typescript.isExportSpecifier(node)) {
        return cloneExportSpecifier(node, options);
    }
    else if (options.typescript.isExportAssignment(node)) {
        return cloneExportAssignment(node, options);
    }
    else if (isJsDocComment(node, options.typescript)) {
        return cloneJsDoc(node, options);
    }
    else if (isJsDocParameterTag(node, options.typescript)) {
        return cloneJsDocParameterTag(node, options);
    }
    else if (isJsDocReturnTag(node, options.typescript)) {
        return cloneJsDocReturnTag(node, options);
    }
    else if (isJsDocTypeExpression(node, options.typescript)) {
        return cloneJsDocTypeExpression(node, options);
    }
    else if (isJsDocEnumTag(node, options.typescript)) {
        return cloneJsDocEnumTag(node, options);
    }
    else if (isJsDocTypeTag(node, options.typescript)) {
        return cloneJsDocTypeTag(node, options);
    }
    else if (isJsDocAllType(node, options.typescript)) {
        return cloneJsDocAllType(node, options);
    }
    else if (isJsDocUnknownType(node, options.typescript)) {
        return cloneJsDocUnknownType(node, options);
    }
    else if (isJsDocNonNullableType(node, options.typescript)) {
        return cloneJsDocNonNullableType(node, options);
    }
    else if (isJsDocNullableType(node, options.typescript)) {
        return cloneJsDocNullableType(node, options);
    }
    else if (isJsDocOptionalType(node, options.typescript)) {
        return cloneJsDocOptionalType(node, options);
    }
    else if (isJsDocFunctionType(node, options.typescript)) {
        return cloneJsDocFunctionType(node, options);
    }
    else if (isJsDocVariadicType(node, options.typescript)) {
        return cloneJsDocVariadicType(node, options);
    }
    else if (isJsDocNamepathType(node, options.typescript)) {
        return cloneJsDocNamepathType(node, options);
    }
    else if (isJsDocUnknownTag(node, options.typescript)) {
        return cloneJsDocUnknownTag(node, options);
    }
    else if (isJsDocAugmentsTag(node, options.typescript)) {
        return cloneJsDocAugmentsTag(node, options);
    }
    else if (isJsDocAuthorTag(node, options.typescript)) {
        return cloneJsDocAuthorTag(node, options);
    }
    else if (isJsDocClassTag(node, options.typescript)) {
        return cloneJsDocClassTag(node, options);
    }
    else if (isJsDocThisTag(node, options.typescript)) {
        return cloneJsDocThisTag(node, options);
    }
    else if (isJsDocTemplateTag(node, options.typescript)) {
        return cloneJsDocTemplateTag(node, options);
    }
    else if (isJsDocTypedefTag(node, options.typescript)) {
        return cloneJsDocTypedefTag(node, options);
    }
    else if (isJsDocDeprecatedTag(node, options.typescript)) {
        return cloneJsDocDeprecatedTag(node, options);
    }
    else if (isJsDocCallbackTag(node, options.typescript)) {
        return cloneJsDocCallbackTag(node, options);
    }
    else if (isJsDocSignature(node, options.typescript)) {
        return cloneJsDocSignature(node, options);
    }
    else if (isJsDocPropertyTag(node, options.typescript)) {
        return cloneJsDocPropertyTag(node, options);
    }
    else if (isJsDocTypeLiteral(node, options.typescript)) {
        return cloneJsDocTypeLiteral(node, options);
    }
    else if (isJsDocReadonlyTag(node, options.typescript)) {
        return cloneJsDocReadonlyTag(node, options);
    }
    else if (isJsDocSeeTag(node, options.typescript)) {
        return cloneJsDocSeeTag(node, options);
    }
    else if (isJsDocPrivateTag(node, options.typescript)) {
        return cloneJsDocPrivateTag(node, options);
    }
    else if (isJsDocProtectedTag(node, options.typescript)) {
        return cloneJsDocProtectedTag(node, options);
    }
    else if (isJsDocPublicTag(node, options.typescript)) {
        return cloneJsDocPublicTag(node, options);
    }
    else if (options.typescript.isToken(node)) {
        return cloneToken(node, options);
    }
    else if (isTemplateLiteralTypeNode(node, options.typescript)) {
        return cloneTemplateLiteralTypeNode(node, options);
    }
    else if (isTemplateLiteralTypeSpan(node, options.typescript)) {
        return cloneTemplateLiteralTypeSpan(node, options);
    }
    throw new TypeError(`Could not handle Node of kind: '${TSModule__namespace.SyntaxKind[node.kind]}'`);
}

exports.cloneNode = cloneNode;
exports.preserveNode = preserveNode;
exports.setParentNodes = setParentNodes;
//# sourceMappingURL=index.js.map
