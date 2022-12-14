'use strict';

var tslib = require('tslib');
var path = require('path');
var os = require('os');
var slash = require('slash');
var chalk = require('chalk');
var util = require('util');
var browserslistGenerator = require('@wessberg/browserslist-generator');
var crypto = require('crypto');
var TSModule = require('typescript');
var fs = require('fs');
var core = require('@babel/core');
var browserslist = require('browserslist');
var pluginutils = require('@rollup/pluginutils');
var stringutil = require('@wessberg/stringutil');
var tsCloneNode = require('@wessberg/ts-clone-node');
var MagicString = require('magic-string');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

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

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var slash__default = /*#__PURE__*/_interopDefaultLegacy(slash);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);
var TSModule__namespace = /*#__PURE__*/_interopNamespace(TSModule);
var MagicString__default = /*#__PURE__*/_interopDefaultLegacy(MagicString);

const SOURCE_MAP_EXTENSION = ".map";
const TS_EXTENSION = ".ts";
const TSX_EXTENSION = ".tsx";
const JS_EXTENSION = ".js";
const JS_MAP_EXTENSION = `${JS_EXTENSION}${SOURCE_MAP_EXTENSION}`;
const JSX_EXTENSION = ".jsx";
const JSON_EXTENSION = ".json";
const MJS_EXTENSION = ".mjs";
const MJSX_EXTENSION = ".mjsx";
const D_TS_EXTENSION = `.d${TS_EXTENSION}`;
const D_TS_MAP_EXTENSION = `.d${TS_EXTENSION}${SOURCE_MAP_EXTENSION}`;
const TSBUILDINFO_EXTENSION = `.tsbuildinfo`;
const KNOWN_EXTENSIONS = new Set([
    D_TS_EXTENSION,
    D_TS_MAP_EXTENSION,
    JS_MAP_EXTENSION,
    TS_EXTENSION,
    TSX_EXTENSION,
    JS_EXTENSION,
    JSX_EXTENSION,
    JSON_EXTENSION,
    MJS_EXTENSION,
    MJSX_EXTENSION,
    TSBUILDINFO_EXTENSION
]);
const DEFAULT_TSCONFIG_FILE_NAME = "tsconfig.json";
const NODE_MODULES = "node_modules";
const NODE_MODULES_MATCH_PATH = `/${NODE_MODULES}/`;
const SOURCE_MAP_COMMENT = "//# sourceMappingURL";
const SOURCE_MAP_COMMENT_REGEXP = /\/\/# sourceMappingURL=(\S*)/;
const TSLIB_NAME = `tslib${D_TS_EXTENSION}`;
const BABEL_RUNTIME_PREFIX_1 = "@babel/runtime/";
const BABEL_RUNTIME_PREFIX_2 = "babel-runtime/";
const REGENERATOR_RUNTIME_NAME_1 = `${BABEL_RUNTIME_PREFIX_1}regenerator/index.js`;
const REGENERATOR_RUNTIME_NAME_2 = `${BABEL_RUNTIME_PREFIX_2}regenerator/index.js`;
const BABEL_REQUIRE_RUNTIME_HELPER_REGEXP_1 = new RegExp(`(require\\(["'\`])(${BABEL_RUNTIME_PREFIX_1}helpers/esm/[^"'\`]*)["'\`]\\)`);
const BABEL_REQUIRE_RUNTIME_HELPER_REGEXP_2 = new RegExp(`(require\\(["'\`])(${BABEL_RUNTIME_PREFIX_2}helpers/esm/[^"'\`]*)["'\`]\\)`);
const BABEL_MINIFICATION_BLACKLIST_PRESET_NAMES = [];
const BABEL_MINIFICATION_BLACKLIST_PLUGIN_NAMES = ["@babel/plugin-transform-runtime", "babel-plugin-transform-runtime"];
const BABEL_MINIFY_PRESET_NAMES = ["babel-preset-minify"];
const BABEL_MINIFY_PLUGIN_NAMES = [
    "babel-plugin-transform-minify-booleans",
    "babel-plugin-minify-builtins",
    "babel-plugin-transform-inline-consecutive-adds",
    "babel-plugin-minify-dead-code-elimination",
    "babel-plugin-minify-constant-folding",
    "babel-plugin-minify-flip-comparisons",
    "babel-plugin-minify-guarded-expressions",
    "babel-plugin-minify-infinity",
    "babel-plugin-minify-mangle-names",
    "babel-plugin-transform-member-expression-literals",
    "babel-plugin-transform-merge-sibling-variables",
    "babel-plugin-minify-numeric-literals",
    "babel-plugin-transform-property-literals",
    "babel-plugin-transform-regexp-constructors",
    "babel-plugin-transform-remove-console",
    "babel-plugin-transform-remove-debugger",
    "babel-plugin-transform-remove-undefined",
    "babel-plugin-minify-replace",
    "babel-plugin-minify-simplify",
    "babel-plugin-transform-simplify-comparison-operators",
    "babel-plugin-minify-type-constructors",
    "babel-plugin-transform-undefined-to-void"
];
const FORCED_BABEL_PRESET_ENV_OPTIONS = {
    modules: false
};
const FORCED_BABEL_YEARLY_PRESET_OPTIONS = Object.assign({}, FORCED_BABEL_PRESET_ENV_OPTIONS);
const FORCED_BABEL_PLUGIN_TRANSFORM_RUNTIME_OPTIONS = {
    helpers: true,
    regenerator: true,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    useESModules: true
};
const ROLLUP_PLUGIN_MULTI_ENTRY_LEGACY = "\0rollup-plugin-multi-entry:entry-point";
const ROLLUP_PLUGIN_VIRTUAL_PREFIX = `\0virtual:`;

/**
 * Ensures that the given item is in fact an array
 */
function ensureArray(item) {
    return Array.isArray(item) ? item : [item];
}

const ROOT_DIRECTORY = path__default['default'].parse(process.cwd()).root;
const PLATFORM = os.platform();
const DRIVE_LETTER_REGEXP = /^\w:/;
function relative(from, to) {
    return ensurePosix(path__default['default'].relative(from, to));
}
function join(...paths) {
    return ensurePosix(path__default['default'].join(...paths));
}
function normalize(p) {
    return ensurePosix(p);
}
function dirname(p) {
    return ensurePosix(path__default['default'].dirname(p));
}
function basename(p) {
    return ensurePosix(path__default['default'].basename(p));
}
function extname(p) {
    return path__default['default'].extname(p);
}
function parse(p) {
    const parsedPath = path__default['default'].parse(p);
    return {
        ext: parsedPath.ext,
        name: normalize(parsedPath.name),
        base: normalize(parsedPath.base),
        dir: normalize(parsedPath.dir),
        root: normalize(parsedPath.root)
    };
}
function isTypeScriptLib(p) {
    return p.startsWith(`lib.`) && p.endsWith(D_TS_EXTENSION);
}
/**
 * On Windows, it is important that all absolute paths are absolute, including the drive letter, because TypeScript assumes this
 */
function ensureHasDriveLetter(p) {
    if (PLATFORM !== "win32")
        return p;
    if (DRIVE_LETTER_REGEXP.test(p))
        return p;
    if (p.startsWith(ROOT_DIRECTORY))
        return p;
    if (!isAbsolute(p))
        return p;
    return nativeJoin(ROOT_DIRECTORY, p);
}
/**
 * Ensures that the given path follows posix file names
 */
function ensurePosix(p) {
    return slash__default['default'](p);
}
function nativeNormalize(p) {
    // Converts to either POSIX or native Windows file paths
    return path__default['default'].normalize(p);
}
function nativeDirname(p) {
    return path__default['default'].dirname(p);
}
function nativeJoin(...paths) {
    return path__default['default'].join(...paths);
}
function isAbsolute(p) {
    return path__default['default'].isAbsolute(p);
}
/**
 * Gets the extension of the given file
 */
function getExtension(file) {
    if (file.endsWith(D_TS_EXTENSION))
        return D_TS_EXTENSION;
    else if (file.endsWith(D_TS_MAP_EXTENSION))
        return D_TS_MAP_EXTENSION;
    return extname(file);
}
/**
 * Returns true if the given path represents an external library
 */
function isExternalLibrary(p) {
    return (!p.startsWith(".") && !p.startsWith("/")) || p.includes(NODE_MODULES_MATCH_PATH);
}
/**
 * Returns true if the given id represents tslib
 */
function isTslib(p) {
    return p === "tslib" || normalize(p).endsWith(`/tslib/${TSLIB_NAME}`) || normalize(p).endsWith("/tslib/tslib.es6.js") || normalize(p).endsWith("/tslib/tslib.js");
}
/**
 * Returns true if the given path represents a Babel helper
 */
function isBabelHelper(p) {
    return includesBabelEsmHelper(p) || isBabelCjsHelper(p);
}
/**
 * Returns true if the given path represents a Babel ESM helper
 */
function includesBabelEsmHelper(p) {
    return normalize(p).includes(`${BABEL_RUNTIME_PREFIX_1}helpers/esm`) || normalize(p).includes(`${BABEL_RUNTIME_PREFIX_2}helpers/esm`);
}
/**
 * Returns true if the given path represents a Babel CJS helper
 */
function isBabelCjsHelper(p) {
    return !includesBabelEsmHelper(p) && (normalize(p).includes(`${BABEL_RUNTIME_PREFIX_1}helpers`) || normalize(p).includes(`${BABEL_RUNTIME_PREFIX_2}helpers`));
}
/**
 * Returns true if the given path represents @babel/preset-env
 */
function isBabelPresetEnv(p) {
    return normalize(p).includes("@babel/preset-env") || normalize(p).includes("babel-preset-env");
}
/**
 * Returns true if the given path is the name of the entry module or @rollup/plugin-multi-entry
 */
function isMultiEntryModule(p, multiEntryModuleName) {
    const normalized = normalize(p);
    return normalized === ROLLUP_PLUGIN_MULTI_ENTRY_LEGACY || (multiEntryModuleName != null && normalized === multiEntryModuleName);
}
/**
 * Returns true if the given path represents @babel/preset-es[2015|2016|2017]
 */
function isYearlyBabelPreset(p) {
    return normalize(p).includes("@babel/preset-es") || normalize(p).includes("babel-preset-es");
}
/**
 * Returns true if the given path represents @babel/plugin-transform-runtime
 */
function isBabelPluginTransformRuntime(p) {
    return normalize(p).includes("@babel/plugin-transform-runtime") || normalize(p).includes("babel-plugin-transform-runtime");
}
function somePathsAreRelated(paths, matchPath) {
    for (const p of paths) {
        if (pathsAreRelated(p, matchPath))
            return true;
    }
    return false;
}
function pathsAreRelated(a, b) {
    if (a === b)
        return true;
    // A node_modules folder may contain one or more nested node_modules
    if (a.includes(NODE_MODULES) || b.includes(NODE_MODULES)) {
        const firstPathFromNodeModules = a.includes(NODE_MODULES) ? a.slice(a.indexOf(NODE_MODULES)) : a;
        const secondPathFromNodeModules = b.includes(NODE_MODULES) ? b.slice(b.indexOf(NODE_MODULES)) : b;
        if (firstPathFromNodeModules.includes(secondPathFromNodeModules))
            return true;
        if (secondPathFromNodeModules.includes(firstPathFromNodeModules))
            return true;
    }
    return false;
}
/**
 * Strips the extension from a file
 */
function stripKnownExtension(file) {
    let currentExtname;
    for (const extName of KNOWN_EXTENSIONS) {
        if (file.endsWith(extName)) {
            currentExtname = extName;
            break;
        }
    }
    if (currentExtname == null)
        return file;
    return file.slice(0, file.lastIndexOf(currentExtname));
}
/**
 * Sets the given extension for the given file
 */
function setExtension(file, extension) {
    return normalize(`${stripKnownExtension(file)}${extension}`);
}
/**
 * Ensure that the given path has a leading "."
 */
function ensureHasLeadingDotAndPosix(p, externalGuard = true) {
    if (externalGuard && isExternalLibrary(p))
        return p;
    const posixPath = ensurePosix(p);
    if (posixPath.startsWith("."))
        return posixPath;
    if (posixPath.startsWith("/"))
        return `.${posixPath}`;
    return `./${posixPath}`;
}
/**
 * Ensures that the given path is relative
 */
function ensureRelative(root, p) {
    // If the path is already relative, simply return it
    if (!isAbsolute(p)) {
        return normalize(p);
    }
    // Otherwise, construct a relative path from the root
    return relative(root, p);
}
/**
 * Ensures that the given path is absolute
 */
function ensureAbsolute(root, p) {
    // If the path is already absolute, simply return it
    if (isAbsolute(p)) {
        return normalize(p);
    }
    // Otherwise, construct an absolute path from the root
    return join(root, p);
}
/**
 * Checks the id from the given importer with respect to the given externalOption provided to Rollup
 */
function isExternal(id, importer, externalOption) {
    var _a;
    if (externalOption == null)
        return false;
    if (externalOption === true)
        return true;
    if (externalOption === false)
        return false;
    if (typeof externalOption === "function")
        return (_a = externalOption(id, importer, true)) !== null && _a !== void 0 ? _a : false;
    const ids = new Set();
    const matchers = [];
    for (const value of ensureArray(externalOption)) {
        if (value instanceof RegExp) {
            matchers.push(value);
        }
        else {
            ids.add(value);
        }
    }
    return ids.has(id) || matchers.some(matcher => matcher.test(id));
}

function finalizeParsedCommandLine({ cwd, parsedCommandLineResult: { originalCompilerOptions, parsedCommandLine, tsconfigPath } }) {
    // Declarations may be generated, but not as part of the Builder/Incremental program which is used during the transform, renderChunk, and generateBundle phases, so a nice optimization can be to instruct TypeScript not to generate them.
    // The raw CompilerOptions will be preserved and used in the last compilation phase to generate declarations if needed.
    // However, when 'composite' is true or when incremental compilation is active, declarations must be emitted for buildInfo to work, so under such circumstances this optimization must be skipped.
    const canApplySkipDeclarationsOptimization = !Boolean(parsedCommandLine.options.incremental) &&
        !Boolean(parsedCommandLine.options.composite) &&
        parsedCommandLine.options.tsBuildInfoFile == null &&
        (parsedCommandLine.projectReferences == null || parsedCommandLine.projectReferences.length < 1);
    if (canApplySkipDeclarationsOptimization) {
        parsedCommandLine.options.declaration = false;
        parsedCommandLine.options.declarationMap = false;
        parsedCommandLine.options.declarationDir = undefined;
    }
    // Ensure that at tsBuildInfoFile exists if 'composite' or 'incremental' is true
    if (parsedCommandLine.options.incremental === true || parsedCommandLine.options.composite === true) {
        if (parsedCommandLine.options.tsBuildInfoFile != null) {
            parsedCommandLine.options.tsBuildInfoFile = ensureAbsolute(cwd, parsedCommandLine.options.tsBuildInfoFile);
        }
        // Otherwise, use the _actual_ outDir/outFile from the resolved tsconfig to build the path to the .tsbuildinfo file since TypeScript should be able to actually
        // resolve the file from the path pointed to by the user
        else {
            let tsBuildInfoAbsolutePath;
            // Use outDir as the base directory
            if (originalCompilerOptions.outDir != null) {
                tsBuildInfoAbsolutePath = join(ensureAbsolute(cwd, originalCompilerOptions.outDir), `${parse(tsconfigPath).name}${TSBUILDINFO_EXTENSION}`);
            }
            // Otherwise, use outFile but replace the extension
            else if (originalCompilerOptions.outFile != null) {
                tsBuildInfoAbsolutePath = ensureAbsolute(cwd, setExtension(originalCompilerOptions.outFile, TSBUILDINFO_EXTENSION));
            }
            // Otherwise, use 'cwd' as the directory for the .tsbuildinfo file
            else {
                tsBuildInfoAbsolutePath = join(ensureAbsolute(cwd, `${parse(tsconfigPath).name}${TSBUILDINFO_EXTENSION}`));
            }
            parsedCommandLine.options.tsBuildInfoFile = tsBuildInfoAbsolutePath;
        }
    }
    return parsedCommandLine;
}

function shouldDebugSourceFile(debug, { fileName, text }) {
    if (typeof debug === "boolean")
        return debug;
    return Boolean(debug({
        kind: "transformer",
        fileName,
        text
    }));
}
function shouldDebugMetrics(debug, sourceFile) {
    if (typeof debug === "boolean")
        return debug;
    return Boolean(debug(Object.assign({ kind: "metrics" }, (sourceFile == null ? {} : { fileName: sourceFile.fileName }))));
}
function shouldDebugEmit(debug, fileName, text, outputPathKind) {
    if (typeof debug === "boolean")
        return debug;
    return Boolean(debug({
        kind: "emit",
        fileKind: outputPathKind,
        fileName,
        text
    }));
}
function shouldDebugTsconfig(debug) {
    if (typeof debug === "boolean")
        return debug;
    return Boolean(debug({
        kind: "tsconfig"
    }));
}

function getFormattedDateTimePrefix() {
    const currentDate = new Date();
    const currentDateTime = `(${currentDate.getHours().toString().padStart(2, "0")}:${currentDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${currentDate.getSeconds().toString().padStart(2, "0")})`;
    return `${chalk__default['default'].gray(currentDateTime)}   `;
}

function inspect(item, depth = 4) {
    console.log(util.inspect(item, { colors: true, depth, maxArrayLength: 1000 }));
}

function logTsconfig(config) {
    console.log(`${getFormattedDateTimePrefix()}${chalk__default['default'].red(`tsconfig`)}`);
    inspect(config);
}

/**
 * Returns true if the given tsconfig is a ParsedCommandLine
 */
function isParsedCommandLine(tsconfig) {
    return tsconfig != null && typeof tsconfig !== "string" && typeof tsconfig !== "function" && "options" in tsconfig && !("hook" in tsconfig);
}
/**
 * Returns true if the given tsconfig are raw, JSON-serializable CompilerOptions
 */
function isRawCompilerOptions(tsconfig) {
    return tsconfig != null && typeof tsconfig !== "string" && typeof tsconfig !== "function" && !("options" in tsconfig) && !("hook" in tsconfig);
}
/**
 * Returns true if the given tsconfig is in fact a function that receives resolved CompilerOptions that can be extended
 */
function isTsConfigResolver(tsconfig) {
    return tsconfig != null && typeof tsconfig === "function";
}
/**
 * Returns true if the given tsconfig is in fact an object that provides a filename for a tsconfig,
 * as well as a 'hook' function that receives resolved CompilerOptions that can be extended
 */
function isTsConfigResolverWithFileName(tsconfig) {
    return tsconfig != null && typeof tsconfig !== "string" && typeof tsconfig !== "function" && !("options" in tsconfig) && "hook" in tsconfig;
}
/**
 * Returns true if the given tsconfig are CompilerOptions
 */
function isCompilerOptions(tsconfig) {
    return (tsconfig != null &&
        typeof tsconfig !== "string" &&
        typeof tsconfig !== "function" &&
        !("options" in tsconfig) &&
        !("hook" in tsconfig) &&
        (("module" in tsconfig && typeof tsconfig.module === "number") ||
            ("target" in tsconfig && typeof tsconfig.target === "number") ||
            ("jsx" in tsconfig && typeof tsconfig.jsx === "number") ||
            ("moduleResolution" in tsconfig && typeof tsconfig.moduleResolution === "number") ||
            ("newLine" in tsconfig && typeof tsconfig.newLine === "number")));
}
/**
 * Gets a ParsedCommandLine based on the given options
 */
function getParsedCommandLine(options) {
    const { cwd, tsconfig, fileSystem, forcedCompilerOptions = {}, typescript } = options;
    const hasProvidedTsconfig = tsconfig != null;
    let originalCompilerOptions;
    let parsedCommandLine;
    let tsconfigPath = ensureAbsolute(cwd, DEFAULT_TSCONFIG_FILE_NAME);
    // If the given tsconfig is already a ParsedCommandLine, use that one, but apply the forced CompilerOptions
    if (isParsedCommandLine(tsconfig)) {
        originalCompilerOptions = tsconfig.options;
        tsconfig.options = Object.assign(Object.assign({}, tsconfig.options), forcedCompilerOptions);
        parsedCommandLine = tsconfig;
    }
    // If the user provided CompilerOptions directly, use those to build a ParsedCommandLine
    else if (isCompilerOptions(tsconfig)) {
        originalCompilerOptions = typescript.parseJsonConfigFileContent({}, fileSystem, cwd, tsconfig).options;
        parsedCommandLine = typescript.parseJsonConfigFileContent({}, fileSystem, cwd, Object.assign(Object.assign({}, tsconfig), forcedCompilerOptions));
    }
    // If the user provided JSON-serializable ("raw") CompilerOptions directly, use those to build a ParsedCommandLine
    else if (isRawCompilerOptions(tsconfig)) {
        originalCompilerOptions = typescript.parseJsonConfigFileContent({ compilerOptions: tsconfig }, fileSystem, cwd).options;
        parsedCommandLine = typescript.parseJsonConfigFileContent({ compilerOptions: tsconfig }, fileSystem, cwd, forcedCompilerOptions);
    }
    // Otherwise, attempt to resolve it and parse it
    else {
        tsconfigPath = ensureAbsolute(cwd, isTsConfigResolverWithFileName(tsconfig) ? tsconfig.fileName : tsconfig != null && !isTsConfigResolver(tsconfig) ? tsconfig : DEFAULT_TSCONFIG_FILE_NAME);
        // If the file exists, read the tsconfig on that location
        let tsconfigContent = fileSystem.readFile(tsconfigPath);
        // Otherwise, if the user hasn't provided any tsconfig at all, start from an empty one (and only use the forced options)
        if (tsconfigContent == null && !hasProvidedTsconfig) {
            tsconfigContent = "";
        }
        // Finally, if the user has provided a file that doesn't exist, throw
        else if (tsconfigContent == null) {
            throw new ReferenceError(`The given tsconfig: '${tsconfigPath}' doesn't exist!`);
        }
        const tsconfigJson = typescript.parseConfigFileTextToJson(tsconfigPath, tsconfigContent).config;
        const basePath = nativeDirname(tsconfigPath);
        originalCompilerOptions = typescript.parseJsonConfigFileContent(tsconfigJson, fileSystem, basePath, {}, tsconfigPath).options;
        parsedCommandLine = typescript.parseJsonConfigFileContent(tsconfigJson, fileSystem, basePath, forcedCompilerOptions, tsconfigPath);
        // If an extension hook has been provided. Make sure to still apply the forced CompilerOptions
        if (isTsConfigResolver(tsconfig)) {
            originalCompilerOptions = Object.assign({}, tsconfig(originalCompilerOptions));
            parsedCommandLine.options = Object.assign(Object.assign({}, tsconfig(parsedCommandLine.options)), forcedCompilerOptions);
        }
        else if (isTsConfigResolverWithFileName(tsconfig)) {
            // If an extension hook has been provided through the 'hook' property. Make sure to still apply the forced CompilerOptions
            originalCompilerOptions = Object.assign({}, tsconfig.hook(originalCompilerOptions));
            parsedCommandLine.options = Object.assign(Object.assign({}, tsconfig.hook(parsedCommandLine.options)), forcedCompilerOptions);
        }
    }
    // Ensure that the parsed command line, as well as the original CompilerOptions has a base URL
    if (parsedCommandLine.options.baseUrl == null) {
        parsedCommandLine.options.baseUrl = ".";
    }
    if (originalCompilerOptions.baseUrl == null) {
        originalCompilerOptions.baseUrl = ".";
    }
    // Remove all non-declaration files from the default file names since these will be handled separately by Rollup.
    // Also filter out all files that is matched by the include/exclude globs provided as plugin options
    parsedCommandLine.fileNames = parsedCommandLine.fileNames.filter(file => file.endsWith(D_TS_EXTENSION) && options.filter(file));
    const parsedCommandLineResult = {
        parsedCommandLine,
        originalCompilerOptions,
        tsconfigPath
    };
    // On some TypeScript versions such as 3.0.0, the 'composite' feature
    // require that a specific configFilePath exists on the CompilerOptions,
    // so make sure a path is always set.
    if (parsedCommandLine.options.configFilePath == null) {
        parsedCommandLine.options.configFilePath = tsconfigPath;
    }
    // Finalize the parsed command line
    finalizeParsedCommandLine(Object.assign(Object.assign({}, options), { parsedCommandLineResult }));
    if (shouldDebugTsconfig(options.pluginOptions.debug)) {
        logTsconfig(parsedCommandLine);
    }
    return parsedCommandLineResult;
}

/**
 * Gets the ScriptTarget to use from the given Browserslist
 */
function getScriptTargetFromBrowserslist(browserslist, typescript) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    switch (browserslistGenerator.getAppropriateEcmaVersionForBrowserslist(browserslist)) {
        case "es3":
            return typescript.ScriptTarget.ES3;
        case "es5":
            return typescript.ScriptTarget.ES5;
        case "es2015":
            return typescript.ScriptTarget.ES2015;
        // Support older TypeScript versions that may not supported ES2016 as a ScriptTarget with nullish coalescing
        case "es2016":
            return (_a = typescript.ScriptTarget.ES2016) !== null && _a !== void 0 ? _a : typescript.ScriptTarget.ES2015;
        // Support older TypeScript versions that may not supported ES2016 as a ScriptTarget with nullish coalescing
        case "es2017":
            return (_c = (_b = typescript.ScriptTarget.ES2017) !== null && _b !== void 0 ? _b : typescript.ScriptTarget.ES2016) !== null && _c !== void 0 ? _c : typescript.ScriptTarget.ES2015;
        // Support older TypeScript versions that may not supported ES2016 as a ScriptTarget with nullish coalescing
        case "es2018":
            return (_f = (_e = (_d = typescript.ScriptTarget.ES2018) !== null && _d !== void 0 ? _d : typescript.ScriptTarget.ES2017) !== null && _e !== void 0 ? _e : typescript.ScriptTarget.ES2016) !== null && _f !== void 0 ? _f : typescript.ScriptTarget.ES2015;
        // Support older TypeScript versions that may not supported ES2016 as a ScriptTarget with nullish coalescing
        case "es2019":
            return (_k = (_j = (_h = (_g = typescript.ScriptTarget.ES2019) !== null && _g !== void 0 ? _g : typescript.ScriptTarget.ES2018) !== null && _h !== void 0 ? _h : typescript.ScriptTarget.ES2017) !== null && _j !== void 0 ? _j : typescript.ScriptTarget.ES2016) !== null && _k !== void 0 ? _k : typescript.ScriptTarget.ES2015;
        // Support older TypeScript versions that may not supported ES2016 as a ScriptTarget with nullish coalescing
        case "es2020":
            return ((_q = (_p = (_o = (_m = (_l = typescript.ScriptTarget.ES2020) !== null && _l !== void 0 ? _l : typescript.ScriptTarget.ES2019) !== null && _m !== void 0 ? _m : typescript.ScriptTarget.ES2018) !== null && _o !== void 0 ? _o : typescript.ScriptTarget.ES2017) !== null && _p !== void 0 ? _p : typescript.ScriptTarget.ES2016) !== null && _q !== void 0 ? _q : typescript.ScriptTarget.ES2015);
    }
}
/**
 * Gets the EcmaVersion that represents the given ScriptTarget
 */
function getEcmaVersionForScriptTarget(scriptTarget, typescript) {
    switch (scriptTarget) {
        case typescript.ScriptTarget.ES3:
            return "es3";
        case typescript.ScriptTarget.ES5:
            return "es5";
        case typescript.ScriptTarget.ES2015:
            return "es2015";
        case typescript.ScriptTarget.ES2016:
            return "es2016";
        case typescript.ScriptTarget.ES2017:
            return "es2017";
        case typescript.ScriptTarget.ES2018:
            return "es2018";
        case typescript.ScriptTarget.ES2019:
            return "es2019";
        case typescript.ScriptTarget.ES2020:
        case typescript.ScriptTarget.ESNext:
        case typescript.ScriptTarget.JSON:
            return "es2020";
    }
}

/**
 * Generates a random hash
 */
function generateRandomHash({ length = 8, key } = {}) {
    return key == null ? crypto.randomBytes(length / 2).toString("hex") : crypto.createHmac("sha1", key).digest("hex").slice(0, length);
}
function generateRandomIntegerHash(options, offset = 1000000) {
    const str = generateRandomHash(options);
    let result = 0;
    for (let i = 0; i < str.length; i++) {
        result = result + str.charCodeAt(i);
    }
    return result + offset;
}

/**
 * Gets the destination directory to use based on the given Rollup output options
 */
function getOutDir(cwd, options) {
    let outDir;
    if (options == null) {
        // Generate a random output directory. The idea is that this will never match any existing files on disk.
        // The reason being that Typescript may erroneously think that input files may be overwritten if 'allowJs' is true
        // and 'outDir' is '.'
        outDir = join(cwd, generateRandomHash());
    }
    else if (options.dir != null) {
        outDir = options.dir;
    }
    else if (options.file != null) {
        outDir = dirname(options.file);
    }
    else {
        outDir = cwd;
    }
    // Return the relative output directory. Default to "." if it should be equal to cwd
    const relativeToCwd = ensureRelative(cwd, outDir);
    return relativeToCwd === "" ? "." : relativeToCwd;
}

/**
 * Gets the ModuleKind to force
 */
function getForcedModuleKindOption({ pluginOptions }) {
    // Under these circumstances, TypeScript is a client of Rollup, and Rollup only understands ESM.
    // Rollup, not TypeScript, is the decider of which module system(s) to target based on the Rollup configuration.
    // Because of this, TypeScript will always be instructed to emit ESM.
    return { module: pluginOptions.typescript.ModuleKind.ESNext };
}
/**
 * Gets the ScriptTarget to force
 */
function getForcedScriptTargetOption({ pluginOptions, browserslist }) {
    // If Babel should perform the transpilation, always target the latest ECMAScript version and let Babel take care of the rest
    if (pluginOptions.transpiler === "babel") {
        return { target: pluginOptions.typescript.ScriptTarget.ESNext };
    }
    // If a Browserslist is provided, and if Typescript should perform the transpilation, decide the appropriate ECMAScript version based on the Browserslist.
    else if (browserslist != null && browserslist !== false) {
        return { target: getScriptTargetFromBrowserslist(browserslist, pluginOptions.typescript) };
    }
    // Otherwise, don't force the 'target' option
    return {};
}
/**
 * Retrieves the CompilerOptions that will be forced
 */
function getForcedCompilerOptions(options) {
    return Object.assign(Object.assign(Object.assign({}, getForcedModuleKindOption(options)), getForcedScriptTargetOption(options)), { outDir: getOutDir(options.pluginOptions.cwd), 
        // Rollup, not Typescript, is the decider of where to put files
        outFile: undefined, 
        // Always generate SourceMaps. Rollup will then decide if it wants to use them or not
        sourceMap: true, 
        // Never use inline source maps. Let Rollup inline the returned SourceMap if it can and if sourcemaps should be emitted in the OutputOptions,
        inlineSourceMap: false, 
        // Since we never use inline source maps, inline sources aren't supported
        inlineSources: false, 
        // Helpers should *always* be imported. We don't want them to be duplicated multiple times within generated chunks
        importHelpers: true, 
        // Node resolution is required when 'importHelpers' are true
        moduleResolution: options.pluginOptions.typescript.ModuleResolutionKind.NodeJs, 
        // Typescript should always be able to emit - otherwise we cannot transform source files
        noEmit: false, 
        // Typescript should always be able to emit - otherwise we cannot transform source files
        noEmitOnError: false, 
        // Typescript should always be able to emit other things than declarations - otherwise we cannot transform source files
        emitDeclarationOnly: false, 
        // Typescript should always be able to emit helpers - since we force 'importHelpers'
        noEmitHelpers: false, 
        // Typescript should always be able to resolve things - otherwise compilation will break
        noResolve: false, 
        // Typescript should never watch files. That is the job of Rollup
        watch: false, 
        // Typescript should never watch files. That is the job of Rollup
        preserveWatchOutput: false, skipLibCheck: true });
}

/**
 * Returns true if the given OutputFile represents code
 */
function isCodeOutputFile({ name }) {
    const extension = getExtension(name);
    return [SOURCE_MAP_EXTENSION, D_TS_EXTENSION, D_TS_MAP_EXTENSION].every(otherExtension => extension !== otherExtension);
}

/**
 * Returns true if the given OutputFile represents a SourceMap
 */
function isMapOutputFile({ name }) {
    const extension = getExtension(name);
    return [SOURCE_MAP_EXTENSION, D_TS_MAP_EXTENSION].some(otherExtension => extension === otherExtension);
}

/**
 * Gets a SourceDescription from the given EmitOutput
 */
function getSourceDescriptionFromEmitOutput(output) {
    const code = output.outputFiles.find(isCodeOutputFile);
    if (code == null)
        return undefined;
    const map = output.outputFiles.find(isMapOutputFile);
    // Remove the SourceMap comment from the code if it is given. Rollup is the decider of whether or not to emit SourceMaps and if they should be inlined
    const inlinedSourcemapIndex = code.text.indexOf(`\n${SOURCE_MAP_COMMENT}`);
    if (inlinedSourcemapIndex >= 0) {
        code.text = code.text.slice(0, inlinedSourcemapIndex);
    }
    return Object.assign({ code: code.text }, (map == null ? {} : { map: map.text }));
}

/**
 * Gets diagnostics for the given fileName
 */
function emitDiagnostics({ host, context, pluginOptions }) {
    const typescript = host.getTypescript();
    let diagnostics = host.getDiagnostics();
    // If there is a hook for diagnostics, call it assign the result of calling it to the local variable 'diagnostics'
    if (pluginOptions.hook.diagnostics != null) {
        diagnostics = pluginOptions.hook.diagnostics(diagnostics);
    }
    // Don't proceed if the hook returned null or undefined
    if (diagnostics == null)
        return;
    diagnostics.forEach((diagnostic) => {
        const message = typescript.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        const position = diagnostic.start == null || diagnostic.file == null ? undefined : diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        // Color-format the diagnostics
        const colorFormatted = typescript.formatDiagnosticsWithColorAndContext([diagnostic], host);
        // Provide a normalized error code
        const code = `${diagnostic.scope == null ? "TS" : diagnostic.scope}${diagnostic.code}`;
        // Provide an empty Stack. There's nothing useful in seeing the internals of this Plugin in the reported error
        const stack = "";
        // Isolate the frame
        const newLine = host.getNewLine();
        let frame = colorFormatted.slice(colorFormatted.indexOf(message) + message.length);
        // Remove the trailing newline from the frame if it has one
        if (frame.startsWith(newLine)) {
            frame = frame.slice(frame.indexOf(newLine) + newLine.length);
        }
        switch (diagnostic.category) {
            case typescript.DiagnosticCategory.Error:
                context.error(Object.assign(Object.assign(Object.assign(Object.assign({ frame,
                    code, name: code, stack }, (diagnostic.length == null ? {} : { length: diagnostic.length })), (diagnostic.file == null && position == null
                    ? {}
                    : {
                        loc: Object.assign(Object.assign(Object.assign({}, (diagnostic.file == null ? {} : { file: diagnostic.file.fileName })), (position == null ? {} : { line: position.line + 1 })), (position == null ? {} : { column: position.character + 1 }))
                    })), (diagnostic.file == null ? {} : { pos: diagnostic.file.pos })), { message }), position == null ? undefined : { line: position.line + 1, column: position.character + 1 });
                break;
            case typescript.DiagnosticCategory.Warning:
            case typescript.DiagnosticCategory.Message:
            case typescript.DiagnosticCategory.Suggestion:
                context.warn(Object.assign(Object.assign(Object.assign(Object.assign({ frame,
                    code, name: code }, (diagnostic.length == null ? {} : { length: diagnostic.length })), { loc: Object.assign(Object.assign(Object.assign({}, (diagnostic.file == null ? {} : { file: diagnostic.file.fileName })), (position == null ? {} : { line: position.line + 1 })), (position == null ? {} : { column: position.character + 1 })) }), (diagnostic.file == null ? {} : { pos: diagnostic.file.pos })), { message }), position == null ? undefined : { line: position.line + 1, column: position.character + 1 });
                break;
        }
    });
}

/**
 * Gets the extensions that are supported by Typescript, depending on whether or not to allow JS and JSON
 */
function getSupportedExtensions(allowJs, allowJson) {
    return new Set([TS_EXTENSION, TSX_EXTENSION, D_TS_EXTENSION, ...(allowJs ? [JS_EXTENSION, JSX_EXTENSION] : []), ...(allowJson ? [JSON_EXTENSION] : [])]);
}

/**
 * Returns true if the given asset is an OutputChunk
 */
function isOutputChunk(thing) {
    return !("isAsset" in thing);
}

/**
 * Takes all filenames that has been included in the given bundle
 */
function takeBundledFilesNames(bundle) {
    const bundledFilenames = new Set();
    Object.values(bundle).forEach(value => {
        if (isOutputChunk(value)) {
            Object.keys(value.modules).forEach(fileName => bundledFilenames.add(normalize(fileName)));
        }
        else {
            bundledFilenames.add(normalize(value.fileName));
        }
    });
    return bundledFilenames;
}

function getRealFileSystem(typescript) {
    return Object.assign(Object.assign({}, typescript.sys), { realpath(path) {
            return typescript.sys.realpath == null ? path : typescript.sys.realpath(path);
        },
        ensureDirectory(path) {
            return fs.statSync(path).isDirectory() ? path : nativeDirname(path);
        } });
}

/**
 * Gets normalized PluginOptions based on the given ones
 */
function getPluginOptions(options) {
    // Destructure the options and provide defaults
    const { browserslist, transpiler = "typescript", typescript = TSModule__namespace, cwd = normalize(process.cwd()), tsconfig, transformers, include = [], exclude = [], transpileOnly = false, debug = false, fileSystem = getRealFileSystem(typescript), hook = {} } = options;
    // These options will be used no matter what
    const baseOptions = {
        typescript,
        browserslist,
        cwd: ensureAbsolute(process.cwd(), cwd),
        exclude,
        include,
        transformers,
        tsconfig,
        transpileOnly,
        debug,
        fileSystem,
        hook
    };
    // If we're to use Typescript, return the Typescript-options
    if (transpiler === "typescript") {
        return Object.assign(Object.assign({}, baseOptions), { transpiler: "typescript" });
    }
    else {
        return Object.assign(Object.assign(Object.assign({}, baseOptions), ("babelConfig" in options ? { babelConfig: options.babelConfig } : {})), { transpiler: "babel" });
    }
}

function isDefined(item) {
    return item != null;
}

/**
 * Returns true if the given babelConfig is IBabelInputOptions
 */
function isBabelInputOptions(babelConfig) {
    return babelConfig != null && typeof babelConfig !== "string";
}
/**
 * Combines the given two sets of presets
 */
function combineConfigItems(userItems, defaultItems = [], forcedItems = [], inChunkPhase) {
    const namesInUserItems = new Set(userItems.map(item => { var _a; return (_a = item.file) === null || _a === void 0 ? void 0 : _a.resolved; }).filter(isDefined));
    const namesInForcedItems = new Set(forcedItems.map(item => { var _a; return (_a = item.file) === null || _a === void 0 ? void 0 : _a.resolved; }).filter(isDefined));
    const userItemsHasYearlyPreset = [...namesInUserItems].some(isYearlyBabelPreset);
    return ([
        // Only use those default items that doesn't appear within the forced items or the user-provided items.
        // If the options contains a yearly preset such as "preset-es2015", filter out preset-env from the default items if it is given
        ...defaultItems.filter(item => item.file == null ||
            (!somePathsAreRelated(namesInUserItems, item.file.resolved) &&
                !somePathsAreRelated(namesInForcedItems, item.file.resolved) &&
                (!userItemsHasYearlyPreset || !isBabelPresetEnv(item.file.resolved)))),
        // Only use those user items that doesn't appear within the forced items
        ...userItems.filter(item => item.file == null || !namesInForcedItems.has(item.file.resolved)),
        // Apply the forced items at all times
        ...forcedItems
    ]
        // Filter out those options that do not apply depending on whether or not to apply minification
        .filter(configItem => (inChunkPhase ? configItemIsAllowedDuringChunkPhase(configItem) : configItemIsAllowedDuringFilePhase(configItem))));
}
/**
 * Returns true if the given configItem is related to minification
 */
function configItemIsRelevantForChunkPhase(configItem) {
    return (BABEL_MINIFY_PRESET_NAMES.some(preset => { var _a; return (_a = configItem.file) === null || _a === void 0 ? void 0 : _a.resolved.includes(preset); }) || BABEL_MINIFY_PLUGIN_NAMES.some(plugin => { var _a; return (_a = configItem.file) === null || _a === void 0 ? void 0 : _a.resolved.includes(plugin); }));
}
/**
 * Returns true if the given configItem is allowed per chunk transformation
 */
function configItemIsAllowedDuringChunkPhase(configItem) {
    return (BABEL_MINIFICATION_BLACKLIST_PRESET_NAMES.every(preset => configItem.file == null || !configItem.file.resolved.includes(preset)) &&
        BABEL_MINIFICATION_BLACKLIST_PLUGIN_NAMES.every(plugin => configItem.file == null || !configItem.file.resolved.includes(plugin)));
}
/**
 * Returns true if the given configItem is allowed per file transformations
 */
function configItemIsAllowedDuringFilePhase(configItem) {
    return (BABEL_MINIFY_PRESET_NAMES.every(preset => configItem.file == null || !configItem.file.resolved.includes(preset)) &&
        BABEL_MINIFY_PLUGIN_NAMES.every(plugin => configItem.file == null || !configItem.file.resolved.includes(plugin)));
}
/**
 * Gets a Babel Config based on the given options
 */
function getBabelConfig({ babelConfig, cwd, forcedOptions = {}, defaultOptions = {}, browserslist, phase, hook }) {
    return (filename) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        // Load a partial Babel config based on the input options
        const partialConfig = core.loadPartialConfig(
        // If babel options are provided directly
        isBabelInputOptions(babelConfig)
            ? // If the given babelConfig is an object of input options, use that as the basis for the full config
             Object.assign({ cwd, root: cwd }, babelConfig) : // Load the path to a babel config provided to the plugin if any, otherwise try to resolve it
         Object.assign({ cwd, root: cwd, filename }, (babelConfig == null ? {} : { configFile: babelConfig })));
        if (partialConfig == null) {
            return {
                config: undefined
            };
        }
        const { options } = partialConfig;
        const { presets: forcedPresets, plugins: forcedPlugins } = forcedOptions, otherForcedOptions = tslib.__rest(forcedOptions, ["presets", "plugins"]);
        const { presets: defaultPresets, plugins: defaultPlugins } = defaultOptions, otherDefaultOptions = tslib.__rest(defaultOptions, ["presets", "plugins"]);
        const configFileOption = { configFile: false, babelrc: false };
        // If users have provided presets of their own, ensure that they are using respecting the forced options
        if (options.presets != null) {
            options.presets = options.presets.map(preset => {
                if (preset.file == null)
                    return preset;
                // Apply the forced @babel/preset-env options here
                if (isBabelPresetEnv(preset.file.resolved)) {
                    return core.createConfigItem([
                        preset.file.request,
                        Object.assign(Object.assign(Object.assign({}, (preset.options == null ? {} : preset.options)), FORCED_BABEL_PRESET_ENV_OPTIONS), (preset.options != null && preset.options.targets != null
                            ? {}
                            : {
                                targets: {
                                    browsers: browserslist
                                }
                            }))
                    ], { type: "preset", dirname: cwd });
                }
                // Apply the forced @babel/preset-es[2015|2016|2017...] options here
                else if (isYearlyBabelPreset(preset.file.resolved)) {
                    return core.createConfigItem([
                        preset.file.request,
                        Object.assign(Object.assign({}, (preset.options == null ? {} : preset.options)), FORCED_BABEL_YEARLY_PRESET_OPTIONS)
                    ], { type: "preset", dirname: cwd });
                }
                return preset;
            });
        }
        // If users have provided plugins of their own, ensure that they are using respecting the forced options
        if (options.plugins != null) {
            options.plugins = options.plugins.map((plugin) => {
                if (plugin.file == null)
                    return plugin;
                // Apply the forced @babel/preset-env options here
                if (isBabelPluginTransformRuntime(plugin.file.resolved)) {
                    return core.createConfigItem([
                        plugin.file.request,
                        Object.assign(Object.assign({}, (plugin.options == null ? {} : plugin.options)), FORCED_BABEL_PLUGIN_TRANSFORM_RUNTIME_OPTIONS)
                    ], { type: "plugin", dirname: cwd });
                }
                return plugin;
            });
        }
        // Combine the partial config with the default and forced options
        const combined = Object.assign(Object.assign(Object.assign(Object.assign({}, otherDefaultOptions), options), otherForcedOptions), { presets: combineConfigItems(((_a = options.presets) !== null && _a !== void 0 ? _a : []), defaultPresets == null ? undefined : (_c = (_b = core.loadPartialConfig(Object.assign({ presets: defaultPresets }, configFileOption))) === null || _b === void 0 ? void 0 : _b.options.presets) !== null && _c !== void 0 ? _c : undefined, forcedPresets == null ? undefined : (_e = (_d = core.loadPartialConfig(Object.assign({ presets: forcedPresets }, configFileOption))) === null || _d === void 0 ? void 0 : _d.options.presets) !== null && _e !== void 0 ? _e : undefined, phase === "chunk"), plugins: combineConfigItems(((_f = options.plugins) !== null && _f !== void 0 ? _f : []), defaultPlugins == null ? undefined : (_h = (_g = core.loadPartialConfig(Object.assign({ plugins: defaultPlugins }, configFileOption))) === null || _g === void 0 ? void 0 : _g.options.plugins) !== null && _h !== void 0 ? _h : undefined, forcedPlugins == null ? undefined : (_k = (_j = core.loadPartialConfig(Object.assign({ plugins: forcedPlugins }, configFileOption))) === null || _j === void 0 ? void 0 : _j.options.plugins) !== null && _k !== void 0 ? _k : undefined, phase === "chunk") });
        // sourceMap is an alias for 'sourceMaps'. If the user provided it, make sure it is undefined. Otherwise, Babel will fail during validation
        if ("sourceMap" in combined) {
            delete combined.sourceMap;
        }
        const combinedOptionsAfterHook = hook != null ? hook(combined, (_m = (_l = partialConfig.config) !== null && _l !== void 0 ? _l : partialConfig.babelrc) !== null && _m !== void 0 ? _m : undefined, phase) : combined;
        const loadedOptions = (_o = core.loadOptions(Object.assign(Object.assign(Object.assign({}, combinedOptionsAfterHook), { filename }), configFileOption))) !== null && _o !== void 0 ? _o : undefined;
        // Only return a config in the chunk phase if it includes at least one plugin or preset that is relevant to it
        if (phase === "chunk") {
            const hasRelevantConfigItems = loadedOptions != null &&
                [
                    ...((_p = combined.plugins) !== null && _p !== void 0 ? _p : []).filter(configItemIsRelevantForChunkPhase),
                    ...((_q = combined.presets) !== null && _q !== void 0 ? _q : []).filter(configItemIsRelevantForChunkPhase)
                ].length > 0;
            return {
                config: hasRelevantConfigItems ? loadedOptions : undefined
            };
        }
        else {
            return {
                config: loadedOptions
            };
        }
    };
}

/**
 * Retrieves the Babel config options that will be forced
 */
function getForcedBabelOptions({ cwd }) {
    return {
        // Always produce sourcemaps. Rollup will be the decider of what to do with them.
        sourceMaps: true,
        // Always use the cwd provided to the plugin
        cwd,
        // Never let Babel be the decider of which files to ignore. Rather let Rollup decide that
        ignore: undefined,
        // Never let Babel be the decider of which files to include. Rather let Rollup decide that
        only: undefined,
        // Always parse things like modules. Rollup will then decide what to do based on the output format
        sourceType: "module",
        plugins: [
            // Needed to make babel understand dynamic imports
            require.resolve("@babel/plugin-syntax-dynamic-import")
        ]
    };
}

/**
 * Returns true if the given browserslist is raw input for a Browserslist
 */
function isBrowserslistInput(browserslist) {
    return typeof browserslist === "string" || Array.isArray(browserslist);
}
/**
 * Returns true if the given browserslist is an IBrowserslistQueryConfig
 */
function isBrowserslistQueryConfig(browserslist) {
    return browserslist != null && !isBrowserslistInput(browserslist) && browserslist !== false && "query" in browserslist && browserslist.query != null;
}
/**
 * Returns true if the given browserslist is an IBrowserslistPathConfig
 */
function isBrowserslistPathConfig(browserslist) {
    return browserslist != null && !isBrowserslistInput(browserslist) && browserslist !== false && "path" in browserslist && browserslist.path != null;
}
/**
 * Gets a Browserslist based on the given options
 */
function getBrowserslist({ browserslist: browserslist$1, cwd, fileSystem }) {
    // If a Browserslist is provided directly from the options, use that
    if (browserslist$1 != null) {
        // If the Browserslist is equal to false, it should never be used. Return undefined
        if (browserslist$1 === false) {
            return false;
        }
        // If the Browserslist is some raw input queries, use them directly
        else if (isBrowserslistInput(browserslist$1)) {
            return browserslistGenerator.normalizeBrowserslist(ensureArray(browserslist$1));
        }
        // If the Browserslist is a config with raw query options, use them directly
        else if (isBrowserslistQueryConfig(browserslist$1)) {
            return browserslistGenerator.normalizeBrowserslist(ensureArray(browserslist$1.query));
        }
        // If the Browserslist is a config with a path, attempt to resolve the Browserslist from that property
        else if (isBrowserslistPathConfig(browserslist$1)) {
            const browserslistPath = ensureAbsolute(cwd, browserslist$1.path);
            const errorMessage = `The given path for a Browserslist: '${browserslistPath}' could not be resolved from '${cwd}'`;
            if (!fileSystem.fileExists(nativeNormalize(browserslistPath))) {
                throw new ReferenceError(errorMessage);
            }
            else {
                // Read the config
                const match = browserslist.readConfig(browserslistPath);
                if (match == null) {
                    throw new ReferenceError(errorMessage);
                }
                else {
                    return match.defaults;
                }
            }
        }
        // The config object could not be validated. Return undefined
        else {
            return undefined;
        }
    }
    // Otherwise, try to locate a Browserslist
    else {
        const config = browserslist.findConfig(cwd);
        return config == null ? undefined : config.defaults;
    }
}

/**
 * A Cache over resolved modules
 */
class ResolveCache {
    constructor(options) {
        this.options = options;
        /**
         * A memory-persistent cache of resolved modules for files over time
         */
        this.RESOLVE_CACHE = new Map();
    }
    /**
     * Gets the resolved path for an id from a parent
     */
    getFromCache(id, parent) {
        const parentMap = this.RESOLVE_CACHE.get(parent);
        if (parentMap == null)
            return undefined;
        return parentMap.get(id);
    }
    /**
     * Deletes the entry matching the given parent
     */
    delete(parent) {
        return this.RESOLVE_CACHE.delete(parent);
    }
    clear() {
        this.RESOLVE_CACHE.clear();
    }
    /**
     * Sets the given resolved module in the resolve cache
     */
    setInCache(result, id, parent) {
        let parentMap = this.RESOLVE_CACHE.get(parent);
        if (parentMap == null) {
            parentMap = new Map();
            this.RESOLVE_CACHE.set(parent, parentMap);
        }
        parentMap.set(id, result);
        return result;
    }
    /**
     * Resolves a module name, including internal helpers such as tslib, even if they aren't included in the language service
     */
    resolveModuleName(typescript, moduleName, containingFile, compilerOptions, host, cache, redirectedReference) {
        // Default to using Typescript's resolver directly
        return typescript.resolveModuleName(moduleName, containingFile, compilerOptions, host, cache, redirectedReference);
    }
    /**
     * Gets a cached module result for the given file from the given parent and returns it if it exists already.
     * If not, it will compute it, update the cache, and then return it
     */
    get(options) {
        const { id, parent, moduleResolutionHost } = options;
        let cacheResult = this.getFromCache(id, parent);
        const typescript = moduleResolutionHost.getTypescript();
        const compilerOptions = moduleResolutionHost.getCompilationSettings();
        const cwd = moduleResolutionHost.getCwd();
        const nonAmbientSupportedExtensions = moduleResolutionHost.getSupportedNonAmbientExtensions();
        if (cacheResult != null) {
            return cacheResult;
        }
        // Resolve the file via Typescript, either through classic or node module resolution
        const { resolvedModule } = this.resolveModuleName(typescript, id, parent, compilerOptions, moduleResolutionHost);
        // If it could not be resolved, the cache result will be equal to null
        if (resolvedModule == null) {
            cacheResult = null;
        }
        // Otherwise, proceed
        else {
            // Make sure that the path is absolute from the cwd
            resolvedModule.resolvedFileName = normalize(ensureAbsolute(cwd, resolvedModule.resolvedFileName));
            if (resolvedModule.resolvedFileName.endsWith(D_TS_EXTENSION)) {
                resolvedModule.resolvedAmbientFileName = resolvedModule.resolvedFileName;
                resolvedModule.resolvedFileName = undefined;
                resolvedModule.extension = D_TS_EXTENSION;
                if (isTslib(id)) {
                    const candidate = normalize(setExtension(resolvedModule.resolvedAmbientFileName, `.es6${JS_EXTENSION}`));
                    if (this.options.fileSystem.fileExists(nativeNormalize(candidate))) {
                        resolvedModule.resolvedFileName = candidate;
                    }
                }
                // Don't go and attempt to resolve sources for external libraries
                else if (resolvedModule.isExternalLibraryImport == null || !resolvedModule.isExternalLibraryImport) {
                    // Try to determine the resolved file name.
                    for (const extension of nonAmbientSupportedExtensions) {
                        const candidate = normalize(setExtension(resolvedModule.resolvedAmbientFileName, extension));
                        if (this.options.fileSystem.fileExists(nativeNormalize(candidate))) {
                            resolvedModule.resolvedFileName = candidate;
                            break;
                        }
                    }
                }
            }
            else {
                resolvedModule.resolvedAmbientFileName = undefined;
                const candidate = normalize(setExtension(resolvedModule.resolvedFileName, D_TS_EXTENSION));
                if (this.options.fileSystem.fileExists(nativeNormalize(candidate))) {
                    resolvedModule.resolvedAmbientFileName = candidate;
                }
            }
            cacheResult = resolvedModule;
        }
        // Store the new result in the cache
        return this.setInCache(cacheResult, id, parent);
    }
}

const REGENERATOR_SOURCE = `\
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
"use strict";

var Op = Object.prototype;
var hasOwn = Op.hasOwnProperty;
var undefined; // More compressible than void 0.
var $Symbol = typeof Symbol === "function" ? Symbol : {};
var iteratorSymbol = $Symbol.iterator || "@@iterator";
var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

function wrap(innerFn, outerFn, self, tryLocsList) {
  // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
  var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
  var generator = Object.create(protoGenerator.prototype);
  var context = new Context(tryLocsList || []);

  // The ._invoke method unifies the implementations of the .next,
  // .throw, and .return methods.
  generator._invoke = makeInvokeMethod(innerFn, self, context);

  return generator;
}

// Try/catch helper to minimize deoptimizations. Returns a completion
// record like context.tryEntries[i].completion. This interface could
// have been (and was previously) designed to take a closure to be
// invoked without arguments, but in all the cases we care about we
// already have an existing method we want to call, so there's no need
// to create a new function object. We can even get away with assuming
// the method takes exactly one argument, since that happens to be true
// in every case, so we don't have to touch the arguments object. The
// only additional allocation required is the completion record, which
// has a stable shape and so hopefully should be cheap to allocate.
function tryCatch(fn, obj, arg) {
  try {
    return { type: "normal", arg: fn.call(obj, arg) };
  } catch (err) {
    return { type: "throw", arg: err };
  }
}

var GenStateSuspendedStart = "suspendedStart";
var GenStateSuspendedYield = "suspendedYield";
var GenStateExecuting = "executing";
var GenStateCompleted = "completed";

// Returning this object from the innerFn has the same effect as
// breaking out of the dispatch switch statement.
var ContinueSentinel = {};

// Dummy constructor functions that we use as the .constructor and
// .constructor.prototype properties for functions that return Generator
// objects. For full spec compliance, you may wish to configure your
// minifier not to mangle the names of these two functions.
function Generator() {}
function GeneratorFunction() {}
function GeneratorFunctionPrototype() {}

// This is a polyfill for %IteratorPrototype% for environments that
// don't natively support it.
var IteratorPrototype = {};
IteratorPrototype[iteratorSymbol] = function () {
  return this;
};

var getProto = Object.getPrototypeOf;
var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
if (NativeIteratorPrototype &&
  NativeIteratorPrototype !== Op &&
  hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
  // This environment has a native %IteratorPrototype%; use it instead
  // of the polyfill.
  IteratorPrototype = NativeIteratorPrototype;
}

var Gp = GeneratorFunctionPrototype.prototype =
  Generator.prototype = Object.create(IteratorPrototype);
GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
GeneratorFunctionPrototype.constructor = GeneratorFunction;
GeneratorFunctionPrototype[toStringTagSymbol] =
  GeneratorFunction.displayName = "GeneratorFunction";

// Helper for defining the .next, .throw, and .return methods of the
// Iterator interface in terms of a single ._invoke method.
function defineIteratorMethods(prototype) {
  ["next", "throw", "return"].forEach(function(method) {
    prototype[method] = function(arg) {
      return this._invoke(method, arg);
    };
  });
}

function isGeneratorFunction (genFun) {
  var ctor = typeof genFun === "function" && genFun.constructor;
  return ctor
    ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction"
    : false;
};

function mark (genFun) {
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
  } else {
    genFun.__proto__ = GeneratorFunctionPrototype;
    if (!(toStringTagSymbol in genFun)) {
      genFun[toStringTagSymbol] = "GeneratorFunction";
    }
  }
  genFun.prototype = Object.create(Gp);
  return genFun;
};

// Within the body of any async function, \`await x\` is transformed to
// \`yield regeneratorRuntime.awrap(x)\`, so that the runtime can test
// \`hasOwn.call(value, "__await")\` to determine if the yielded value is
// meant to be awaited.
function awrap (arg) {
  return { __await: arg };
};

function AsyncIterator(generator, PromiseImpl) {
  function invoke(method, arg, resolve, reject) {
    var record = tryCatch(generator[method], generator, arg);
    if (record.type === "throw") {
      reject(record.arg);
    } else {
      var result = record.arg;
      var value = result.value;
      if (value &&
        typeof value === "object" &&
        hasOwn.call(value, "__await")) {
        return PromiseImpl.resolve(value.__await).then(function(value) {
          invoke("next", value, resolve, reject);
        }, function(err) {
          invoke("throw", err, resolve, reject);
        });
      }

      return PromiseImpl.resolve(value).then(function(unwrapped) {
        // When a yielded Promise is resolved, its final value becomes
        // the .value of the Promise<{value,done}> result for the
        // current iteration.
        result.value = unwrapped;
        resolve(result);
      }, function(error) {
        // If a rejected Promise was yielded, throw the rejection back
        // into the async generator function so it can be handled there.
        return invoke("throw", error, resolve, reject);
      });
    }
  }

  var previousPromise;

  function enqueue(method, arg) {
    function callInvokeWithMethodAndArg() {
      return new PromiseImpl(function(resolve, reject) {
        invoke(method, arg, resolve, reject);
      });
    }

    return previousPromise =
      // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(
        callInvokeWithMethodAndArg,
        // Avoid propagating failures to Promises returned by later
        // invocations of the iterator.
        callInvokeWithMethodAndArg
      ) : callInvokeWithMethodAndArg();
  }

  // Define the unified helper method that is used to implement .next,
  // .throw, and .return (see defineIteratorMethods).
  this._invoke = enqueue;
}

defineIteratorMethods(AsyncIterator.prototype);
AsyncIterator.prototype[asyncIteratorSymbol] = function () {
  return this;
};

// Note that simple async functions are implemented on top of
// AsyncIterator objects; they just return a Promise for the value of
// the final result produced by the iterator.
 function async (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
  if (PromiseImpl === void 0) PromiseImpl = Promise;

  var iter = new AsyncIterator(
    wrap(innerFn, outerFn, self, tryLocsList),
    PromiseImpl
  );

  return isGeneratorFunction(outerFn)
    ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function(result) {
      return result.done ? result.value : iter.next();
    });
};

function makeInvokeMethod(innerFn, self, context) {
  var state = GenStateSuspendedStart;

  return function invoke(method, arg) {
    if (state === GenStateExecuting) {
      throw new Error("Generator is already running");
    }

    if (state === GenStateCompleted) {
      if (method === "throw") {
        throw arg;
      }

      // Be forgiving, per 25.3.3.3.3 of the spec:
      // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
      return doneResult();
    }

    context.method = method;
    context.arg = arg;

    while (true) {
      var delegate = context.delegate;
      if (delegate) {
        var delegateResult = maybeInvokeDelegate(delegate, context);
        if (delegateResult) {
          if (delegateResult === ContinueSentinel) continue;
          return delegateResult;
        }
      }

      if (context.method === "next") {
        // Setting context._sent for legacy support of Babel's
        // function.sent implementation.
        context.sent = context._sent = context.arg;

      } else if (context.method === "throw") {
        if (state === GenStateSuspendedStart) {
          state = GenStateCompleted;
          throw context.arg;
        }

        context.dispatchException(context.arg);

      } else if (context.method === "return") {
        context.abrupt("return", context.arg);
      }

      state = GenStateExecuting;

      var record = tryCatch(innerFn, self, context);
      if (record.type === "normal") {
        // If an exception is thrown from innerFn, we leave state ===
        // GenStateExecuting and loop back for another invocation.
        state = context.done
          ? GenStateCompleted
          : GenStateSuspendedYield;

        if (record.arg === ContinueSentinel) {
          continue;
        }

        return {
          value: record.arg,
          done: context.done
        };

      } else if (record.type === "throw") {
        state = GenStateCompleted;
        // Dispatch the exception by looping back around to the
        // context.dispatchException(context.arg) call above.
        context.method = "throw";
        context.arg = record.arg;
      }
    }
  };
}

// Call delegate.iterator[context.method](context.arg) and handle the
// result, either by returning a { value, done } result from the
// delegate iterator, or by modifying context.method and context.arg,
// setting context.delegate to null, and returning the ContinueSentinel.
function maybeInvokeDelegate(delegate, context) {
  var method = delegate.iterator[context.method];
  if (method === undefined) {
    // A .throw or .return when the delegate iterator has no .throw
    // method always terminates the yield* loop.
    context.delegate = null;

    if (context.method === "throw") {
      // Note: ["return"] must be used for ES3 parsing compatibility.
      if (delegate.iterator["return"]) {
        // If the delegate iterator has a return method, give it a
        // chance to clean up.
        context.method = "return";
        context.arg = undefined;
        maybeInvokeDelegate(delegate, context);

        if (context.method === "throw") {
          // If maybeInvokeDelegate(context) changed context.method from
          // "return" to "throw", let that override the TypeError below.
          return ContinueSentinel;
        }
      }

      context.method = "throw";
      context.arg = new TypeError(
        "The iterator does not provide a 'throw' method");
    }

    return ContinueSentinel;
  }

  var record = tryCatch(method, delegate.iterator, context.arg);

  if (record.type === "throw") {
    context.method = "throw";
    context.arg = record.arg;
    context.delegate = null;
    return ContinueSentinel;
  }

  var info = record.arg;

  if (! info) {
    context.method = "throw";
    context.arg = new TypeError("iterator result is not an object");
    context.delegate = null;
    return ContinueSentinel;
  }

  if (info.done) {
    // Assign the result of the finished delegate to the temporary
    // variable specified by delegate.resultName (see delegateYield).
    context[delegate.resultName] = info.value;

    // Resume execution at the desired location (see delegateYield).
    context.next = delegate.nextLoc;

    // If context.method was "throw" but the delegate handled the
    // exception, let the outer generator proceed normally. If
    // context.method was "next", forget context.arg since it has been
    // "consumed" by the delegate iterator. If context.method was
    // "return", allow the original .return call to continue in the
    // outer generator.
    if (context.method !== "return") {
      context.method = "next";
      context.arg = undefined;
    }

  } else {
    // Re-yield the result returned by the delegate method.
    return info;
  }

  // The delegate iterator is finished, so forget it and continue with
  // the outer generator.
  context.delegate = null;
  return ContinueSentinel;
}

// Define Generator.prototype.{next,throw,return} in terms of the
// unified ._invoke helper method.
defineIteratorMethods(Gp);

Gp[toStringTagSymbol] = "Generator";

// A Generator should always return itself as the iterator object when the
// @@iterator function is called on it. Some browsers' implementations of the
// iterator prototype chain incorrectly implement this, causing the Generator
// object to not be returned from this call. This ensures that doesn't happen.
// See https://github.com/facebook/regenerator/issues/274 for more details.
Gp[iteratorSymbol] = function() {
  return this;
};

Gp.toString = function() {
  return "[object Generator]";
};

function pushTryEntry(locs) {
  var entry = { tryLoc: locs[0] };

  if (1 in locs) {
    entry.catchLoc = locs[1];
  }

  if (2 in locs) {
    entry.finallyLoc = locs[2];
    entry.afterLoc = locs[3];
  }

  this.tryEntries.push(entry);
}

function resetTryEntry(entry) {
  var record = entry.completion || {};
  record.type = "normal";
  delete record.arg;
  entry.completion = record;
}

function Context(tryLocsList) {
  // The root entry object (effectively a try statement without a catch
  // or a finally block) gives us a place to store values thrown from
  // locations where there is no enclosing try statement.
  this.tryEntries = [{ tryLoc: "root" }];
  tryLocsList.forEach(pushTryEntry, this);
  this.reset(true);
}

function keys (object) {
  var keys = [];
  for (var key in object) {
    keys.push(key);
  }
  keys.reverse();

  // Rather than returning an object with a next method, we keep
  // things simple and return the next function itself.
  return function next() {
    while (keys.length) {
      var key = keys.pop();
      if (key in object) {
        next.value = key;
        next.done = false;
        return next;
      }
    }

    // To avoid creating an additional object, we just hang the .value
    // and .done properties off the next function object itself. This
    // also ensures that the minifier will not anonymize the function.
    next.done = true;
    return next;
  };
};

function values(iterable) {
  if (iterable) {
    var iteratorMethod = iterable[iteratorSymbol];
    if (iteratorMethod) {
      return iteratorMethod.call(iterable);
    }

    if (typeof iterable.next === "function") {
      return iterable;
    }

    if (!isNaN(iterable.length)) {
      var i = -1, next = function next() {
        while (++i < iterable.length) {
          if (hasOwn.call(iterable, i)) {
            next.value = iterable[i];
            next.done = false;
            return next;
          }
        }

        next.value = undefined;
        next.done = true;

        return next;
      };

      return next.next = next;
    }
  }

  // Return an iterator with no values.
  return { next: doneResult };
}

function doneResult() {
  return { value: undefined, done: true };
}

Context.prototype = {
  constructor: Context,

  reset: function(skipTempReset) {
    this.prev = 0;
    this.next = 0;
    // Resetting context._sent for legacy support of Babel's
    // function.sent implementation.
    this.sent = this._sent = undefined;
    this.done = false;
    this.delegate = null;

    this.method = "next";
    this.arg = undefined;

    this.tryEntries.forEach(resetTryEntry);

    if (!skipTempReset) {
      for (var name in this) {
        // Not sure about the optimal order of these conditions:
        if (name.charAt(0) === "t" &&
          hasOwn.call(this, name) &&
          !isNaN(+name.slice(1))) {
          this[name] = undefined;
        }
      }
    }
  },

  stop: function() {
    this.done = true;

    var rootEntry = this.tryEntries[0];
    var rootRecord = rootEntry.completion;
    if (rootRecord.type === "throw") {
      throw rootRecord.arg;
    }

    return this.rval;
  },

  dispatchException: function(exception) {
    if (this.done) {
      throw exception;
    }

    var context = this;
    function handle(loc, caught) {
      record.type = "throw";
      record.arg = exception;
      context.next = loc;

      if (caught) {
        // If the dispatched exception was caught by a catch block,
        // then let that catch block handle the exception normally.
        context.method = "next";
        context.arg = undefined;
      }

      return !! caught;
    }

    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var entry = this.tryEntries[i];
      var record = entry.completion;

      if (entry.tryLoc === "root") {
        // Exception thrown outside of any try block that could handle
        // it, so set the completion value of the entire function to
        // throw the exception.
        return handle("end");
      }

      if (entry.tryLoc <= this.prev) {
        var hasCatch = hasOwn.call(entry, "catchLoc");
        var hasFinally = hasOwn.call(entry, "finallyLoc");

        if (hasCatch && hasFinally) {
          if (this.prev < entry.catchLoc) {
            return handle(entry.catchLoc, true);
          } else if (this.prev < entry.finallyLoc) {
            return handle(entry.finallyLoc);
          }

        } else if (hasCatch) {
          if (this.prev < entry.catchLoc) {
            return handle(entry.catchLoc, true);
          }

        } else if (hasFinally) {
          if (this.prev < entry.finallyLoc) {
            return handle(entry.finallyLoc);
          }

        } else {
          throw new Error("try statement without catch or finally");
        }
      }
    }
  },

  abrupt: function(type, arg) {
    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var entry = this.tryEntries[i];
      if (entry.tryLoc <= this.prev &&
        hasOwn.call(entry, "finallyLoc") &&
        this.prev < entry.finallyLoc) {
        var finallyEntry = entry;
        break;
      }
    }

    if (finallyEntry &&
      (type === "break" ||
        type === "continue") &&
      finallyEntry.tryLoc <= arg &&
      arg <= finallyEntry.finallyLoc) {
      // Ignore the finally entry if control is not jumping to a
      // location outside the try/catch block.
      finallyEntry = null;
    }

    var record = finallyEntry ? finallyEntry.completion : {};
    record.type = type;
    record.arg = arg;

    if (finallyEntry) {
      this.method = "next";
      this.next = finallyEntry.finallyLoc;
      return ContinueSentinel;
    }

    return this.complete(record);
  },

  complete: function(record, afterLoc) {
    if (record.type === "throw") {
      throw record.arg;
    }

    if (record.type === "break" ||
      record.type === "continue") {
      this.next = record.arg;
    } else if (record.type === "return") {
      this.rval = this.arg = record.arg;
      this.method = "return";
      this.next = "end";
    } else if (record.type === "normal" && afterLoc) {
      this.next = afterLoc;
    }

    return ContinueSentinel;
  },

  finish: function(finallyLoc) {
    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var entry = this.tryEntries[i];
      if (entry.finallyLoc === finallyLoc) {
        this.complete(entry.completion, entry.afterLoc);
        resetTryEntry(entry);
        return ContinueSentinel;
      }
    }
  },

  "catch": function(tryLoc) {
    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var entry = this.tryEntries[i];
      if (entry.tryLoc === tryLoc) {
        var record = entry.completion;
        if (record.type === "throw") {
          var thrown = record.arg;
          resetTryEntry(entry);
        }
        return thrown;
      }
    }

    // The context.catch method must only be called with a location
    // argument that corresponds to a known catch block.
    throw new Error("illegal catch attempt");
  },

  delegateYield: function(iterable, resultName, nextLoc) {
    this.delegate = {
      iterator: values(iterable),
      resultName: resultName,
      nextLoc: nextLoc
    };

    if (this.method === "next") {
      // Deliberately forget the last sent value so that we don't
      // accidentally pass it on to the delegate.
      this.arg = undefined;
    }

    return ContinueSentinel;
  }
};

// Export a default namespace that plays well with Rollup
export default {
  wrap,
  isGeneratorFunction,
  AsyncIterator,
  mark,
  awrap,
  async,
  keys,
  values
};
`;

/**
 * Retrieves the Babel config options that will be used by default. If the user provides the same keys/presets/plugins, *they*
 * will take precedence
 */
function getDefaultBabelOptions({ browserslist }) {
    const includePresetEnv = browserslist != null;
    return {
        presets: [
            // Use @babel/preset-env when a Browserslist has been given
            ...(!includePresetEnv
                ? []
                : [
                    [
                        require.resolve("@babel/preset-env"),
                        Object.assign(Object.assign({}, FORCED_BABEL_PRESET_ENV_OPTIONS), { 
                            // Loose breaks things such as spreading an iterable that isn't an array
                            loose: false, spec: false, debug: false, ignoreBrowserslistConfig: false, shippedProposals: true, targets: {
                                browsers: browserslist
                            } })
                    ]
                ])
        ],
        plugins: [
            // If preset-env will be included, shipped proposals will be included already. If not, apply them here
            ...(includePresetEnv
                ? []
                : [
                    require.resolve("@babel/plugin-proposal-object-rest-spread"),
                    require.resolve("@babel/plugin-proposal-async-generator-functions"),
                    require.resolve("@babel/plugin-proposal-optional-catch-binding"),
                    require.resolve("@babel/plugin-proposal-unicode-property-regex"),
                    require.resolve("@babel/plugin-proposal-json-strings")
                ]),
            // Force the use of helpers (e.g. the runtime). But *don't* apply polyfills.
            [
                require.resolve("@babel/plugin-transform-runtime"),
                Object.assign(Object.assign({}, FORCED_BABEL_PLUGIN_TRANSFORM_RUNTIME_OPTIONS), { corejs: false })
            ]
        ]
    };
}

/**
 * Merges all of the given transformers
 */
function mergeTransformers(...transformers) {
    return options => {
        const instantiatedTransformers = transformers
            .filter(isDefined)
            .map((transformer) => (typeof transformer === "function" ? transformer(options) : transformer));
        const beforeTransformers = [].concat.apply([], instantiatedTransformers.map(transformer => transformer.before).filter(beforeTransformer => beforeTransformer != null));
        const afterTransformers = [].concat.apply([], instantiatedTransformers.map(transformer => transformer.after).filter(afterTransformer => afterTransformer != null));
        const afterDeclarationsTransformers = [].concat.apply([], instantiatedTransformers.map(transformer => transformer.afterDeclarations).filter(afterDeclarationTransformer => afterDeclarationTransformer != null));
        return {
            before: beforeTransformers.length === 0 ? undefined : beforeTransformers,
            after: afterTransformers.length === 0 ? undefined : afterTransformers,
            afterDeclarations: afterDeclarationsTransformers.length === 0 ? undefined : afterDeclarationsTransformers
        };
    };
}

/**
 * If a browserslist is given, that one will be used. Otherwise, if the given CompilerOptions has a 'target' property, a Browserslist
 * will be computed based on the targeted Ecma version
 */
function takeBrowserslistOrComputeBasedOnCompilerOptions(browserslist, compilerOptions, typescript) {
    if (browserslist != null && browserslist !== false) {
        // If a browserslist is given, use it
        return browserslist;
    }
    else if (browserslist === false) {
        return undefined;
    }
    else {
        // Otherwise, generate a browserslist based on the tsconfig target if given
        return compilerOptions.target == null ? undefined : browserslistGenerator.browsersWithSupportForEcmaVersion(getEcmaVersionForScriptTarget(compilerOptions.target, typescript));
    }
}

/**
 * Gets the destination directory to use for declarations based on the given CompilerOptions and Rollup output options
 */
function getDeclarationOutDir(cwd, compilerOptions, options) {
    const outDir = compilerOptions.declarationDir != null ? ensureRelative(cwd, compilerOptions.declarationDir) : getOutDir(cwd, options);
    // Default to "." if it should be equal to cwd
    return outDir === "" ? "." : outDir;
}

function applyTransformers({ transformers, visitorOptions }) {
    for (const transformer of transformers) {
        visitorOptions.sourceFile = transformer(visitorOptions);
    }
    return visitorOptions.sourceFile;
}

/**
 * Gets the chunk filename that matches the given filename. It may be the same.
 */
function getChunkFilename(module, chunks) {
    var _a;
    return (_a = getChunkForModule(module, chunks)) === null || _a === void 0 ? void 0 : _a.paths.absolute;
}
function getChunkForModule(module, chunks) {
    for (const chunk of chunks) {
        if ("has" in chunk.modules && chunk.modules.has(module)) {
            return chunk;
        }
        else if ("includes" in chunk.modules && chunk.modules.includes(module)) {
            return chunk;
        }
    }
    return undefined;
}

function formatLibReferenceDirective(libName) {
    return `/// <reference lib="${libName}" />`;
}

function formatTypeReferenceDirective(fileName) {
    return `/// <reference types="${fileName}" />`;
}

function pickResolvedModule(resolvedModule, preferAmbient) {
    var _a;
    if (preferAmbient) {
        return (_a = resolvedModule.resolvedAmbientFileName) !== null && _a !== void 0 ? _a : resolvedModule.resolvedFileName;
    }
    else {
        return resolvedModule.resolvedFileName;
    }
}

/**
 * Returns true if the given node has an Export keyword in front of it
 */
function hasExportModifier(node, typescript) {
    return node.modifiers != null && node.modifiers.some(modifier => isExportModifier(modifier, typescript));
}
/**
 * Returns true if the given node has an Declare keyword in front of it
 */
function hasDeclareModifier(node, typescript) {
    return node.modifiers != null && node.modifiers.some(modifier => isDeclareModifier(modifier, typescript));
}
/**
 * Returns true if the given modifier has an Export keyword in front of it
 */
function isExportModifier(node, typescript) {
    return node.kind === typescript.SyntaxKind.ExportKeyword;
}
/**
 * Returns true if the given modifier has an Default keyword in front of it
 */
function isDefaultModifier(node, typescript) {
    return node.kind === typescript.SyntaxKind.DefaultKeyword;
}
/**
 * Returns true if the given modifier has an declare keyword in front of it
 */
function isDeclareModifier(node, typescript) {
    return node.kind === typescript.SyntaxKind.DeclareKeyword;
}
/**
 * Removes an export modifier from the given ModifiersArray
 */
function removeExportModifier(modifiers, typescript) {
    if (modifiers == null)
        return modifiers;
    return modifiers.filter(modifier => !isExportModifier(modifier, typescript) && !isDefaultModifier(modifier, typescript));
}
/**
 * Removes a declare modifier from the given ModifiersArray
 */
function removeDeclareModifier(modifiers, typescript) {
    if (modifiers == null)
        return modifiers;
    return modifiers.filter(modifier => !isDeclareModifier(modifier, typescript));
}
/**
 * Removes an export modifier from the given ModifiersArray
 */
function ensureHasDeclareModifier(modifiers, compatFactory, typescript) {
    if (modifiers == null)
        return [compatFactory.createModifier(typescript.SyntaxKind.DeclareKeyword)];
    if (modifiers.some(m => m.kind === typescript.SyntaxKind.DeclareKeyword))
        return modifiers;
    return [compatFactory.createModifier(typescript.SyntaxKind.DeclareKeyword), ...modifiers];
}
/**
 * Returns true if the given modifiers contain the keywords 'export' and 'default'
 */
function hasDefaultExportModifier(modifiers, typescript) {
    if (modifiers == null)
        return false;
    return modifiers.some(modifier => isExportModifier(modifier, typescript)) && modifiers.some(modifier => isDefaultModifier(modifier, typescript));
}

function getImportedSymbolFromImportSpecifier(specifier, moduleSpecifier) {
    var _a;
    return {
        moduleSpecifier,
        isDefaultImport: specifier.name.text === "default",
        propertyName: (_a = specifier.propertyName) !== null && _a !== void 0 ? _a : specifier.name,
        name: specifier.name
    };
}
function getImportedSymbolFromImportClauseName(clauseName, moduleSpecifier) {
    return {
        moduleSpecifier,
        isDefaultImport: true,
        propertyName: clauseName,
        name: clauseName
    };
}
function getImportedSymbolFromNamespaceImport(namespaceImport, moduleSpecifier) {
    return {
        moduleSpecifier,
        isDefaultImport: true,
        propertyName: namespaceImport.name,
        name: namespaceImport.name
    };
}
function getExportedSymbolFromExportSpecifier(specifier, moduleSpecifier) {
    var _a;
    return {
        moduleSpecifier,
        isDefaultExport: specifier.name.text === "default",
        propertyName: (_a = specifier.propertyName) !== null && _a !== void 0 ? _a : specifier.name,
        name: specifier.name
    };
}
function createExportSpecifierFromNameAndModifiers({ name, modifiers, typescript, compatFactory }) {
    if (hasDefaultExportModifier(modifiers, typescript)) {
        const propertyNameText = name;
        const nameText = "default";
        const exportSpecifier = compatFactory.createExportSpecifier(propertyNameText === nameText ? undefined : compatFactory.createIdentifier(propertyNameText), compatFactory.createIdentifier(nameText));
        return {
            exportSpecifier,
            exportedSymbol: getExportedSymbolFromExportSpecifier(exportSpecifier, undefined)
        };
    }
    else {
        const propertyNameText = name;
        const nameText = propertyNameText;
        const exportSpecifier = compatFactory.createExportSpecifier(propertyNameText === nameText ? undefined : compatFactory.createIdentifier(propertyNameText), compatFactory.createIdentifier(nameText));
        return {
            exportSpecifier,
            exportedSymbol: getExportedSymbolFromExportSpecifier(exportSpecifier, undefined)
        };
    }
}

function visitImportDeclaration$5({ node, typescript, markAsImported }) {
    if (!typescript.isStringLiteralLike(node.moduleSpecifier))
        return;
    if (node.importClause != null) {
        if (node.importClause.name != null) {
            markAsImported(getImportedSymbolFromImportClauseName(node.importClause.name, node.moduleSpecifier.text));
        }
        if (node.importClause.namedBindings != null) {
            if (typescript.isNamespaceImport(node.importClause.namedBindings)) {
                markAsImported(getImportedSymbolFromNamespaceImport(node.importClause.namedBindings, node.moduleSpecifier.text));
            }
            else {
                // Otherwise, check all ExportSpecifiers
                for (const importSpecifier of node.importClause.namedBindings.elements) {
                    markAsImported(getImportedSymbolFromImportSpecifier(importSpecifier, node.moduleSpecifier.text));
                }
            }
        }
    }
    else {
        markAsImported({
            moduleSpecifier: node.moduleSpecifier.text,
            isClauseLessImport: true
        });
    }
}

function visitImportTypeNode$2({ node, typescript, markAsImported, continuation }) {
    if (!typescript.isLiteralTypeNode(node.argument) || !typescript.isStringLiteralLike(node.argument.literal))
        return;
    const moduleSpecifier = node.argument.literal.text;
    const name = node.qualifier == null ? undefined : typescript.isIdentifier(node.qualifier) ? node.qualifier : typescript.isIdentifier(node.qualifier.left) ? node.qualifier.left : undefined;
    if (name != null) {
        markAsImported({
            name,
            moduleSpecifier,
            isDefaultImport: false,
            propertyName: name
        });
    }
    else {
        markAsImported({
            moduleSpecifier,
            isClauseLessImport: true
        });
    }
    if (node.typeArguments != null) {
        for (const typeArgument of node.typeArguments) {
            continuation(typeArgument);
        }
    }
}

function visitModuleDeclaration$8(_a) {
    var { node } = _a, options = tslib.__rest(_a, ["node"]);
    if (node.body == null)
        return;
    return options.childContinuation(node.body);
}

function visitNode$d(_a) {
    var { node } = _a, options = tslib.__rest(_a, ["node"]);
    if (options.typescript.isImportDeclaration(node)) {
        return visitImportDeclaration$5(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isImportTypeNode(node)) {
        return visitImportTypeNode$2(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isModuleDeclaration(node)) {
        return visitModuleDeclaration$8(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.shouldDeepTraverse) {
        return options.childContinuation(node);
    }
}

function trackImportsTransformer(options) {
    const { typescript } = options;
    const importedSymbolSet = new Set();
    // Prepare some VisitorOptions
    const visitorOptions = Object.assign(Object.assign({}, options), { 
        // Optimization: We only need to traverse nested nodes inside of the SourceFile if it contains at least one ImportTypeNode (or at least what appears to be one)
        shouldDeepTraverse: options.sourceFile.text.includes("import("), markAsImported(symbol) {
            importedSymbolSet.add(symbol);
        }, childContinuation: (node) => typescript.forEachChild(node, nextNode => {
            visitNode$d(Object.assign(Object.assign({}, visitorOptions), { node: nextNode }));
        }), continuation: (node) => {
            visitNode$d(Object.assign(Object.assign({}, visitorOptions), { node }));
        } });
    typescript.forEachChild(options.sourceFile, nextNode => {
        visitorOptions.continuation(nextNode);
    });
    return importedSymbolSet;
}

function visitClassDeclaration$5(_a) {
    var { node, typescript, markAsExported } = _a, options = tslib.__rest(_a, ["node", "typescript", "markAsExported"]);
    // If the node has no export modifier, leave it as it is
    if (!hasExportModifier(node, typescript) || node.name == null)
        return;
    const { exportedSymbol } = createExportSpecifierFromNameAndModifiers(Object.assign(Object.assign({}, options), { name: node.name.text, modifiers: node.modifiers, typescript }));
    // Also mark the node as exported so that we can track it later
    markAsExported(exportedSymbol);
}

function visitClassExpression$5(_a) {
    var { node, typescript, markAsExported } = _a, options = tslib.__rest(_a, ["node", "typescript", "markAsExported"]);
    // If the node has no export modifier, leave it as it is
    if (!hasExportModifier(node, typescript) || node.name == null)
        return;
    const { exportedSymbol } = createExportSpecifierFromNameAndModifiers(Object.assign(Object.assign({}, options), { name: node.name.text, modifiers: node.modifiers, typescript }));
    // Also mark the node as exported so that we can track it later
    markAsExported(exportedSymbol);
}

function visitFunctionDeclaration$5(_a) {
    var { node, typescript, markAsExported } = _a, options = tslib.__rest(_a, ["node", "typescript", "markAsExported"]);
    // If the node has no export modifier, leave it as it is
    if (!hasExportModifier(node, typescript) || node.name == null)
        return;
    const { exportedSymbol } = createExportSpecifierFromNameAndModifiers(Object.assign(Object.assign({}, options), { name: node.name.text, modifiers: node.modifiers, typescript }));
    // Also mark the node as exported so that we can track it later
    markAsExported(exportedSymbol);
}

function visitFunctionExpression$5(_a) {
    var { node, typescript, markAsExported } = _a, options = tslib.__rest(_a, ["node", "typescript", "markAsExported"]);
    // If the node has no export modifier, leave it as it is
    if (!hasExportModifier(node, typescript) || node.name == null)
        return;
    const { exportedSymbol } = createExportSpecifierFromNameAndModifiers(Object.assign(Object.assign({}, options), { name: node.name.text, modifiers: node.modifiers, typescript }));
    // Also mark the node as exported so that we can track it later
    markAsExported(exportedSymbol);
}

function visitEnumDeclaration$5(_a) {
    var { node, typescript, markAsExported } = _a, options = tslib.__rest(_a, ["node", "typescript", "markAsExported"]);
    // If the node has no export modifier, leave it as it is
    if (!hasExportModifier(node, typescript))
        return;
    const { exportedSymbol } = createExportSpecifierFromNameAndModifiers(Object.assign(Object.assign({}, options), { name: node.name.text, modifiers: node.modifiers, typescript }));
    // Also mark the node as exported so that we can track it later
    markAsExported(exportedSymbol);
}

/**
 * Deconflicts the given BindingElement.
 */
function traceIdentifiersForBindingElement({ node, continuation }) {
    return continuation(node.name);
}

/**
 * Traces identifiers for the given ClassDeclaration.
 */
function traceIdentifiersForClassDeclaration({ node, addIdentifier }) {
    if (node.name == null)
        return;
    addIdentifier(node.name.text);
}

/**
 * Traces identifiers for the given EnumDeclaration.
 */
function traceIdentifiersForEnumDeclaration({ node, addIdentifier }) {
    addIdentifier(node.name.text);
}

/**
 * Traces identifiers for the given FunctionDeclaration.
 */
function traceIdentifiersForFunctionDeclaration({ node, addIdentifier }) {
    if (node.name == null)
        return;
    addIdentifier(node.name.text);
}

/**
 * Traces identifiers for the given ImportClause.
 */
function traceIdentifiersForImportClause({ node, addIdentifier, continuation }) {
    if (node.name != null) {
        addIdentifier(node.name.text);
    }
    if (node.namedBindings != null) {
        return continuation(node.namedBindings);
    }
}

/**
 * Traces identifiers for the given NamespaceImport.
 */
function traceIdentifiersForNamespaceImport({ node, addIdentifier }) {
    if (node.name != null) {
        addIdentifier(node.name.text);
    }
}

/**
 * Traces identifiers for the given ImportSpecifier.
 */
function traceIdentifiersForImportSpecifier({ node, addIdentifier }) {
    addIdentifier(node.name.text);
}

/**
 * Traces identifiers for the given ExportSpecifier.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function traceIdentifiersForExportSpecifier(_options) {
    // An ExportSpecifier doesn't produce any local module bindings
}

/**
 * Deconflicts the given Identifier.
 */
function traceIdentifiersForIdentifier({ node, addIdentifier }) {
    addIdentifier(node.text);
}

/**
 * Traces identifiers for the given InterfaceDeclaration.
 */
function traceIdentifiersForInterfaceDeclaration({ node, addIdentifier }) {
    addIdentifier(node.name.text);
}

/**
 * Traces identifiers for the given TypeAliasDeclaration.
 */
function traceIdentifiersForTypeAliasDeclaration({ node, addIdentifier }) {
    if (node.name == null)
        return;
    addIdentifier(node.name.text);
}

/**
 * Deconflicts the given VariableDeclaration.
 */
function traceIdentifiersForVariableDeclaration({ node, continuation }) {
    continuation(node.name);
}

/**
 * Traces identifiers for the given ExportAssignment.
 */
function traceIdentifiersForExportAssignment({ node, continuation }) {
    continuation(node.expression);
}

/**
 * Traces identifiers for the given CallExpression.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function traceIdentifiersForCallExpression(_options) {
    // Do nothing
}

/**
 * Traces identifiers for the given NewExpression.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function traceIdentifiersForNewExpression(_options) {
    // Do nothing
}

/**
 * Traces identifiers for the given Node, potentially generating new unique variable names for them
 */
function traceIdentifiersForNode(_a) {
    var { node } = _a, options = tslib.__rest(_a, ["node"]);
    if (options.typescript.isBindingElement(node))
        traceIdentifiersForBindingElement(Object.assign(Object.assign({}, options), { node }));
    else if (options.typescript.isClassDeclaration(node))
        traceIdentifiersForClassDeclaration(Object.assign(Object.assign({}, options), { node }));
    else if (options.typescript.isEnumDeclaration(node))
        traceIdentifiersForEnumDeclaration(Object.assign(Object.assign({}, options), { node }));
    else if (options.typescript.isFunctionDeclaration(node))
        traceIdentifiersForFunctionDeclaration(Object.assign(Object.assign({}, options), { node }));
    else if (options.typescript.isImportClause(node))
        traceIdentifiersForImportClause(Object.assign(Object.assign({}, options), { node }));
    else if (options.typescript.isNamespaceImport(node))
        traceIdentifiersForNamespaceImport(Object.assign(Object.assign({}, options), { node }));
    else if (options.typescript.isImportSpecifier(node))
        traceIdentifiersForImportSpecifier(Object.assign(Object.assign({}, options), { node }));
    else if (options.typescript.isExportSpecifier(node))
        traceIdentifiersForExportSpecifier(Object.assign(Object.assign({}, options), { node }));
    else if (options.typescript.isIdentifier(node))
        traceIdentifiersForIdentifier(Object.assign(Object.assign({}, options), { node }));
    else if (options.typescript.isInterfaceDeclaration(node))
        traceIdentifiersForInterfaceDeclaration(Object.assign(Object.assign({}, options), { node }));
    else if (options.typescript.isTypeAliasDeclaration(node))
        traceIdentifiersForTypeAliasDeclaration(Object.assign(Object.assign({}, options), { node }));
    else if (options.typescript.isVariableDeclaration(node))
        traceIdentifiersForVariableDeclaration(Object.assign(Object.assign({}, options), { node }));
    else if (options.typescript.isExportAssignment(node))
        traceIdentifiersForExportAssignment(Object.assign(Object.assign({}, options), { node }));
    else if (options.typescript.isCallExpression(node))
        traceIdentifiersForCallExpression(Object.assign(Object.assign({}, options), { node }));
    else if (options.typescript.isNewExpression(node))
        traceIdentifiersForNewExpression(Object.assign(Object.assign({}, options), { node }));
    else
        options.childContinuation(node);
}

function traceIdentifiers(_a, identifiers = new Set()) {
    var { node } = _a, rest = tslib.__rest(_a, ["node"]);
    return getIdentifiers(Object.assign(Object.assign({}, rest), { node }), identifiers);
}
function getIdentifiers(_a, identifiers) {
    var { node } = _a, rest = tslib.__rest(_a, ["node"]);
    traceIdentifiersForNode(Object.assign(Object.assign({}, rest), { node, continuation: nextNode => getIdentifiers(Object.assign(Object.assign({}, rest), { node: nextNode }), identifiers), childContinuation: nextNode => rest.typescript.forEachChild(nextNode, nextNextNode => {
            getIdentifiers(Object.assign(Object.assign({}, rest), { node: nextNextNode }), identifiers);
        }), addIdentifier(name) {
            identifiers.add(name);
        } }));
    return identifiers;
}

function visitVariableStatement$5(_a) {
    var { node, typescript, sourceFile, markAsExported } = _a, options = tslib.__rest(_a, ["node", "typescript", "sourceFile", "markAsExported"]);
    // If the node has no export modifier, leave it as it is
    if (!hasExportModifier(node, typescript))
        return;
    const identifiers = traceIdentifiers({ node, sourceFile, typescript });
    for (const identifier of identifiers) {
        const { exportedSymbol } = createExportSpecifierFromNameAndModifiers(Object.assign(Object.assign({}, options), { name: identifier, modifiers: node.modifiers, typescript }));
        // Also mark the node as exported so that we can track it later
        markAsExported(exportedSymbol);
    }
}

function visitInterfaceDeclaration$5(_a) {
    var { node, typescript, markAsExported } = _a, options = tslib.__rest(_a, ["node", "typescript", "markAsExported"]);
    // If the node has no export modifier, leave it as it is
    if (!hasExportModifier(node, typescript))
        return;
    const { exportedSymbol } = createExportSpecifierFromNameAndModifiers(Object.assign(Object.assign({}, options), { name: node.name.text, modifiers: node.modifiers, typescript }));
    // Also mark the node as exported so that we can track it later
    markAsExported(exportedSymbol);
}

function visitModuleDeclaration$7(_a) {
    var { node, typescript, markAsExported } = _a, options = tslib.__rest(_a, ["node", "typescript", "markAsExported"]);
    // If the node has no export modifier, leave it as it is
    if (!hasExportModifier(node, typescript)) {
        if (node.body != null)
            return options.childContinuation(node.body);
        else
            return;
    }
    const { exportedSymbol } = createExportSpecifierFromNameAndModifiers(Object.assign(Object.assign({}, options), { name: node.name.text, modifiers: node.modifiers, typescript }));
    // Also mark the node as exported so that we can track it later
    markAsExported(exportedSymbol);
}

function visitTypeAliasDeclaration$5(_a) {
    var { node, typescript, markAsExported } = _a, options = tslib.__rest(_a, ["node", "typescript", "markAsExported"]);
    // If the node has no export modifier, leave it as it is
    if (!hasExportModifier(node, typescript))
        return;
    const { exportedSymbol } = createExportSpecifierFromNameAndModifiers(Object.assign(Object.assign({}, options), { name: node.name.text, modifiers: node.modifiers, typescript }));
    // Also mark the node as exported so that we can track it later
    markAsExported(exportedSymbol);
}

function visitExportDeclaration$6({ node, typescript, markAsExported }) {
    var _a, _b;
    if (node.moduleSpecifier != null && !typescript.isStringLiteralLike(node.moduleSpecifier))
        return;
    // If there is no ExportClause, it is a NamespaceExport such as 'export * from "..."'.
    // If there is, and it is a NamespaceExport, it will be something like 'export * as Foo from "..."'
    if (node.exportClause == null || ((_a = typescript.isNamespaceExport) === null || _a === void 0 ? void 0 : _a.call(typescript, node.exportClause))) {
        // It will never make sense to have a NamespaceExport with no ModuleSpecifier, but nevertheless do the check
        if (node.moduleSpecifier != null) {
            markAsExported({
                isNamespaceExport: true,
                name: node.exportClause == null ? undefined : node.exportClause.name,
                moduleSpecifier: node.moduleSpecifier.text
            });
        }
        return;
    }
    // Otherwise, check all ExportSpecifiers
    for (const exportSpecifier of node.exportClause.elements) {
        markAsExported(getExportedSymbolFromExportSpecifier(exportSpecifier, (_b = node.moduleSpecifier) === null || _b === void 0 ? void 0 : _b.text));
    }
}

function visitExportAssignment$3(options) {
    const { node, typescript, markAsExported } = options;
    const identifier = typescript.isIdentifier(node.expression) ? node.expression : undefined;
    if (identifier != null) {
        markAsExported({
            isDefaultExport: true,
            moduleSpecifier: undefined,
            name: identifier,
            propertyName: identifier
        });
    }
}

function visitNode$c(_a) {
    var { node } = _a, options = tslib.__rest(_a, ["node"]);
    if (options.typescript.isClassDeclaration(node)) {
        return visitClassDeclaration$5(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isClassExpression(node)) {
        return visitClassExpression$5(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isFunctionDeclaration(node)) {
        return visitFunctionDeclaration$5(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isFunctionExpression(node)) {
        return visitFunctionExpression$5(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isEnumDeclaration(node)) {
        return visitEnumDeclaration$5(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isInterfaceDeclaration(node)) {
        return visitInterfaceDeclaration$5(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isTypeAliasDeclaration(node)) {
        return visitTypeAliasDeclaration$5(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isModuleDeclaration(node)) {
        return visitModuleDeclaration$7(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isVariableStatement(node)) {
        return visitVariableStatement$5(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isExportDeclaration(node)) {
        return visitExportDeclaration$6(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isExportAssignment(node)) {
        return visitExportAssignment$3(Object.assign(Object.assign({}, options), { node }));
    }
}

function trackExportsTransformer(options) {
    const { typescript } = options;
    const exportedSymbolSet = new Set();
    // Prepare some VisitorOptions
    const visitorOptions = Object.assign(Object.assign({}, options), { markAsExported(symbol) {
            exportedSymbolSet.add(symbol);
        }, childContinuation: (node) => typescript.forEachChild(node, nextNode => {
            visitNode$c(Object.assign(Object.assign({}, visitorOptions), { node: nextNode }));
        }), continuation: (node) => {
            visitNode$c(Object.assign(Object.assign({}, visitorOptions), { node }));
        } });
    typescript.forEachChild(options.sourceFile, nextNode => {
        visitorOptions.continuation(nextNode);
    });
    return exportedSymbolSet;
}

function isNodeFactory(compatFactory) {
    return !("updateSourceFileNode" in compatFactory);
}

function statsCollector(options) {
    var _a;
    const { typescript, sourceFile, declarationPaths, host, sourceFileToTypeReferencesSet } = options;
    const stats = {
        externalTypes: []
    };
    // Track all imports
    const importedSymbols = trackImportsTransformer({
        sourceFile,
        typescript
    });
    const resolveResults = [];
    // For each of the Imported Symbols, resolve them using the provided ModuleResolutionHost
    for (const importedSymbol of importedSymbols) {
        const resolved = host.resolve(importedSymbol.moduleSpecifier, declarationPaths.absolute);
        if (resolved == null)
            continue;
        resolveResults.push(Object.assign(Object.assign({}, resolved), { moduleSpecifier: importedSymbol.moduleSpecifier }));
    }
    for (const typeReference of (_a = sourceFileToTypeReferencesSet.get(sourceFile.fileName)) !== null && _a !== void 0 ? _a : new Set()) {
        const resolved = host.resolve(typeReference.moduleSpecifier, declarationPaths.absolute);
        if (resolved == null)
            continue;
        resolveResults.push(Object.assign(Object.assign({}, resolved), { moduleSpecifier: typeReference.moduleSpecifier }));
    }
    // For each resolveResult, check if they represent external dependencies, and if so, add them to the 'externalTypes' stats
    for (const resolveResult of resolveResults) {
        if (resolveResult.isExternalLibraryImport === true && resolveResult.packageId != null) {
            // If the external types already include this library, skip it
            if (stats.externalTypes.some(({ library }) => { var _a; return library === ((_a = resolveResult.packageId) === null || _a === void 0 ? void 0 : _a.name); }))
                continue;
            stats.externalTypes.push({
                library: resolveResult.packageId.name,
                version: resolveResult.packageId.version
            });
        }
    }
    return stats;
}

function needsInitialize(options) {
    return options.sourceFileToExportedSymbolSet.size === 0 || options.sourceFileToImportedSymbolSet.size === 0 || options.moduleSpecifierToSourceFileMap.size === 0;
}
function sourceFileBundler(options, ...transformers) {
    return context => bundle => {
        var _a, _b, _c;
        const { typescript } = options;
        const factory = (_a = context.factory) !== null && _a !== void 0 ? _a : undefined;
        const compatFactory = (_b = context.factory) !== null && _b !== void 0 ? _b : typescript;
        // A Bundle of SourceFiles is expected. In case the SourceFileBundler is invoked with something other than that, do an early return
        if (typescript.isSourceFile(bundle)) {
            return bundle;
        }
        const updatedSourceFiles = [];
        const entryModulesArr = [...options.chunk.entryModules];
        const sourceFileMap = new Map(bundle.sourceFiles.map(sourceFile => [sourceFile.fileName, sourceFile]));
        // Take file names for all SourceFiles
        const sourceFileNames = new Set(sourceFileMap.keys());
        const sourceFiles = [...sourceFileMap.values()];
        if (needsInitialize(options)) {
            sourceFiles.forEach(sourceFile => {
                for (const statement of sourceFile.statements) {
                    if (typescript.isModuleDeclaration(statement)) {
                        options.moduleSpecifierToSourceFileMap.set(statement.name.text, sourceFile);
                    }
                }
                options.sourceFileToImportedSymbolSet.set(sourceFile.fileName, trackImportsTransformer({
                    typescript: typescript,
                    sourceFile
                }));
                options.sourceFileToExportedSymbolSet.set(sourceFile.fileName, trackExportsTransformer({
                    typescript: typescript,
                    compatFactory,
                    sourceFile
                }));
            });
        }
        // Only consider those SourceFiles that are part of the current chunk to be emitted
        const sourceFilesForChunk = sourceFiles.filter(sourceFile => getChunkFilename(sourceFile.fileName, options.chunks) === options.chunk.paths.absolute);
        // Visit only the entry SourceFile(s)
        const entrySourceFiles = sourceFilesForChunk
            .filter(sourceFile => options.chunk.entryModules.has(sourceFile.fileName))
            .sort((a, b) => (entryModulesArr.indexOf(a.fileName) < entryModulesArr.indexOf(b.fileName) ? -1 : 1));
        const nonEntrySourceFiles = sourceFilesForChunk.filter(sourceFile => !entrySourceFiles.includes(sourceFile));
        const firstEntrySourceFile = entrySourceFiles[0];
        const otherEntrySourceFilesForChunk = entrySourceFiles.filter(entrySourceFile => entrySourceFile !== firstEntrySourceFile);
        if (firstEntrySourceFile != null) {
            // Prepare some VisitorOptions
            const visitorOptions = Object.assign(Object.assign({}, options), { context,
                factory,
                compatFactory,
                otherEntrySourceFilesForChunk, sourceFile: firstEntrySourceFile, lexicalEnvironment: {
                    parent: undefined,
                    bindings: new Map()
                }, includedSourceFiles: new Set([firstEntrySourceFile.fileName]), declarationToDeconflictedBindingMap: new Map(), preservedImports: new Map(), resolveSourceFile: (fileName, from) => {
                    for (const file of [fileName, `${fileName}/index`]) {
                        if (options.moduleSpecifierToSourceFileMap.has(file)) {
                            return options.moduleSpecifierToSourceFileMap.get(file);
                        }
                    }
                    const resolved = options.host.resolve(fileName, from);
                    if (resolved == null)
                        return undefined;
                    const pickedResolvedModule = pickResolvedModule(resolved, true);
                    const resolvedSourceFile = pickedResolvedModule == null ? undefined : sourceFileMap.get(pickedResolvedModule);
                    // Never allow resolving SourceFiles representing content not part of the compilation unit,
                    // since that would lead to module merging assuming that modules will be part of the emitted declarations
                    // even though they want, leading to undefined symbols
                    if (resolvedSourceFile == null || !sourceFileNames.has(resolvedSourceFile.fileName))
                        return undefined;
                    return resolvedSourceFile;
                } });
            // Run all transformers on the SourceFile
            let transformedSourceFile = applyTransformers({
                visitorOptions,
                transformers
            });
            // There may be additional transformers that are wrapped by this one. Run them on the transformed SourceFile rather than the entire bundle.
            if (options.wrappedTransformers != null && options.wrappedTransformers.afterDeclarations != null) {
                for (const transformerFactory of options.wrappedTransformers.afterDeclarations) {
                    const transformer = transformerFactory(context);
                    if ("transformSourceFile" in transformer) {
                        transformedSourceFile = transformer.transformSourceFile(transformedSourceFile);
                    }
                    else {
                        transformedSourceFile = transformer(transformedSourceFile);
                    }
                }
            }
            // If a declarationStats hook has been provided to the plugin, collect stats and invoke the hook with the information
            if (options.declarationStats != null) {
                Object.assign(options.declarationStats, {
                    [options.declarationPaths.fileName]: statsCollector(Object.assign(Object.assign({}, visitorOptions), { sourceFile: transformedSourceFile }))
                });
            }
            updatedSourceFiles.push(transformedSourceFile);
        }
        for (const sourceFile of [...otherEntrySourceFilesForChunk, ...nonEntrySourceFiles]) {
            updatedSourceFiles.push(isNodeFactory(compatFactory) ? compatFactory.updateSourceFile(sourceFile, [], true) : compatFactory.updateSourceFileNode(sourceFile, [], true));
        }
        // Merge lib- and type reference directives.
        const libReferenceDirectiveFileNames = new Set();
        const typeReferenceDirectiveFileNames = new Set();
        const prepends = [];
        const bundleWithSyntheticLibReferences = bundle;
        if (bundleWithSyntheticLibReferences.syntheticLibReferences != null) {
            for (const { fileName } of bundleWithSyntheticLibReferences.syntheticLibReferences) {
                libReferenceDirectiveFileNames.add(fileName);
            }
        }
        for (const updatedSourceFile of updatedSourceFiles) {
            for (const { fileName } of updatedSourceFile.libReferenceDirectives) {
                libReferenceDirectiveFileNames.add(fileName);
            }
            for (const { fileName } of updatedSourceFile.typeReferenceDirectives) {
                typeReferenceDirectiveFileNames.add(fileName);
            }
            for (const typeReferenceModule of (_c = options.sourceFileToTypeReferencesSet.get(updatedSourceFile.fileName)) !== null && _c !== void 0 ? _c : new Set()) {
                typeReferenceDirectiveFileNames.add(typeReferenceModule.moduleSpecifier);
            }
        }
        for (const fileName of libReferenceDirectiveFileNames) {
            prepends.push(typescript.createUnparsedSourceFile(formatLibReferenceDirective(fileName)));
        }
        for (const fileName of typeReferenceDirectiveFileNames) {
            prepends.push(typescript.createUnparsedSourceFile(formatTypeReferenceDirective(fileName)));
        }
        return compatFactory.updateBundle(bundle, updatedSourceFiles, prepends);
    };
}

/**
 * Calculates Levenshtein distance
 */
function similarity(a, b) {
    let tmp;
    if (a.length === 0) {
        return b.length;
    }
    if (b.length === 0) {
        return a.length;
    }
    if (a.length > b.length) {
        tmp = a;
        a = b;
        b = tmp;
    }
    let i = 0;
    let j = 0;
    let res = 0;
    const alen = a.length;
    const blen = b.length;
    const row = Array(alen);
    for (i = 0; i <= alen; i++) {
        row[i] = i;
    }
    for (i = 1; i <= blen; i++) {
        res = i;
        for (j = 1; j <= alen; j++) {
            tmp = row[j - 1];
            row[j - 1] = res;
            res = b[i - 1] === a[j - 1] ? tmp : Math.min(tmp + 1, Math.min(res + 1, row[j] + 1));
        }
    }
    return res;
}

function isSameChunk(options) {
    return generateModuleSpecifier(options) == null;
}
function generateModuleSpecifier(options) {
    const { chunk, moduleSpecifier, resolveSourceFile, chunks, from, host } = options;
    const sourceFile = resolveSourceFile(moduleSpecifier, from);
    if (sourceFile == null) {
        return moduleSpecifier;
    }
    const chunkForModuleSpecifier = getChunkFilename(sourceFile.fileName, chunks);
    // If no chunk could be located for the module specifier, it most likely marked as external.
    // Leave it exactly as it is to mimic the behavior of Rollup. Unfortunately, this is not as
    // easy as it could be, given that all module specifiers are rewritten to bare module specifiers
    // when leveraging TypeScript's 'outFile' feature, so we'll have to get a hold of the original SourceFile
    // to see what the original module specifier might have been.
    if (chunkForModuleSpecifier == null) {
        const fromSourceFile = host.getSourceFile(from);
        if (fromSourceFile == null) {
            return moduleSpecifier;
        }
        const dependencies = host.getDependenciesForFile(fromSourceFile.fileName);
        if (dependencies == null) {
            return moduleSpecifier;
        }
        // Take the most similar-looking module specifier by Levenshtein distance
        return [...dependencies]
            .filter(dependency => normalize(pickResolvedModule(dependency, true)) === normalize(sourceFile.fileName))
            .map(dependency => [dependency.moduleSpecifier, similarity(moduleSpecifier, dependency.moduleSpecifier)])
            .sort(([, a], [, b]) => (a > b ? 1 : -1))
            .map(([specifier]) => specifier)[0];
    }
    // Never allow self-referencing chunks
    if (chunkForModuleSpecifier === chunk.paths.absolute) {
        return undefined;
    }
    const relativePath = relative(dirname(chunk.paths.absolute), chunkForModuleSpecifier);
    return ensureHasLeadingDotAndPosix(stripKnownExtension(relativePath), false);
}

function getSymbolFlagsForNode(node, typescript) {
    if (typescript.isClassLike(node)) {
        return typescript.SymbolFlags.Class;
    }
    else if (typescript.isVariableDeclaration(node)) {
        return typescript.SymbolFlags.Variable;
    }
    else if (typescript.isEnumDeclaration(node)) {
        return typescript.SymbolFlags.Enum;
    }
    else if (typescript.isEnumMember(node)) {
        return typescript.SymbolFlags.EnumMember;
    }
    else if (typescript.isPropertyDeclaration(node)) {
        return typescript.SymbolFlags.Property;
    }
    else if (typescript.isGetAccessor(node)) {
        return typescript.SymbolFlags.GetAccessor;
    }
    else if (typescript.isSetAccessor(node)) {
        return typescript.SymbolFlags.SetAccessor;
    }
    else if (typescript.isFunctionLike(node)) {
        return typescript.SymbolFlags.Function;
    }
    else if (typescript.isInterfaceDeclaration(node)) {
        return typescript.SymbolFlags.Interface;
    }
    else if (typescript.isModuleDeclaration(node)) {
        return typescript.SymbolFlags.Module;
    }
    else if (typescript.isTypeLiteralNode(node)) {
        return typescript.SymbolFlags.TypeLiteral;
    }
    else if (typescript.isObjectLiteralExpression(node)) {
        return typescript.SymbolFlags.ObjectLiteral;
    }
    else if (typescript.isMethodDeclaration(node)) {
        return typescript.SymbolFlags.Method;
    }
    else if (typescript.isConstructorDeclaration(node)) {
        return typescript.SymbolFlags.Constructor;
    }
    else if (typescript.isMethodSignature(node) || typescript.isCallSignatureDeclaration(node) || typescript.isPropertySignature(node)) {
        return typescript.SymbolFlags.Signature;
    }
    else if (typescript.isTypeParameterDeclaration(node)) {
        return typescript.SymbolFlags.TypeParameter;
    }
    else if (typescript.isTypeAliasDeclaration(node)) {
        return typescript.SymbolFlags.TypeAlias;
    }
    return typescript.SymbolFlags.None;
}

function getOriginalNode(node, typescript) {
    var _a;
    if (node._original != null) {
        return getOriginalNode(node._original, typescript);
    }
    return (_a = typescript.getOriginalNode(node)) !== null && _a !== void 0 ? _a : node;
}

function getSymbolAtLocation({ node, typescript, typeChecker }) {
    var _a, _b, _c;
    const originalNode = getOriginalNode(node, typescript);
    return ((_c = (_b = (_a = originalNode._symbol) !== null && _a !== void 0 ? _a : originalNode.symbol) !== null && _b !== void 0 ? _b : typeChecker.getSymbolAtLocation(originalNode)) !== null && _c !== void 0 ? _c : typeChecker.getSymbolsInScope(originalNode, getSymbolFlagsForNode(originalNode, typescript))[0]);
}

function preserveSymbols(node, otherNode, options) {
    if (node === otherNode)
        return node;
    node._symbol = getSymbolAtLocation(Object.assign(Object.assign({}, options), { node: otherNode }));
    return node;
}
function preserveMeta(newNode, oldNode, options) {
    return tsCloneNode.preserveNode(newNode, oldNode, options);
}
function preserveParents(node, options) {
    return tsCloneNode.setParentNodes(node, { typescript: options.typescript, propertyName: "_parent", deep: true });
}
function cloneNodeWithMeta(node, options) {
    return tsCloneNode.cloneNode(node, options);
}

function cloneLexicalEnvironment(lexicalEnvironment, ...entries) {
    return {
        parent: lexicalEnvironment,
        bindings: new Map(entries)
    };
}

function visitClassDeclaration$4(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasDeclareModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateClassDeclaration(node, node.decorators, removeDeclareModifier(node.modifiers, typescript), node.name, node.typeParameters, node.heritageClauses, node.members), node, options);
}

function visitClassExpression$4(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasDeclareModifier(node, typescript))
        return node;
    return preserveMeta(isNodeFactory(compatFactory)
        ? compatFactory.updateClassExpression(node, node.decorators, removeDeclareModifier(node.modifiers, typescript), node.name, node.typeParameters, node.heritageClauses, node.members)
        : compatFactory.updateClassExpression(node, removeDeclareModifier(node.modifiers, typescript), node.name, node.typeParameters, node.heritageClauses, node.members), node, options);
}

function visitFunctionDeclaration$4(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasDeclareModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateFunctionDeclaration(node, node.decorators, removeDeclareModifier(node.modifiers, typescript), node.asteriskToken, node.name, node.typeParameters, node.parameters, node.type, node.body), node, options);
}

function visitFunctionExpression$4(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasDeclareModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateFunctionExpression(node, removeDeclareModifier(node.modifiers, typescript), node.asteriskToken, node.name, node.typeParameters, node.parameters, node.type, node.body), node, options);
}

function visitEnumDeclaration$4(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasDeclareModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateEnumDeclaration(node, node.decorators, removeDeclareModifier(node.modifiers, typescript), node.name, node.members), node, options);
}

function visitVariableStatement$4(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasDeclareModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateVariableStatement(node, removeDeclareModifier(node.modifiers, typescript), node.declarationList), node, options);
}

function visitInterfaceDeclaration$4(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasDeclareModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateInterfaceDeclaration(node, node.decorators, removeDeclareModifier(node.modifiers, typescript), node.name, node.typeParameters, node.heritageClauses, node.members), node, options);
}

function visitModuleDeclaration$6(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasDeclareModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateModuleDeclaration(node, node.decorators, removeDeclareModifier(node.modifiers, typescript), node.name, node.body), node, options);
}

function visitTypeAliasDeclaration$4(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasDeclareModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateTypeAliasDeclaration(node, node.decorators, removeDeclareModifier(node.modifiers, typescript), node.name, node.typeParameters, node.type), node, options);
}

function visitNode$b(_a) {
    var { node } = _a, options = tslib.__rest(_a, ["node"]);
    if (options.typescript.isClassDeclaration(node)) {
        return visitClassDeclaration$4(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isClassExpression(node)) {
        return visitClassExpression$4(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isFunctionDeclaration(node)) {
        return visitFunctionDeclaration$4(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isFunctionExpression(node)) {
        return visitFunctionExpression$4(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isEnumDeclaration(node)) {
        return visitEnumDeclaration$4(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isInterfaceDeclaration(node)) {
        return visitInterfaceDeclaration$4(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isTypeAliasDeclaration(node)) {
        return visitTypeAliasDeclaration$4(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isModuleDeclaration(node)) {
        return visitModuleDeclaration$6(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isVariableStatement(node)) {
        return visitVariableStatement$4(Object.assign(Object.assign({}, options), { node }));
    }
    else {
        // Only consider root-level statements here
        return node;
    }
}

function logMetrics(message, fileName) {
    const uniqueMessage = `${getFormattedDateTimePrefix()}${chalk__default['default'].green(`metrics: ${message}`)}${fileName == null ? "" : ` ${chalk__default['default'].gray(`(${fileName})`)}`}`;
    console.time(uniqueMessage);
    return {
        finish: () => console.timeEnd(uniqueMessage)
    };
}

function logTransformationStep(leadingText, name, sourceFile, printer) {
    console.log(`${getFormattedDateTimePrefix()}${chalk__default['default'].magenta(`transformer: ${leadingText} ${name}`)} ${chalk__default['default'].gray(`(${sourceFile.fileName})`)}`);
    console.log(chalk__default['default'].white(printer.printFile(sourceFile)));
}
function logTransformer(name, sourceFile, printer) {
    logTransformationStep("Before", name, sourceFile, printer);
    return {
        finish: nextSourceFile => logTransformationStep("After", name, nextSourceFile, printer)
    };
}

function ensureNoDeclareModifierTransformer(options) {
    const { typescript, context, sourceFile, pluginOptions, printer } = options;
    const fullBenchmark = shouldDebugMetrics(pluginOptions.debug, sourceFile) ? logMetrics(`Ensuring no declare modifiers`, sourceFile.fileName) : undefined;
    const transformationLog = shouldDebugSourceFile(pluginOptions.debug, sourceFile) ? logTransformer("Ensuring no declare modifiers", sourceFile, printer) : undefined;
    // Prepare some VisitorOptions
    const visitorOptions = Object.assign(Object.assign({}, options), { childContinuation: (node) => typescript.visitEachChild(node, nextNode => visitNode$b(Object.assign(Object.assign({}, visitorOptions), { node: nextNode })), context), continuation: (node) => visitNode$b(Object.assign(Object.assign({}, visitorOptions), { node })) });
    const result = preserveMeta(typescript.visitEachChild(sourceFile, nextNode => visitorOptions.continuation(nextNode), context), sourceFile, options);
    transformationLog === null || transformationLog === void 0 ? void 0 : transformationLog.finish(result);
    fullBenchmark === null || fullBenchmark === void 0 ? void 0 : fullBenchmark.finish();
    return result;
}

function visitImportDeclaration$4(options) {
    const { node, compatFactory, typescript } = options;
    // If the ModuleSpecifier is given and it isn't a string literal, leave it as it is
    if (!typescript.isStringLiteralLike(node.moduleSpecifier)) {
        return node;
    }
    // Don't include binding-less imports. This doesn't make sense inside ambient modules
    if (node.importClause == null) {
        return undefined;
    }
    // Otherwise, replace this ImportDeclaration with merged imports from the module
    const replacements = options.preserveImportedModuleIfNeeded(node.moduleSpecifier.text);
    if (replacements == null || replacements.length === 0)
        return undefined;
    const [first, ...other] = replacements;
    // Again, don't include binding-less imports. This doesn't make sense inside ambient modules
    if (first == null || first.importClause == null) {
        return undefined;
    }
    // If there is neither a default name or a single named binding, don't preserve the import
    if (first.importClause.name == null &&
        (first.importClause.namedBindings == null || (!typescript.isNamespaceImport(first.importClause.namedBindings) && first.importClause.namedBindings.elements.length < 1))) {
        return other;
    }
    return [
        compatFactory.updateImportDeclaration(node, node.decorators, node.modifiers, isNodeFactory(compatFactory)
            ? compatFactory.updateImportClause(node.importClause, first.importClause.isTypeOnly, first.importClause.name, first.importClause.namedBindings)
            : compatFactory.updateImportClause(node.importClause, first.importClause.name, first.importClause.namedBindings, first.importClause.isTypeOnly), node.moduleSpecifier),
        ...other
    ];
}

function visitExportDeclaration$5(options) {
    var _a, _b, _c;
    const { node, compatFactory, typescript } = options;
    // If the ModuleSpecifier is given and it isn't a string literal, leave it as it is
    if (node.moduleSpecifier != null && !typescript.isStringLiteralLike(node.moduleSpecifier)) {
        return node;
    }
    // Otherwise, replace this ExportDeclaration with merged exports from the module
    const replacements = options.preserveExportedModuleIfNeeded((_a = node.moduleSpecifier) === null || _a === void 0 ? void 0 : _a.text);
    if (replacements == null || replacements.length === 0)
        return undefined;
    const [first, ...other] = replacements;
    let exportClause;
    if (first.exportClause != null && typescript.isNamedExports(first.exportClause)) {
        exportClause =
            node.exportClause != null && typescript.isNamedExports(node.exportClause)
                ? compatFactory.updateNamedExports(node.exportClause, first.exportClause.elements)
                : compatFactory.createNamedExports(first.exportClause.elements);
    }
    else if (first.exportClause != null && ((_b = typescript.isNamespaceExport) === null || _b === void 0 ? void 0 : _b.call(typescript, first.exportClause))) {
        exportClause =
            node.exportClause != null && ((_c = typescript.isNamespaceExport) === null || _c === void 0 ? void 0 : _c.call(typescript, node.exportClause))
                ? compatFactory.updateNamespaceExport(node.exportClause, compatFactory.createIdentifier(first.exportClause.name.text))
                : compatFactory.createNamespaceExport(compatFactory.createIdentifier(first.exportClause.name.text));
    }
    return [
        preserveMeta(isNodeFactory(compatFactory)
            ? compatFactory.updateExportDeclaration(node, node.decorators, node.modifiers, node.isTypeOnly, exportClause, node.moduleSpecifier)
            : compatFactory.updateExportDeclaration(node, node.decorators, node.modifiers, exportClause, node.moduleSpecifier, node.isTypeOnly), node, options),
        ...other
    ];
}

function visitExportAssignment$2(options) {
    const { node, typescript } = options;
    // If the Expression isn't an identifier, leave the node as it is
    if (!typescript.isIdentifier(node.expression)) {
        return node;
    }
    // Otherwise, replace this ExportDeclaration with merged exports from the module
    return options.preserveExportedModuleIfNeeded(undefined);
}

function visitNode$a(_a) {
    var { node } = _a, options = tslib.__rest(_a, ["node"]);
    if (options.typescript.isImportDeclaration(node)) {
        return visitImportDeclaration$4(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isExportDeclaration(node)) {
        return visitExportDeclaration$5(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isExportAssignment(node)) {
        return visitExportAssignment$2(Object.assign(Object.assign({}, options), { node }));
    }
    else {
        // Only consider root-level statements here
        return node;
    }
}

function getMergedImportDeclarationsForModules(sourceFile, compatFactory, typescript) {
    const imports = sourceFile.statements.filter(typescript.isImportDeclaration);
    const moduleToImportDeclarations = new Map();
    const namedImportsFromModulesMap = new Map();
    const defaultImportsFromModulesMap = new Map();
    const namespaceImportsFromModulesMap = new Map();
    for (const importDeclaration of imports) {
        // If the ModuleSpecifier is given and it isn't a string literal, skip it
        if (!typescript.isStringLiteralLike(importDeclaration.moduleSpecifier)) {
            continue;
        }
        const specifierText = importDeclaration.moduleSpecifier.text;
        let namedImportsFromModules = namedImportsFromModulesMap.get(specifierText);
        if (namedImportsFromModules == null) {
            namedImportsFromModules = [[]];
            namedImportsFromModulesMap.set(specifierText, namedImportsFromModules);
        }
        const addAliasForNamedImport = (propertyName, alias) => {
            let collectionWithProperty = namedImportsFromModules.find(records => records.some(record => propertyName === record.propertyName && alias === record.alias));
            if (collectionWithProperty != null)
                return;
            if (propertyName === alias) {
                // append the pair to the 0-indexed collection
                const [firstCollection] = namedImportsFromModules;
                firstCollection.push({ propertyName, alias });
            }
            else {
                // Create a new collection
                collectionWithProperty = [{ propertyName, alias }];
                namedImportsFromModules.push(collectionWithProperty);
            }
        };
        let defaultImportsFromModules = defaultImportsFromModulesMap.get(specifierText);
        if (defaultImportsFromModules == null) {
            defaultImportsFromModules = new Set();
            defaultImportsFromModulesMap.set(specifierText, defaultImportsFromModules);
        }
        let namespaceImportsFromModules = namespaceImportsFromModulesMap.get(specifierText);
        if (namespaceImportsFromModules == null) {
            namespaceImportsFromModules = new Set();
            namespaceImportsFromModulesMap.set(specifierText, namespaceImportsFromModules);
        }
        if (importDeclaration.importClause != null) {
            if (importDeclaration.importClause.name != null) {
                defaultImportsFromModules.add(importDeclaration.importClause.name.text);
            }
            if (importDeclaration.importClause.namedBindings != null) {
                if (typescript.isNamespaceImport(importDeclaration.importClause.namedBindings)) {
                    namespaceImportsFromModules.add(importDeclaration.importClause.namedBindings.name.text);
                }
                else {
                    for (const element of importDeclaration.importClause.namedBindings.elements) {
                        if (element.propertyName == null) {
                            addAliasForNamedImport(element.name.text, element.name.text);
                        }
                        else {
                            addAliasForNamedImport(element.propertyName.text, element.name.text);
                        }
                    }
                }
            }
        }
    }
    // Add all default imports from the module (They may have different local names)
    for (const [module, names] of defaultImportsFromModulesMap) {
        let importDeclarationsForModule = moduleToImportDeclarations.get(module);
        if (importDeclarationsForModule == null) {
            importDeclarationsForModule = [];
            moduleToImportDeclarations.set(module, importDeclarationsForModule);
        }
        for (const name of names) {
            importDeclarationsForModule.push(preserveParents(compatFactory.createImportDeclaration(undefined, undefined, isNodeFactory(compatFactory)
                ? compatFactory.createImportClause(false, compatFactory.createIdentifier(name), undefined)
                : compatFactory.createImportClause(compatFactory.createIdentifier(name), undefined, false), compatFactory.createStringLiteral(ensureHasLeadingDotAndPosix(module))), { typescript }));
        }
    }
    // Add all namespace imports from the module (They may have different local names)
    for (const [module, names] of namespaceImportsFromModulesMap) {
        let importDeclarationsForModule = moduleToImportDeclarations.get(module);
        if (importDeclarationsForModule == null) {
            importDeclarationsForModule = [];
            moduleToImportDeclarations.set(module, importDeclarationsForModule);
        }
        for (const name of names) {
            importDeclarationsForModule.push(preserveParents(compatFactory.createImportDeclaration(undefined, undefined, isNodeFactory(compatFactory)
                ? compatFactory.createImportClause(false, undefined, compatFactory.createNamespaceImport(compatFactory.createIdentifier(name)))
                : compatFactory.createImportClause(undefined, compatFactory.createNamespaceImport(compatFactory.createIdentifier(name)), false), compatFactory.createStringLiteral(ensureHasLeadingDotAndPosix(module))), { typescript }));
        }
    }
    // Add all named imports from the module (They may have different local names)
    for (const [module, collections] of namedImportsFromModulesMap) {
        let importDeclarationsForModule = moduleToImportDeclarations.get(module);
        if (importDeclarationsForModule == null) {
            importDeclarationsForModule = [];
            moduleToImportDeclarations.set(module, importDeclarationsForModule);
        }
        for (const collection of collections) {
            // Don't add empty collections
            if (collection.length < 1)
                continue;
            importDeclarationsForModule.push(preserveParents(compatFactory.createImportDeclaration(undefined, undefined, isNodeFactory(compatFactory)
                ? compatFactory.createImportClause(false, undefined, compatFactory.createNamedImports(collection.map(record => record.propertyName !== record.alias
                    ? compatFactory.createImportSpecifier(compatFactory.createIdentifier(record.propertyName), compatFactory.createIdentifier(record.alias))
                    : compatFactory.createImportSpecifier(undefined, compatFactory.createIdentifier(record.alias)))))
                : compatFactory.createImportClause(undefined, compatFactory.createNamedImports(collection.map(record => record.propertyName !== record.alias
                    ? compatFactory.createImportSpecifier(compatFactory.createIdentifier(record.propertyName), compatFactory.createIdentifier(record.alias))
                    : compatFactory.createImportSpecifier(undefined, compatFactory.createIdentifier(record.alias)))), false), compatFactory.createStringLiteral(ensureHasLeadingDotAndPosix(module))), { typescript }));
        }
    }
    return moduleToImportDeclarations;
}

/**
 * Merges the exports based on the given Statements
 */
function getMergedExportDeclarationsForModules(sourceFile, compatFactory, typescript) {
    var _a;
    const exports = sourceFile.statements.filter(typescript.isExportDeclaration);
    const exportAssignments = sourceFile.statements.filter(typescript.isExportAssignment);
    const moduleToExportDeclarations = new Map();
    const moduleSpecifierToAliasedExportedBindings = new Map();
    const namedNamespaceExportsFromModulesMap = new Map();
    const reExportedSpecifiers = new Set();
    for (const exportAssignment of exportAssignments) {
        let aliasedExportedBindings = moduleSpecifierToAliasedExportedBindings.get(undefined);
        if (aliasedExportedBindings == null) {
            aliasedExportedBindings = new Map();
            moduleSpecifierToAliasedExportedBindings.set(undefined, aliasedExportedBindings);
        }
        // If the Expression isn't an identifier, skip this ExportAssignment
        if (!typescript.isIdentifier(exportAssignment.expression)) {
            continue;
        }
        const propertyName = exportAssignment.expression.text;
        const alias = "default";
        let setForExportedBinding = aliasedExportedBindings.get(propertyName);
        if (setForExportedBinding == null) {
            setForExportedBinding = new Set();
            aliasedExportedBindings.set(propertyName, setForExportedBinding);
        }
        setForExportedBinding.add(alias);
    }
    for (const exportDeclaration of exports) {
        // If the ModuleSpecifier is given and it isn't a string literal, leave it as it is
        if (exportDeclaration.moduleSpecifier != null && !typescript.isStringLiteralLike(exportDeclaration.moduleSpecifier)) {
            continue;
        }
        const specifierText = (_a = exportDeclaration.moduleSpecifier) === null || _a === void 0 ? void 0 : _a.text;
        let aliasedExportedBindings = moduleSpecifierToAliasedExportedBindings.get(specifierText);
        let namedNamespaceExports = specifierText == null ? undefined : namedNamespaceExportsFromModulesMap.get(specifierText);
        if (aliasedExportedBindings == null) {
            aliasedExportedBindings = new Map();
            moduleSpecifierToAliasedExportedBindings.set(specifierText, aliasedExportedBindings);
        }
        if (namedNamespaceExports == null && specifierText != null) {
            namedNamespaceExports = new Set();
            namedNamespaceExportsFromModulesMap.set(specifierText, namedNamespaceExports);
        }
        if (exportDeclaration.exportClause != null) {
            if (typescript.isNamedExports(exportDeclaration.exportClause)) {
                // Take all aliased exports
                for (const element of exportDeclaration.exportClause.elements) {
                    const propertyName = element.propertyName != null ? element.propertyName.text : element.name.text;
                    const alias = element.name.text;
                    let setForExportedBinding = aliasedExportedBindings.get(propertyName);
                    if (setForExportedBinding == null) {
                        setForExportedBinding = new Set();
                        aliasedExportedBindings.set(propertyName, setForExportedBinding);
                    }
                    setForExportedBinding.add(alias);
                }
            }
            // Otherwise, it must be a named NamespaceExport (such as 'export * as Foo from "..."')
            else if (namedNamespaceExports != null) {
                namedNamespaceExports.add(exportDeclaration.exportClause.name.text);
            }
        }
        // If it has no exportClause, it's a reexport (such as export * from "./<specifier>").
        else {
            // Don't include the same clause twice
            if (reExportedSpecifiers.has(specifierText))
                continue;
            reExportedSpecifiers.add(specifierText);
            let exportDeclarationsForModule = moduleToExportDeclarations.get(specifierText);
            if (exportDeclarationsForModule == null) {
                exportDeclarationsForModule = [];
                moduleToExportDeclarations.set(specifierText, exportDeclarationsForModule);
            }
            exportDeclarationsForModule.push(exportDeclaration);
        }
    }
    for (const [specifier, exportedBindings] of moduleSpecifierToAliasedExportedBindings) {
        if (exportedBindings.size === 0)
            continue;
        const exportSpecifiers = [];
        const bindings = new Set();
        for (const [propertyName, aliases] of exportedBindings) {
            for (const alias of aliases) {
                // If a binding, A, is exported already, it cannot be exported again.
                if (bindings.has(alias))
                    continue;
                bindings.add(alias);
                if (propertyName === alias) {
                    exportSpecifiers.push(compatFactory.createExportSpecifier(undefined, alias));
                }
                else {
                    exportSpecifiers.push(compatFactory.createExportSpecifier(propertyName, alias));
                }
            }
        }
        let exportDeclarationsForModule = moduleToExportDeclarations.get(specifier);
        if (exportDeclarationsForModule == null) {
            exportDeclarationsForModule = [];
            moduleToExportDeclarations.set(specifier, exportDeclarationsForModule);
        }
        exportDeclarationsForModule.push(preserveParents(isNodeFactory(compatFactory)
            ? compatFactory.createExportDeclaration(undefined, undefined, false, compatFactory.createNamedExports(exportSpecifiers), specifier == null ? undefined : compatFactory.createStringLiteral(ensureHasLeadingDotAndPosix(specifier)))
            : compatFactory.createExportDeclaration(undefined, undefined, compatFactory.createNamedExports(exportSpecifiers), specifier == null ? undefined : compatFactory.createStringLiteral(ensureHasLeadingDotAndPosix(specifier))), { typescript }));
    }
    // Add all named namespace exports from the module (They may have different local names)
    for (const [specifier, names] of namedNamespaceExportsFromModulesMap) {
        let exportDeclarationsForModule = moduleToExportDeclarations.get(specifier);
        if (exportDeclarationsForModule == null) {
            exportDeclarationsForModule = [];
            moduleToExportDeclarations.set(specifier, exportDeclarationsForModule);
        }
        for (const name of names) {
            exportDeclarationsForModule.push(preserveParents(isNodeFactory(compatFactory)
                ? compatFactory.createExportDeclaration(undefined, undefined, false, compatFactory.createNamespaceExport(compatFactory.createIdentifier(name)), compatFactory.createStringLiteral(ensureHasLeadingDotAndPosix(specifier)))
                : compatFactory.createExportDeclaration(undefined, undefined, compatFactory.createNamespaceExport(compatFactory.createIdentifier(name)), compatFactory.createStringLiteral(ensureHasLeadingDotAndPosix(specifier))), { typescript }));
        }
    }
    return moduleToExportDeclarations;
}

function statementMerger({ markAsModuleIfNeeded }) {
    return options => {
        const { compatFactory, typescript, context, sourceFile, pluginOptions, printer } = options;
        const fullBenchmark = shouldDebugMetrics(pluginOptions.debug, sourceFile) ? logMetrics(`Statement merging`, sourceFile.fileName) : undefined;
        const transformationLog = shouldDebugSourceFile(pluginOptions.debug, sourceFile) ? logTransformer("Statement merging", sourceFile, printer) : undefined;
        // Merge all of the imports
        const mergedImports = getMergedImportDeclarationsForModules(sourceFile, compatFactory, typescript);
        const mergedExports = getMergedExportDeclarationsForModules(sourceFile, compatFactory, typescript);
        const includedImportedModules = new Set();
        const includedExportedModules = new Set();
        // Prepare some VisitorOptions
        const visitorOptions = Object.assign(Object.assign({}, options), { preserveImportedModuleIfNeeded(module) {
                if (includedImportedModules.has(module))
                    return undefined;
                includedImportedModules.add(module);
                return mergedImports.get(module);
            },
            preserveExportedModuleIfNeeded(module) {
                if (includedExportedModules.has(module))
                    return undefined;
                includedExportedModules.add(module);
                return mergedExports.get(module);
            }, childContinuation: (node) => typescript.visitEachChild(node, nextNode => visitNode$a(Object.assign(Object.assign({}, visitorOptions), { node: nextNode })), context), continuation: (node) => visitNode$a(Object.assign(Object.assign({}, visitorOptions), { node })) });
        let result = typescript.visitEachChild(sourceFile, nextNode => visitorOptions.continuation(nextNode), context);
        const importDeclarations = result.statements.filter(typescript.isImportDeclaration);
        const exportDeclarations = result.statements.filter(statement => typescript.isExportDeclaration(statement) || typescript.isExportAssignment(statement));
        const statementsWithExportModifier = result.statements.filter(statement => hasExportModifier(statement, typescript));
        const otherStatements = result.statements.filter(statement => !typescript.isImportDeclaration(statement) && !typescript.isExportDeclaration(statement) && !typescript.isExportAssignment(statement));
        const importExportCount = importDeclarations.length + exportDeclarations.length + statementsWithExportModifier.length;
        result = preserveMeta(isNodeFactory(compatFactory)
            ? compatFactory.updateSourceFile(result, [
                ...importDeclarations,
                ...otherStatements,
                ...exportDeclarations,
                ...(importExportCount === 0 && markAsModuleIfNeeded
                    ? // Create an 'export {}' declaration to mark the declaration file as module-based if it has no imports or exports
                        [compatFactory.createExportDeclaration(undefined, undefined, false, compatFactory.createNamedExports([]))]
                    : [])
            ], result.isDeclarationFile, result.referencedFiles, result.typeReferenceDirectives, result.hasNoDefaultLib, result.libReferenceDirectives)
            : compatFactory.updateSourceFileNode(result, [
                ...importDeclarations,
                ...otherStatements,
                ...exportDeclarations,
                ...(importExportCount === 0 && markAsModuleIfNeeded
                    ? // Create an 'export {}' declaration to mark the declaration file as module-based if it has no imports or exports
                        [compatFactory.createExportDeclaration(undefined, undefined, compatFactory.createNamedExports([]))]
                    : [])
            ], result.isDeclarationFile, result.referencedFiles, result.typeReferenceDirectives, result.hasNoDefaultLib, result.libReferenceDirectives), result, options);
        transformationLog === null || transformationLog === void 0 ? void 0 : transformationLog.finish(result);
        fullBenchmark === null || fullBenchmark === void 0 ? void 0 : fullBenchmark.finish();
        return result;
    };
}

function visitImportDeclaration$3(options) {
    const { node, intentToAddImportDeclaration } = options;
    intentToAddImportDeclaration(cloneNodeWithMeta(node, options));
    return undefined;
}

function generateHintSuffix(hint) {
    switch (hint) {
        case "class":
            return "Class";
        case "function":
            return "Func";
        case "namespace":
            return "NS";
    }
}
/**
 * Generates an identifier based on the given module name
 */
function generateIdentifierName(module, hint) {
    return `${stringutil.camelCase(stripKnownExtension(basename(module)))}${generateHintSuffix(hint)}`;
}

function addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFileName, value, oldValue = value) {
    lexicalEnvironment.bindings.set(oldValue, { originalSourceFileName, value });
}

const DECONFLICT_SUFFIX = "$";
function generateUniqueBinding(lexicalEnvironment, candidate) {
    let counter = -1;
    if (lexicalEnvironment.bindings.has(candidate)) {
        const { value } = lexicalEnvironment.bindings.get(candidate);
        // If the bound value isn't identical to the candidate, it has been deconflicted previously.
        // Start from this value instead
        if (value !== candidate) {
            counter = parseInt(value.slice(candidate.length + DECONFLICT_SUFFIX.length));
        }
        return `${candidate}${DECONFLICT_SUFFIX}${counter + 1}`;
    }
    if (lexicalEnvironment.parent == null) {
        return candidate;
    }
    return generateUniqueBinding(lexicalEnvironment.parent, candidate);
}

function isIdentifierFree(lexicalEnvironment, identifier, originalSourceFileName) {
    // So long as the current lexical environment doesn't already define the provided identifier,
    // it can be declared, even if it may shadow an existing identifier from the parent chain of Lexical environments
    const binding = lexicalEnvironment.bindings.get(identifier);
    // if there is no binding, the identifier is free
    if (binding == null)
        return true;
    // Otherwise, the identifier is free if and only if it was originally declared in the same SourceFile (in which case it follows the
    // declaration merging rules outlined here: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
    return binding.originalSourceFileName === originalSourceFileName;
}

function getOriginalSourceFile(node, currentSourceFile, typescript) {
    var _a;
    const originalNode = getOriginalNode(node, typescript);
    let sourceFile = originalNode.getSourceFile();
    if (sourceFile != null)
        return sourceFile;
    if (originalNode._parent != null) {
        if (originalNode._parent.kind === typescript.SyntaxKind.SourceFile) {
            return originalNode._parent;
        }
        sourceFile = (_a = originalNode._parent) === null || _a === void 0 ? void 0 : _a.getSourceFile();
    }
    return sourceFile !== null && sourceFile !== void 0 ? sourceFile : currentSourceFile;
}

function visitExportDeclaration$4(options) {
    var _a, _b, _c, _d, _e;
    const { node, typescript, compatFactory, host, lexicalEnvironment, sourceFile, intentToAddImportDeclaration } = options;
    if (node.moduleSpecifier == null || !typescript.isStringLiteralLike(node.moduleSpecifier)) {
        return node;
    }
    // Otherwise, we'll have to generate an ImportDeclaration outside the ModuleBlock and reference it here
    if (node.exportClause == null || ((_a = typescript.isNamespaceExport) === null || _a === void 0 ? void 0 : _a.call(typescript, node.exportClause))) {
        const bindingName = generateIdentifierName(node.moduleSpecifier.text, "namespace");
        addBindingToLexicalEnvironment(lexicalEnvironment, sourceFile.fileName, bindingName);
        const resolveResult = host.resolve(node.moduleSpecifier.text, sourceFile.fileName);
        const resolvedFileName = (_b = resolveResult === null || resolveResult === void 0 ? void 0 : resolveResult.resolvedAmbientFileName) !== null && _b !== void 0 ? _b : resolveResult === null || resolveResult === void 0 ? void 0 : resolveResult.resolvedFileName;
        if (resolvedFileName == null) {
            return undefined;
        }
        const resolvedSourceFile = options.host.getSourceFile(resolvedFileName);
        if (resolvedSourceFile == null) {
            return undefined;
        }
        const originalSourceFile = getOriginalSourceFile(node, sourceFile, typescript);
        const exportedBindings = [...(_e = (_d = (_c = resolvedSourceFile.symbol) === null || _c === void 0 ? void 0 : _c.exports) === null || _d === void 0 ? void 0 : _d.keys()) !== null && _e !== void 0 ? _e : []].map(binding => isIdentifierFree(lexicalEnvironment, binding, originalSourceFile.fileName) ? [binding, binding] : [binding, generateUniqueBinding(lexicalEnvironment, binding)]);
        const namedImports = compatFactory.createNamedImports(exportedBindings.map(([name, deconflictedName]) => compatFactory.createImportSpecifier(name === deconflictedName ? undefined : compatFactory.createIdentifier(name), compatFactory.createIdentifier(deconflictedName))));
        intentToAddImportDeclaration(compatFactory.createImportDeclaration(undefined, undefined, isNodeFactory(compatFactory)
            ? compatFactory.createImportClause(false, undefined, namedImports)
            : compatFactory.createImportClause(undefined, namedImports, false), compatFactory.createStringLiteral(node.moduleSpecifier.text)));
        const namedExports = compatFactory.createNamedExports(exportedBindings.map(([name, deconflictedName]) => compatFactory.createExportSpecifier(name === deconflictedName ? undefined : compatFactory.createIdentifier(deconflictedName), compatFactory.createIdentifier(name))));
        return preserveParents(isNodeFactory(compatFactory)
            ? compatFactory.updateExportDeclaration(node, node.decorators, node.modifiers, node.isTypeOnly, namedExports, undefined)
            : compatFactory.updateExportDeclaration(node, node.decorators, node.modifiers, namedExports, undefined, node.isTypeOnly), options);
    }
    return node;
}

function visitNode$9(_a) {
    var { node } = _a, options = tslib.__rest(_a, ["node"]);
    if (options.typescript.isImportDeclaration(node)) {
        return visitImportDeclaration$3(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isExportDeclaration(node)) {
        return visitExportDeclaration$4(Object.assign(Object.assign({}, options), { node }));
    }
    else {
        // Only consider root-level statements here
        return node;
    }
}

function inlineNamespaceModuleBlockTransformer({ intentToAddImportDeclaration }) {
    return options => {
        const { typescript, context, sourceFile, pluginOptions, printer } = options;
        const fullBenchmark = shouldDebugMetrics(pluginOptions.debug, sourceFile) ? logMetrics(`Inlining ModuleBlock to be wrapped in a Namespace`, sourceFile.fileName) : undefined;
        const transformationLog = shouldDebugSourceFile(pluginOptions.debug, sourceFile) ? logTransformer("Inlining ModuleBlock to be wrapped in a Namespace", sourceFile, printer) : undefined;
        // Prepare some VisitorOptions
        const visitorOptions = Object.assign(Object.assign({}, options), { intentToAddImportDeclaration, childContinuation: (node) => typescript.visitEachChild(node, nextNode => visitNode$9(Object.assign(Object.assign({}, visitorOptions), { node: nextNode })), context), continuation: (node) => visitNode$9(Object.assign(Object.assign({}, visitorOptions), { node })) });
        const result = preserveMeta(typescript.visitEachChild(sourceFile, nextNode => visitorOptions.continuation(nextNode), context), sourceFile, options);
        transformationLog === null || transformationLog === void 0 ? void 0 : transformationLog.finish(result);
        fullBenchmark === null || fullBenchmark === void 0 ? void 0 : fullBenchmark.finish();
        return result;
    };
}

function generateExportDeclarations(options, exportDeclarations = []) {
    var _a, _b, _c;
    const { sourceFile, sourceFileToExportedSymbolSet, compatFactory, typescript } = options;
    const exportedSymbols = (_a = sourceFileToExportedSymbolSet.get(sourceFile.fileName)) !== null && _a !== void 0 ? _a : [];
    for (const symbol of exportedSymbols) {
        const matchingSourceFile = symbol.moduleSpecifier == null ? undefined : options.getMatchingSourceFile(symbol.moduleSpecifier, sourceFile);
        const generatedModuleSpecifier = symbol.moduleSpecifier == null
            ? undefined
            : generateModuleSpecifier(Object.assign(Object.assign({}, options), { from: sourceFile.fileName, moduleSpecifier: symbol.moduleSpecifier }));
        // If it is a NamespaceExport, we may need to recursively add all exports for the referenced SourceFiles
        if ("isNamespaceExport" in symbol) {
            // If no SourceFile was matched, add the Namespace Export directly.
            // If the generated moduleSpecifier is null, that's because it is a self-reference, in which case the 'export *' declaration must be skipped
            // in favor of all other named export bindings that will included anyway
            if (matchingSourceFile == null && generatedModuleSpecifier != null) {
                exportDeclarations.push(preserveParents(isNodeFactory(compatFactory)
                    ? compatFactory.createExportDeclaration(undefined, undefined, false, undefined, compatFactory.createStringLiteral(generatedModuleSpecifier))
                    : compatFactory.createExportDeclaration(undefined, undefined, undefined, compatFactory.createStringLiteral(generatedModuleSpecifier), false), { typescript }));
            }
            // Otherwise, recursively add all exports for the reexported module
            else if (matchingSourceFile != null) {
                generateExportDeclarations(Object.assign(Object.assign({}, options), { sourceFile: matchingSourceFile }), exportDeclarations);
            }
        }
        // Otherwise, we can just add an ExportDeclaration with an ExportSpecifier
        else {
            const exportSpecifier = compatFactory.createExportSpecifier(symbol.propertyName.text === symbol.name.text ? undefined : compatFactory.createIdentifier(symbol.propertyName.text), compatFactory.createIdentifier(symbol.name.text));
            exportDeclarations.push(preserveParents(isNodeFactory(compatFactory)
                ? compatFactory.createExportDeclaration(undefined, undefined, false, compatFactory.createNamedExports([exportSpecifier]), symbol.moduleSpecifier == null || generatedModuleSpecifier == null || matchingSourceFile != null
                    ? undefined
                    : compatFactory.createStringLiteral(generatedModuleSpecifier))
                : compatFactory.createExportDeclaration(undefined, undefined, compatFactory.createNamedExports([exportSpecifier]), symbol.moduleSpecifier == null || generatedModuleSpecifier == null || matchingSourceFile != null
                    ? undefined
                    : compatFactory.createStringLiteral(generatedModuleSpecifier), false), { typescript }));
            const propertyName = (_b = exportSpecifier.propertyName) !== null && _b !== void 0 ? _b : exportSpecifier.name;
            preserveSymbols(propertyName, (_c = symbol.propertyName) !== null && _c !== void 0 ? _c : symbol.name, options);
        }
    }
    return exportDeclarations;
}
function visitExportDeclaration$3(options) {
    var _a;
    const { node, compatFactory, typescript } = options;
    const moduleSpecifier = node.moduleSpecifier == null || !typescript.isStringLiteralLike(node.moduleSpecifier) ? undefined : node.moduleSpecifier.text;
    const updatedModuleSpecifier = moduleSpecifier == null
        ? undefined
        : generateModuleSpecifier(Object.assign(Object.assign({}, options), { from: options.sourceFile.fileName, moduleSpecifier }));
    const matchingSourceFile = moduleSpecifier == null ? undefined : options.getMatchingSourceFile(moduleSpecifier, options.sourceFile);
    const payload = {
        moduleSpecifier,
        matchingSourceFile
    };
    const contResult = options.childContinuation(node, payload);
    // If no SourceFile was resolved
    if (matchingSourceFile == null) {
        // If the module specifier didn't change, preserve the export as it is.
        if (moduleSpecifier === updatedModuleSpecifier || updatedModuleSpecifier == null) {
            return contResult;
        }
        // Otherwise, update the module specifier
        return preserveMeta(isNodeFactory(compatFactory)
            ? compatFactory.updateExportDeclaration(contResult, contResult.decorators, contResult.modifiers, contResult.isTypeOnly, contResult.exportClause, compatFactory.createStringLiteral(updatedModuleSpecifier))
            : compatFactory.updateExportDeclaration(contResult, contResult.decorators, contResult.modifiers, contResult.exportClause, compatFactory.createStringLiteral(updatedModuleSpecifier), contResult.isTypeOnly), contResult, options);
    }
    // If it is a binding-less NamespaceExport (such as 'export * from "..."), we'll need to add explicit named ExportSpecifiers for all of the re-exported bindings instead
    if (contResult.exportClause == null) {
        options.prependNodes(...options.includeSourceFile(matchingSourceFile));
        return generateExportDeclarations(Object.assign(Object.assign({}, options), { typescript, sourceFile: matchingSourceFile }));
    }
    // Otherwise, it if is a named NamespaceExport (such as 'export * as Foo from ".."), we can't just lose the module specifier since 'export * as Foo' isn't valid.
    // Instead, we must declare the namespace inline and add an ExportDeclaration with a named export for it
    else if ((_a = typescript.isNamespaceExport) === null || _a === void 0 ? void 0 : _a.call(typescript, contResult.exportClause)) {
        const importDeclarations = [];
        // Otherwise, prepend the nodes for the SourceFile in a namespace declaration
        const moduleBlock = compatFactory.createModuleBlock([
            ...options.includeSourceFile(matchingSourceFile, {
                allowDuplicate: true,
                allowExports: "skip-optional",
                lexicalEnvironment: cloneLexicalEnvironment(),
                transformers: [
                    ensureNoDeclareModifierTransformer,
                    statementMerger({ markAsModuleIfNeeded: false }),
                    inlineNamespaceModuleBlockTransformer({
                        intentToAddImportDeclaration: importDeclaration => {
                            importDeclarations.push(importDeclaration);
                        }
                    })
                ]
            })
        ]);
        options.prependNodes(...importDeclarations.map(importDeclaration => preserveParents(importDeclaration, options)), preserveParents(compatFactory.createModuleDeclaration(undefined, ensureHasDeclareModifier(undefined, compatFactory, typescript), compatFactory.createIdentifier(contResult.exportClause.name.text), moduleBlock, typescript.NodeFlags.Namespace), options), preserveParents(isNodeFactory(compatFactory)
            ? compatFactory.createExportDeclaration(undefined, undefined, false, compatFactory.createNamedExports([compatFactory.createExportSpecifier(undefined, compatFactory.createIdentifier(contResult.exportClause.name.text))]), undefined)
            : compatFactory.createExportDeclaration(undefined, undefined, compatFactory.createNamedExports([compatFactory.createExportSpecifier(undefined, compatFactory.createIdentifier(contResult.exportClause.name.text))]), undefined, contResult.isTypeOnly), options));
    }
    // Otherwise, preserve the continuation result, but without the ModuleSpecifier
    return preserveMeta(isNodeFactory(compatFactory)
        ? compatFactory.updateExportDeclaration(contResult, contResult.decorators, contResult.modifiers, contResult.isTypeOnly, contResult.exportClause, undefined)
        : compatFactory.updateExportDeclaration(contResult, contResult.decorators, contResult.modifiers, contResult.exportClause, undefined, contResult.isTypeOnly), contResult, options);
}

function getParentNode(node) {
    if (node._parent != null) {
        return node._parent;
    }
    return node.parent;
}
function setParentNode(node, parentNode) {
    node._parent = parentNode;
    return node;
}

function visitImportTypeNode$1(options) {
    var _a;
    const { node, compatFactory, typescript } = options;
    const moduleSpecifier = !typescript.isLiteralTypeNode(node.argument) || !typescript.isStringLiteralLike(node.argument.literal) ? undefined : node.argument.literal.text;
    const matchingSourceFile = moduleSpecifier == null ? undefined : options.getMatchingSourceFile(moduleSpecifier, options.sourceFile);
    const payload = {
        moduleSpecifier,
        matchingSourceFile
    };
    if (payload.moduleSpecifier == null)
        return options.childContinuation(node, payload);
    const contResult = options.childContinuation(node, payload);
    // If no SourceFile was resolved, preserve the export as it is.
    if (matchingSourceFile == null) {
        const generatedModuleSpecifier = moduleSpecifier == null
            ? undefined
            : generateModuleSpecifier(Object.assign(Object.assign({}, options), { from: options.sourceFile.fileName, moduleSpecifier }));
        return generatedModuleSpecifier == null
            ? contResult
            : preserveMeta(compatFactory.updateImportTypeNode(contResult, compatFactory.createLiteralTypeNode(compatFactory.createStringLiteral(generatedModuleSpecifier)), contResult.qualifier, contResult.typeArguments, contResult.isTypeOf), node, options);
    }
    let returnNode;
    // If the node has no qualifier, it imports the entire module as a namespace.
    if (contResult.qualifier == null) {
        // Generate a name for it
        const namespaceName = generateIdentifierName(matchingSourceFile.fileName, "namespace");
        const innerContent = compatFactory.createIdentifier(namespaceName);
        const importDeclarations = [];
        const moduleBlock = compatFactory.createModuleBlock([
            ...options.includeSourceFile(matchingSourceFile, {
                allowDuplicate: true,
                allowExports: "skip-optional",
                lexicalEnvironment: cloneLexicalEnvironment(),
                transformers: [
                    ensureNoDeclareModifierTransformer,
                    statementMerger({ markAsModuleIfNeeded: false }),
                    inlineNamespaceModuleBlockTransformer({
                        intentToAddImportDeclaration: importDeclaration => {
                            importDeclarations.push(importDeclaration);
                        }
                    })
                ]
            })
        ]);
        options.prependNodes(...importDeclarations.map(importDeclaration => preserveParents(importDeclaration, options)), preserveParents(compatFactory.createModuleDeclaration(undefined, ensureHasDeclareModifier(undefined, compatFactory, typescript), compatFactory.createIdentifier(namespaceName), moduleBlock, typescript.NodeFlags.Namespace), options));
        returnNode = contResult.isTypeOf != null && contResult.isTypeOf ? compatFactory.createTypeQueryNode(innerContent) : innerContent;
    }
    else {
        options.prependNodes(...options.includeSourceFile(matchingSourceFile));
        returnNode =
            contResult.isTypeOf != null && contResult.isTypeOf
                ? compatFactory.createTypeQueryNode(contResult.qualifier)
                : compatFactory.createTypeReferenceNode(contResult.qualifier, contResult.typeArguments);
    }
    preserveSymbols(returnNode, (_a = contResult.qualifier) !== null && _a !== void 0 ? _a : contResult, options);
    setParentNode(returnNode, getParentNode(node));
    return returnNode;
}

function visitImportDeclaration$2(options) {
    const { node, compatFactory, typescript } = options;
    const moduleSpecifier = node.moduleSpecifier == null || !typescript.isStringLiteralLike(node.moduleSpecifier) ? undefined : node.moduleSpecifier.text;
    const updatedModuleSpecifier = moduleSpecifier == null
        ? undefined
        : generateModuleSpecifier(Object.assign(Object.assign({}, options), { from: options.sourceFile.fileName, moduleSpecifier }));
    const matchingSourceFile = moduleSpecifier == null ? undefined : options.getMatchingSourceFile(moduleSpecifier, options.sourceFile);
    const payload = {
        moduleSpecifier,
        matchingSourceFile
    };
    const contResult = options.childContinuation(node, payload);
    if (contResult.importClause == null) {
        // Don't allow moduleSpecifier-only imports inside ambient modules
        return undefined;
    }
    // If the module specifier is to be preserved as it is, just return the continuation result
    if (moduleSpecifier === updatedModuleSpecifier || updatedModuleSpecifier == null) {
        return contResult;
    }
    // Otherwise, update the ModuleSpecifier
    return preserveMeta(compatFactory.updateImportDeclaration(contResult, contResult.decorators, contResult.modifiers, contResult.importClause, compatFactory.createStringLiteral(updatedModuleSpecifier)), contResult, options);
}

function getDeclarationFromSymbol(symbol) {
    const valueDeclaration = symbol.valueDeclaration != null ? symbol.valueDeclaration : symbol.declarations != null ? symbol.declarations[0] : undefined;
    return valueDeclaration;
}
function getAliasedDeclarationFromSymbol(symbol, typeChecker) {
    let valueDeclaration = getDeclarationFromSymbol(symbol);
    try {
        const aliasedDeclaration = typeChecker.getAliasedSymbol(symbol);
        if (aliasedDeclaration != null && (aliasedDeclaration.valueDeclaration != null || (aliasedDeclaration.declarations != null && aliasedDeclaration.declarations.length > 0))) {
            valueDeclaration = (aliasedDeclaration.valueDeclaration != null
                ? aliasedDeclaration.valueDeclaration
                : symbol.declarations != null
                    ? aliasedDeclaration.declarations[0]
                    : undefined);
        }
    }
    catch (_a) { }
    return valueDeclaration;
}
function isSymbol(node) {
    return "valueDeclaration" in node || "declarations" in node;
}
/**
 * Gets the Declaration for the given Expression
 */
function getAliasedDeclaration(options) {
    const { node, typeChecker } = options;
    let symbol;
    try {
        symbol = node == null ? undefined : isSymbol(node) ? node : getSymbolAtLocation(Object.assign(Object.assign({}, options), { node }));
    }
    catch (_a) {
        // Typescript couldn't produce a symbol for the Node
    }
    if (symbol == null)
        return undefined;
    return getAliasedDeclarationFromSymbol(symbol, typeChecker);
}
/**
 * Gets the Declaration for the given Expression
 */
function getDeclaration(options) {
    const { node } = options;
    let symbol;
    try {
        symbol = node == null ? undefined : isSymbol(node) ? node : getSymbolAtLocation(Object.assign(Object.assign({}, options), { node }));
    }
    catch (_a) {
        // Typescript couldn't produce a symbol for the Node
    }
    if (symbol == null)
        return undefined;
    return getDeclarationFromSymbol(symbol);
}
/**
 * In general, the "best" declaration is the non-aliased one, with the exception of import bindings that have been inlined in the chunk, in which case the actual declaration should be resolved and used.
 * This is where getAliasedDeclaration comes in handy.
 */
function getBestDeclaration(options) {
    const declaration = getDeclaration(options);
    if (declaration == null)
        return declaration;
    let moduleSpecifier;
    if (options.typescript.isImportSpecifier(declaration)) {
        moduleSpecifier = getParentNode(getParentNode(getParentNode(declaration))).moduleSpecifier;
    }
    else if (options.typescript.isNamespaceImport(declaration)) {
        moduleSpecifier = getParentNode(getParentNode(declaration)).moduleSpecifier;
    }
    else if (options.typescript.isImportClause(declaration)) {
        moduleSpecifier = getParentNode(declaration).moduleSpecifier;
    }
    else if (options.typescript.isIdentifier(declaration) && getParentNode(declaration) != null && options.typescript.isImportClause(getParentNode(declaration))) {
        moduleSpecifier = getParentNode(getParentNode(declaration)).moduleSpecifier;
    }
    if (moduleSpecifier == null || !options.typescript.isStringLiteralLike(moduleSpecifier)) {
        return declaration;
    }
    if (options.typescript.isStringLiteralLike(moduleSpecifier)) {
        if (isSameChunk(Object.assign(Object.assign({}, options), { moduleSpecifier: moduleSpecifier.text, from: options.sourceFile.fileName }))) {
            return getAliasedDeclaration(options);
        }
    }
    return declaration;
}

function createAliasedBinding(node, propertyName, name, typescript, compatFactory, typeChecker, lexicalEnvironment) {
    const declaration = node != null && isSymbol(node) ? getAliasedDeclarationFromSymbol(node, typeChecker) : node;
    const moduleBinding = generateUniqueBinding(lexicalEnvironment, `${propertyName}Wrapper`);
    switch (declaration === null || declaration === void 0 ? void 0 : declaration.kind) {
        case typescript.SyntaxKind.ClassDeclaration:
        case typescript.SyntaxKind.ClassExpression: {
            return [
                preserveParents(compatFactory.createModuleDeclaration(undefined, undefined, compatFactory.createIdentifier(moduleBinding), compatFactory.createModuleBlock([
                    isNodeFactory(compatFactory)
                        ? compatFactory.createExportDeclaration(undefined, undefined, false, compatFactory.createNamedExports([compatFactory.createExportSpecifier(undefined, compatFactory.createIdentifier(propertyName))]))
                        : compatFactory.createExportDeclaration(undefined, undefined, compatFactory.createNamedExports([compatFactory.createExportSpecifier(undefined, compatFactory.createIdentifier(propertyName))]))
                ])), { typescript }),
                preserveParents(compatFactory.createImportEqualsDeclaration.length === 4
                    ? compatFactory.createImportEqualsDeclaration(undefined, undefined, compatFactory.createIdentifier(name), compatFactory.createQualifiedName(compatFactory.createIdentifier(moduleBinding), compatFactory.createIdentifier(propertyName)))
                    : compatFactory.createImportEqualsDeclaration(undefined, undefined, false, compatFactory.createIdentifier(name), compatFactory.createQualifiedName(compatFactory.createIdentifier(moduleBinding), compatFactory.createIdentifier(propertyName))), { typescript })
            ];
        }
        case typescript.SyntaxKind.FunctionDeclaration:
        case typescript.SyntaxKind.FunctionExpression:
        case typescript.SyntaxKind.EnumDeclaration:
        case typescript.SyntaxKind.VariableDeclaration:
        case typescript.SyntaxKind.VariableStatement:
        case typescript.SyntaxKind.ExportAssignment: {
            return [
                preserveParents(compatFactory.createVariableStatement(ensureHasDeclareModifier(undefined, compatFactory, typescript), compatFactory.createVariableDeclarationList([
                    isNodeFactory(compatFactory)
                        ? compatFactory.createVariableDeclaration(compatFactory.createIdentifier(name), undefined, compatFactory.createTypeQueryNode(compatFactory.createIdentifier(propertyName)))
                        : compatFactory.createVariableDeclaration(compatFactory.createIdentifier(name), compatFactory.createTypeQueryNode(compatFactory.createIdentifier(propertyName)))
                ], typescript.NodeFlags.Const)), { typescript })
            ];
        }
        default: {
            return [
                preserveParents(compatFactory.createTypeAliasDeclaration(undefined, undefined, compatFactory.createIdentifier(name), undefined, compatFactory.createTypeReferenceNode(compatFactory.createIdentifier(propertyName), undefined)), { typescript })
            ];
        }
    }
}

function locateExportedSymbolForSourceFile(options, context, seenSourceFiles = new Set()) {
    seenSourceFiles.add(context.sourceFile);
    const exportedSymbols = context.sourceFileToExportedSymbolSet.get(context.sourceFile);
    if (exportedSymbols == null)
        return undefined;
    const exportedSymbolsArr = [...exportedSymbols];
    if ("defaultExport" in options && options.defaultExport) {
        return exportedSymbolsArr.find(exportedSymbol => "isDefaultExport" in exportedSymbol && exportedSymbol.isDefaultExport && (!("moduleSpecifier" in options) || exportedSymbol.moduleSpecifier === options.moduleSpecifier));
    }
    if ("namespaceExport" in options) {
        return exportedSymbolsArr.find(exportedSymbol => "isNamespaceExport" in exportedSymbol && (!("moduleSpecifier" in options) || exportedSymbol.moduleSpecifier === options.moduleSpecifier));
    }
    else {
        const matchedNamedExport = exportedSymbolsArr.find(exportedSymbol => "isDefaultExport" in exportedSymbol &&
            !exportedSymbol.isDefaultExport &&
            (!("name" in options) || exportedSymbol.name.text === options.name) &&
            (!("propertyName" in options) || exportedSymbol.propertyName.text === options.propertyName) &&
            (!("moduleSpecifier" in options) || exportedSymbol.moduleSpecifier === options.moduleSpecifier));
        if (matchedNamedExport != null) {
            return matchedNamedExport;
        }
        else {
            for (const namespaceExport of exportedSymbolsArr.filter((exportedSymbol) => "isNamespaceExport" in exportedSymbol)) {
                const sourceFile = context.resolveSourceFile(namespaceExport.moduleSpecifier, context.sourceFile);
                if (sourceFile != null && !seenSourceFiles.has(sourceFile.fileName)) {
                    const recursiveResult = locateExportedSymbolForSourceFile(options, Object.assign(Object.assign({}, context), { sourceFile: sourceFile.fileName }), seenSourceFiles);
                    if (recursiveResult != null)
                        return recursiveResult;
                }
            }
        }
    }
    return undefined;
}

function visitImportSpecifier$1(options) {
    var _a;
    const { node, payload, compatFactory, typescript } = options;
    if (payload.moduleSpecifier == null)
        return options.childContinuation(node, undefined);
    const contResult = options.childContinuation(node, undefined);
    // If no SourceFile was resolved, preserve the ImportSpecifier as-is, unless it is already included in the chunk
    if (payload.matchingSourceFile == null) {
        return options.shouldPreserveImportedSymbol(getImportedSymbolFromImportSpecifier(contResult, payload.moduleSpecifier)) ? contResult : undefined;
    }
    // Otherwise, prepend the nodes for the SourceFile
    options.prependNodes(...options.includeSourceFile(payload.matchingSourceFile));
    const propertyName = (_a = contResult.propertyName) !== null && _a !== void 0 ? _a : contResult.name;
    const exportedSymbol = propertyName.text === "default"
        ? locateExportedSymbolForSourceFile({ defaultExport: true }, Object.assign(Object.assign({}, options), { sourceFile: payload.matchingSourceFile.fileName }))
        : locateExportedSymbolForSourceFile({ defaultExport: false, name: propertyName.text }, Object.assign(Object.assign({}, options), { sourceFile: payload.matchingSourceFile.fileName }));
    if (exportedSymbol != null) {
        // If the export exports a binding from another module *that points to a file that isn't part of the current chunk*,
        // Create a new ImportDeclaration that refers to that chunk or external module
        const generatedModuleSpecifier = exportedSymbol.moduleSpecifier == null
            ? undefined
            : generateModuleSpecifier(Object.assign(Object.assign({}, options), { from: payload.matchingSourceFile.fileName, moduleSpecifier: exportedSymbol.moduleSpecifier }));
        if (exportedSymbol.moduleSpecifier != null &&
            generatedModuleSpecifier != null &&
            options.getMatchingSourceFile(exportedSymbol.moduleSpecifier, payload.matchingSourceFile) == null) {
            options.prependNodes(preserveParents(compatFactory.createImportDeclaration(undefined, undefined, isNodeFactory(compatFactory)
                ? compatFactory.createImportClause(false, undefined, compatFactory.createNamedImports([
                    compatFactory.createImportSpecifier(propertyName.text === "default"
                        ? compatFactory.createIdentifier("default")
                        : exportedSymbol.propertyName.text === contResult.name.text
                            ? undefined
                            : compatFactory.createIdentifier(exportedSymbol.propertyName.text), compatFactory.createIdentifier(contResult.name.text))
                ]))
                : compatFactory.createImportClause(undefined, compatFactory.createNamedImports([
                    compatFactory.createImportSpecifier(propertyName.text === "default"
                        ? compatFactory.createIdentifier("default")
                        : exportedSymbol.propertyName.text === contResult.name.text
                            ? undefined
                            : compatFactory.createIdentifier(exportedSymbol.propertyName.text), compatFactory.createIdentifier(contResult.name.text))
                ])), compatFactory.createStringLiteral(generatedModuleSpecifier)), options));
        }
        else if (contResult.propertyName != null) {
            const declaration = getAliasedDeclaration(Object.assign(Object.assign({}, options), { node: contResult.propertyName }));
            options.prependNodes(...createAliasedBinding(declaration, exportedSymbol.propertyName.text, contResult.name.text, typescript, compatFactory, options.typeChecker, options.lexicalEnvironment));
        }
    }
    // Don't include the ImportSpecifier
    return undefined;
}

function visitExportSpecifier(options) {
    var _a, _b;
    const { node, payload, compatFactory } = options;
    if (payload.moduleSpecifier == null)
        return options.childContinuation(node, undefined);
    const contResult = options.childContinuation(node, undefined);
    // If no SourceFile was resolved, preserve the export as it is.
    if (payload.matchingSourceFile == null) {
        return contResult;
    }
    options.prependNodes(...options.includeSourceFile(payload.matchingSourceFile));
    // Now, we might be referencing the default export from the original module, in which case this should be rewritten to point to the exact identifier
    const propertyName = (_a = contResult.propertyName) !== null && _a !== void 0 ? _a : contResult.name;
    const namedExportedSymbol = propertyName.text === "default"
        ? locateExportedSymbolForSourceFile({ defaultExport: true }, Object.assign(Object.assign({}, options), { sourceFile: payload.matchingSourceFile.fileName }))
        : (_b = locateExportedSymbolForSourceFile({ defaultExport: false, name: propertyName.text }, Object.assign(Object.assign({}, options), { sourceFile: payload.matchingSourceFile.fileName }))) !== null && _b !== void 0 ? _b : locateExportedSymbolForSourceFile({ namespaceExport: true }, Object.assign(Object.assign({}, options), { sourceFile: payload.matchingSourceFile.fileName }));
    if (namedExportedSymbol != null) {
        // If the export exports a binding from another module *that points to a file that isn't part of the current chunk*,
        // Create a new ExportDeclaration that refers to that chunk or external module
        const generatedModuleSpecifier = namedExportedSymbol.moduleSpecifier == null
            ? undefined
            : generateModuleSpecifier(Object.assign(Object.assign({}, options), { from: payload.matchingSourceFile.fileName, moduleSpecifier: namedExportedSymbol.moduleSpecifier }));
        if (namedExportedSymbol.moduleSpecifier != null &&
            generatedModuleSpecifier != null &&
            options.getMatchingSourceFile(namedExportedSymbol.moduleSpecifier, payload.matchingSourceFile) == null) {
            options.prependNodes(preserveParents(isNodeFactory(compatFactory)
                ? compatFactory.createExportDeclaration(undefined, undefined, false, compatFactory.createNamedExports([
                    compatFactory.createExportSpecifier(propertyName.text === "default"
                        ? compatFactory.createIdentifier("default")
                        : !("propertyName" in namedExportedSymbol) || namedExportedSymbol.propertyName == null || namedExportedSymbol.propertyName.text === contResult.name.text
                            ? undefined
                            : compatFactory.createIdentifier(namedExportedSymbol.propertyName.text), compatFactory.createIdentifier(contResult.name.text))
                ]), compatFactory.createStringLiteral(generatedModuleSpecifier))
                : compatFactory.createExportDeclaration(undefined, undefined, compatFactory.createNamedExports([
                    compatFactory.createExportSpecifier(propertyName.text === "default"
                        ? compatFactory.createIdentifier("default")
                        : !("propertyName" in namedExportedSymbol) || namedExportedSymbol.propertyName == null || namedExportedSymbol.propertyName.text === contResult.name.text
                            ? undefined
                            : compatFactory.createIdentifier(namedExportedSymbol.propertyName.text), compatFactory.createIdentifier(contResult.name.text))
                ]), compatFactory.createStringLiteral(generatedModuleSpecifier)), options));
            return undefined;
        }
        else if (propertyName.text === "default") {
            return preserveMeta(compatFactory.updateExportSpecifier(contResult, !("propertyName" in namedExportedSymbol) || namedExportedSymbol.propertyName == null || namedExportedSymbol.propertyName.text === contResult.name.text ? undefined : compatFactory.createIdentifier(namedExportedSymbol.propertyName.text), compatFactory.createIdentifier(contResult.name.text)), contResult, options);
        }
    }
    // Fall back to preserving the node
    return node;
}

function visitImportClause$1(options) {
    const { node, payload, compatFactory, typescript } = options;
    // If there is no moduleSpecifier, proceed from the children.
    if (payload.moduleSpecifier == null)
        return options.childContinuation(node, payload);
    const contResult = options.childContinuation(node, payload);
    if (node.name == null || contResult.name == null) {
        // If there is no name, just return the continuation result. We only concern ourselves with default imports here
        return contResult;
    }
    // If no SourceFile was resolved, preserve the ImportClause, but potentially remove the default import
    if (payload.matchingSourceFile == null) {
        // If the default import should be preserved, return the continuation result
        if (options.shouldPreserveImportedSymbol(getImportedSymbolFromImportClauseName(contResult.name, payload.moduleSpecifier))) {
            return contResult;
        }
        // Otherwise, remove the default import and remove the named bindings that was retrieved from the continuation.
        return preserveMeta(isNodeFactory(compatFactory)
            ? compatFactory.updateImportClause(contResult, contResult.isTypeOnly, undefined, contResult.namedBindings)
            : compatFactory.updateImportClause(contResult, undefined, contResult.namedBindings, contResult.isTypeOnly), contResult, options);
    }
    // Otherwise, prepend the nodes for the SourceFile
    options.prependNodes(...options.includeSourceFile(payload.matchingSourceFile));
    // Now, take the default export for the referenced module
    const defaultExportedSymbol = locateExportedSymbolForSourceFile({ defaultExport: true }, Object.assign(Object.assign({}, options), { sourceFile: payload.matchingSourceFile.fileName }));
    if (defaultExportedSymbol != null) {
        // If the default export exports a binding from another module *that points to a file that isn't part of the current chunk*,
        // Create a new ImportDeclaration that refers to that chunk or external module
        const generatedModuleSpecifier = defaultExportedSymbol.moduleSpecifier == null
            ? undefined
            : generateModuleSpecifier(Object.assign(Object.assign({}, options), { from: payload.matchingSourceFile.fileName, moduleSpecifier: defaultExportedSymbol.moduleSpecifier }));
        if (defaultExportedSymbol.moduleSpecifier != null &&
            generatedModuleSpecifier != null &&
            options.getMatchingSourceFile(defaultExportedSymbol.moduleSpecifier, payload.matchingSourceFile) == null) {
            options.prependNodes(preserveParents(compatFactory.createImportDeclaration(undefined, undefined, isNodeFactory(compatFactory)
                ? compatFactory.createImportClause(false, compatFactory.createIdentifier(contResult.name.text), undefined)
                : compatFactory.createImportClause(compatFactory.createIdentifier(contResult.name.text), undefined, false), compatFactory.createStringLiteral(generatedModuleSpecifier)), { typescript }));
        }
        // Otherwise, if the names of the ImportClause and the default export exactly matches, we don't need to do anything.
        // If they don't, we'll need to alias it
        else if (defaultExportedSymbol.propertyName.text !== contResult.name.text) {
            const declaration = getAliasedDeclaration(Object.assign(Object.assign({}, options), { node: contResult.name }));
            options.prependNodes(...createAliasedBinding(declaration, defaultExportedSymbol.propertyName.text, contResult.name.text, typescript, compatFactory, options.typeChecker, options.lexicalEnvironment));
        }
    }
    // Don't include the ImportClause
    return undefined;
}

function visitNamespaceImport$1(options) {
    const { node, compatFactory, typescript, payload } = options;
    if (payload.moduleSpecifier == null)
        return options.childContinuation(node, undefined);
    const contResult = options.childContinuation(node, undefined);
    // If no SourceFile was resolved, preserve the ImportSpecifier as-is, unless it is already included in the chunk
    if (payload.matchingSourceFile == null) {
        return options.shouldPreserveImportedSymbol(getImportedSymbolFromNamespaceImport(contResult, payload.moduleSpecifier)) ? contResult : undefined;
    }
    const importDeclarations = [];
    const moduleBlock = compatFactory.createModuleBlock([
        ...options.includeSourceFile(payload.matchingSourceFile, {
            allowDuplicate: true,
            allowExports: "skip-optional",
            lexicalEnvironment: cloneLexicalEnvironment(),
            transformers: [
                ensureNoDeclareModifierTransformer,
                statementMerger({ markAsModuleIfNeeded: false }),
                inlineNamespaceModuleBlockTransformer({
                    intentToAddImportDeclaration: importDeclaration => {
                        importDeclarations.push(importDeclaration);
                    }
                })
            ]
        })
    ]);
    // Otherwise, prepend the nodes for the SourceFile in a namespace declaration
    options.prependNodes(...importDeclarations.map(importDeclaration => preserveParents(importDeclaration, options)), preserveParents(compatFactory.createModuleDeclaration(undefined, ensureHasDeclareModifier(undefined, compatFactory, typescript), compatFactory.createIdentifier(contResult.name.text), moduleBlock, typescript.NodeFlags.Namespace), options));
    // Don't include the NamespaceImport
    return undefined;
}

function visitSourceFile(options) {
    for (const otherEntrySourceFileForChunk of options.otherEntrySourceFilesForChunk) {
        options.prependNodes(...options.includeSourceFile(otherEntrySourceFileForChunk, { allowExports: true }));
    }
    return options.childContinuation(options.node, undefined);
}

function visitNode$8(_a) {
    var { node } = _a, options = tslib.__rest(_a, ["node"]);
    if (options.typescript.isSourceFile(node)) {
        return visitSourceFile(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isExportDeclaration(node)) {
        return visitExportDeclaration$3(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isImportDeclaration(node)) {
        return visitImportDeclaration$2(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isImportTypeNode(node)) {
        return visitImportTypeNode$1(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isImportClause(node)) {
        return visitImportClause$1(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isNamespaceImport(node)) {
        return visitNamespaceImport$1(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isImportSpecifier(node)) {
        return visitImportSpecifier$1(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isExportSpecifier(node)) {
        return visitExportSpecifier(Object.assign(Object.assign({}, options), { node }));
    }
    else {
        return options.childContinuation(node, options.payload);
    }
}

/**
 * Returns true if the given Node is a Statement
 * Uses an internal non-exposed Typescript helper to decide whether or not the Node is a Statement
 */
function isStatement(node, typescript) {
    return typescript.isStatementButNotDeclaration(node);
}

function isRootLevelNode(node, typescript) {
    return (node != null &&
        !Array.isArray(node) &&
        (typescript.isClassDeclaration(node) ||
            typescript.isClassExpression(node) ||
            typescript.isEnumDeclaration(node) ||
            typescript.isExportDeclaration(node) ||
            typescript.isExportAssignment(node) ||
            typescript.isFunctionDeclaration(node) ||
            typescript.isFunctionExpression(node) ||
            typescript.isExpressionStatement(node) ||
            typescript.isImportDeclaration(node) ||
            typescript.isImportEqualsDeclaration(node) ||
            typescript.isInterfaceDeclaration(node) ||
            typescript.isModuleDeclaration(node) ||
            typescript.isTypeAliasDeclaration(node) ||
            typescript.isVariableStatement(node) ||
            isStatement(node, typescript)));
}

function getNodePlacementQueue({ typescript }) {
    const prependNodeQueue = new Set();
    const appendNodeQueue = new Set();
    const flush = () => {
        const returnValue = [[...prependNodeQueue], [...appendNodeQueue]];
        prependNodeQueue.clear();
        appendNodeQueue.clear();
        return returnValue;
    };
    return {
        flush,
        prependNodes(...nodes) {
            for (const node of nodes)
                prependNodeQueue.add(node);
        },
        appendNodes(...nodes) {
            for (const node of nodes)
                appendNodeQueue.add(node);
        },
        wrapVisitResult(node) {
            if (isRootLevelNode(node, typescript) || (Array.isArray(node) && node.some(n => isRootLevelNode(n, typescript)))) {
                const [prependNodes, appendNodes] = flush();
                return [...prependNodes, ...(Array.isArray(node) ? node : [node]), ...appendNodes];
            }
            else {
                return node;
            }
        }
    };
}

function findMatchingImportedSymbol(importedSymbol, importedSymbols) {
    for (const otherImportedSymbol of importedSymbols) {
        // They both need to point to the same moduleSpecifier
        if (importedSymbol.moduleSpecifier !== otherImportedSymbol.moduleSpecifier)
            continue;
        // If it is a NamespaceImport, a matching ImportedSymbol must have the same name
        if ("isNamespaceImport" in importedSymbol) {
            if ("isNamespaceImport" in otherImportedSymbol && importedSymbol.name.text === otherImportedSymbol.name.text) {
                return otherImportedSymbol;
            }
        }
        else if ("isClauseLessImport" in importedSymbol) {
            if ("isClauseLessImport" in otherImportedSymbol) {
                return otherImportedSymbol;
            }
        }
        // Otherwise, their names, property names, and default import values must be equal
        else {
            if ("isDefaultImport" in otherImportedSymbol &&
                importedSymbol.isDefaultImport === otherImportedSymbol.isDefaultImport &&
                importedSymbol.name.text === otherImportedSymbol.name.text &&
                importedSymbol.propertyName.text === otherImportedSymbol.propertyName.text) {
                return otherImportedSymbol;
            }
        }
    }
    return undefined;
}

function visitClassDeclaration$3(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasExportModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateClassDeclaration(node, node.decorators, removeExportModifier(node.modifiers, typescript), node.name, node.typeParameters, node.heritageClauses, node.members), node, options);
}

function visitClassExpression$3(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasExportModifier(node, typescript))
        return node;
    return preserveMeta(isNodeFactory(compatFactory)
        ? compatFactory.updateClassExpression(node, node.decorators, removeExportModifier(node.modifiers, typescript), node.name, node.typeParameters, node.heritageClauses, node.members)
        : compatFactory.updateClassExpression(node, removeExportModifier(node.modifiers, typescript), node.name, node.typeParameters, node.heritageClauses, node.members), node, options);
}

function visitFunctionDeclaration$3(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasExportModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateFunctionDeclaration(node, node.decorators, removeExportModifier(node.modifiers, typescript), node.asteriskToken, node.name, node.typeParameters, node.parameters, node.type, node.body), node, options);
}

function visitFunctionExpression$3(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasExportModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateFunctionExpression(node, removeExportModifier(node.modifiers, typescript), node.asteriskToken, node.name, node.typeParameters, node.parameters, node.type, node.body), node, options);
}

function visitEnumDeclaration$3(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasExportModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateEnumDeclaration(node, node.decorators, removeExportModifier(node.modifiers, typescript), node.name, node.members), node, options);
}

function visitVariableStatement$3(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasExportModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateVariableStatement(node, removeExportModifier(node.modifiers, typescript), node.declarationList), node, options);
}

function visitInterfaceDeclaration$3(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasExportModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateInterfaceDeclaration(node, node.decorators, removeExportModifier(node.modifiers, typescript), node.name, node.typeParameters, node.heritageClauses, node.members), node, options);
}

function visitModuleDeclaration$5(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasExportModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateModuleDeclaration(node, node.decorators, removeExportModifier(node.modifiers, typescript), node.name, node.body), node, options);
}

function visitTypeAliasDeclaration$3(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasExportModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateTypeAliasDeclaration(node, node.decorators, removeExportModifier(node.modifiers, typescript), node.name, node.typeParameters, node.type), node, options);
}

function visitNode$7(_a) {
    var { node } = _a, options = tslib.__rest(_a, ["node"]);
    if (options.typescript.isClassDeclaration(node)) {
        return visitClassDeclaration$3(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isClassExpression(node)) {
        return visitClassExpression$3(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isFunctionDeclaration(node)) {
        return visitFunctionDeclaration$3(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isFunctionExpression(node)) {
        return visitFunctionExpression$3(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isEnumDeclaration(node)) {
        return visitEnumDeclaration$3(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isInterfaceDeclaration(node)) {
        return visitInterfaceDeclaration$3(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isTypeAliasDeclaration(node)) {
        return visitTypeAliasDeclaration$3(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isModuleDeclaration(node)) {
        return visitModuleDeclaration$5(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isVariableStatement(node)) {
        return visitVariableStatement$3(Object.assign(Object.assign({}, options), { node }));
    }
    else {
        // Only consider root-level statements here
        return node;
    }
}

function ensureNoExportModifierTransformer(options) {
    const { typescript, context, sourceFile, pluginOptions, printer } = options;
    const fullBenchmark = shouldDebugMetrics(pluginOptions.debug, sourceFile) ? logMetrics(`Ensuring no export modifiers`, sourceFile.fileName) : undefined;
    const transformationLog = shouldDebugSourceFile(pluginOptions.debug, sourceFile) ? logTransformer("Ensuring no export modifiers", sourceFile, printer) : undefined;
    // Prepare some VisitorOptions
    const visitorOptions = Object.assign(Object.assign({}, options), { childContinuation: (node) => typescript.visitEachChild(node, nextNode => visitNode$7(Object.assign(Object.assign({}, visitorOptions), { node: nextNode })), context), continuation: (node) => visitNode$7(Object.assign(Object.assign({}, visitorOptions), { node })) });
    const result = preserveMeta(typescript.visitEachChild(sourceFile, nextNode => visitorOptions.continuation(nextNode), context), sourceFile, options);
    transformationLog === null || transformationLog === void 0 ? void 0 : transformationLog.finish(result);
    fullBenchmark === null || fullBenchmark === void 0 ? void 0 : fullBenchmark.finish();
    return result;
}

function visitExportDeclaration$2(options) {
    const { node, typescript, preserveExportsWithModuleSpecifiers, preserveAliasedExports } = options;
    if (preserveExportsWithModuleSpecifiers && node.moduleSpecifier != null) {
        return node;
    }
    const isNamespaceExport = typescript.isNamespaceExport == null ? () => false : typescript.isNamespaceExport;
    if (preserveAliasedExports && node.exportClause != null && (isNamespaceExport(node.exportClause) || node.exportClause.elements.some(element => element.propertyName != null))) {
        return node;
    }
    return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function visitExportAssignment$1(_options) {
    return undefined;
}

function visitNode$6(_a) {
    var { node } = _a, options = tslib.__rest(_a, ["node"]);
    if (options.typescript.isExportDeclaration(node)) {
        return visitExportDeclaration$2(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isExportAssignment(node)) {
        return visitExportAssignment$1(Object.assign(Object.assign({}, options), { node }));
    }
    else {
        // Preserve the node
        return node;
    }
}

function noExportDeclarationTransformer({ preserveAliasedExports = false, preserveExportsWithModuleSpecifiers = false } = {}) {
    return options => {
        const { typescript, context, sourceFile, pluginOptions, printer } = options;
        const fullBenchmark = shouldDebugMetrics(pluginOptions.debug, sourceFile) ? logMetrics(`Removing ExportDeclarations`, sourceFile.fileName) : undefined;
        const transformationLog = shouldDebugSourceFile(pluginOptions.debug, sourceFile) ? logTransformer("Removing ExportDeclarations", sourceFile, printer) : undefined;
        const nodePlacementQueue = getNodePlacementQueue({ typescript });
        // Prepare some VisitorOptions
        const visitorOptions = Object.assign(Object.assign(Object.assign({}, options), nodePlacementQueue), { preserveAliasedExports,
            preserveExportsWithModuleSpecifiers, childContinuation: (node) => typescript.visitEachChild(node, nextNode => nodePlacementQueue.wrapVisitResult(visitNode$6(Object.assign(Object.assign({}, visitorOptions), { node: nextNode }))), context), continuation: (node) => nodePlacementQueue.wrapVisitResult(visitNode$6(Object.assign(Object.assign({}, visitorOptions), { node }))) });
        const result = preserveMeta(typescript.visitEachChild(sourceFile, nextNode => visitorOptions.continuation(nextNode), context), sourceFile, options);
        transformationLog === null || transformationLog === void 0 ? void 0 : transformationLog.finish(result);
        fullBenchmark === null || fullBenchmark === void 0 ? void 0 : fullBenchmark.finish();
        return result;
    };
}

function moduleMerger(...transformers) {
    return options => {
        const { typescript, context, compatFactory, sourceFile, pluginOptions, printer, preservedImports } = options;
        const fullBenchmark = shouldDebugMetrics(pluginOptions.debug, sourceFile) ? logMetrics(`Merging modules`, sourceFile.fileName) : undefined;
        const transformationLog = shouldDebugSourceFile(pluginOptions.debug, sourceFile) ? logTransformer("Merging modules", sourceFile, printer) : undefined;
        const nodePlacementQueue = getNodePlacementQueue({ typescript });
        // Prepare some VisitorOptions
        const visitorOptions = Object.assign(Object.assign(Object.assign({}, options), nodePlacementQueue), { transformers, payload: undefined, childContinuation: (node, payload) => typescript.visitEachChild(node, nextNode => nodePlacementQueue.wrapVisitResult(visitNode$8(Object.assign(Object.assign({}, visitorOptions), { payload, node: nextNode }))), context), continuation: (node, payload) => nodePlacementQueue.wrapVisitResult(visitNode$8(Object.assign(Object.assign({}, visitorOptions), { payload,
                node }))), shouldPreserveImportedSymbol(importedSymbol) {
                let importedSymbols = preservedImports.get(importedSymbol.moduleSpecifier);
                if (importedSymbols == null) {
                    importedSymbols = new Set();
                    preservedImports.set(importedSymbol.moduleSpecifier, importedSymbols);
                }
                // Preserve the import of there is no matching imported symbol already
                if (findMatchingImportedSymbol(importedSymbol, importedSymbols) != null) {
                    return false;
                }
                // Otherwise, the import should be preserved!
                importedSymbols.add(importedSymbol);
                return true;
            },
            getMatchingSourceFile(moduleSpecifier, from) {
                const resolvedSourceFile = options.resolveSourceFile(moduleSpecifier, from.fileName);
                const chunkForSourceFile = resolvedSourceFile == null ? undefined : getChunkFilename(resolvedSourceFile.fileName, options.chunks);
                const isSameChunk = resolvedSourceFile != null && chunkForSourceFile != null && chunkForSourceFile === options.chunk.paths.absolute;
                return resolvedSourceFile === from || !isSameChunk ? undefined : resolvedSourceFile;
            },
            includeSourceFile(sourceFileToInclude, _a = {}) {
                var { allowDuplicate = false, allowExports = options.otherEntrySourceFilesForChunk.some(otherEntrySourceFileForChunk => otherEntrySourceFileForChunk.fileName === sourceFileToInclude.fileName), transformers: extraTransformers = [] } = _a, otherOptions = tslib.__rest(_a, ["allowDuplicate", "allowExports", "transformers"]);
                // Never include the same SourceFile twice
                if (options.includedSourceFiles.has(sourceFileToInclude.fileName) && !allowDuplicate)
                    return [];
                options.includedSourceFiles.add(sourceFileToInclude.fileName);
                const allTransformers = allowExports === true
                    ? [...transformers, ...extraTransformers]
                    : [
                        ...transformers,
                        // Removes 'export' modifiers from Nodes
                        ...(allowExports === false || allowExports === "skip-optional" ? [ensureNoExportModifierTransformer] : []),
                        // Removes ExportDeclarations and ExportAssignments
                        noExportDeclarationTransformer({
                            preserveAliasedExports: allowExports === "skip-optional",
                            preserveExportsWithModuleSpecifiers: allowExports === "skip-optional"
                        }),
                        ...extraTransformers
                    ];
                const transformedSourceFile = applyTransformers({
                    visitorOptions: Object.assign(Object.assign(Object.assign({}, visitorOptions), otherOptions), { 
                        // If duplicates should be allowed, treat this context as empty
                        includedSourceFiles: allowDuplicate ? new Set() : options.includedSourceFiles, sourceFile: sourceFileToInclude, otherEntrySourceFilesForChunk: [] }),
                    transformers: [moduleMerger(...allTransformers), ...allTransformers]
                });
                // Keep track of the original symbols which will be lost when the nodes are cloned
                return transformedSourceFile.statements.map(node => cloneNodeWithMeta(node, options));
            } });
        let result = visitorOptions.continuation(sourceFile, undefined);
        // There may be prepended or appended nodes that hasn't been added yet. Do so!
        const [missingPrependNodes, missingAppendNodes] = nodePlacementQueue.flush();
        if (missingPrependNodes.length > 0 || missingAppendNodes.length > 0) {
            result = preserveMeta(isNodeFactory(compatFactory)
                ? compatFactory.updateSourceFile(result, [...missingPrependNodes, ...result.statements, ...missingAppendNodes], result.isDeclarationFile, result.referencedFiles, result.typeReferenceDirectives, result.hasNoDefaultLib, result.libReferenceDirectives)
                : compatFactory.updateSourceFileNode(result, [...missingPrependNodes, ...result.statements, ...missingAppendNodes], result.isDeclarationFile, result.referencedFiles, result.typeReferenceDirectives, result.hasNoDefaultLib, result.libReferenceDirectives), result, options);
        }
        transformationLog === null || transformationLog === void 0 ? void 0 : transformationLog.finish(result);
        fullBenchmark === null || fullBenchmark === void 0 ? void 0 : fullBenchmark.finish();
        // Otherwise, return the result as it is
        return result;
    };
}

/**
 * Deconflicts the given BindingElement.
 */
function deconflictBindingElement(options) {
    const { node, continuation, lexicalEnvironment, typescript, compatFactory, sourceFile } = options;
    let nameContResult;
    const originalSourceFile = getOriginalSourceFile(node, sourceFile, typescript);
    if (typescript.isIdentifier(node.name)) {
        if (isIdentifierFree(lexicalEnvironment, node.name.text, originalSourceFile.fileName)) {
            nameContResult = node.name;
            // The name creates a new local binding within the current LexicalEnvironment
            addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, node.name.text);
        }
        else {
            // Otherwise, deconflict it
            const uniqueBinding = generateUniqueBinding(lexicalEnvironment, node.name.text);
            nameContResult = compatFactory.createIdentifier(uniqueBinding);
            // The name creates a new local binding within the current LexicalEnvironment
            addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, uniqueBinding, node.name.text);
        }
    }
    else {
        // Otherwise, deconflict it
        nameContResult = continuation(node.name, { lexicalEnvironment });
    }
    const propertyNameContResult = node.propertyName == null ? undefined : typescript.isIdentifier(node.propertyName) ? node.propertyName : continuation(node.propertyName, { lexicalEnvironment });
    const initializerContResult = node.initializer == null ? undefined : continuation(node.initializer, { lexicalEnvironment });
    const isIdentical = nameContResult === node.name && propertyNameContResult === node.propertyName && initializerContResult === node.initializer;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(compatFactory.updateBindingElement(node, node.dotDotDotToken, propertyNameContResult, nameContResult, initializerContResult), node, options);
}

function nodeArraysAreEqual(a, b) {
    if (a == null && b == null)
        return true;
    return a != null && b != null && a.length === b.length && a.every((element, index) => element === b[index]);
}

/**
 * According to TypeScript, multiple namespace imports, identically named, from the same module may have different IDs, because they are all local bindings in their respective modules.
 * For example, in files a.ts and b.ts, both may include 'import * as Foo from "foo"', but the ids of 'Foo' will be unique for each SourceFile, given that it is indeed separate local bindings of Foo,
 * and they aren't equal to each other. However, we're merging ImportDeclarations here, and so, structurally identical imported bindings should share ids. This function makes sure to generate an id
 * that is shared for structurally identical NamespaceImports
 */
function getIdForNamespaceImportName(options) {
    const { node } = options;
    const originalNode = getOriginalNode(node, options.typescript);
    const moduleSpecifier = getParentNode(getParentNode(getParentNode(originalNode))).moduleSpecifier;
    return generateRandomIntegerHash({
        key: `NamespaceImport:${node.text}:${moduleSpecifier == null || !options.typescript.isStringLiteralLike(moduleSpecifier) ? generateRandomHash() : moduleSpecifier.text}`,
        length: 100
    });
}
/**
 * According to TypeScript, multiple import specifiers, identically named, from the same module may have different IDs, because they are all local bindings in their respective modules.
 * For example, in files a.ts and b.ts, both may include 'import {foo} from "foo"', but the ids of 'foo' will be unique for each SourceFile, given that it is indeed separate local bindings of foo,
 * and they aren't equal to each other. However, we're merging ImportDeclarations here, and so, structurally identical imported bindings should share ids. This function makes sure to generate an id
 * that is shared for structurally identical ImportSpecifiers
 */
function getIdForImportSpecifier(options) {
    const { node } = options;
    const originalNode = getOriginalNode(node, options.typescript);
    const moduleSpecifier = getParentNode(getParentNode(getParentNode(getParentNode(originalNode)))).moduleSpecifier;
    return generateRandomIntegerHash({
        key: `${node.text === "default" ? "name" : "ImportSpecifier"}:${node.text}:${moduleSpecifier == null || !options.typescript.isStringLiteralLike(moduleSpecifier) ? generateRandomHash() : moduleSpecifier.text}`,
        length: 100
    });
}
/**
 * According to TypeScript, multiple default imports, identically named, from the same module may have different IDs, because they are all local bindings in their respective modules.
 * For example, in files a.ts and b.ts, both may include 'import Foo from "foo"', but the ids of 'Foo' will be unique for each SourceFile, given that it is indeed separate local bindings of Foo,
 * and they aren't equal to each other. However, we're merging ImportDeclarations here, and so, structurally identical imported bindings should share ids. This function makes sure to generate an id
 * that is shared for structurally identical imported names
 */
function getIdForImportedName(options) {
    const { node } = options;
    const originalNode = getOriginalNode(node, options.typescript);
    const moduleSpecifier = getParentNode(getParentNode(originalNode)).moduleSpecifier;
    return generateRandomIntegerHash({
        key: `name:${node.text}:${moduleSpecifier == null || !options.typescript.isStringLiteralLike(moduleSpecifier) ? generateRandomHash() : moduleSpecifier.text}`,
        length: 100
    });
}
function getIdForStructurallyEqualNode(options) {
    if (options.typescript.isImportSpecifier(options.node)) {
        return getIdForImportSpecifier(Object.assign(Object.assign({}, options), { node: options.node.name }));
    }
    else if (options.typescript.isNamespaceImport(options.node)) {
        return getIdForNamespaceImportName(Object.assign(Object.assign({}, options), { node: options.node.name }));
    }
    else if (options.typescript.isImportClause(options.node) && options.node.name != null) {
        return getIdForImportedName(Object.assign(Object.assign({}, options), { node: options.node.name }));
    }
    else {
        return undefined;
    }
}
function getIdForNode(options) {
    var _a;
    if (options.typescript.isExportSpecifier(options.node)) {
        const aliasedDeclaration = getAliasedDeclaration(options);
        if (aliasedDeclaration != null && aliasedDeclaration !== options.node) {
            return getIdForNode(Object.assign(Object.assign({}, options), { node: aliasedDeclaration }));
        }
    }
    const importRelatedId = getIdForStructurallyEqualNode(options);
    if (importRelatedId != null) {
        return importRelatedId;
    }
    else if (options.typescript.isIdentifier(options.node)) {
        const parent = (_a = getParentNode(options.node)) !== null && _a !== void 0 ? _a : getParentNode(getOriginalNode(options.node, options.typescript));
        if (parent != null) {
            const parentImportRelatedId = getIdForStructurallyEqualNode(Object.assign(Object.assign({}, options), { node: parent }));
            if (parentImportRelatedId != null)
                return parentImportRelatedId;
        }
    }
    const symbol = getSymbolAtLocation(options);
    if (symbol == null)
        return undefined;
    let declaration;
    if (symbol.declarations != null) {
        declaration = symbol.declarations[0];
    }
    else if (symbol.valueDeclaration != null) {
        declaration = symbol.valueDeclaration;
    }
    else if ("type" in symbol) {
        declaration = symbol.type;
    }
    if (declaration == null)
        return undefined;
    return declaration.id;
}

/**
 * Deconflicts the given ClassDeclaration.
 */
function deconflictClassDeclaration(options) {
    const { node, continuation, lexicalEnvironment, typescript, compatFactory, sourceFile, declarationToDeconflictedBindingMap } = options;
    let nameContResult;
    if (node.name != null) {
        const id = getIdForNode(options);
        const originalSourceFile = getOriginalSourceFile(node, sourceFile, typescript);
        if (isIdentifierFree(lexicalEnvironment, node.name.text, originalSourceFile.fileName)) {
            nameContResult = node.name;
            if (id != null)
                declarationToDeconflictedBindingMap.set(id, node.name.text);
            // The name creates a new local binding within the current LexicalEnvironment
            addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, node.name.text);
        }
        else {
            // Otherwise, deconflict it
            const uniqueBinding = generateUniqueBinding(lexicalEnvironment, node.name.text);
            nameContResult = compatFactory.createIdentifier(uniqueBinding);
            if (id != null)
                declarationToDeconflictedBindingMap.set(id, uniqueBinding);
            // The name creates a new local binding within the current LexicalEnvironment
            addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, uniqueBinding, node.name.text);
        }
    }
    // The Type parameters, as well as the heritage clauses share the same lexical environment
    const nextContinuationOptions = { lexicalEnvironment: cloneLexicalEnvironment(lexicalEnvironment) };
    const typeParametersContResult = node.typeParameters == null ? undefined : node.typeParameters.map(typeParameter => continuation(typeParameter, nextContinuationOptions));
    const heritageClausesContResult = node.heritageClauses == null ? undefined : node.heritageClauses.map(heritageClause => continuation(heritageClause, nextContinuationOptions));
    const membersContResult = node.members.map(member => continuation(member, { lexicalEnvironment }));
    const isIdentical = nameContResult === node.name &&
        nodeArraysAreEqual(typeParametersContResult, node.typeParameters) &&
        nodeArraysAreEqual(heritageClausesContResult, node.heritageClauses) &&
        nodeArraysAreEqual(membersContResult, node.members);
    if (isIdentical) {
        return node;
    }
    return preserveMeta(compatFactory.updateClassDeclaration(node, node.decorators, node.modifiers, nameContResult, typeParametersContResult, heritageClausesContResult, membersContResult), node, options);
}

/**
 * Deconflicts the given ClassExpression.
 */
function deconflictClassExpression(options) {
    const { node, continuation, lexicalEnvironment, typescript, compatFactory, sourceFile, declarationToDeconflictedBindingMap } = options;
    let nameContResult;
    if (node.name != null) {
        const id = getIdForNode(options);
        const originalSourceFile = getOriginalSourceFile(node, sourceFile, typescript);
        if (isIdentifierFree(lexicalEnvironment, node.name.text, originalSourceFile.fileName)) {
            nameContResult = node.name;
            if (id != null)
                declarationToDeconflictedBindingMap.set(id, node.name.text);
            // The name creates a new local binding within the current LexicalEnvironment
            addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, node.name.text);
        }
        else {
            // Otherwise, deconflict it
            const uniqueBinding = generateUniqueBinding(lexicalEnvironment, node.name.text);
            nameContResult = compatFactory.createIdentifier(uniqueBinding);
            if (id != null)
                declarationToDeconflictedBindingMap.set(id, uniqueBinding);
            // The name creates a new local binding within the current LexicalEnvironment
            addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, uniqueBinding, node.name.text);
        }
    }
    // The Type parameters, as well as the heritage clauses share the same lexical environment
    const nextContinuationOptions = { lexicalEnvironment: cloneLexicalEnvironment(lexicalEnvironment) };
    const typeParametersContResult = node.typeParameters == null ? undefined : node.typeParameters.map(typeParameter => continuation(typeParameter, nextContinuationOptions));
    const heritageClausesContResult = node.heritageClauses == null ? undefined : node.heritageClauses.map(heritageClause => continuation(heritageClause, nextContinuationOptions));
    const membersContResult = node.members.map(member => continuation(member, { lexicalEnvironment }));
    const isIdentical = nameContResult === node.name &&
        nodeArraysAreEqual(typeParametersContResult, node.typeParameters) &&
        nodeArraysAreEqual(heritageClausesContResult, node.heritageClauses) &&
        nodeArraysAreEqual(membersContResult, node.members);
    if (isIdentical) {
        return node;
    }
    return preserveMeta(isNodeFactory(compatFactory)
        ? compatFactory.updateClassExpression(node, node.decorators, node.modifiers, nameContResult, typeParametersContResult, heritageClausesContResult, membersContResult)
        : compatFactory.updateClassExpression(node, node.modifiers, nameContResult, typeParametersContResult, heritageClausesContResult, membersContResult), node, options);
}

/**
 * Deconflicts the given EnumDeclaration.
 */
function deconflictEnumDeclaration(options) {
    const { node, continuation, lexicalEnvironment, typescript, sourceFile, compatFactory, declarationToDeconflictedBindingMap } = options;
    let nameContResult;
    const id = getIdForNode(options);
    const originalSourceFile = getOriginalSourceFile(node, sourceFile, typescript);
    if (isIdentifierFree(lexicalEnvironment, node.name.text, originalSourceFile.fileName)) {
        nameContResult = node.name;
        if (id != null)
            declarationToDeconflictedBindingMap.set(id, node.name.text);
        // The name creates a new local binding within the current LexicalEnvironment
        addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, node.name.text);
    }
    else {
        // Otherwise, deconflict it
        const uniqueBinding = generateUniqueBinding(lexicalEnvironment, node.name.text);
        nameContResult = compatFactory.createIdentifier(uniqueBinding);
        if (id != null)
            declarationToDeconflictedBindingMap.set(id, uniqueBinding);
        // The name creates a new local binding within the current LexicalEnvironment
        addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, uniqueBinding, node.name.text);
    }
    const membersContResult = node.members.map(member => continuation(member, { lexicalEnvironment }));
    const isIdentical = nameContResult === node.name && nodeArraysAreEqual(membersContResult, node.members);
    if (isIdentical) {
        return node;
    }
    return preserveMeta(compatFactory.updateEnumDeclaration(node, node.decorators, node.modifiers, nameContResult, membersContResult), node, options);
}

/**
 * Deconflicts the given EnumMember.
 */
function deconflictEnumMember(options) {
    const { node, continuation, lexicalEnvironment, typescript, compatFactory } = options;
    const nameContResult = typescript.isIdentifier(node.name) ? node.name : continuation(node.name, { lexicalEnvironment });
    const initializerContResult = node.initializer == null ? undefined : continuation(node.initializer, { lexicalEnvironment });
    const isIdentical = nameContResult === node.name && initializerContResult === node.initializer;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(compatFactory.updateEnumMember(node, nameContResult, initializerContResult), node, options);
}

/**
 * Deconflicts the given ExportSpecifier.
 */
function deconflictExportSpecifier(options) {
    var _a;
    const { node, continuation, lexicalEnvironment, compatFactory } = options;
    const propertyName = (_a = node.propertyName) !== null && _a !== void 0 ? _a : node.name;
    const propertyNameContResult = continuation(propertyName, { lexicalEnvironment });
    // If the ExportSpecifier is something like '{Foo}' but 'Foo' has been deconflicted in this SourceFile to something else,
    // we should re-write it to something like '{Foo$0 as Foo}'
    if (propertyNameContResult !== propertyName) {
        return preserveMeta(compatFactory.updateExportSpecifier(node, propertyNameContResult.text === node.name.text ? undefined : propertyNameContResult, node.name), node, options);
    }
    return node;
}

/**
 * Deconflicts the given FunctionDeclaration.
 */
function deconflictFunctionDeclaration(options) {
    const { node, continuation, lexicalEnvironment, typescript, compatFactory, sourceFile, declarationToDeconflictedBindingMap } = options;
    let nameContResult;
    if (node.name != null) {
        const id = getIdForNode(options);
        const originalSourceFile = getOriginalSourceFile(node, sourceFile, typescript);
        if (isIdentifierFree(lexicalEnvironment, node.name.text, originalSourceFile.fileName)) {
            nameContResult = node.name;
            if (id != null)
                declarationToDeconflictedBindingMap.set(id, node.name.text);
            // The name creates a new local binding within the current LexicalEnvironment
            addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, node.name.text);
        }
        else {
            // Otherwise, deconflict it
            const uniqueBinding = generateUniqueBinding(lexicalEnvironment, node.name.text);
            nameContResult = compatFactory.createIdentifier(uniqueBinding);
            if (id != null)
                declarationToDeconflictedBindingMap.set(id, uniqueBinding);
            // The name creates a new local binding within the current LexicalEnvironment
            addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, uniqueBinding, node.name.text);
        }
    }
    // The body, type, type parameters, as well as the parameters share the same lexical environment
    const nextContinuationOptions = { lexicalEnvironment: cloneLexicalEnvironment(lexicalEnvironment) };
    const typeParametersContResult = node.typeParameters == null ? undefined : node.typeParameters.map(typeParameter => continuation(typeParameter, nextContinuationOptions));
    const parametersContResult = node.parameters.map(parameter => continuation(parameter, nextContinuationOptions));
    const typeContResult = node.type == null ? undefined : continuation(node.type, nextContinuationOptions);
    const bodyContResult = node.body == null ? undefined : continuation(node.body, nextContinuationOptions);
    const isIdentical = nameContResult === node.name &&
        nodeArraysAreEqual(typeParametersContResult, node.typeParameters) &&
        nodeArraysAreEqual(parametersContResult, node.parameters) &&
        typeContResult === node.type &&
        bodyContResult === node.body;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(compatFactory.updateFunctionDeclaration(node, node.decorators, node.modifiers, node.asteriskToken, nameContResult, typeParametersContResult, parametersContResult, typeContResult, bodyContResult), node, options);
}

/**
 * Deconflicts the given FunctionExpression.
 */
function deconflictFunctionExpression(options) {
    const { node, continuation, lexicalEnvironment, typescript, compatFactory, sourceFile, declarationToDeconflictedBindingMap } = options;
    let nameContResult;
    if (node.name != null) {
        const id = getIdForNode(options);
        const originalSourceFile = getOriginalSourceFile(node, sourceFile, typescript);
        if (isIdentifierFree(lexicalEnvironment, node.name.text, originalSourceFile.fileName)) {
            nameContResult = node.name;
            if (id != null)
                declarationToDeconflictedBindingMap.set(id, node.name.text);
            // The name creates a new local binding within the current LexicalEnvironment
            addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, node.name.text);
        }
        else {
            // Otherwise, deconflict it
            const uniqueBinding = generateUniqueBinding(lexicalEnvironment, node.name.text);
            nameContResult = compatFactory.createIdentifier(uniqueBinding);
            if (id != null)
                declarationToDeconflictedBindingMap.set(id, uniqueBinding);
            // The name creates a new local binding within the current LexicalEnvironment
            addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, uniqueBinding, node.name.text);
        }
    }
    // The body, type, type parameters, as well as the parameters share the same lexical environment
    const nextContinuationOptions = { lexicalEnvironment: cloneLexicalEnvironment(lexicalEnvironment) };
    const typeParametersContResult = node.typeParameters == null ? undefined : node.typeParameters.map(typeParameter => continuation(typeParameter, nextContinuationOptions));
    const parametersContResult = node.parameters.map(parameter => continuation(parameter, nextContinuationOptions));
    const typeContResult = node.type == null ? undefined : continuation(node.type, nextContinuationOptions);
    const bodyContResult = continuation(node.body, nextContinuationOptions);
    const isIdentical = nameContResult === node.name &&
        nodeArraysAreEqual(typeParametersContResult, node.typeParameters) &&
        nodeArraysAreEqual(parametersContResult, node.parameters) &&
        typeContResult === node.type &&
        bodyContResult === node.body;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(compatFactory.updateFunctionExpression(node, node.modifiers, node.asteriskToken, nameContResult, typeParametersContResult, parametersContResult, typeContResult, bodyContResult), node, options);
}

/**
 * Deconflicts the given GetAccessorDeclaration.
 */
function deconflictGetAccessorDeclaration(options) {
    const { node, continuation, lexicalEnvironment, compatFactory, typescript } = options;
    const nameContResult = typescript.isIdentifier(node.name) ? node.name : continuation(node.name, { lexicalEnvironment });
    // The body, as well as the parameters share the same lexical environment
    const nextContinuationOptions = { lexicalEnvironment: cloneLexicalEnvironment(lexicalEnvironment) };
    const parametersContResult = node.parameters.map(parameter => continuation(parameter, nextContinuationOptions));
    const typeContResult = node.type == null ? undefined : continuation(node.type, nextContinuationOptions);
    const bodyContResult = node.body == null ? undefined : continuation(node.body, nextContinuationOptions);
    const isIdentical = nameContResult === node.name && nodeArraysAreEqual(parametersContResult, node.parameters) && typeContResult === node.type && bodyContResult === node.body;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(isNodeFactory(compatFactory)
        ? compatFactory.updateGetAccessorDeclaration(node, node.decorators, node.modifiers, nameContResult, parametersContResult, typeContResult, bodyContResult)
        : compatFactory.updateGetAccessor(node, node.decorators, node.modifiers, nameContResult, parametersContResult, typeContResult, bodyContResult), node, options);
}

function getBindingFromLexicalEnvironment(lexicalEnvironment, key) {
    if (lexicalEnvironment.bindings.has(key)) {
        return lexicalEnvironment.bindings.get(key).value;
    }
    else if (lexicalEnvironment.parent != null) {
        return getBindingFromLexicalEnvironment(lexicalEnvironment.parent, key);
    }
    else {
        return undefined;
    }
}

/**
 * Deconflicts the given Identifier.
 */
function deconflictIdentifier(options) {
    var _a;
    const { node, lexicalEnvironment, declarationToDeconflictedBindingMap, compatFactory } = options;
    const id = getIdForNode(Object.assign(Object.assign({}, options), { node: (_a = getBestDeclaration(options)) !== null && _a !== void 0 ? _a : node }));
    const envLookupResult = getBindingFromLexicalEnvironment(lexicalEnvironment, node.text);
    const deconflictedBindingMapLookupResult = id == null ? undefined : declarationToDeconflictedBindingMap.get(id);
    const textResult = deconflictedBindingMapLookupResult != null && deconflictedBindingMapLookupResult.startsWith(node.text) ? deconflictedBindingMapLookupResult : envLookupResult;
    const isIdentical = textResult === node.text;
    if (isIdentical || textResult == null) {
        return node;
    }
    return preserveMeta(compatFactory.createIdentifier(textResult), node, options);
}

/**
 * Deconflicts the given ImportClause.
 */
function deconflictImportClause(options) {
    const { node, continuation, lexicalEnvironment, sourceFile, typescript, compatFactory, declarationToDeconflictedBindingMap } = options;
    let nameContResult;
    const originalSourceFile = getOriginalSourceFile(node, sourceFile, typescript);
    const id = getIdForNode(Object.assign({}, options));
    if (node.name != null) {
        if (isIdentifierFree(lexicalEnvironment, node.name.text, originalSourceFile.fileName)) {
            nameContResult = node.name;
            if (id != null) {
                declarationToDeconflictedBindingMap.set(id, node.name.text);
            }
            // The name creates a new local binding within the current LexicalEnvironment
            addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, node.name.text);
        }
        else {
            // Otherwise, deconflict it
            const uniqueBinding = generateUniqueBinding(lexicalEnvironment, node.name.text);
            nameContResult = compatFactory.createIdentifier(uniqueBinding);
            if (id != null) {
                declarationToDeconflictedBindingMap.set(id, uniqueBinding);
            }
            // The name creates a new local binding within the current LexicalEnvironment
            addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, uniqueBinding, node.name.text);
        }
    }
    const namedBindingsContResult = node.namedBindings == null ? undefined : continuation(node.namedBindings, { lexicalEnvironment });
    const isIdentical = nameContResult === node.name && namedBindingsContResult === node.namedBindings;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(isNodeFactory(compatFactory)
        ? compatFactory.updateImportClause(node, node.isTypeOnly, nameContResult, namedBindingsContResult)
        : compatFactory.updateImportClause(node, nameContResult, namedBindingsContResult, node.isTypeOnly), node, options);
}

/**
 * Deconflicts the given ImportSpecifier.
 */
function deconflictImportSpecifier(options) {
    var _a;
    const { node, lexicalEnvironment, typescript, compatFactory, sourceFile, declarationToDeconflictedBindingMap } = options;
    const originalSourceFile = getOriginalSourceFile(node, sourceFile, typescript);
    const id = getIdForNode(options);
    if (isIdentifierFree(lexicalEnvironment, node.name.text, originalSourceFile.fileName)) {
        if (id != null) {
            declarationToDeconflictedBindingMap.set(id, node.name.text);
        }
        // The name creates a new local binding within the current LexicalEnvironment
        addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, node.name.text);
        return node;
    }
    else {
        // Otherwise, deconflict it
        const uniqueBinding = generateUniqueBinding(lexicalEnvironment, node.name.text);
        if (id != null) {
            declarationToDeconflictedBindingMap.set(id, uniqueBinding);
        }
        // The name creates a new local binding within the current LexicalEnvironment
        addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, uniqueBinding, node.name.text);
        // If the ImportSpecifier is something like '{Foo}' but 'Foo' is already bound in this SourceFile,
        // we should re-write it to something like '{Foo as Foo$0}'
        const propertyName = (_a = node.propertyName) !== null && _a !== void 0 ? _a : node.name;
        return preserveMeta(compatFactory.updateImportSpecifier(node, compatFactory.createIdentifier(propertyName.text), compatFactory.createIdentifier(uniqueBinding)), node, options);
    }
}

/**
 * Deconflicts the given InterfaceDeclaration.
 */
function deconflictInterfaceDeclaration(options) {
    const { node, continuation, lexicalEnvironment, compatFactory, typescript, sourceFile, declarationToDeconflictedBindingMap } = options;
    let nameContResult;
    const id = getIdForNode(options);
    const originalSourceFile = getOriginalSourceFile(node, sourceFile, typescript);
    if (isIdentifierFree(lexicalEnvironment, node.name.text, originalSourceFile.fileName)) {
        nameContResult = node.name;
        if (id != null)
            declarationToDeconflictedBindingMap.set(id, node.name.text);
        // The name creates a new local binding within the current LexicalEnvironment
        addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, node.name.text);
    }
    else {
        // Otherwise, deconflict it
        const uniqueBinding = generateUniqueBinding(lexicalEnvironment, node.name.text);
        nameContResult = compatFactory.createIdentifier(uniqueBinding);
        if (id != null)
            declarationToDeconflictedBindingMap.set(id, uniqueBinding);
        // The name creates a new local binding within the current LexicalEnvironment
        addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, uniqueBinding, node.name.text);
    }
    // The Type parameters, as well as the heritage clauses share the same lexical environment
    const nextContinuationOptions = { lexicalEnvironment: cloneLexicalEnvironment(lexicalEnvironment) };
    const typeParametersContResult = node.typeParameters == null ? undefined : node.typeParameters.map(typeParameter => continuation(typeParameter, nextContinuationOptions));
    const heritageClausesContResult = node.heritageClauses == null ? undefined : node.heritageClauses.map(heritageClause => continuation(heritageClause, nextContinuationOptions));
    const membersContResult = node.members.map(member => continuation(member, { lexicalEnvironment }));
    const isIdentical = nameContResult === node.name &&
        nodeArraysAreEqual(typeParametersContResult, node.typeParameters) &&
        nodeArraysAreEqual(heritageClausesContResult, node.heritageClauses) &&
        nodeArraysAreEqual(membersContResult, node.members);
    if (isIdentical) {
        return node;
    }
    return preserveMeta(compatFactory.updateInterfaceDeclaration(node, node.decorators, node.modifiers, nameContResult, typeParametersContResult, heritageClausesContResult, membersContResult), node, options);
}

/**
 * Deconflicts the given MappedTypeNode.
 */
function deconflictMappedTypeNode(options) {
    const { node, continuation, lexicalEnvironment, compatFactory } = options;
    // The TypeParameter has its own lexical environment
    const nextContinuationOptions = { lexicalEnvironment: cloneLexicalEnvironment(lexicalEnvironment) };
    const typeParameterContResult = continuation(node.typeParameter, nextContinuationOptions);
    const typeContResult = node.type == null ? undefined : continuation(node.type, nextContinuationOptions);
    const nameTypeContResult = node.nameType == null ? undefined : continuation(node.nameType, nextContinuationOptions);
    const isIdentical = typeParameterContResult === node.typeParameter && typeContResult === node.type && nameTypeContResult === node.nameType;
    if (isIdentical) {
        return node;
    }
    // For TypeScript versions before v4.1, updateMappedTypeNode takes five arguments (since it doesn't support 'as' clauses)
    if (compatFactory.updateMappedTypeNode.length === 5) {
        const legacyCompatFactory = compatFactory;
        return preserveMeta(legacyCompatFactory.updateMappedTypeNode(node, node.readonlyToken, typeParameterContResult, node.questionToken, typeContResult), node, options);
    }
    // TypeScript 4.1 and forward
    else {
        return preserveMeta(compatFactory.updateMappedTypeNode(node, node.readonlyToken, typeParameterContResult, nameTypeContResult, node.questionToken, typeContResult), node, options);
    }
}

/**
 * Deconflicts the given MethodDeclaration.
 */
function deconflictMethodDeclaration(options) {
    const { node, continuation, lexicalEnvironment, compatFactory, typescript } = options;
    const nameContResult = typescript.isIdentifier(node.name) ? node.name : continuation(node.name, { lexicalEnvironment });
    // The body, type, type parameters, as well as the parameters share the same lexical environment
    const nextContinuationOptions = { lexicalEnvironment: cloneLexicalEnvironment(lexicalEnvironment) };
    const typeParametersContResult = node.typeParameters == null ? undefined : node.typeParameters.map(typeParameter => continuation(typeParameter, nextContinuationOptions));
    const parametersContResult = node.parameters.map(parameter => continuation(parameter, nextContinuationOptions));
    const typeContResult = node.type == null ? undefined : continuation(node.type, nextContinuationOptions);
    const bodyContResult = node.body == null ? undefined : continuation(node.body, nextContinuationOptions);
    const isIdentical = nameContResult === node.name &&
        nodeArraysAreEqual(typeParametersContResult, node.typeParameters) &&
        nodeArraysAreEqual(parametersContResult, node.parameters) &&
        typeContResult === node.type &&
        bodyContResult === node.body;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(isNodeFactory(compatFactory)
        ? compatFactory.updateMethodDeclaration(node, node.decorators, node.modifiers, node.asteriskToken, nameContResult, node.questionToken, typeParametersContResult, parametersContResult, typeContResult, bodyContResult)
        : compatFactory.updateMethod(node, node.decorators, node.modifiers, node.asteriskToken, nameContResult, node.questionToken, typeParametersContResult, parametersContResult, typeContResult, bodyContResult), node, options);
}

/**
 * Deconflicts the given IndexSignatureDeclaration.
 */
function deconflictIndexSignatureDeclaration(options) {
    const { node, continuation, lexicalEnvironment, compatFactory, typescript } = options;
    // The whole thing has its own lexical environment
    const nextContinuationOptions = { lexicalEnvironment: cloneLexicalEnvironment(lexicalEnvironment) };
    const nameContResult = node.name == null ? undefined : typescript.isIdentifier(node.name) ? node.name : continuation(node.name, nextContinuationOptions);
    const typeParametersContResult = node.typeParameters == null ? undefined : node.typeParameters.map(typeParameter => continuation(typeParameter, nextContinuationOptions));
    const parametersContResult = node.parameters.map(parameter => continuation(parameter, nextContinuationOptions));
    const typeContResult = node.type == null ? undefined : continuation(node.type, nextContinuationOptions);
    const isIdentical = nameContResult === node.name &&
        nodeArraysAreEqual(typeParametersContResult, node.typeParameters) &&
        nodeArraysAreEqual(parametersContResult, node.parameters) &&
        typeContResult === node.type;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(compatFactory.updateIndexSignature(node, node.decorators, node.modifiers, parametersContResult, typeContResult), node, options);
}

/**
 * Deconflicts the given MethodSignature.
 */
function deconflictMethodSignature(options) {
    const { node, continuation, lexicalEnvironment, compatFactory, typescript } = options;
    const nameContResult = typescript.isIdentifier(node.name) ? node.name : continuation(node.name, { lexicalEnvironment });
    // The type, type parameters, as well as the parameters share the same lexical environment
    const nextContinuationOptions = { lexicalEnvironment: cloneLexicalEnvironment(lexicalEnvironment) };
    const typeParametersContResult = node.typeParameters == null ? undefined : compatFactory.createNodeArray(node.typeParameters.map(typeParameter => continuation(typeParameter, nextContinuationOptions)));
    const parametersContResult = compatFactory.createNodeArray(node.parameters.map(parameter => continuation(parameter, nextContinuationOptions)));
    const typeContResult = node.type == null ? undefined : continuation(node.type, nextContinuationOptions);
    const isIdentical = nameContResult === node.name &&
        nodeArraysAreEqual(typeParametersContResult, node.typeParameters) &&
        nodeArraysAreEqual(parametersContResult, node.parameters) &&
        typeContResult === node.type;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(isNodeFactory(compatFactory)
        ? compatFactory.updateMethodSignature(node, node.modifiers, nameContResult, node.questionToken, typeParametersContResult, parametersContResult, typeContResult)
        : compatFactory.updateMethodSignature(node, typeParametersContResult, parametersContResult, typeContResult, nameContResult, node.questionToken), node, options);
}

/**
 * Deconflicts the given ModuleDeclaration.
 */
function deconflictModuleDeclaration(options) {
    var _a;
    const { node, continuation, lexicalEnvironment, compatFactory, typescript, sourceFile, declarationToDeconflictedBindingMap } = options;
    let nameContResult;
    const id = getIdForNode(options);
    const originalSourceFile = getOriginalSourceFile(node.name, sourceFile, typescript);
    // Check if it is a namespace ModuleDeclaration. If it is, its name can be deconflicted. If it isn't, it should augment and merge with any existing declarations for it
    const isNamespace = (node.flags & typescript.NodeFlags.Namespace) !== 0;
    if (!isNamespace) {
        const binding = (_a = getBindingFromLexicalEnvironment(lexicalEnvironment, node.name.text)) !== null && _a !== void 0 ? _a : node.name.text;
        // The body has its own lexical environment
        const nextContinuationOptions = { lexicalEnvironment: cloneLexicalEnvironment(lexicalEnvironment) };
        const bodyContResult = node.body == null ? undefined : continuation(node.body, nextContinuationOptions);
        const isIdentical = binding === node.name.text && bodyContResult === node.body;
        if (isIdentical) {
            return node;
        }
        else {
            return preserveMeta(compatFactory.updateModuleDeclaration(node, node.decorators, node.modifiers, compatFactory.createIdentifier(binding), bodyContResult), node, options);
        }
    }
    if (isIdentifierFree(lexicalEnvironment, node.name.text, originalSourceFile.fileName)) {
        nameContResult = node.name;
        if (id != null)
            declarationToDeconflictedBindingMap.set(id, node.name.text);
        // The name creates a new local binding within the current LexicalEnvironment
        addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, node.name.text);
    }
    else {
        // Otherwise, deconflict it
        const uniqueBinding = generateUniqueBinding(lexicalEnvironment, node.name.text);
        nameContResult = compatFactory.createIdentifier(uniqueBinding);
        if (id != null)
            declarationToDeconflictedBindingMap.set(id, uniqueBinding);
        // The name creates a new local binding within the current LexicalEnvironment
        addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, uniqueBinding, node.name.text);
    }
    // The body has its own lexical environment
    const nextContinuationOptions = { lexicalEnvironment: cloneLexicalEnvironment(lexicalEnvironment) };
    const bodyContResult = node.body == null ? undefined : continuation(node.body, nextContinuationOptions);
    const isIdentical = nameContResult === node.name && bodyContResult === node.body;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(compatFactory.updateModuleDeclaration(node, node.decorators, node.modifiers, nameContResult, bodyContResult), node, options);
}

/**
 * Deconflicts the given NamespaceImport.
 */
function deconflictNamespaceImport(options) {
    const { node, lexicalEnvironment, sourceFile, compatFactory, typescript, declarationToDeconflictedBindingMap } = options;
    let nameContResult;
    const originalSourceFile = getOriginalSourceFile(node, sourceFile, typescript);
    const id = getIdForNode(options);
    if (isIdentifierFree(lexicalEnvironment, node.name.text, originalSourceFile.fileName)) {
        nameContResult = node.name;
        if (id != null) {
            declarationToDeconflictedBindingMap.set(id, node.name.text);
        }
        // The name creates a new local binding within the current LexicalEnvironment
        addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, node.name.text);
    }
    else {
        // Otherwise, deconflict it
        const uniqueBinding = generateUniqueBinding(lexicalEnvironment, node.name.text);
        nameContResult = compatFactory.createIdentifier(uniqueBinding);
        if (id != null) {
            declarationToDeconflictedBindingMap.set(id, uniqueBinding);
        }
        // The name creates a new local binding within the current LexicalEnvironment
        addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, uniqueBinding, node.name.text);
    }
    const isIdentical = nameContResult === node.name;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(compatFactory.updateNamespaceImport(node, nameContResult), node, options);
}

/**
 * Deconflicts the given ParameterDeclaration.
 */
function deconflictParameterDeclaration(options) {
    const { node, continuation, lexicalEnvironment, compatFactory, typescript } = options;
    const nameContResult = typescript.isIdentifier(node.name) ? node.name : continuation(node.name, { lexicalEnvironment });
    const typeContResult = node.type == null ? undefined : continuation(node.type, { lexicalEnvironment });
    const initializerContResult = node.initializer == null ? undefined : continuation(node.initializer, { lexicalEnvironment });
    const isIdentical = nameContResult === node.name && typeContResult === node.type && initializerContResult === node.initializer;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(isNodeFactory(compatFactory)
        ? compatFactory.updateParameterDeclaration(node, node.decorators, node.modifiers, node.dotDotDotToken, nameContResult, node.questionToken, typeContResult, initializerContResult)
        : compatFactory.updateParameter(node, node.decorators, node.modifiers, node.dotDotDotToken, nameContResult, node.questionToken, typeContResult, initializerContResult), node, options);
}

/**
 * Deconflicts the given PropertyAssignment.
 */
function deconflictPropertyAssignment(options) {
    const { node, continuation, lexicalEnvironment, compatFactory, typescript } = options;
    const nameContResult = typescript.isIdentifier(node.name) ? node.name : continuation(node.name, { lexicalEnvironment });
    const initializerContResult = node.initializer == null ? undefined : continuation(node.initializer, { lexicalEnvironment });
    const isIdentical = nameContResult === node.name && initializerContResult === node.initializer;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(compatFactory.updatePropertyAssignment(node, nameContResult, initializerContResult), node, options);
}

/**
 * Deconflicts the given PropertyDeclaration.
 */
function deconflictPropertyDeclaration(options) {
    var _a, _b;
    const { node, continuation, lexicalEnvironment, compatFactory, typescript } = options;
    const nameContResult = typescript.isIdentifier(node.name) ? node.name : continuation(node.name, { lexicalEnvironment });
    const typeContResult = node.type == null ? undefined : continuation(node.type, { lexicalEnvironment });
    const initializerContResult = node.initializer == null ? undefined : continuation(node.initializer, { lexicalEnvironment });
    const isIdentical = nameContResult === node.name && typeContResult === node.type && initializerContResult === node.initializer;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(isNodeFactory(compatFactory)
        ? compatFactory.updatePropertyDeclaration(node, node.decorators, node.modifiers, nameContResult, (_a = node.questionToken) !== null && _a !== void 0 ? _a : node.exclamationToken, typeContResult, initializerContResult)
        : compatFactory.updateProperty(node, node.decorators, node.modifiers, nameContResult, (_b = node.questionToken) !== null && _b !== void 0 ? _b : node.exclamationToken, typeContResult, initializerContResult), node, options);
}

/**
 * Deconflicts the given PropertySignature.
 */
function deconflictPropertySignature(options) {
    const { node, continuation, lexicalEnvironment, compatFactory, typescript } = options;
    const nameContResult = typescript.isIdentifier(node.name) ? node.name : continuation(node.name, { lexicalEnvironment });
    const typeContResult = node.type == null ? undefined : continuation(node.type, { lexicalEnvironment });
    const initializerContResult = node.initializer == null ? undefined : continuation(node.initializer, { lexicalEnvironment });
    const isIdentical = nameContResult === node.name && typeContResult === node.type && initializerContResult === node.initializer;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(compatFactory.updatePropertySignature(node, node.modifiers, nameContResult, node.questionToken, typeContResult, initializerContResult), node, options);
}

/**
 * Deconflicts the given SetAccessorDeclaration.
 */
function deconflictSetAccessorDeclaration(options) {
    const { node, continuation, lexicalEnvironment, compatFactory, typescript } = options;
    const nameContResult = typescript.isIdentifier(node.name) ? node.name : continuation(node.name, { lexicalEnvironment });
    // The body, as well as the parameters share the same lexical environment
    const nextContinuationOptions = { lexicalEnvironment: cloneLexicalEnvironment(lexicalEnvironment) };
    const parametersContResult = node.parameters.map(parameter => continuation(parameter, nextContinuationOptions));
    const bodyContResult = node.body == null ? undefined : continuation(node.body, nextContinuationOptions);
    const isIdentical = nameContResult === node.name && nodeArraysAreEqual(parametersContResult, node.parameters) && bodyContResult === node.body;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(isNodeFactory(compatFactory)
        ? compatFactory.updateSetAccessorDeclaration(node, node.decorators, node.modifiers, nameContResult, parametersContResult, bodyContResult)
        : compatFactory.updateSetAccessor(node, node.decorators, node.modifiers, nameContResult, parametersContResult, bodyContResult), node, options);
}

/**
 * Deconflicts the given TypeAliasDeclaration.
 */
function deconflictTypeAliasDeclaration(options) {
    const { node, continuation, lexicalEnvironment, compatFactory, typescript, sourceFile, declarationToDeconflictedBindingMap } = options;
    let nameContResult;
    const id = getIdForNode(options);
    const originalSourceFile = getOriginalSourceFile(node, sourceFile, typescript);
    if (isIdentifierFree(lexicalEnvironment, node.name.text, originalSourceFile.fileName)) {
        nameContResult = node.name;
        if (id != null)
            declarationToDeconflictedBindingMap.set(id, node.name.text);
        // The name creates a new local binding within the current LexicalEnvironment
        addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, node.name.text);
    }
    else {
        // Otherwise, deconflict it
        const uniqueBinding = generateUniqueBinding(lexicalEnvironment, node.name.text);
        nameContResult = compatFactory.createIdentifier(uniqueBinding);
        if (id != null)
            declarationToDeconflictedBindingMap.set(id, uniqueBinding);
        // The name creates a new local binding within the current LexicalEnvironment
        addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, uniqueBinding, node.name.text);
    }
    // The Type parameters, as well as the initializer, share the same lexical environment
    const nextContinuationOptions = { lexicalEnvironment: cloneLexicalEnvironment(lexicalEnvironment) };
    const typeParametersContResult = node.typeParameters == null ? undefined : node.typeParameters.map(typeParameter => continuation(typeParameter, nextContinuationOptions));
    const typeContResult = continuation(node.type, nextContinuationOptions);
    const isIdentical = nameContResult === node.name && nodeArraysAreEqual(typeParametersContResult, node.typeParameters) && typeContResult === node.type;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(compatFactory.updateTypeAliasDeclaration(node, node.decorators, node.modifiers, nameContResult, typeParametersContResult, typeContResult), node, options);
}

/**
 * Deconflicts the given TypeParameterDeclaration.
 */
function deconflictTypeParameterDeclaration(options) {
    const { node, continuation, lexicalEnvironment, compatFactory, typescript, sourceFile, declarationToDeconflictedBindingMap } = options;
    let nameContResult;
    const id = getIdForNode(options);
    const originalSourceFile = getOriginalSourceFile(node, sourceFile, typescript);
    if (isIdentifierFree(lexicalEnvironment, node.name.text, originalSourceFile.fileName)) {
        nameContResult = node.name;
        if (id != null)
            declarationToDeconflictedBindingMap.set(id, node.name.text);
        // The name creates a new local binding within the current LexicalEnvironment
        addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, node.name.text);
    }
    else {
        // Otherwise, deconflict it
        const uniqueBinding = generateUniqueBinding(lexicalEnvironment, node.name.text);
        nameContResult = compatFactory.createIdentifier(uniqueBinding);
        if (id != null)
            declarationToDeconflictedBindingMap.set(id, uniqueBinding);
        // The name creates a new local binding within the current LexicalEnvironment
        addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, uniqueBinding, node.name.text);
    }
    const constraintContResult = node.constraint == null ? undefined : continuation(node.constraint, { lexicalEnvironment });
    const defaultContResult = node.default == null ? undefined : continuation(node.default, { lexicalEnvironment });
    const isIdentical = constraintContResult === node.constraint && defaultContResult === node.default;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(compatFactory.updateTypeParameterDeclaration(node, nameContResult, constraintContResult, defaultContResult), node, options);
}

/**
 * Deconflicts the given VariableDeclaration.
 */
function deconflictVariableDeclaration(options) {
    const { node, continuation, lexicalEnvironment, compatFactory, typescript, sourceFile, declarationToDeconflictedBindingMap } = options;
    let nameContResult;
    if (typescript.isIdentifier(node.name)) {
        const id = getIdForNode(options);
        const originalSourceFile = getOriginalSourceFile(node, sourceFile, typescript);
        if (isIdentifierFree(lexicalEnvironment, node.name.text, originalSourceFile.fileName)) {
            nameContResult = node.name;
            if (id != null)
                declarationToDeconflictedBindingMap.set(id, node.name.text);
            // The name creates a new local binding within the current LexicalEnvironment
            addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, node.name.text);
        }
        else {
            // Otherwise, deconflict it
            const uniqueBinding = generateUniqueBinding(lexicalEnvironment, node.name.text);
            nameContResult = compatFactory.createIdentifier(uniqueBinding);
            if (id != null)
                declarationToDeconflictedBindingMap.set(id, uniqueBinding);
            // The name creates a new local binding within the current LexicalEnvironment
            addBindingToLexicalEnvironment(lexicalEnvironment, originalSourceFile.fileName, uniqueBinding, node.name.text);
        }
    }
    else {
        // Otherwise, deconflict it
        nameContResult = continuation(node.name, { lexicalEnvironment });
    }
    const typeContResult = node.type == null ? undefined : continuation(node.type, { lexicalEnvironment });
    const initializerContResult = node.initializer == null ? undefined : continuation(node.initializer, { lexicalEnvironment });
    const isIdentical = nameContResult === node.name && typeContResult === node.type && initializerContResult === node.initializer;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(isNodeFactory(compatFactory)
        ? compatFactory.updateVariableDeclaration(node, nameContResult, node.exclamationToken, typeContResult, initializerContResult)
        : compatFactory.updateVariableDeclaration(node, nameContResult, typeContResult, initializerContResult), node, options);
}

/**
 * Deconflicts the given FunctionTypeNode.
 */
function deconflictFunctionTypeNode(options) {
    const { node, continuation, lexicalEnvironment, compatFactory } = options;
    let nameContResult;
    // The body, type, type parameters, as well as the parameters share the same lexical environment
    const nextContinuationOptions = { lexicalEnvironment: cloneLexicalEnvironment(lexicalEnvironment) };
    const typeParametersContResult = node.typeParameters == null ? undefined : compatFactory.createNodeArray(node.typeParameters.map(typeParameter => continuation(typeParameter, nextContinuationOptions)));
    const parametersContResult = compatFactory.createNodeArray(node.parameters.map(parameter => continuation(parameter, nextContinuationOptions)));
    const typeContResult = node.type == null ? undefined : continuation(node.type, nextContinuationOptions);
    const isIdentical = nameContResult === node.name &&
        nodeArraysAreEqual(typeParametersContResult, node.typeParameters) &&
        nodeArraysAreEqual(parametersContResult, node.parameters) &&
        typeContResult === node.type;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(compatFactory.updateFunctionTypeNode(node, typeParametersContResult, parametersContResult, typeContResult), node, options);
}

/**
 * Deconflicts the given ImportTypeNode.
 */
function deconflictImportTypeNode(options) {
    const { node, continuation, lexicalEnvironment, compatFactory } = options;
    const argumentContResult = continuation(node.argument, { lexicalEnvironment });
    const typeArgumentsContResult = node.typeArguments == null ? undefined : node.typeArguments.map(typeArgument => continuation(typeArgument, { lexicalEnvironment }));
    const isIdentical = argumentContResult === node.argument && nodeArraysAreEqual(typeArgumentsContResult, node.typeArguments);
    if (isIdentical) {
        return node;
    }
    return preserveMeta(compatFactory.updateImportTypeNode(node, argumentContResult, node.qualifier, typeArgumentsContResult, node.isTypeOf), node, options);
}

/**
 * Deconflicts the given ConstructorDeclaration.
 */
function deconflictConstructorDeclaration(options) {
    var _a, _b;
    const { node, continuation, lexicalEnvironment, compatFactory } = options;
    // The body and parameters share the same lexical environment
    const nextContinuationOptions = { lexicalEnvironment: cloneLexicalEnvironment(lexicalEnvironment) };
    const parametersContResult = (_b = (_a = node.parameters) === null || _a === void 0 ? void 0 : _a.map(parameter => continuation(parameter, nextContinuationOptions))) !== null && _b !== void 0 ? _b : [];
    const bodyContResult = node.body == null ? undefined : continuation(node.body, nextContinuationOptions);
    const isIdentical = nodeArraysAreEqual(parametersContResult, node.parameters) && bodyContResult === node.body;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(isNodeFactory(compatFactory)
        ? compatFactory.updateConstructorDeclaration(node, node.decorators, node.modifiers, parametersContResult, bodyContResult)
        : compatFactory.updateConstructor(node, node.decorators, node.modifiers, parametersContResult, bodyContResult), node, options);
}

/**
 * Deconflicts the given CallSignature.
 */
function deconflictCallSignatureDeclaration(options) {
    const { node, continuation, lexicalEnvironment, compatFactory } = options;
    // The type, type parameters, as well as the parameters share the same lexical environment
    const nextContinuationOptions = { lexicalEnvironment: cloneLexicalEnvironment(lexicalEnvironment) };
    const typeParametersContResult = node.typeParameters == null ? undefined : compatFactory.createNodeArray(node.typeParameters.map(typeParameter => continuation(typeParameter, nextContinuationOptions)));
    const parametersContResult = compatFactory.createNodeArray(node.parameters.map(parameter => continuation(parameter, nextContinuationOptions)));
    const typeContResult = node.type == null ? undefined : continuation(node.type, nextContinuationOptions);
    const isIdentical = nodeArraysAreEqual(typeParametersContResult, node.typeParameters) &&
        nodeArraysAreEqual(parametersContResult, node.parameters) &&
        typeContResult === node.type;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(compatFactory.updateCallSignature(node, typeParametersContResult, parametersContResult, typeContResult), node, options);
}

/**
 * Deconflicts the given QualifiedName.
 */
function deconflictQualifiedName(options) {
    const { node, continuation, lexicalEnvironment, compatFactory } = options;
    const leftContResult = continuation(node.left, { lexicalEnvironment });
    const isIdentical = leftContResult === node.left;
    if (isIdentical) {
        return node;
    }
    return preserveMeta(compatFactory.updateQualifiedName(node, leftContResult, node.right), node, options);
}

/**
 * Deconflicts the given Node. Everything but LValues will be updated here
 */
function deconflictNode(_a) {
    var _b, _c;
    var { node } = _a, options = tslib.__rest(_a, ["node"]);
    if (options.typescript.isBindingElement(node)) {
        return deconflictBindingElement(Object.assign({ node }, options));
    }
    else if (options.typescript.isQualifiedName(node)) {
        return deconflictQualifiedName(Object.assign({ node }, options));
    }
    else if (options.typescript.isClassDeclaration(node)) {
        return deconflictClassDeclaration(Object.assign({ node }, options));
    }
    else if (options.typescript.isClassExpression(node)) {
        return deconflictClassExpression(Object.assign({ node }, options));
    }
    else if (options.typescript.isEnumDeclaration(node)) {
        return deconflictEnumDeclaration(Object.assign({ node }, options));
    }
    else if (options.typescript.isEnumMember(node)) {
        return deconflictEnumMember(Object.assign({ node }, options));
    }
    else if (options.typescript.isExportSpecifier(node)) {
        return deconflictExportSpecifier(Object.assign({ node }, options));
    }
    else if (options.typescript.isFunctionDeclaration(node)) {
        return deconflictFunctionDeclaration(Object.assign({ node }, options));
    }
    else if (options.typescript.isFunctionExpression(node)) {
        return deconflictFunctionExpression(Object.assign({ node }, options));
    }
    else if (options.typescript.isConstructorDeclaration(node)) {
        return deconflictConstructorDeclaration(Object.assign({ node }, options));
    }
    else if (options.typescript.isFunctionTypeNode(node)) {
        return deconflictFunctionTypeNode(Object.assign({ node }, options));
    }
    else if (options.typescript.isGetAccessorDeclaration(node)) {
        return deconflictGetAccessorDeclaration(Object.assign({ node }, options));
    }
    else if (options.typescript.isIdentifier(node)) {
        return deconflictIdentifier(Object.assign({ node }, options));
    }
    else if (options.typescript.isImportClause(node)) {
        return deconflictImportClause(Object.assign({ node }, options));
    }
    else if (options.typescript.isImportSpecifier(node)) {
        return deconflictImportSpecifier(Object.assign({ node }, options));
    }
    else if (options.typescript.isInterfaceDeclaration(node)) {
        return deconflictInterfaceDeclaration(Object.assign({ node }, options));
    }
    // MappedTypeNodes may not be part of the current Typescript version, hence the optional call
    else if ((_c = (_b = options.typescript).isMappedTypeNode) === null || _c === void 0 ? void 0 : _c.call(_b, node)) {
        return deconflictMappedTypeNode(Object.assign({ node }, options));
    }
    else if (options.typescript.isMethodDeclaration(node)) {
        return deconflictMethodDeclaration(Object.assign({ node }, options));
    }
    else if (options.typescript.isIndexSignatureDeclaration(node)) {
        return deconflictIndexSignatureDeclaration(Object.assign({ node }, options));
    }
    else if (options.typescript.isMethodSignature(node)) {
        return deconflictMethodSignature(Object.assign({ node }, options));
    }
    else if (options.typescript.isCallSignatureDeclaration(node)) {
        return deconflictCallSignatureDeclaration(Object.assign({ node }, options));
    }
    else if (options.typescript.isModuleDeclaration(node)) {
        return deconflictModuleDeclaration(Object.assign({ node }, options));
    }
    else if (options.typescript.isNamespaceImport(node)) {
        return deconflictNamespaceImport(Object.assign({ node }, options));
    }
    else if (options.typescript.isParameter(node)) {
        return deconflictParameterDeclaration(Object.assign({ node }, options));
    }
    else if (options.typescript.isPropertyAssignment(node)) {
        return deconflictPropertyAssignment(Object.assign({ node }, options));
    }
    else if (options.typescript.isPropertyDeclaration(node)) {
        return deconflictPropertyDeclaration(Object.assign({ node }, options));
    }
    else if (options.typescript.isPropertySignature(node)) {
        return deconflictPropertySignature(Object.assign({ node }, options));
    }
    else if (options.typescript.isSetAccessorDeclaration(node)) {
        return deconflictSetAccessorDeclaration(Object.assign({ node }, options));
    }
    else if (options.typescript.isTypeAliasDeclaration(node)) {
        return deconflictTypeAliasDeclaration(Object.assign({ node }, options));
    }
    else if (options.typescript.isImportTypeNode(node)) {
        return deconflictImportTypeNode(Object.assign({ node }, options));
    }
    else if (options.typescript.isTypeParameterDeclaration(node)) {
        return deconflictTypeParameterDeclaration(Object.assign({ node }, options));
    }
    else if (options.typescript.isVariableDeclaration(node)) {
        return deconflictVariableDeclaration(Object.assign({ node }, options));
    }
    else
        return options.childContinuation(node, { lexicalEnvironment: options.lexicalEnvironment });
}
/**
 * Deconflicts local bindings
 */
function deconflicter(options) {
    const { typescript, context, sourceFile, pluginOptions, printer, lexicalEnvironment } = options;
    const fullBenchmark = shouldDebugMetrics(pluginOptions.debug, sourceFile) ? logMetrics(`Deconflicting`, sourceFile.fileName) : undefined;
    const transformationLog = shouldDebugSourceFile(pluginOptions.debug, sourceFile) ? logTransformer("Deconflicting", sourceFile, printer) : undefined;
    // Prepare some VisitorOptions
    const visitorOptions = Object.assign(Object.assign({}, options), { childContinuation: (node, continuationOptions) => typescript.visitEachChild(node, nextNode => deconflictNode(Object.assign(Object.assign(Object.assign({}, visitorOptions), continuationOptions), { node: nextNode })), context), continuation: (node, continuationOptions) => deconflictNode(Object.assign(Object.assign(Object.assign({}, visitorOptions), continuationOptions), { node })) });
    const result = preserveMeta(typescript.visitEachChild(sourceFile, nextNode => visitorOptions.continuation(nextNode, { lexicalEnvironment }), context), sourceFile, options);
    transformationLog === null || transformationLog === void 0 ? void 0 : transformationLog.finish(result);
    fullBenchmark === null || fullBenchmark === void 0 ? void 0 : fullBenchmark.finish();
    return result;
}

function visitClassDeclaration$2(options) {
    const { node, typescript, compatFactory } = options;
    if (hasDeclareModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateClassDeclaration(node, node.decorators, ensureHasDeclareModifier(node.modifiers, compatFactory, typescript), node.name, node.typeParameters, node.heritageClauses, node.members), node, options);
}

function visitClassExpression$2(options) {
    const { node, typescript, compatFactory } = options;
    if (hasDeclareModifier(node, typescript))
        return node;
    return preserveMeta(isNodeFactory(compatFactory)
        ? compatFactory.updateClassExpression(node, node.decorators, ensureHasDeclareModifier(node.modifiers, compatFactory, typescript), node.name, node.typeParameters, node.heritageClauses, node.members)
        : compatFactory.updateClassExpression(node, ensureHasDeclareModifier(node.modifiers, compatFactory, typescript), node.name, node.typeParameters, node.heritageClauses, node.members), node, options);
}

function visitFunctionDeclaration$2(options) {
    const { node, compatFactory, typescript } = options;
    if (hasDeclareModifier(node, typescript))
        return node;
    return preserveMeta(isNodeFactory(compatFactory)
        ? compatFactory.updateFunctionDeclaration(node, node.decorators, ensureHasDeclareModifier(node.modifiers, compatFactory, typescript), node.asteriskToken, node.name, node.typeParameters, node.parameters, node.type, node.body)
        : compatFactory.updateFunctionDeclaration(node, node.decorators, ensureHasDeclareModifier(node.modifiers, compatFactory, typescript), node.asteriskToken, node.name, node.typeParameters, node.parameters, node.type, node.body), node, options);
}

function visitFunctionExpression$2(options) {
    const { node, compatFactory, typescript } = options;
    if (hasDeclareModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateFunctionExpression(node, ensureHasDeclareModifier(node.modifiers, compatFactory, typescript), node.asteriskToken, node.name, node.typeParameters, node.parameters, node.type, node.body), node, options);
}

function visitEnumDeclaration$2(options) {
    const { node, compatFactory, typescript } = options;
    if (hasDeclareModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateEnumDeclaration(node, node.decorators, ensureHasDeclareModifier(node.modifiers, compatFactory, typescript), node.name, node.members), node, options);
}

function visitVariableStatement$2(options) {
    const { node, compatFactory, typescript } = options;
    if (hasDeclareModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateVariableStatement(node, ensureHasDeclareModifier(node.modifiers, compatFactory, typescript), node.declarationList), node, options);
}

function visitInterfaceDeclaration$2(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasDeclareModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateInterfaceDeclaration(node, node.decorators, removeDeclareModifier(node.modifiers, typescript), node.name, node.typeParameters, node.heritageClauses, node.members), node, options);
}

function visitModuleDeclaration$4(options) {
    const { node, compatFactory, typescript } = options;
    if (hasDeclareModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateModuleDeclaration(node, node.decorators, ensureHasDeclareModifier(node.modifiers, compatFactory, typescript), node.name, node.body), node, options);
}

function visitTypeAliasDeclaration$2(options) {
    const { node, compatFactory, typescript } = options;
    if (!hasDeclareModifier(node, typescript))
        return node;
    return preserveMeta(compatFactory.updateTypeAliasDeclaration(node, node.decorators, removeDeclareModifier(node.modifiers, typescript), node.name, node.typeParameters, node.type), node, options);
}

function visitNode$5(_a) {
    var { node } = _a, options = tslib.__rest(_a, ["node"]);
    if (options.typescript.isClassDeclaration(node)) {
        return visitClassDeclaration$2(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isClassExpression(node)) {
        return visitClassExpression$2(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isFunctionDeclaration(node)) {
        return visitFunctionDeclaration$2(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isFunctionExpression(node)) {
        return visitFunctionExpression$2(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isEnumDeclaration(node)) {
        return visitEnumDeclaration$2(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isInterfaceDeclaration(node)) {
        return visitInterfaceDeclaration$2(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isTypeAliasDeclaration(node)) {
        return visitTypeAliasDeclaration$2(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isModuleDeclaration(node)) {
        return visitModuleDeclaration$4(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isVariableStatement(node)) {
        return visitVariableStatement$2(Object.assign(Object.assign({}, options), { node }));
    }
    else {
        // Only consider root-level statements here
        return node;
    }
}

function ensureDeclareModifierTransformer(options) {
    const { typescript, context, sourceFile, pluginOptions, printer } = options;
    const fullBenchmark = shouldDebugMetrics(pluginOptions.debug, sourceFile) ? logMetrics(`Ensuring declare modifiers`, sourceFile.fileName) : undefined;
    const transformationLog = shouldDebugSourceFile(pluginOptions.debug, sourceFile) ? logTransformer("Ensuring declare modifiers", sourceFile, printer) : undefined;
    // Prepare some VisitorOptions
    const visitorOptions = Object.assign(Object.assign({}, options), { childContinuation: (node) => typescript.visitEachChild(node, nextNode => visitNode$5(Object.assign(Object.assign({}, visitorOptions), { node: nextNode })), context), continuation: (node) => visitNode$5(Object.assign(Object.assign({}, visitorOptions), { node })) });
    const result = preserveMeta(typescript.visitEachChild(sourceFile, nextNode => visitorOptions.continuation(nextNode), context), sourceFile, options);
    transformationLog === null || transformationLog === void 0 ? void 0 : transformationLog.finish(result);
    fullBenchmark === null || fullBenchmark === void 0 ? void 0 : fullBenchmark.finish();
    return result;
}

function visitModuleDeclaration$3({ node, typescript }) {
    if (node.body == null)
        return undefined;
    if (typescript.isModuleBlock(node.body) && typescript.isStringLiteralLike(node.name)) {
        return [...node.body.statements];
    }
    return node;
}

function visitNode$4(_a) {
    var { node } = _a, options = tslib.__rest(_a, ["node"]);
    if (options.typescript.isModuleDeclaration(node)) {
        return visitModuleDeclaration$3(Object.assign(Object.assign({}, options), { node }));
    }
    else {
        return options.childContinuation(node);
    }
}

function moduleBlockExtractor(options) {
    const { typescript, context, sourceFile, pluginOptions, printer } = options;
    const fullBenchmark = shouldDebugMetrics(pluginOptions.debug, sourceFile) ? logMetrics(`Extracting module blocks`, sourceFile.fileName) : undefined;
    const transformationLog = shouldDebugSourceFile(pluginOptions.debug, sourceFile) ? logTransformer("Extracting module blocks", sourceFile, printer) : undefined;
    // Prepare some VisitorOptions
    const visitorOptions = Object.assign(Object.assign({}, options), { childContinuation: (node) => typescript.visitEachChild(node, nextNode => visitNode$4(Object.assign(Object.assign({}, visitorOptions), { node: nextNode })), context), continuation: (node) => visitNode$4(Object.assign(Object.assign({}, visitorOptions), { node })) });
    const result = preserveMeta(typescript.visitEachChild(sourceFile, nextNode => visitorOptions.continuation(nextNode), context), sourceFile, options);
    transformationLog === null || transformationLog === void 0 ? void 0 : transformationLog.finish(result);
    fullBenchmark === null || fullBenchmark === void 0 ? void 0 : fullBenchmark.finish();
    return result;
}

function checkClassDeclaration({ node, continuation, markIdentifiersAsReferenced }) {
    const referencedIdentifiers = [];
    if (node.heritageClauses != null) {
        for (const heritageClause of node.heritageClauses) {
            referencedIdentifiers.push(...continuation(heritageClause));
        }
    }
    if (node.typeParameters != null) {
        for (const typeParameter of node.typeParameters) {
            referencedIdentifiers.push(...continuation(typeParameter));
        }
    }
    for (const member of node.members) {
        referencedIdentifiers.push(...continuation(member));
    }
    markIdentifiersAsReferenced(node, ...referencedIdentifiers);
    return referencedIdentifiers;
}

function isSymbolIdentifier(node, typescript) {
    return typescript.isIdentifier(node) && node.text.startsWith("[") && node.text.endsWith("]");
}

function checkIdentifier({ node, typescript }) {
    return isSymbolIdentifier(node, typescript) ? [node.text.slice(1, -1)] : [node.text];
}

function checkClassExpression({ node, continuation, markIdentifiersAsReferenced }) {
    const referencedIdentifiers = [];
    if (node.heritageClauses != null) {
        for (const heritageClause of node.heritageClauses) {
            referencedIdentifiers.push(...continuation(heritageClause));
        }
    }
    if (node.typeParameters != null) {
        for (const typeParameter of node.typeParameters) {
            referencedIdentifiers.push(...continuation(typeParameter));
        }
    }
    for (const member of node.members) {
        referencedIdentifiers.push(...continuation(member));
    }
    markIdentifiersAsReferenced(node, ...referencedIdentifiers);
    return referencedIdentifiers;
}

function checkInterfaceDeclaration({ node, continuation, markIdentifiersAsReferenced }) {
    const referencedIdentifiers = [];
    if (node.heritageClauses != null) {
        for (const heritageClause of node.heritageClauses) {
            referencedIdentifiers.push(...continuation(heritageClause));
        }
    }
    if (node.typeParameters != null) {
        for (const typeParameter of node.typeParameters) {
            referencedIdentifiers.push(...continuation(typeParameter));
        }
    }
    for (const member of node.members) {
        referencedIdentifiers.push(...continuation(member));
    }
    markIdentifiersAsReferenced(node, ...referencedIdentifiers);
    return referencedIdentifiers;
}

function checkEnumDeclaration({ node, continuation, markIdentifiersAsReferenced }) {
    const referencedIdentifiers = [];
    for (const member of node.members) {
        referencedIdentifiers.push(...continuation(member));
    }
    markIdentifiersAsReferenced(node, ...referencedIdentifiers);
    return referencedIdentifiers;
}

function checkTypeAliasDeclaration({ node, continuation, markIdentifiersAsReferenced }) {
    const referencedIdentifiers = [];
    if (node.typeParameters != null) {
        for (const typeParameter of node.typeParameters) {
            referencedIdentifiers.push(...continuation(typeParameter));
        }
    }
    referencedIdentifiers.push(...continuation(node.type));
    markIdentifiersAsReferenced(node, ...referencedIdentifiers);
    return referencedIdentifiers;
}

function checkFunctionDeclaration({ node, continuation, markIdentifiersAsReferenced }) {
    const referencedIdentifiers = [];
    for (const parameter of node.parameters) {
        referencedIdentifiers.push(...continuation(parameter));
    }
    if (node.typeParameters != null) {
        for (const typeParameter of node.typeParameters) {
            referencedIdentifiers.push(...continuation(typeParameter));
        }
    }
    if (node.body != null) {
        referencedIdentifiers.push(...continuation(node.body));
    }
    if (node.type != null) {
        referencedIdentifiers.push(...continuation(node.type));
    }
    markIdentifiersAsReferenced(node, ...referencedIdentifiers);
    return referencedIdentifiers;
}

function checkFunctionExpression({ node, continuation, markIdentifiersAsReferenced }) {
    const referencedIdentifiers = [];
    for (const parameter of node.parameters) {
        referencedIdentifiers.push(...continuation(parameter));
    }
    if (node.typeParameters != null) {
        for (const typeParameter of node.typeParameters) {
            referencedIdentifiers.push(...continuation(typeParameter));
        }
    }
    if (node.body != null) {
        referencedIdentifiers.push(...continuation(node.body));
    }
    if (node.type != null) {
        referencedIdentifiers.push(...continuation(node.type));
    }
    markIdentifiersAsReferenced(node, ...referencedIdentifiers);
    return referencedIdentifiers;
}

function checkVariableDeclaration({ node, continuation }) {
    const referencedIdentifiers = [];
    if (node.initializer != null) {
        referencedIdentifiers.push(...continuation(node.initializer));
    }
    if (node.type != null) {
        referencedIdentifiers.push(...continuation(node.type));
    }
    return referencedIdentifiers;
}

function checkExportSpecifier({ node, continuation }) {
    const referencedIdentifiers = [];
    if (node.propertyName != null) {
        referencedIdentifiers.push(...continuation(node.propertyName));
    }
    else if (node.propertyName == null) {
        referencedIdentifiers.push(...continuation(node.name));
    }
    return referencedIdentifiers;
}

function checkArrayBindingPattern({ node, continuation }) {
    const referencedIdentifiers = [];
    for (const element of node.elements) {
        referencedIdentifiers.push(...continuation(element));
    }
    return referencedIdentifiers;
}

function checkObjectBindingPattern({ node, continuation }) {
    const referencedIdentifiers = [];
    for (const element of node.elements) {
        referencedIdentifiers.push(...continuation(element));
    }
    return referencedIdentifiers;
}

function checkBindingElement({ node, continuation, typescript }) {
    const referencedIdentifiers = [];
    if (!typescript.isIdentifier(node.name)) {
        referencedIdentifiers.push(...continuation(node.name));
    }
    if (node.initializer != null) {
        referencedIdentifiers.push(...continuation(node.initializer));
    }
    if (node.propertyName != null && !typescript.isIdentifier(node.propertyName)) {
        referencedIdentifiers.push(...continuation(node.propertyName));
    }
    return referencedIdentifiers;
}

function checkMethodDeclaration({ node, continuation, typescript }) {
    const referencedIdentifiers = [];
    if (!typescript.isIdentifier(node.name)) {
        referencedIdentifiers.push(...continuation(node.name));
    }
    for (const parameter of node.parameters) {
        referencedIdentifiers.push(...continuation(parameter));
    }
    if (node.typeParameters != null) {
        for (const typeParameter of node.typeParameters) {
            referencedIdentifiers.push(...continuation(typeParameter));
        }
    }
    if (node.type != null) {
        referencedIdentifiers.push(...continuation(node.type));
    }
    if (node.body != null) {
        referencedIdentifiers.push(...continuation(node.body));
    }
    return referencedIdentifiers;
}

function checkMethodSignature({ node, continuation, typescript }) {
    const referencedIdentifiers = [];
    if (!typescript.isIdentifier(node.name) || isSymbolIdentifier(node.name, typescript)) {
        referencedIdentifiers.push(...continuation(node.name));
    }
    for (const parameter of node.parameters) {
        referencedIdentifiers.push(...continuation(parameter));
    }
    if (node.typeParameters != null) {
        for (const typeParameter of node.typeParameters) {
            referencedIdentifiers.push(...continuation(typeParameter));
        }
    }
    if (node.type != null) {
        referencedIdentifiers.push(...continuation(node.type));
    }
    return referencedIdentifiers;
}

function checkPropertyDeclaration({ node, continuation, typescript }) {
    const referencedIdentifiers = [];
    if (!typescript.isIdentifier(node.name)) {
        referencedIdentifiers.push(...continuation(node.name));
    }
    if (node.type != null) {
        referencedIdentifiers.push(...continuation(node.type));
    }
    if (node.initializer != null) {
        referencedIdentifiers.push(...continuation(node.initializer));
    }
    return referencedIdentifiers;
}

function checkPropertySignature({ node, continuation, typescript }) {
    const referencedIdentifiers = [];
    if (!typescript.isIdentifier(node.name) || isSymbolIdentifier(node.name, typescript)) {
        referencedIdentifiers.push(...continuation(node.name));
    }
    if (node.initializer != null) {
        referencedIdentifiers.push(...continuation(node.initializer));
    }
    if (node.type != null) {
        referencedIdentifiers.push(...continuation(node.type));
    }
    return referencedIdentifiers;
}

function checkGetAccessorDeclaration({ node, continuation, typescript }) {
    const referencedIdentifiers = [];
    if (!typescript.isIdentifier(node.name)) {
        referencedIdentifiers.push(...continuation(node.name));
    }
    for (const parameter of node.parameters) {
        referencedIdentifiers.push(...continuation(parameter));
    }
    if (node.typeParameters != null) {
        for (const typeParameter of node.typeParameters) {
            referencedIdentifiers.push(...continuation(typeParameter));
        }
    }
    if (node.type != null) {
        referencedIdentifiers.push(...continuation(node.type));
    }
    if (node.body != null) {
        referencedIdentifiers.push(...continuation(node.body));
    }
    return referencedIdentifiers;
}

function checkSetAccessorDeclaration({ node, continuation, typescript }) {
    const referencedIdentifiers = [];
    if (!typescript.isIdentifier(node.name)) {
        referencedIdentifiers.push(...continuation(node.name));
    }
    for (const parameter of node.parameters) {
        referencedIdentifiers.push(...continuation(parameter));
    }
    if (node.typeParameters != null) {
        for (const typeParameter of node.typeParameters) {
            referencedIdentifiers.push(...continuation(typeParameter));
        }
    }
    if (node.type != null) {
        referencedIdentifiers.push(...continuation(node.type));
    }
    if (node.body != null) {
        referencedIdentifiers.push(...continuation(node.body));
    }
    return referencedIdentifiers;
}

function checkParameterDeclaration({ node, continuation, typescript }) {
    const referencedIdentifiers = [];
    if (!typescript.isIdentifier(node.name)) {
        referencedIdentifiers.push(...continuation(node.name));
    }
    if (node.type != null) {
        referencedIdentifiers.push(...continuation(node.type));
    }
    if (node.initializer != null) {
        referencedIdentifiers.push(...continuation(node.initializer));
    }
    return referencedIdentifiers;
}

function checkVariableDeclarationList({ node, continuation }) {
    const referencedIdentifiers = [];
    for (const declaration of node.declarations) {
        referencedIdentifiers.push(...continuation(declaration));
    }
    return referencedIdentifiers;
}

function checkVariableStatement({ node, continuation, markIdentifiersAsReferenced }) {
    const referencedIdentifiers = continuation(node.declarationList);
    markIdentifiersAsReferenced(node, ...referencedIdentifiers);
    return referencedIdentifiers;
}

function checkExportDeclaration({ node, continuation, markIdentifiersAsReferenced }) {
    const referencedIdentifiers = [];
    if (node.exportClause != null) {
        referencedIdentifiers.push(...continuation(node.exportClause));
    }
    markIdentifiersAsReferenced(node, ...referencedIdentifiers);
    return referencedIdentifiers;
}

function checkExportAssignment({ node, continuation, markIdentifiersAsReferenced }) {
    const referencedIdentifiers = continuation(node.expression);
    markIdentifiersAsReferenced(node, ...referencedIdentifiers);
    return referencedIdentifiers;
}

function checkModuleDeclaration({ node, continuation, markIdentifiersAsReferenced }) {
    const referencedIdentifiers = [];
    if (node.body != null) {
        referencedIdentifiers.push(...continuation(node.body));
    }
    markIdentifiersAsReferenced(node, ...referencedIdentifiers);
    return referencedIdentifiers;
}

function checkIndexedAccessTypeNode({ node, continuation }) {
    const referencedIdentifiers = [];
    referencedIdentifiers.push(...continuation(node.indexType));
    referencedIdentifiers.push(...continuation(node.objectType));
    return referencedIdentifiers;
}

function checkPropertyAccessExpression({ node, continuation }) {
    return continuation(node.expression);
}

function checkQualifiedName({ node, continuation }) {
    return continuation(node.left);
}

/**
 * Returns true if the given Node contains the given Child Node
 */
function nodeContainsChild(parent, potentialChild) {
    if (parent === potentialChild)
        return false;
    let candidate = potentialChild;
    while (candidate != null) {
        candidate = getParentNode(candidate);
        if (candidate === parent)
            return true;
    }
    return false;
}

function checkTemplateLiteralTypeNode({ node, continuation }) {
    const referencedIdentifiers = [];
    if (node.head != null) {
        referencedIdentifiers.push(...continuation(node.head));
    }
    if (node.templateSpans != null) {
        for (const templateSpan of node.templateSpans) {
            referencedIdentifiers.push(...continuation(templateSpan));
        }
    }
    return referencedIdentifiers;
}

/**
 * Returns true if the given Node is a TemplateLiteralTypeNode
 */
function isTemplateLiteralTypeNode(node, typescript) {
    return typescript.SyntaxKind.TemplateLiteralType != null && node.kind === typescript.SyntaxKind.TemplateLiteralType;
}

function checkTemplateLiteralTypeSpan({ node, continuation }) {
    const referencedIdentifiers = [];
    if (node.type != null) {
        referencedIdentifiers.push(...continuation(node.type));
    }
    return referencedIdentifiers;
}

function checkTypeReferenceNode({ node, continuation }) {
    const referencedIdentifiers = [];
    if (node.typeName != null) {
        referencedIdentifiers.push(...continuation(node.typeName));
    }
    if (node.typeArguments != null) {
        for (const typeArgument of node.typeArguments) {
            referencedIdentifiers.push(...continuation(typeArgument));
        }
    }
    return referencedIdentifiers;
}

/**
 * Visits the given node. Returns true if it references the node to check for references, and false otherwise
 */
function checkNode(_a) {
    var _b, _c;
    var { node, originalNode } = _a, options = tslib.__rest(_a, ["node", "originalNode"]);
    if (options.typescript.isArrayBindingPattern(node)) {
        return checkArrayBindingPattern(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isObjectBindingPattern(node)) {
        return checkObjectBindingPattern(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isParameter(node)) {
        return checkParameterDeclaration(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isQualifiedName(node)) {
        return checkQualifiedName(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isBindingElement(node)) {
        return checkBindingElement(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isMethodDeclaration(node)) {
        return checkMethodDeclaration(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isMethodSignature(node)) {
        return checkMethodSignature(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isGetAccessorDeclaration(node)) {
        return checkGetAccessorDeclaration(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isSetAccessorDeclaration(node)) {
        return checkSetAccessorDeclaration(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isPropertyAccessExpression(node)) {
        return checkPropertyAccessExpression(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isPropertyDeclaration(node)) {
        return checkPropertyDeclaration(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isPropertySignature(node)) {
        return checkPropertySignature(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isClassDeclaration(node)) {
        return checkClassDeclaration(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isClassExpression(node)) {
        return checkClassExpression(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isFunctionDeclaration(node)) {
        return checkFunctionDeclaration(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isFunctionExpression(node)) {
        return checkFunctionExpression(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isInterfaceDeclaration(node)) {
        return checkInterfaceDeclaration(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isEnumDeclaration(node)) {
        return checkEnumDeclaration(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isTypeAliasDeclaration(node)) {
        return checkTypeAliasDeclaration(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isIndexedAccessTypeNode(node)) {
        return checkIndexedAccessTypeNode(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isVariableStatement(node)) {
        return checkVariableStatement(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isVariableDeclarationList(node)) {
        return checkVariableDeclarationList(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isVariableDeclaration(node)) {
        return checkVariableDeclaration(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isExportDeclaration(node)) {
        return checkExportDeclaration(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isExportAssignment(node)) {
        return checkExportAssignment(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isExportSpecifier(node)) {
        return checkExportSpecifier(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isModuleDeclaration(node)) {
        return checkModuleDeclaration(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isIdentifier(node)) {
        return checkIdentifier(Object.assign({ node, originalNode }, options));
    }
    else if (isTemplateLiteralTypeNode(node, options.typescript)) {
        return checkTemplateLiteralTypeNode(Object.assign({ node, originalNode }, options));
    }
    else if ((_c = (_b = options.typescript).isTemplateLiteralTypeSpan) === null || _c === void 0 ? void 0 : _c.call(_b, node)) {
        return checkTemplateLiteralTypeSpan(Object.assign({ node, originalNode }, options));
    }
    else if (options.typescript.isTypeReferenceNode(node)) {
        return checkTypeReferenceNode(Object.assign({ node, originalNode }, options));
    }
    else {
        return options.childContinuation(node);
    }
}
/**
 * Visits the given node. Returns true if it references the node to check for references, and false otherwise
 */
function getReferencingNodes(originalNode, identifiers, cache) {
    // TODO: Can all of this be replaced by typescript.FindAllReferences.Core.isSymbolReferencedInFile(identifier, typeChecker, sourceFile); ?
    const referencingNodes = new Set();
    for (const identifier of identifiers) {
        const nodesReferencingIdentifier = cache.get(identifier);
        if (nodesReferencingIdentifier != null) {
            for (const node of nodesReferencingIdentifier) {
                if (node === originalNode || nodeContainsChild(originalNode, node))
                    continue;
                referencingNodes.add(node);
            }
        }
    }
    return [...referencingNodes];
}
/**
 * Returns true if the given Node is referenced within the given options
 */
function isReferenced(_a) {
    var { seenNodes = new Set() } = _a, options = tslib.__rest(_a, ["seenNodes"]);
    // Exports are always referenced and should never be removed
    if (options.typescript.isExportDeclaration(options.node) ||
        options.typescript.isExportSpecifier(options.node) ||
        options.typescript.isExportAssignment(options.node) ||
        hasExportModifier(options.node, options.typescript) ||
        options.typescript.isModuleDeclaration(options.node)) {
        return true;
    }
    // If it has been computed previously, use the cached result
    if (options.referenceCache.has(options.node)) {
        return options.referenceCache.get(options.node);
    }
    // Assume that the node is referenced if the received node has been visited before in the recursive stack
    if (seenNodes.has(options.node)) {
        return true;
    }
    else {
        // Otherwise, add the node to the Set of seen nodes
        seenNodes.add(options.node);
    }
    // Collect the identifier for the node
    const identifiers = traceIdentifiers(options);
    // If there are no identifiers for the node, include it since it cannot be referenced.
    if (identifiers.size === 0) {
        return true;
    }
    // Collect all nodes that references the given node
    const referencingNodes = collectReferences(options, identifiers);
    // Compute the result
    const result = referencingNodes.length > 0 && referencingNodes.some(referencingNode => isReferenced(Object.assign(Object.assign({}, options), { seenNodes, node: referencingNode })));
    // Cache the result
    options.referenceCache.set(options.node, result);
    return result;
}
function collectReferences(options, identifiers) {
    let nodeToReferencedIdentifiersCache = options.sourceFileToNodeToReferencedIdentifiersCache.get(options.sourceFile.fileName);
    // If it has been computed for the SourceFile previously, use it.
    if (nodeToReferencedIdentifiersCache == null) {
        // Otherwise, compute it
        nodeToReferencedIdentifiersCache = new Map();
        options.sourceFileToNodeToReferencedIdentifiersCache.set(options.sourceFile.fileName, nodeToReferencedIdentifiersCache);
        const visitorOptions = Object.assign(Object.assign({}, options), { originalNode: options.node, markIdentifiersAsReferenced(fromNode, ...referencedIdentifiers) {
                for (const identifier of referencedIdentifiers) {
                    let matchingSet = nodeToReferencedIdentifiersCache.get(identifier);
                    if (matchingSet == null) {
                        matchingSet = new Set();
                        nodeToReferencedIdentifiersCache.set(identifier, matchingSet);
                    }
                    matchingSet.add(fromNode);
                }
            }, childContinuation: (node) => {
                const referencedIdentifiers = [];
                options.typescript.forEachChild(node, nextNode => {
                    referencedIdentifiers.push(...checkNode(Object.assign(Object.assign({}, visitorOptions), { node: nextNode })));
                });
                return referencedIdentifiers;
            }, continuation: (node) => checkNode(Object.assign(Object.assign({}, visitorOptions), { node })) });
        options.typescript.forEachChild(options.sourceFile, node => {
            checkNode(Object.assign(Object.assign({}, visitorOptions), { node }));
        });
    }
    return getReferencingNodes(options.node, identifiers, nodeToReferencedIdentifiersCache);
}

function visitClassDeclaration$1({ node, continuation, compatFactory }) {
    const nameContinuationResult = node.name == null ? undefined : continuation(node.name);
    if (nameContinuationResult == null) {
        return undefined;
    }
    return node.name === nameContinuationResult
        ? node
        : compatFactory.updateClassDeclaration(node, node.decorators, node.modifiers, nameContinuationResult, node.typeParameters, node.heritageClauses, node.members);
}

function visitClassExpression$1({ node, continuation, compatFactory }) {
    const nameContinuationResult = node.name == null ? undefined : continuation(node.name);
    if (nameContinuationResult == null) {
        return undefined;
    }
    return node.name === nameContinuationResult
        ? node
        : isNodeFactory(compatFactory)
            ? compatFactory.updateClassExpression(node, node.decorators, node.modifiers, nameContinuationResult, node.typeParameters, node.heritageClauses, node.members)
            : compatFactory.updateClassExpression(node, node.modifiers, nameContinuationResult, node.typeParameters, node.heritageClauses, node.members);
}

function visitFunctionDeclaration$1({ node, continuation, compatFactory }) {
    const nameContinuationResult = node.name == null ? undefined : continuation(node.name);
    if (nameContinuationResult == null) {
        return undefined;
    }
    return node.name === nameContinuationResult
        ? node
        : compatFactory.updateFunctionDeclaration(node, node.decorators, node.modifiers, node.asteriskToken, nameContinuationResult, node.typeParameters, node.parameters, node.type, node.body);
}

function visitFunctionExpression$1({ node, continuation, compatFactory }) {
    const nameContinuationResult = node.name == null ? undefined : continuation(node.name);
    if (nameContinuationResult == null) {
        return undefined;
    }
    return node.name === nameContinuationResult
        ? node
        : compatFactory.updateFunctionExpression(node, node.modifiers, node.asteriskToken, nameContinuationResult, node.typeParameters, node.parameters, node.type, node.body);
}

function visitEnumDeclaration$1({ node, continuation, compatFactory }) {
    const nameContinuationResult = continuation(node.name);
    if (nameContinuationResult == null) {
        return undefined;
    }
    return node.name === nameContinuationResult ? node : compatFactory.updateEnumDeclaration(node, node.decorators, node.modifiers, nameContinuationResult, node.members);
}

function visitInterfaceDeclaration$1(options) {
    const { node, continuation, compatFactory } = options;
    const nameContinuationResult = continuation(node.name);
    if (nameContinuationResult == null) {
        return undefined;
    }
    return node.name === nameContinuationResult
        ? node
        : preserveMeta(compatFactory.updateInterfaceDeclaration(node, node.decorators, node.modifiers, nameContinuationResult, node.typeParameters, node.heritageClauses, node.members), node, options);
}

function visitTypeAliasDeclaration$1({ node, continuation, compatFactory }) {
    const nameContinuationResult = continuation(node.name);
    if (nameContinuationResult == null) {
        return undefined;
    }
    return node.name === nameContinuationResult
        ? node
        : compatFactory.updateTypeAliasDeclaration(node, node.decorators, node.modifiers, nameContinuationResult, node.typeParameters, node.type);
}

function visitModuleDeclaration$2({ node }) {
    return node;
}

function visitExportDeclaration$1({ node }) {
    return node;
}

function visitExportAssignment({ node }) {
    return node;
}

function visitVariableStatement$1({ node, continuation, compatFactory }) {
    const variableDeclarationListContinuationResult = continuation(node.declarationList);
    if (variableDeclarationListContinuationResult == null) {
        return undefined;
    }
    return compatFactory.updateVariableStatement(node, node.modifiers, variableDeclarationListContinuationResult);
}

function visitVariableDeclarationList({ node, continuation, compatFactory }) {
    const filteredVariableDeclarations = [];
    for (const variableDeclaration of node.declarations) {
        const variableDeclarationContinuationResult = continuation(variableDeclaration);
        if (variableDeclarationContinuationResult != null) {
            filteredVariableDeclarations.push(variableDeclarationContinuationResult);
        }
    }
    if (filteredVariableDeclarations.length < 1) {
        return undefined;
    }
    return compatFactory.updateVariableDeclarationList(node, filteredVariableDeclarations);
}

function visitVariableDeclaration({ node, continuation, compatFactory }) {
    const nameContinuationResult = continuation(node.name);
    if (nameContinuationResult == null) {
        return undefined;
    }
    return node.name === nameContinuationResult
        ? node
        : isNodeFactory(compatFactory)
            ? compatFactory.updateVariableDeclaration(node, nameContinuationResult, node.exclamationToken, node.type, node.initializer)
            : compatFactory.updateVariableDeclaration(node, nameContinuationResult, node.type, node.initializer);
}

function visitImportDeclaration$1({ node, continuation, compatFactory }) {
    if (node.importClause == null)
        return undefined;
    const importClauseContinuationResult = continuation(node.importClause);
    if (importClauseContinuationResult == null) {
        return undefined;
    }
    return importClauseContinuationResult === node.importClause
        ? node
        : compatFactory.updateImportDeclaration(node, node.decorators, node.modifiers, importClauseContinuationResult, node.moduleSpecifier);
}

function visitImportSpecifier({ node, continuation, compatFactory }) {
    const nameContinuationResult = continuation(node.name);
    if (nameContinuationResult == null) {
        return undefined;
    }
    return node.name === nameContinuationResult ? node : compatFactory.updateImportSpecifier(node, node.propertyName, nameContinuationResult);
}

function visitImportClause({ node, continuation, compatFactory }) {
    const namedBindingsContinuationResult = node.namedBindings == null ? undefined : continuation(node.namedBindings);
    const nameContinuationResult = node.name == null ? undefined : continuation(node.name);
    const removeNamedBindings = namedBindingsContinuationResult == null;
    const removeName = nameContinuationResult == null;
    if (removeNamedBindings && removeName) {
        return undefined;
    }
    return isNodeFactory(compatFactory)
        ? compatFactory.updateImportClause(node, node.isTypeOnly, removeName ? undefined : node.name, removeNamedBindings ? undefined : namedBindingsContinuationResult)
        : compatFactory.updateImportClause(node, removeName ? undefined : node.name, removeNamedBindings ? undefined : namedBindingsContinuationResult, node.isTypeOnly);
}

function visitNamedImports({ node, continuation, compatFactory }) {
    const filteredSpecifiers = [];
    for (const importSpecifier of node.elements) {
        const importSpecifierContinuationResult = continuation(importSpecifier);
        if (importSpecifierContinuationResult != null) {
            filteredSpecifiers.push(importSpecifierContinuationResult);
        }
    }
    if (filteredSpecifiers.length < 1) {
        return undefined;
    }
    return compatFactory.updateNamedImports(node, filteredSpecifiers);
}

function visitNamespaceImport({ node, continuation, compatFactory }) {
    const nameContinuationResult = continuation(node.name);
    if (nameContinuationResult == null) {
        return undefined;
    }
    return node.name === nameContinuationResult ? node : compatFactory.updateNamespaceImport(node, nameContinuationResult);
}

function visitImportEqualsDeclaration(options) {
    const { node, continuation, compatFactory } = options;
    const nameContinuationResult = node.name == null ? undefined : continuation(node.name);
    if (nameContinuationResult == null) {
        return undefined;
    }
    return node.name === nameContinuationResult
        ? node
        : preserveMeta(compatFactory.createImportEqualsDeclaration.length === 4
            ? compatFactory.updateImportEqualsDeclaration(node, node.decorators, node.modifiers, nameContinuationResult, node.moduleReference)
            : compatFactory.updateImportEqualsDeclaration(node, node.decorators, node.modifiers, node.isTypeOnly, nameContinuationResult, node.moduleReference), node, options);
}

function visitArrayBindingPattern({ node, continuation, compatFactory }) {
    const filteredArrayBindingElements = [];
    for (const arrayBindingElement of node.elements) {
        const arrayBindingElementContinuationResult = continuation(arrayBindingElement);
        if (arrayBindingElementContinuationResult != null) {
            filteredArrayBindingElements.push(arrayBindingElementContinuationResult);
        }
    }
    if (filteredArrayBindingElements.length < 1) {
        return undefined;
    }
    return compatFactory.updateArrayBindingPattern(node, filteredArrayBindingElements);
}

function visitObjectBindingPattern({ node, continuation, compatFactory }) {
    const filteredObjectBindingElements = [];
    for (const objectBindingElement of node.elements) {
        const objectBindingElementContinuationResult = continuation(objectBindingElement);
        if (objectBindingElementContinuationResult != null) {
            filteredObjectBindingElements.push(objectBindingElementContinuationResult);
        }
    }
    if (filteredObjectBindingElements.length < 1) {
        return undefined;
    }
    return compatFactory.updateObjectBindingPattern(node, filteredObjectBindingElements);
}

function visitBindingElement({ node, continuation, compatFactory }) {
    const nameContinuationResult = continuation(node.name);
    if (nameContinuationResult == null) {
        return undefined;
    }
    return node.name === nameContinuationResult ? node : compatFactory.updateBindingElement(node, node.dotDotDotToken, node.propertyName, nameContinuationResult, node.initializer);
}

function visitIdentifier$1({ node, isReferenced }) {
    if (node != null && isReferenced(node)) {
        return node;
    }
    return undefined;
}

function visitNode$3(options) {
    const { node, typescript } = options;
    if (hasExportModifier(node, typescript))
        return node;
    if (typescript.isClassDeclaration(node)) {
        return visitClassDeclaration$1(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isClassExpression(node)) {
        return visitClassExpression$1(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isFunctionDeclaration(node)) {
        return visitFunctionDeclaration$1(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isFunctionExpression(node)) {
        return visitFunctionExpression$1(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isEnumDeclaration(node)) {
        return visitEnumDeclaration$1(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isInterfaceDeclaration(node)) {
        return visitInterfaceDeclaration$1(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isTypeAliasDeclaration(node)) {
        return visitTypeAliasDeclaration$1(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isModuleDeclaration(node)) {
        return visitModuleDeclaration$2(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isExportDeclaration(node)) {
        return visitExportDeclaration$1(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isExportAssignment(node)) {
        return visitExportAssignment(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isVariableStatement(node)) {
        return visitVariableStatement$1(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isVariableDeclarationList(node)) {
        return visitVariableDeclarationList(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isVariableDeclaration(node)) {
        return visitVariableDeclaration(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isImportDeclaration(node)) {
        return visitImportDeclaration$1(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isImportSpecifier(node)) {
        return visitImportSpecifier(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isImportClause(node)) {
        return visitImportClause(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isNamedImports(node)) {
        return visitNamedImports(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isNamespaceImport(node)) {
        return visitNamespaceImport(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isImportEqualsDeclaration(node)) {
        return visitImportEqualsDeclaration(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isArrayBindingPattern(node)) {
        return visitArrayBindingPattern(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isObjectBindingPattern(node)) {
        return visitObjectBindingPattern(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isBindingElement(node)) {
        return visitBindingElement(Object.assign(Object.assign({}, options), { node }));
    }
    else if (typescript.isIdentifier(node)) {
        return visitIdentifier$1(Object.assign(Object.assign({}, options), { node }));
    }
    else {
        // Fall back to dropping the node
        return undefined;
    }
}

function treeShaker(options) {
    const { typescript, context, sourceFile, pluginOptions, printer } = options;
    const fullBenchmark = shouldDebugMetrics(pluginOptions.debug, sourceFile) ? logMetrics(`Tree-shaking`, sourceFile.fileName) : undefined;
    const transformationLog = shouldDebugSourceFile(pluginOptions.debug, sourceFile) ? logTransformer("Tree-shaking", sourceFile, printer) : undefined;
    // Prepare some VisitorOptions
    const visitorOptions = Object.assign(Object.assign({}, options), { treeshakenCommentRanges: [], isReferenced: (node) => isReferenced(Object.assign(Object.assign({}, visitorOptions), { node })), continuation: (node) => visitNode$3(Object.assign(Object.assign({}, visitorOptions), { node })) });
    const updatedSourceFile = preserveMeta(typescript.visitEachChild(sourceFile, visitorOptions.continuation, context), sourceFile, options);
    transformationLog === null || transformationLog === void 0 ? void 0 : transformationLog.finish(updatedSourceFile);
    fullBenchmark === null || fullBenchmark === void 0 ? void 0 : fullBenchmark.finish();
    return updatedSourceFile;
}

function visitClassDeclaration(options) {
    var _a;
    const { node, compatFactory, typescript, appendNodes, sourceFile } = options;
    // If the node has no export modifier, leave it as it is
    if (!hasExportModifier(node, typescript))
        return node;
    const nameText = node.name == null ? generateIdentifierName(sourceFile.fileName, "class") : node.name.text;
    let returnNode;
    const { exportSpecifier } = createExportSpecifierFromNameAndModifiers(Object.assign(Object.assign({}, options), { name: nameText, modifiers: node.modifiers }));
    // Append an ExportDeclaration
    appendNodes(preserveParents(isNodeFactory(compatFactory)
        ? compatFactory.createExportDeclaration(undefined, undefined, false, compatFactory.createNamedExports([exportSpecifier]))
        : compatFactory.createExportDeclaration(undefined, undefined, compatFactory.createNamedExports([exportSpecifier])), { typescript }));
    // Update the name if it changed
    if (node.name != null && nameText === node.name.text) {
        returnNode = node;
    }
    else {
        returnNode = preserveMeta(compatFactory.updateClassDeclaration(node, node.decorators, node.modifiers, compatFactory.createIdentifier(nameText), node.typeParameters, node.heritageClauses, node.members), node, options);
    }
    const propertyName = (_a = exportSpecifier.propertyName) !== null && _a !== void 0 ? _a : exportSpecifier.name;
    preserveSymbols(propertyName, returnNode, options);
    return returnNode;
}

function visitClassExpression(options) {
    var _a;
    const { node, compatFactory, typescript, appendNodes, sourceFile } = options;
    // If the node has no export modifier, leave it as it is
    if (!hasExportModifier(node, typescript))
        return node;
    const nameText = node.name == null ? generateIdentifierName(sourceFile.fileName, "class") : node.name.text;
    let returnNode;
    const { exportSpecifier } = createExportSpecifierFromNameAndModifiers(Object.assign(Object.assign({}, options), { name: nameText, modifiers: node.modifiers }));
    // Append an ExportDeclaration
    appendNodes(preserveParents(isNodeFactory(compatFactory)
        ? compatFactory.createExportDeclaration(undefined, undefined, false, compatFactory.createNamedExports([exportSpecifier]))
        : compatFactory.createExportDeclaration(undefined, undefined, compatFactory.createNamedExports([exportSpecifier])), { typescript }));
    // Update the name if it changed
    if (node.name != null && nameText === node.name.text) {
        returnNode = node;
    }
    else {
        returnNode = preserveMeta(isNodeFactory(compatFactory)
            ? compatFactory.updateClassExpression(node, node.decorators, node.modifiers, compatFactory.createIdentifier(nameText), node.typeParameters, node.heritageClauses, node.members)
            : compatFactory.updateClassExpression(node, node.modifiers, compatFactory.createIdentifier(nameText), node.typeParameters, node.heritageClauses, node.members), node, options);
    }
    const propertyName = (_a = exportSpecifier.propertyName) !== null && _a !== void 0 ? _a : exportSpecifier.name;
    preserveSymbols(propertyName, returnNode, options);
    return returnNode;
}

function visitFunctionDeclaration(options) {
    var _a;
    const { node, compatFactory, typescript, sourceFile, appendNodes } = options;
    // If the node has no export modifier, leave it as it is
    if (!hasExportModifier(node, typescript))
        return node;
    const nameText = node.name == null ? generateIdentifierName(sourceFile.fileName, "function") : node.name.text;
    let returnNode;
    const { exportSpecifier } = createExportSpecifierFromNameAndModifiers(Object.assign(Object.assign({}, options), { name: nameText, modifiers: node.modifiers }));
    // Append an ExportDeclaration
    appendNodes(preserveParents(isNodeFactory(compatFactory)
        ? compatFactory.createExportDeclaration(undefined, undefined, false, compatFactory.createNamedExports([exportSpecifier]))
        : compatFactory.createExportDeclaration(undefined, undefined, compatFactory.createNamedExports([exportSpecifier])), { typescript }));
    // Update the name if it changed
    if (node.name != null && nameText === node.name.text) {
        returnNode = node;
    }
    else {
        returnNode = preserveMeta(compatFactory.updateFunctionDeclaration(node, node.decorators, node.modifiers, node.asteriskToken, compatFactory.createIdentifier(nameText), node.typeParameters, node.parameters, node.type, node.body), node, options);
    }
    const propertyName = (_a = exportSpecifier.propertyName) !== null && _a !== void 0 ? _a : exportSpecifier.name;
    preserveSymbols(propertyName, returnNode, options);
    return returnNode;
}

function visitFunctionExpression(options) {
    var _a;
    const { node, compatFactory, typescript, sourceFile, appendNodes } = options;
    // If the node has no export modifier, leave it as it is
    if (!hasExportModifier(node, typescript))
        return node;
    const nameText = node.name == null ? generateIdentifierName(sourceFile.fileName, "function") : node.name.text;
    let returnNode;
    const { exportSpecifier } = createExportSpecifierFromNameAndModifiers(Object.assign(Object.assign({}, options), { name: nameText, modifiers: node.modifiers }));
    // Append an ExportDeclaration
    appendNodes(preserveParents(isNodeFactory(compatFactory)
        ? compatFactory.createExportDeclaration(undefined, undefined, false, compatFactory.createNamedExports([exportSpecifier]))
        : compatFactory.createExportDeclaration(undefined, undefined, compatFactory.createNamedExports([exportSpecifier])), { typescript }));
    // Update the name if it changed
    if (node.name != null && nameText === node.name.text) {
        returnNode = node;
    }
    else {
        returnNode = preserveMeta(compatFactory.updateFunctionExpression(node, node.modifiers, node.asteriskToken, compatFactory.createIdentifier(nameText), node.typeParameters, node.parameters, node.type, node.body), node, options);
    }
    const propertyName = (_a = exportSpecifier.propertyName) !== null && _a !== void 0 ? _a : exportSpecifier.name;
    preserveSymbols(propertyName, returnNode, options);
    return returnNode;
}

function visitEnumDeclaration(options) {
    var _a;
    const { node, compatFactory, typescript, appendNodes } = options;
    // If the node has no export modifier, leave it as it is
    if (!hasExportModifier(node, typescript))
        return node;
    const { exportSpecifier } = createExportSpecifierFromNameAndModifiers(Object.assign(Object.assign({}, options), { name: node.name.text, modifiers: node.modifiers }));
    // Append an ExportDeclaration
    appendNodes(preserveParents(isNodeFactory(compatFactory)
        ? compatFactory.createExportDeclaration(undefined, undefined, false, compatFactory.createNamedExports([exportSpecifier]))
        : compatFactory.createExportDeclaration(undefined, undefined, compatFactory.createNamedExports([exportSpecifier])), { typescript }));
    const propertyName = (_a = exportSpecifier.propertyName) !== null && _a !== void 0 ? _a : exportSpecifier.name;
    preserveSymbols(propertyName, node, options);
    return node;
}

function visitVariableStatement(options) {
    var _a;
    const { node, compatFactory, typescript, appendNodes } = options;
    // If the node has no export modifier, leave it as it is
    if (!hasExportModifier(node, typescript))
        return node;
    for (const declaration of node.declarationList.declarations) {
        const identifiers = traceIdentifiers(Object.assign(Object.assign({}, options), { node: declaration }));
        for (const identifier of identifiers) {
            const { exportSpecifier } = createExportSpecifierFromNameAndModifiers(Object.assign(Object.assign({}, options), { name: identifier, modifiers: node.modifiers }));
            // Append an ExportDeclaration
            appendNodes(preserveParents(isNodeFactory(compatFactory)
                ? compatFactory.createExportDeclaration(undefined, undefined, false, compatFactory.createNamedExports([exportSpecifier]))
                : compatFactory.createExportDeclaration(undefined, undefined, compatFactory.createNamedExports([exportSpecifier])), { typescript }));
            const propertyName = (_a = exportSpecifier.propertyName) !== null && _a !== void 0 ? _a : exportSpecifier.name;
            preserveSymbols(propertyName, declaration, options);
        }
    }
    return node;
}

function visitInterfaceDeclaration(options) {
    var _a;
    const { node, compatFactory, typescript, appendNodes } = options;
    // If the node has no export modifier, leave it as it is
    if (!hasExportModifier(node, typescript))
        return node;
    const { exportSpecifier } = createExportSpecifierFromNameAndModifiers(Object.assign(Object.assign({}, options), { name: node.name.text, modifiers: node.modifiers }));
    // Append an ExportDeclaration
    appendNodes(preserveParents(isNodeFactory(compatFactory)
        ? compatFactory.createExportDeclaration(undefined, undefined, false, compatFactory.createNamedExports([exportSpecifier]))
        : compatFactory.createExportDeclaration(undefined, undefined, compatFactory.createNamedExports([exportSpecifier])), { typescript }));
    const propertyName = (_a = exportSpecifier.propertyName) !== null && _a !== void 0 ? _a : exportSpecifier.name;
    preserveSymbols(propertyName, node, options);
    return node;
}

function visitModuleDeclaration$1(options) {
    var _a;
    const { node, compatFactory, typescript, appendNodes } = options;
    // If the node has no export modifier, leave it as it is
    if (!hasExportModifier(node, typescript))
        return node;
    const { exportSpecifier } = createExportSpecifierFromNameAndModifiers(Object.assign(Object.assign({}, options), { name: node.name.text, modifiers: node.modifiers }));
    // Append an ExportDeclaration
    appendNodes(preserveParents(isNodeFactory(compatFactory)
        ? compatFactory.createExportDeclaration(undefined, undefined, false, compatFactory.createNamedExports([exportSpecifier]))
        : compatFactory.createExportDeclaration(undefined, undefined, compatFactory.createNamedExports([exportSpecifier])), { typescript }));
    const propertyName = (_a = exportSpecifier.propertyName) !== null && _a !== void 0 ? _a : exportSpecifier.name;
    preserveSymbols(propertyName, node, options);
    return node;
}

function visitTypeAliasDeclaration(options) {
    var _a;
    const { node, compatFactory, typescript, appendNodes } = options;
    // If the node has no export modifier, leave it as it is
    if (!hasExportModifier(node, typescript))
        return node;
    const { exportSpecifier } = createExportSpecifierFromNameAndModifiers(Object.assign(Object.assign({}, options), { name: node.name.text, modifiers: node.modifiers }));
    // Append an ExportDeclaration
    appendNodes(preserveParents(isNodeFactory(compatFactory)
        ? compatFactory.createExportDeclaration(undefined, undefined, false, compatFactory.createNamedExports([exportSpecifier]))
        : compatFactory.createExportDeclaration(undefined, undefined, compatFactory.createNamedExports([exportSpecifier])), { typescript }));
    const propertyName = (_a = exportSpecifier.propertyName) !== null && _a !== void 0 ? _a : exportSpecifier.name;
    preserveSymbols(propertyName, node, options);
    return node;
}

function visitNode$2(_a) {
    var { node } = _a, options = tslib.__rest(_a, ["node"]);
    if (options.typescript.isClassDeclaration(node)) {
        return visitClassDeclaration(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isClassExpression(node)) {
        return visitClassExpression(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isFunctionDeclaration(node)) {
        return visitFunctionDeclaration(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isFunctionExpression(node)) {
        return visitFunctionExpression(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isEnumDeclaration(node)) {
        return visitEnumDeclaration(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isInterfaceDeclaration(node)) {
        return visitInterfaceDeclaration(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isTypeAliasDeclaration(node)) {
        return visitTypeAliasDeclaration(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isModuleDeclaration(node)) {
        return visitModuleDeclaration$1(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isVariableStatement(node)) {
        return visitVariableStatement(Object.assign(Object.assign({}, options), { node }));
    }
    else {
        // Only consider root-level statements here
        return node;
    }
}

function toExportDeclarationTransformer(options) {
    const { compatFactory, typescript, context, sourceFile, pluginOptions, printer } = options;
    const fullBenchmark = shouldDebugMetrics(pluginOptions.debug, sourceFile) ? logMetrics(`Adding ExportDeclarations`, sourceFile.fileName) : undefined;
    const transformationLog = shouldDebugSourceFile(pluginOptions.debug, sourceFile) ? logTransformer("Adding ExportDeclarations", sourceFile, printer) : undefined;
    const nodePlacementQueue = getNodePlacementQueue({ typescript });
    // Prepare some VisitorOptions
    const visitorOptions = Object.assign(Object.assign(Object.assign({}, options), nodePlacementQueue), { childContinuation: (node) => typescript.visitEachChild(node, nextNode => nodePlacementQueue.wrapVisitResult(visitNode$2(Object.assign(Object.assign({}, visitorOptions), { node: nextNode }))), context), continuation: (node) => nodePlacementQueue.wrapVisitResult(visitNode$2(Object.assign(Object.assign({}, visitorOptions), { node }))) });
    let result = typescript.visitEachChild(sourceFile, nextNode => visitorOptions.continuation(nextNode), context);
    // There may be prepended or appended nodes that hasn't been added yet. Do so!
    const [missingPrependNodes, missingAppendNodes] = nodePlacementQueue.flush();
    if (missingPrependNodes.length > 0 || missingAppendNodes.length > 0) {
        result = isNodeFactory(compatFactory)
            ? compatFactory.updateSourceFile(result, [...missingPrependNodes, ...result.statements, ...missingAppendNodes], result.isDeclarationFile, result.referencedFiles, result.typeReferenceDirectives, result.hasNoDefaultLib, result.libReferenceDirectives)
            : compatFactory.updateSourceFileNode(result, [...missingPrependNodes, ...result.statements, ...missingAppendNodes], result.isDeclarationFile, result.referencedFiles, result.typeReferenceDirectives, result.hasNoDefaultLib, result.libReferenceDirectives);
    }
    result = preserveMeta(result, result, options);
    transformationLog === null || transformationLog === void 0 ? void 0 : transformationLog.finish(result);
    fullBenchmark === null || fullBenchmark === void 0 ? void 0 : fullBenchmark.finish();
    return result;
}

function typeModuleReferenceIsAllowed({ host, moduleSpecifier }) {
    const compilerOptions = host.getCompilationSettings();
    if (compilerOptions.types == null || compilerOptions.types.length < 1)
        return true;
    return compilerOptions.types.includes(moduleSpecifier);
}

function getTypeReferenceModuleFromFileName({ host, fileName }) {
    for (const typeRoot of host.getTypeRoots()) {
        if (!fileName.includes(typeRoot))
            continue;
        const base = normalize(fileName.slice(typeRoot.length + 1));
        const moduleSpecifier = base.includes("/") ? base.slice(0, base.indexOf("/")) : base;
        if (typeModuleReferenceIsAllowed({ host, moduleSpecifier })) {
            return {
                moduleSpecifier,
                fileName
            };
        }
    }
    return undefined;
}

function getTypeReferenceModuleFromNode(options) {
    const aliasedDeclaration = getAliasedDeclaration(options);
    if (aliasedDeclaration == null)
        return;
    const declarationSourceFile = aliasedDeclaration.getSourceFile();
    if (declarationSourceFile == null)
        return;
    const typeReference = getTypeReferenceModuleFromFileName(Object.assign(Object.assign({}, options), { fileName: declarationSourceFile.fileName }));
    if (typeReference == null)
        return undefined;
    // Otherwise, check if the particular binding is already directly imported somewhere, in which case the directive isn't needed
    for (const importDeclaration of options.importDeclarations) {
        // The module specifier must be identical to the name of the type reference
        if (!options.typescript.isStringLiteralLike(importDeclaration.moduleSpecifier))
            continue;
        if (importDeclaration.moduleSpecifier.text !== typeReference.moduleSpecifier)
            continue;
        // Otherwise, we only need to verify that the identifier is included as a binding inside the ImportClause
        if (importDeclaration.importClause == null)
            continue;
        // If the identifier is imported as a default import, we don't need the directive
        if (importDeclaration.importClause.name != null && importDeclaration.importClause.name.text === options.node.text) {
            return undefined;
        }
        // If there are no named bindings, there's no way the ImportClause may refer to the module of the type reference
        if (importDeclaration.importClause.namedBindings == null)
            continue;
        if (options.typescript.isNamespaceImport(importDeclaration.importClause.namedBindings)) {
            // If the identifier is imported as a namespace import, we don't need the directive
            if (importDeclaration.importClause.namedBindings.name.text === options.node.text) {
                return undefined;
            }
        }
        else {
            for (const importSpecifier of importDeclaration.importClause.namedBindings.elements) {
                // If the name of the ImportSpecifier is identical to that of the identifier, we don't need the directive
                if (importSpecifier.name.text === options.node.text) {
                    return undefined;
                }
            }
        }
    }
    // Otherwise, preserve it!
    return typeReference;
}

function visitIdentifier(options) {
    const { node, addTypeReference } = options;
    const typeReferenceModule = getTypeReferenceModuleFromNode(Object.assign(Object.assign({}, options), { node }));
    if (typeReferenceModule != null) {
        addTypeReference(typeReferenceModule);
    }
}

function visitNode$1(_a) {
    var { node } = _a, options = tslib.__rest(_a, ["node"]);
    if (options.typescript.isIdentifier(node)) {
        return visitIdentifier(Object.assign(Object.assign({}, options), { node }));
    }
    else {
        // Only consider root-level statements here
        return options.childContinuation(node);
    }
}

function typeReferenceCollector(options) {
    const { typescript } = options;
    const typeReferences = new Set();
    options.sourceFileToTypeReferencesSet.set(options.sourceFile.fileName, typeReferences);
    // Prepare some VisitorOptions
    const visitorOptions = Object.assign(Object.assign({}, options), { importDeclarations: options.sourceFile.statements.filter(options.typescript.isImportDeclaration), addTypeReference(typeReference) {
            typeReferences.add(typeReference);
        }, childContinuation: (node) => typescript.forEachChild(node, nextNode => {
            visitNode$1(Object.assign(Object.assign({}, visitorOptions), { node: nextNode }));
        }), continuation: (node) => {
            visitNode$1(Object.assign(Object.assign({}, visitorOptions), { node }));
        } });
    typescript.forEachChild(options.sourceFile, nextNode => {
        visitorOptions.continuation(nextNode);
    });
    return options.sourceFile;
}

/**
 * Bundles declarations
 */
function declarationBundler(options) {
    return {
        afterDeclarations: [
            // Bundle all SourceFiles within the declaration bundle
            sourceFileBundler(options, 
            // Merge modules inside the entry module(s),
            moduleBlockExtractor, moduleMerger(
            // Merge modules inside the entry module(s),
            moduleBlockExtractor, 
            // Ensure that nodes that require it have the 'declare' modifier
            ensureDeclareModifierTransformer), 
            // Generate ExportDeclarations where 'export' modifiers are otherwise being used
            toExportDeclarationTransformer, 
            // Deconflicts bindings
            deconflicter, 
            // Removes 'export' modifiers from Nodes
            ensureNoExportModifierTransformer, 
            // Ensure that nodes that require it have the 'declare' modifier
            ensureDeclareModifierTransformer, 
            // Tree-shake declarations
            treeShaker, 
            // Merge related statements
            statementMerger({ markAsModuleIfNeeded: true }), 
            // Collects type references
            typeReferenceCollector)
        ]
    };
}

function bundleDeclarationsForChunk(options) {
    let code = "";
    let map;
    const emitOutput = options.host.emit(undefined, true, declarationBundler(options));
    for (const { name, text } of emitOutput.outputFiles) {
        if (name.endsWith(D_TS_MAP_EXTENSION)) {
            map = JSON.parse(text);
            map.file = options.declarationPaths.fileName;
        }
        else if (name.endsWith(D_TS_EXTENSION)) {
            code += text.replace(SOURCE_MAP_COMMENT_REGEXP, `${SOURCE_MAP_COMMENT}=${options.declarationMapPaths.fileName}`);
        }
    }
    return Object.assign({ code }, (map == null ? {} : { map: JSON.stringify(map) }));
}

function preparePaths({ relativeOutDir, absoluteOutDir, fileName }) {
    const absolutePath = join(absoluteOutDir, fileName);
    const relativePath = join(relativeOutDir, fileName);
    return {
        fileName,
        absolute: absolutePath,
        relative: relativePath
    };
}

function preNormalizeChunk(chunk) {
    return {
        modules: Object.keys(chunk.modules).map(normalize),
        fileName: normalize(chunk.fileName),
        isEntry: chunk.isEntry
    };
}
function normalizeChunk(chunk, { host, outputOptions, relativeOutDir, multiEntryModule, multiEntryFileNames }) {
    const cwd = host.getCwd();
    let entryModules;
    let isMultiEntryChunk = false;
    for (let i = 0; i < chunk.modules.length; i++) {
        const module = chunk.modules[i];
        if (multiEntryFileNames != null && (module === ROLLUP_PLUGIN_MULTI_ENTRY_LEGACY || (multiEntryModule != null && module === multiEntryModule))) {
            // Reassign the entry file names accordingly
            chunk.modules.splice(i, 1, ...[...multiEntryFileNames].filter(fileName => !chunk.modules.includes(fileName)));
            isMultiEntryChunk = true;
        }
    }
    const visitableModules = chunk.modules.filter(module => host.isSupportedFileName(module, true));
    // If no entry module is predetermined, it should be the module on the last position for an entry chunk, or
    // every visible module for a non-entry chunk
    if (entryModules == null) {
        entryModules = isMultiEntryChunk && multiEntryFileNames != null ? [...multiEntryFileNames] : chunk.isEntry ? [visitableModules.slice(-1)[0]] : [...visitableModules].reverse();
    }
    return {
        isEntry: chunk.isEntry,
        paths: preparePaths({
            fileName: normalize(chunk.fileName),
            relativeOutDir: getOutDir(cwd, outputOptions),
            absoluteOutDir: join(cwd, relativeOutDir)
        }),
        modules: new Set(chunk.modules),
        entryModules: new Set(entryModules)
    };
}

function createCommonChunk(module, code, format, chunkFileNames = `[name]-[hash].js`) {
    const name = stripKnownExtension(basename(module));
    const hash = generateRandomHash({ key: code });
    let fileName;
    if (typeof chunkFileNames === "string") {
        fileName = chunkFileNames
            .replace(/\[format]/g, format)
            .replace(/\[hash]/g, hash)
            .replace(/\[name]/g, name);
    }
    else {
        fileName = chunkFileNames({
            name: module,
            type: "chunk",
            isEntry: false,
            isImplicitEntry: false,
            isDynamicEntry: false,
            facadeModuleId: module,
            modules: {
                [module]: {
                    originalLength: 0,
                    removedExports: [],
                    renderedExports: [],
                    renderedLength: 0,
                    code: null
                }
            },
            exports: []
        });
    }
    return {
        fileName,
        modules: [module],
        isEntry: false
    };
}
function ensureChunkForModule(module, code, chunks, moduleDependencyMap, format, chunkFileNames) {
    let chunk = getChunkForModule(module, chunks);
    const [firstChunk] = chunks;
    if (chunk == null) {
        if (chunks.length === 1) {
            firstChunk.modules.unshift(module);
            return firstChunk;
        }
        else {
            // Find all modules that refer to this module.
            const referencingModules = [...moduleDependencyMap.entries()]
                .map(([otherModule, dependencies]) => [otherModule, [...dependencies]])
                .filter(([, dependencies]) => dependencies.find(resolveModule => pickResolvedModule(resolveModule, false) === module))
                .map(([otherModule]) => otherModule);
            // Find all chunks for the referencing modules
            const [firstReferencingChunk, ...otherReferencingChunks] = new Set(referencingModules.map(referencingModule => getChunkForModule(referencingModule, chunks)).filter(chunkOrUndefined => chunkOrUndefined != null));
            // If only 1 chunk is matched, use that one
            if (firstReferencingChunk != null && otherReferencingChunks.length === 0) {
                firstReferencingChunk.modules.unshift(module);
                return firstReferencingChunk;
            }
            // Otherwise, create a new chunk
            else {
                chunk = createCommonChunk(module, code, format, chunkFileNames);
                chunks.push(chunk);
                return chunk;
            }
        }
    }
    else {
        return chunk;
    }
}
function mergeChunksWithAmbientDependencies({ format = "esm", chunkFileNames, chunks, externalOption, host }) {
    const dependencyToModulesMap = new Map();
    const sourceFileToDependenciesMap = host.getAllDependencies();
    for (const [module, dependencies] of sourceFileToDependenciesMap.entries()) {
        for (const resolvedModule of dependencies) {
            const dependency = pickResolvedModule(resolvedModule, false);
            if (dependency == null || isExternal(resolvedModule.moduleSpecifier, module, externalOption))
                continue;
            let modulesForDependency = dependencyToModulesMap.get(dependency);
            if (modulesForDependency == null) {
                modulesForDependency = new Set();
                dependencyToModulesMap.set(dependency, modulesForDependency);
            }
            modulesForDependency.add(module);
        }
    }
    for (const [dependency, modulesForDependency] of dependencyToModulesMap.entries()) {
        const text = host.readFile(dependency);
        if (text == null)
            continue;
        const chunkWithDependency = ensureChunkForModule(dependency, text, chunks, sourceFileToDependenciesMap, format, chunkFileNames);
        const chunksForModulesForDependency = new Set([...modulesForDependency].map(moduleForDependency => ensureChunkForModule(moduleForDependency, text, chunks, sourceFileToDependenciesMap, format, chunkFileNames)));
        // If the modules that refer to the dependency are divided across multiple chunks, and one of those chunks contain the dependency,
        // move it into its own chunk
        if (chunksForModulesForDependency.size > 1) {
            const containingChunk = [...chunksForModulesForDependency].find(chunkForModuleDependency => chunkForModuleDependency === chunkWithDependency);
            if (containingChunk != null) {
                containingChunk.modules.splice(containingChunk.modules.indexOf(dependency), 1);
                chunks.push(createCommonChunk(dependency, text, format, chunkFileNames));
            }
        }
    }
}

function logEmit(fileName, text) {
    console.log(`${getFormattedDateTimePrefix()}${chalk__default['default'].blue(`emit: ${fileName}`)}`);
    console.log(chalk__default['default'].white(text));
}

function emitDeclarations(options) {
    var _a, _b;
    const fullBenchmark = shouldDebugMetrics(options.pluginOptions.debug) ? logMetrics(`Emit declarations`) : undefined;
    const typescript = options.host.getTypescript();
    const cwd = options.host.getCwd();
    const relativeOutDir = getOutDir(cwd, options.outputOptions);
    const chunks = Object.values(options.bundle).filter(isOutputChunk).map(preNormalizeChunk);
    // Merge ambient dependencies into the chunks
    mergeChunksWithAmbientDependencies({
        chunks,
        host: options.host,
        externalOption: options.externalOption,
        chunkFileNames: options.outputOptions.chunkFileNames,
        format: options.outputOptions.format
    });
    // Normalize the chunks
    const normalizedChunks = chunks.map(chunk => normalizeChunk(chunk, Object.assign(Object.assign({}, options), { relativeOutDir })));
    const relativeDeclarationOutDir = getDeclarationOutDir(cwd, options.originalCompilerOptions, options.outputOptions);
    const absoluteDeclarationOutDir = join(cwd, relativeDeclarationOutDir);
    const sourceFileToNodeToReferencedIdentifiersCache = new Map();
    const referenceCache = new Map();
    let virtualOutFile = preparePaths({
        fileName: setExtension("index.js", D_TS_EXTENSION),
        relativeOutDir: relativeDeclarationOutDir,
        absoluteOutDir: absoluteDeclarationOutDir
    });
    // Rewrite the virtual out file if a hook is provided
    if (options.pluginOptions.hook.outputPath != null) {
        const result = options.pluginOptions.hook.outputPath(virtualOutFile.absolute, "declaration");
        if (result != null) {
            virtualOutFile = preparePaths({
                fileName: basename(result),
                relativeOutDir: relative(cwd, dirname(result)),
                absoluteOutDir: dirname(result)
            });
        }
    }
    const filter = pluginutils.createFilter(undefined, [setExtension(virtualOutFile.relative, D_TS_EXTENSION), setExtension(virtualOutFile.relative, D_TS_MAP_EXTENSION)]);
    const host = options.host.clone(Object.assign(Object.assign({}, options.host.getCompilationSettings()), { declaration: Boolean(options.originalCompilerOptions.declaration), declarationMap: Boolean(options.originalCompilerOptions.declarationMap), declarationDir: options.originalCompilerOptions.declarationDir, outFile: setExtension(virtualOutFile.relative, JS_EXTENSION), module: typescript.ModuleKind.System, emitDeclarationOnly: true, 
        // Never allow these options for bundled declarations
        composite: false, incremental: false, tsBuildInfoFile: undefined }), filter, {
        allowTransformingDeclarations: true
    });
    const typeChecker = host.getTypeChecker();
    const sharedOptions = Object.assign(Object.assign({}, options), { chunks: normalizedChunks, host,
        typeChecker,
        typescript,
        referenceCache,
        sourceFileToNodeToReferencedIdentifiersCache, sourceFileToTypeReferencesSet: new Map(), sourceFileToExportedSymbolSet: new Map(), sourceFileToImportedSymbolSet: new Map(), sourceFileToDependenciesMap: new Map(), moduleSpecifierToSourceFileMap: new Map(), printer: host.getPrinter(), 
        // Only prepare the record if a hook has been provided
        declarationStats: options.pluginOptions.hook.declarationStats != null ? {} : undefined });
    for (const chunk of normalizedChunks) {
        let declarationPaths = preparePaths({
            fileName: setExtension(chunk.paths.fileName, D_TS_EXTENSION),
            relativeOutDir: relativeDeclarationOutDir,
            absoluteOutDir: absoluteDeclarationOutDir
        });
        let declarationMapPaths = preparePaths({
            fileName: setExtension(chunk.paths.fileName, D_TS_MAP_EXTENSION),
            relativeOutDir: relativeDeclarationOutDir,
            absoluteOutDir: absoluteDeclarationOutDir
        });
        // Rewrite the declaration paths
        if (options.pluginOptions.hook.outputPath != null) {
            const declarationResult = options.pluginOptions.hook.outputPath(declarationPaths.absolute, "declaration");
            const declarationMapResult = options.pluginOptions.hook.outputPath(declarationMapPaths.absolute, "declarationMap");
            if (declarationResult != null) {
                declarationPaths = preparePaths({
                    fileName: basename(declarationResult),
                    relativeOutDir: relative(cwd, dirname(declarationResult)),
                    absoluteOutDir: dirname(declarationResult)
                });
            }
            if (declarationMapResult != null) {
                declarationMapPaths = {
                    // Don't allow diverging from the declaration paths.
                    // The two files must be placed together
                    fileName: basename(declarationMapResult),
                    relative: join(dirname(declarationPaths.relative), basename(declarationMapResult)),
                    absolute: join(dirname(declarationPaths.absolute), basename(declarationMapResult))
                };
            }
        }
        const emitFileDeclarationFilename = relative(relativeOutDir, declarationPaths.relative);
        const emitFileDeclarationMapFilename = relative(relativeOutDir, declarationMapPaths.relative);
        // Rollup does not allow emitting files outside of the root of the whatever 'dist' directory that has been provided.
        // Under such circumstances, unfortunately, we'll have to default to using whatever FileSystem was provided to write the files to disk
        const declarationNeedsFileSystem = emitFileDeclarationFilename.startsWith("../") || emitFileDeclarationFilename.startsWith("..\\") || options.pluginContext.emitFile == null;
        const declarationMapNeedsFileSystem = emitFileDeclarationMapFilename.startsWith("../") || emitFileDeclarationMapFilename.startsWith("..\\") || options.pluginContext.emitFile == null;
        // Don't emit declarations when there is no compatible entry file
        if (chunk.entryModules.size < 1)
            continue;
        const bundleResult = bundleDeclarationsForChunk(Object.assign(Object.assign({}, sharedOptions), { chunk,
            declarationPaths,
            declarationMapPaths, wrappedTransformers: host.getCustomTransformers() }));
        if (shouldDebugEmit(options.pluginOptions.debug, declarationPaths.absolute, bundleResult.code, "declaration")) {
            logEmit(declarationPaths.absolute, bundleResult.code);
        }
        if (declarationNeedsFileSystem) {
            options.host.getFileSystem().writeFile(nativeNormalize(declarationPaths.absolute), bundleResult.code);
        }
        // Otherwise, we can use Rollup, which is absolutely preferable
        else {
            options.pluginContext.emitFile({
                type: "asset",
                source: bundleResult.code,
                fileName: nativeNormalize(emitFileDeclarationFilename)
            });
        }
        // If there is a SourceMap for the declarations, add that asset too
        if (bundleResult.map != null) {
            if (shouldDebugEmit(options.pluginOptions.debug, declarationMapPaths.absolute, bundleResult.map.toString(), "declarationMap")) {
                logEmit(declarationMapPaths.absolute, bundleResult.map.toString());
            }
            if (declarationMapNeedsFileSystem) {
                options.host.getFileSystem().writeFile(nativeNormalize(declarationMapPaths.absolute), bundleResult.map.toString());
            }
            // Otherwise, we can use Rollup, which is absolutely preferable
            else {
                options.pluginContext.emitFile({
                    type: "asset",
                    source: bundleResult.map.toString(),
                    fileName: nativeNormalize(emitFileDeclarationMapFilename)
                });
            }
        }
    }
    if (sharedOptions.declarationStats != null) {
        (_b = (_a = options.pluginOptions.hook).declarationStats) === null || _b === void 0 ? void 0 : _b.call(_a, sharedOptions.declarationStats);
    }
    if (fullBenchmark != null)
        fullBenchmark.finish();
}

function replaceBabelEsmHelpers(code, filename) {
    const matches = [...stringutil.matchAll(code, BABEL_REQUIRE_RUNTIME_HELPER_REGEXP_1), ...stringutil.matchAll(code, BABEL_REQUIRE_RUNTIME_HELPER_REGEXP_2)];
    if (matches.length < 1)
        return undefined;
    const magicString = new MagicString__default['default'](code, { filename, indentExclusionRanges: [] });
    for (const match of matches) {
        const start = match.index + match[1].length;
        const end = match.index + match[1].length + match[2].length;
        magicString.overwrite(start, end, match[2].replace(`/esm/`, `/`));
    }
    return {
        code: magicString.toString(),
        map: magicString.generateMap({ hires: true, source: filename, includeContent: true })
    };
}

class ModuleResolutionHost {
    constructor(options, files = new Map()) {
        this.options = options;
        this.files = files;
        this.directoryExistsCache = new Map();
        this.fileExistsCache = new Map();
    }
    add(fileInput) {
        const file = Object.assign(Object.assign({}, fileInput), { transformedText: "transformedText" in fileInput && fileInput.transformedText != null ? fileInput.transformedText : fileInput.text });
        this.files.set(file.fileName, file);
        this.clearCaches(file.fileName);
        return file;
    }
    clearCaches(fileName) {
        if (fileName != null) {
            this.fileExistsCache.delete(fileName);
            this.directoryExistsCache.delete(dirname(fileName));
            this.currentFileNames = undefined;
            this.currentDirectories = undefined;
        }
        else {
            this.directoryExistsCache.clear();
            this.fileExistsCache.clear();
        }
    }
    delete(fileName) {
        this.clearCaches(fileName);
        return this.files.delete(fileName);
    }
    has(fileName) {
        return this.files.has(fileName);
    }
    get(fileName) {
        return this.files.get(fileName);
    }
    getFileNames() {
        if (this.currentFileNames == null) {
            this.currentFileNames = new Set(this.files.keys());
        }
        return this.currentFileNames;
    }
    getFileNameDirectories() {
        if (this.currentDirectories == null) {
            this.currentDirectories = new Set([...this.getFileNames()].map(fileName => dirname(fileName)));
        }
        return this.currentDirectories;
    }
    getRollupFileNames() {
        return new Set([...this.getFileNames()].filter(fileName => this.get(fileName).fromRollup));
    }
    getFileSystem() {
        return this.options.fileSystem;
    }
    getParsedCommandLine() {
        return this.options.parsedCommandLineResult.parsedCommandLine;
    }
    getCompilationSettings() {
        return this.getParsedCommandLine().options;
    }
    getSupportedExtensions() {
        return this.options.extensions;
    }
    getSupportedNonAmbientExtensions() {
        if (this.currentNonAmbientSupportedExtensions == null) {
            this.currentNonAmbientSupportedExtensions = new Set([...this.options.extensions].filter(extension => extension !== D_TS_EXTENSION && extension !== D_TS_MAP_EXTENSION));
        }
        return this.currentNonAmbientSupportedExtensions;
    }
    getTypescript() {
        return this.options.typescript;
    }
    getCwd() {
        return this.options.cwd;
    }
    /**
     * Returns true if the given file exists
     */
    fileExists(fileName) {
        if (this.fileExistsCache.has(fileName)) {
            return this.fileExistsCache.get(fileName);
        }
        const exists = this.files.has(fileName) || this.getFileSystem().fileExists(nativeNormalize(fileName));
        this.fileExistsCache.set(fileName, exists);
        return exists;
    }
    /**
     * Reads the given file
     */
    readFile(fileName, encoding) {
        // Check if the file exists within the cached files and return it if so
        const result = this.files.get(fileName);
        if (result != null)
            return result.text;
        // Otherwise, try to properly resolve the file
        return this.getFileSystem().readFile(nativeNormalize(fileName), encoding);
    }
    /**
     * Returns true if the given directory exists
     */
    directoryExists(directoryName) {
        if (this.directoryExistsCache.has(directoryName)) {
            return this.directoryExistsCache.get(directoryName);
        }
        const absoluteDirectoryName = ensureAbsolute(this.getCwd(), directoryName);
        const fileNameDirectories = this.getFileNameDirectories();
        const result = fileNameDirectories.has(directoryName) ||
            fileNameDirectories.has(absoluteDirectoryName) ||
            this.getFileSystem().directoryExists(nativeNormalize(directoryName)) ||
            this.getFileSystem().directoryExists(nativeNormalize(absoluteDirectoryName));
        this.directoryExistsCache.set(directoryName, result);
        return result;
    }
    /**
     * Gets the real path for the given path. Meant to resolve symlinks
     */
    realpath(path) {
        return normalize(this.getFileSystem().realpath(nativeNormalize(path)));
    }
    /**
     * Gets the current directory
     */
    getCurrentDirectory() {
        return normalize(this.getCwd());
    }
    /**
     * Gets all directories within the given directory path
     */
    getDirectories(directoryName) {
        return this.getFileSystem().getDirectories(nativeNormalize(directoryName)).map(normalize);
    }
}

/**
 * Gets the NewLineCharacter to use for a NewLineKind
 */
function getNewLineCharacter(newLine, typescript) {
    switch (newLine) {
        case typescript.NewLineKind.CarriageReturnLineFeed:
            return "\r\n";
        case typescript.NewLineKind.LineFeed:
            return "\n";
    }
}

/**
 * Resolves an id from the given parent
 */
function resolveId(_a) {
    var { resolveCache } = _a, options = tslib.__rest(_a, ["resolveCache"]);
    // Don't proceed if there is no parent (in which case this is an entry module)
    if (options.parent == null)
        return null;
    return resolveCache.get(options);
}

/**
 * Gets a ScriptKind from the given path
 */
function getScriptKindFromPath(path, typescript) {
    if (path.endsWith(JS_EXTENSION)) {
        return typescript.ScriptKind.JS;
    }
    else if (path.endsWith(TS_EXTENSION)) {
        return typescript.ScriptKind.TS;
    }
    else if (path.endsWith(TSX_EXTENSION)) {
        return typescript.ScriptKind.TSX;
    }
    else if (path.endsWith(JSX_EXTENSION)) {
        return typescript.ScriptKind.JSX;
    }
    else if (path.endsWith(JSON_EXTENSION)) {
        return typescript.ScriptKind.JSON;
    }
    else {
        return typescript.ScriptKind.Unknown;
    }
}

function ensureModuleTransformer({ typescript, compatFactory, sourceFile }) {
    const importDeclarationCount = sourceFile.statements.filter(typescript.isImportDeclaration).length;
    const exportDeclarationCount = sourceFile.statements.filter(typescript.isExportDeclaration).length;
    const exportAssignmentCount = sourceFile.statements.filter(typescript.isExportAssignment).length;
    // If there's nothing to mark the file as a module, add an empty ExportDeclaration to mark it as such
    if (importDeclarationCount < 1 && exportDeclarationCount < 1 && exportAssignmentCount < 1) {
        return isNodeFactory(compatFactory)
            ? compatFactory.updateSourceFile(sourceFile, [...sourceFile.statements, compatFactory.createExportDeclaration(undefined, undefined, false, compatFactory.createNamedExports([]))], sourceFile.isDeclarationFile, sourceFile.referencedFiles, sourceFile.typeReferenceDirectives, sourceFile.hasNoDefaultLib, sourceFile.libReferenceDirectives)
            : compatFactory.updateSourceFileNode(sourceFile, [...sourceFile.statements, compatFactory.createExportDeclaration(undefined, undefined, compatFactory.createNamedExports([]))], sourceFile.isDeclarationFile, sourceFile.referencedFiles, sourceFile.typeReferenceDirectives, sourceFile.hasNoDefaultLib, sourceFile.libReferenceDirectives);
    }
    return sourceFile;
}

function visitImportDeclaration({ node, typescript, host, sourceFile, addDependency }) {
    if (!typescript.isStringLiteralLike(node.moduleSpecifier))
        return;
    const resolvedModule = host.resolve(node.moduleSpecifier.text, sourceFile.fileName);
    if (resolvedModule != null) {
        addDependency(Object.assign(Object.assign({}, resolvedModule), { moduleSpecifier: node.moduleSpecifier.text }));
    }
}

function visitImportTypeNode({ node, typescript, host, sourceFile, addDependency, continuation }) {
    if (!typescript.isLiteralTypeNode(node.argument) || !typescript.isStringLiteralLike(node.argument.literal))
        return;
    const moduleSpecifier = node.argument.literal.text;
    const resolvedModule = host.resolve(moduleSpecifier, sourceFile.fileName);
    if (resolvedModule != null) {
        addDependency(Object.assign(Object.assign({}, resolvedModule), { moduleSpecifier }));
    }
    if (node.qualifier != null) {
        continuation(node.qualifier);
    }
    if (node.typeArguments != null) {
        for (const typeArgument of node.typeArguments) {
            continuation(typeArgument);
        }
    }
}

function visitModuleDeclaration(_a) {
    var { node } = _a, options = tslib.__rest(_a, ["node"]);
    if (node.body == null)
        return;
    return options.childContinuation(node.body);
}

function visitExportDeclaration({ node, typescript, host, sourceFile, addDependency }) {
    if (node.moduleSpecifier == null || !typescript.isStringLiteralLike(node.moduleSpecifier))
        return;
    const resolvedModule = host.resolve(node.moduleSpecifier.text, sourceFile.fileName);
    if (resolvedModule != null) {
        addDependency(Object.assign(Object.assign({}, resolvedModule), { moduleSpecifier: node.moduleSpecifier.text }));
    }
}

function visitNode(_a) {
    var { node } = _a, options = tslib.__rest(_a, ["node"]);
    if (options.typescript.isImportDeclaration(node)) {
        return visitImportDeclaration(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isImportTypeNode(node)) {
        return visitImportTypeNode(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isExportDeclaration(node)) {
        return visitExportDeclaration(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.typescript.isModuleDeclaration(node)) {
        return visitModuleDeclaration(Object.assign(Object.assign({}, options), { node }));
    }
    else if (options.shouldDeepTraverse) {
        return options.childContinuation(node);
    }
}

function trackDependenciesTransformer(options) {
    const typescript = options.host.getTypescript();
    const dependencies = new Set();
    // Prepare some VisitorOptions
    const visitorOptions = Object.assign(Object.assign({}, options), { typescript, 
        // Optimization: We only need to traverse nested nodes inside of the SourceFile if it contains at least one ImportTypeNode (or at least what appears to be one)
        shouldDeepTraverse: options.sourceFile.text.includes("import("), addDependency(resolvedModule) {
            dependencies.add(resolvedModule);
        }, childContinuation: (node) => typescript.forEachChild(node, nextNode => {
            visitNode(Object.assign(Object.assign({}, visitorOptions), { node: nextNode }));
        }), continuation: (node) => {
            visitNode(Object.assign(Object.assign({}, visitorOptions), { node }));
        } });
    typescript.forEachChild(options.sourceFile, nextNode => {
        visitorOptions.continuation(nextNode);
    });
    return dependencies;
}

function getModuleDependencies(options) {
    // Skip .d.ts files
    if (getExtension(options.module) === D_TS_EXTENSION)
        return undefined;
    const cachedDependencies = options.compilerHost.getDependenciesForFile(options.module);
    if (cachedDependencies != null) {
        return cachedDependencies;
    }
    const sourceFile = options.compilerHost.getSourceFile(options.module);
    if (sourceFile == null) {
        return;
    }
    return trackDependenciesTransformer({
        host: options.compilerHost,
        sourceFile
    });
}

class CompilerHost extends ModuleResolutionHost {
    constructor(options, printer = options.typescript.createPrinter({
        newLine: options.parsedCommandLineResult.parsedCommandLine.options.newLine
    }), sourceFiles = new Map(), transformerDiagnostics = new Map(), fileToVersionMap = new Map(), sourceFileToDependenciesMap = new Map(), files) {
        super(options, files);
        this.options = options;
        this.printer = printer;
        this.sourceFiles = sourceFiles;
        this.transformerDiagnostics = transformerDiagnostics;
        this.fileToVersionMap = fileToVersionMap;
        this.sourceFileToDependenciesMap = sourceFileToDependenciesMap;
        this.creatingProgram = false;
        this.invalidateProgram = false;
        this.externalFiles = new Set();
        this.addDefaultFileNames();
    }
    allowTransformingDeclarations() {
        return this.options.allowTransformingDeclarations === true;
    }
    isSupportedFileName(fileName, ignoreFilter = false) {
        return (ignoreFilter || this.options.filter(fileName)) && this.getSupportedExtensions().has(getExtension(fileName));
    }
    getDiagnostics(fileName) {
        var _a;
        const program = this.getProgram();
        const sourceFile = fileName == null ? undefined : this.getSourceFile(fileName);
        const baseDiagnostics = [
            ...this.getParsedCommandLine().errors,
            ...program.getConfigFileParsingDiagnostics(),
            ...program.getOptionsDiagnostics(),
            ...program.getSyntacticDiagnostics(sourceFile),
            ...program.getGlobalDiagnostics(),
            ...program.getSemanticDiagnostics(sourceFile)
        ];
        if (sourceFile != null) {
            return [...baseDiagnostics, ...((_a = this.transformerDiagnostics.get(sourceFile.fileName)) !== null && _a !== void 0 ? _a : [])];
        }
        else {
            const extraDiagnostics = [];
            for (const transformerDiagnostics of this.transformerDiagnostics.values()) {
                extraDiagnostics.push(...transformerDiagnostics);
            }
            return [...baseDiagnostics, ...extraDiagnostics];
        }
    }
    emitBuildInfo() {
        var _a;
        this.popEmitOutput();
        const programWithEmitBuildInfo = this.getProgramInstance();
        // A non-exposed internal method, emitBuildInfo, is used, if available (which it is from TypeScript v3.4 and up)
        // If not, we would have to emit the entire Program (or pending affected files) which can be avoided for maximum performance
        (_a = programWithEmitBuildInfo.emitBuildInfo) === null || _a === void 0 ? void 0 : _a.call(programWithEmitBuildInfo, this.writeFile.bind(this));
        return this.popEmitOutput();
    }
    emit(fileName, onlyDts = false, transformers) {
        this.popEmitOutput();
        const sourceFile = fileName == null ? undefined : this.getSourceFile(fileName);
        const customTransformers = this.getCustomTransformers(transformers);
        let hasEmitted = false;
        const runEmit = (program) => {
            // There is an extra, private, argument that can be given to emit internally in TypeScript
            // which forces emit of declarations. Set this to true for dts emit.
            program.emit(sourceFile, (file, data, writeByteOrderMark) => {
                hasEmitted = true;
                this.writeFile(file, data, writeByteOrderMark);
            }, undefined, onlyDts, customTransformers, onlyDts == null || !onlyDts ? undefined : true);
        };
        runEmit(this.getProgram());
        // TypeScript will not emit if a builder-program haven't changed. In that case, use the underlying program instance and emit with that one.
        if (!hasEmitted) {
            runEmit(this.getProgramInstance());
        }
        return this.popEmitOutput();
    }
    writeFile(name, text, writeByteOrderMark) {
        const emitOutput = this.ensureEmitOutput();
        emitOutput.outputFiles.push({
            name,
            text,
            writeByteOrderMark
        });
    }
    getScriptTarget() {
        var _a;
        return (_a = this.getCompilationSettings().target) !== null && _a !== void 0 ? _a : this.getTypescript().ScriptTarget.ES3;
    }
    createProgram() {
        const typescript = this.getTypescript();
        const rootNames = [...this.getFileNames()];
        const options = this.getCompilationSettings();
        // The --incremental option is part of TypeScript 3.4 and up only
        if ("createIncrementalProgram" in typescript) {
            return typescript.createIncrementalProgram({
                rootNames,
                options,
                host: this
            });
        }
        else {
            return typescript.createEmitAndSemanticDiagnosticsBuilderProgram(rootNames, options, this, this.previousProgram);
        }
    }
    getProgram() {
        // If there is no current program, or if the list of root names is out of sync with the actual list of files, construct a new Program
        if (this.currentProgram == null) {
            // Construct a new program.
            this.creatingProgram = true;
            try {
                this.currentProgram = this.createProgram();
            }
            finally {
                this.creatingProgram = false;
            }
            // If the program was invalidated before it was ever finished being created,
            // Try again to ensure all SourceFiles will be part of it
            if (this.invalidateProgram) {
                this.invalidateProgram = false;
                this.currentProgram = this.createProgram();
            }
        }
        return this.currentProgram;
    }
    getPrinter() {
        return this.printer;
    }
    getProgramInstance() {
        if (this.currentProgramInstance == null) {
            this.currentProgramInstance = this.getProgram().getProgram();
        }
        return this.currentProgramInstance;
    }
    getTypeChecker() {
        if (this.currentTypeChecker == null) {
            this.currentTypeChecker = this.getProgramInstance().getTypeChecker();
        }
        return this.currentTypeChecker;
    }
    getFilter() {
        return this.options.filter;
    }
    getTransformers() {
        return this.options.transformers;
    }
    getDependenciesForFileDeep(fileName, dependencies = new Set(), seenModules = new Set()) {
        if (seenModules.has(fileName))
            return dependencies;
        seenModules.add(fileName);
        const localDependencies = this.sourceFileToDependenciesMap.get(fileName);
        const dependenciesArr = [...dependencies];
        if (localDependencies != null) {
            for (const dependency of localDependencies) {
                if (!dependenciesArr.some(({ resolvedFileName, resolvedAmbientFileName }) => resolvedFileName === dependency.resolvedFileName && resolvedAmbientFileName === dependency.resolvedAmbientFileName)) {
                    dependencies.add(dependency);
                    if (dependency.resolvedFileName != null)
                        this.getDependenciesForFileDeep(dependency.resolvedFileName, dependencies, seenModules);
                    if (dependency.resolvedAmbientFileName != null) {
                        this.getDependenciesForFileDeep(dependency.resolvedAmbientFileName, dependencies, seenModules);
                    }
                }
            }
        }
        return dependencies;
    }
    getDependenciesForFile(fileName, deep = false) {
        if (deep) {
            return this.getDependenciesForFileDeep(fileName);
        }
        return this.sourceFileToDependenciesMap.get(fileName);
    }
    getAllDependencies() {
        return this.sourceFileToDependenciesMap;
    }
    add(fileInput, traceDependencies = true) {
        var _a;
        const existing = this.get(fileInput.fileName);
        if (existing != null && existing.text === fileInput.text) {
            return existing;
        }
        this.delete(fileInput.fileName);
        if (fileInput.fromRollup) {
            const sourceFile = this.constructSourceFile(fileInput.fileName, fileInput.text);
            const typescript = this.getTypescript();
            const compatFactory = (_a = typescript.factory) !== null && _a !== void 0 ? _a : typescript;
            const transformedSourceFile = ensureModuleTransformer({ typescript, compatFactory, sourceFile });
            if (transformedSourceFile !== sourceFile) {
                fileInput.transformedText = this.printer.printFile(transformedSourceFile);
            }
        }
        const addedFile = super.add(fileInput);
        if (traceDependencies) {
            this.refreshDependenciesForFileName(fileInput.fileName);
        }
        return addedFile;
    }
    refreshDependenciesForFileName(fileName, seenModules = new Set()) {
        if (seenModules.has(fileName) || this.externalFiles.has(fileName))
            return;
        seenModules.add(fileName);
        const dependencies = getModuleDependencies({
            compilerHost: this,
            module: fileName
        });
        if (dependencies == null)
            return;
        this.sourceFileToDependenciesMap.set(fileName, dependencies);
        for (const resolveResult of dependencies) {
            // Don't perform a recursive descent into the files that are external
            if (isExternal(resolveResult.moduleSpecifier, fileName, this.options.externalOption)) {
                // Mark the module as external
                this.externalFiles.add(pickResolvedModule(resolveResult, true));
                continue;
            }
            for (const module of [resolveResult.resolvedFileName, resolveResult.resolvedAmbientFileName]) {
                if (module == null)
                    continue;
                this.refreshDependenciesForFileName(module, seenModules);
            }
        }
    }
    constructSourceFile(fileName, text, languageVersion = this.getScriptTarget()) {
        return this.getTypescript().createSourceFile(fileName, text, languageVersion, true, getScriptKindFromPath(fileName, this.getTypescript()));
    }
    clearProgram() {
        if (this.creatingProgram) {
            this.invalidateProgram = true;
        }
        this.previousProgram = this.currentProgram;
        this.currentProgram = undefined;
        this.currentProgramInstance = undefined;
        this.currentTypeChecker = undefined;
    }
    ensureEmitOutput() {
        if (this.emitOutput == null) {
            this.emitOutput = {
                outputFiles: [],
                emitSkipped: false
            };
        }
        return this.emitOutput;
    }
    popEmitOutput() {
        const emitOutput = this.ensureEmitOutput();
        this.emitOutput = undefined;
        return emitOutput;
    }
    delete(fileName) {
        const superDelete = super.delete(fileName);
        const sourceFilesDelete = this.sourceFiles.delete(fileName);
        const transformerDiagnosticsDelete = this.transformerDiagnostics.delete(fileName);
        const sourceFileToDependenciesMapDelete = this.sourceFileToDependenciesMap.delete(fileName);
        const success = superDelete || sourceFilesDelete || transformerDiagnosticsDelete || sourceFileToDependenciesMapDelete;
        this.clearProgram();
        return success;
    }
    clone(compilerOptions, fileNameFilter = () => true, overrides = {}) {
        return new CompilerHost(Object.assign(Object.assign(Object.assign({}, this.options), overrides), { parsedCommandLineResult: Object.assign(Object.assign({}, this.options.parsedCommandLineResult), { parsedCommandLine: Object.assign(Object.assign({}, this.getParsedCommandLine()), { fileNames: this.getParsedCommandLine().fileNames.filter(fileNameFilter), options: Object.assign(Object.assign({}, this.getCompilationSettings()), compilerOptions) }) }) }), this.printer, new Map([...this.sourceFiles.entries()].filter(([path]) => fileNameFilter(path))), new Map([...this.transformerDiagnostics.entries()].filter(([path]) => fileNameFilter(path))), new Map([...this.fileToVersionMap.entries()].filter(([path]) => fileNameFilter(path))), new Map([...this.sourceFileToDependenciesMap.entries()].filter(([path]) => fileNameFilter(path))), new Map([...this.files.entries()].filter(([path]) => fileNameFilter(path))));
    }
    getSourceFile(fileName, languageVersion = this.getScriptTarget()) {
        var _a;
        const absoluteFileName = isTypeScriptLib(fileName) ? join(this.getDefaultLibLocation(), fileName) : ensureAbsolute(this.getCwd(), fileName);
        if (this.sourceFiles.has(absoluteFileName)) {
            return this.sourceFiles.get(absoluteFileName);
        }
        if (!this.isSupportedFileName(absoluteFileName, true))
            return undefined;
        let file = this.get(absoluteFileName);
        if (file == null) {
            const text = this.readFile(absoluteFileName);
            if (text == null)
                return undefined;
            file = this.add({ fileName: absoluteFileName, text, fromRollup: false }, false);
        }
        const sourceFile = this.constructSourceFile(absoluteFileName, file.transformedText, languageVersion);
        this.sourceFiles.set(absoluteFileName, sourceFile);
        const oldVersion = (_a = this.fileToVersionMap.get(absoluteFileName)) !== null && _a !== void 0 ? _a : 0;
        const newVersion = oldVersion + 1;
        this.fileToVersionMap.set(absoluteFileName, newVersion);
        // SourceFiles in builder programs needs a version
        sourceFile.version = newVersion;
        return sourceFile;
    }
    getTypeRoots() {
        if (this.currentTypeRoots == null) {
            this.currentTypeRoots = new Set(this.getTypescript().getEffectiveTypeRoots(this.getCompilationSettings(), this));
        }
        return this.currentTypeRoots;
    }
    getDefaultLibLocation() {
        return dirname(this.getTypescript().getDefaultLibFilePath(this.getCompilationSettings()));
    }
    /**
     * Gets the Custom Transformers to use, depending on the current emit mode
     */
    getCustomTransformers(transformers = this.getTransformers()) {
        const mergedTransformers = mergeTransformers(transformers);
        const upgradedTransformers = mergedTransformers({
            program: this.getProgramInstance(),
            typescript: this.getTypescript(),
            printer: this.printer,
            /**
             * This hook can add diagnostics from within CustomTransformers. These will be emitted alongside Typescript diagnostics seamlessly
             */
            addDiagnostics: (...diagnostics) => {
                diagnostics.forEach(diagnostic => {
                    // Skip diagnostics that doesn't point to a specific file
                    if (diagnostic.file == null)
                        return;
                    let transformerDiagnostics = this.transformerDiagnostics.get(diagnostic.file.fileName);
                    // If no file matches the one of the diagnostic, skip it
                    if (transformerDiagnostics == null) {
                        transformerDiagnostics = [];
                        this.transformerDiagnostics.set(diagnostic.file.fileName, transformerDiagnostics);
                    }
                    // Add the diagnostic
                    transformerDiagnostics.push(diagnostic);
                });
            }
        });
        // Ensure that declarations are never transformed if not allowed
        if (!this.allowTransformingDeclarations()) {
            return Object.assign(Object.assign({}, upgradedTransformers), { afterDeclarations: undefined });
        }
        return upgradedTransformers;
    }
    /**
     * Gets the default lib file name based on the given CompilerOptions
     */
    getDefaultLibFileName(compilerOptions) {
        return this.getTypescript().getDefaultLibFileName(compilerOptions);
    }
    /**
     * Gets the canonical filename for the given file
     */
    getCanonicalFileName(fileName) {
        return this.useCaseSensitiveFileNames() ? fileName : fileName.toLowerCase();
    }
    /**
     * Returns true if file names should be treated as case-sensitive
     */
    useCaseSensitiveFileNames() {
        return this.getFileSystem().useCaseSensitiveFileNames;
    }
    /**
     * Gets the newline to use
     */
    getNewLine() {
        const compilationSettings = this.getCompilationSettings();
        return compilationSettings.newLine != null ? getNewLineCharacter(compilationSettings.newLine, this.getTypescript()) : this.getFileSystem().newLine;
    }
    /**
     * Reads the given directory
     */
    readDirectory(path, extensions, exclude, include, depth) {
        return this.getFileSystem().readDirectory(nativeNormalize(path), extensions, exclude, include, depth).map(normalize);
    }
    resolve(moduleName, containingFile) {
        return resolveId({
            moduleResolutionHost: this,
            parent: containingFile,
            id: moduleName,
            resolveCache: this.options.resolveCache
        });
    }
    resolveModuleNames(moduleNames, containingFile) {
        const resolvedModules = [];
        for (const moduleName of moduleNames) {
            const result = this.resolve(moduleName, containingFile);
            if (result != null && result.resolvedAmbientFileName != null) {
                resolvedModules.push(Object.assign(Object.assign({}, result), { resolvedFileName: result.resolvedAmbientFileName }));
            }
            else if (result != null && result.resolvedFileName != null) {
                resolvedModules.push(Object.assign(Object.assign({}, result), { resolvedFileName: result.resolvedFileName }));
            }
            else {
                resolvedModules.push(undefined);
            }
        }
        return resolvedModules;
    }
    resolveTypeReferenceDirectives(typeReferenceDirectiveNames, containingFile) {
        const resolvedTypeReferenceDirectives = [];
        for (const typeReferenceDirectiveName of typeReferenceDirectiveNames) {
            // try to use standard resolution
            const result = resolveId({
                moduleResolutionHost: this,
                parent: containingFile,
                id: typeReferenceDirectiveName,
                resolveCache: this.options.resolveCache
            });
            if (result != null && result.resolvedAmbientFileName != null) {
                resolvedTypeReferenceDirectives.push(Object.assign(Object.assign({}, result), { primary: true, resolvedFileName: result.resolvedAmbientFileName }));
            }
            else if (result != null && result.resolvedFileName != null) {
                resolvedTypeReferenceDirectives.push(Object.assign(Object.assign({}, result), { primary: true, resolvedFileName: result.resolvedFileName }));
            }
            else {
                resolvedTypeReferenceDirectives.push(undefined);
            }
        }
        return resolvedTypeReferenceDirectives;
    }
    /**
     * Adds all default declaration files to the LanguageService
     */
    addDefaultFileNames() {
        this.getParsedCommandLine().fileNames.forEach(file => {
            const fileName = ensureAbsolute(this.getCwd(), file);
            if (!this.getFilter()(normalize(fileName)))
                return;
            const text = this.readFile(fileName);
            if (text != null) {
                this.add({
                    fileName,
                    text,
                    fromRollup: false
                });
            }
        });
    }
}

/**
 * Returns true if the given OutputFile represents .tsbuildinfo
 */
function isBuildInfoOutputFile({ name }) {
    return getExtension(name) === TSBUILDINFO_EXTENSION;
}

function emitBuildInfo(options) {
    const compilationSettings = options.host.getCompilationSettings();
    if (compilationSettings.tsBuildInfoFile == null)
        return;
    const emitResult = options.host.emitBuildInfo();
    const buildInfo = emitResult.outputFiles.find(isBuildInfoOutputFile);
    if (buildInfo == null)
        return;
    const cwd = options.host.getCwd();
    const relativeOutDir = getOutDir(cwd, options.outputOptions);
    let outputPathCandidate = compilationSettings.tsBuildInfoFile;
    // Rewrite the path
    if (options.pluginOptions.hook.outputPath != null) {
        const result = options.pluginOptions.hook.outputPath(outputPathCandidate, "buildInfo");
        if (result != null) {
            outputPathCandidate = result;
        }
    }
    if (shouldDebugEmit(options.pluginOptions.debug, outputPathCandidate, buildInfo.text, "buildInfo")) {
        logEmit(outputPathCandidate, buildInfo.text);
    }
    const emitFile = join(relative(relativeOutDir, outputPathCandidate));
    // Rollup does not allow emitting files outside of the root of the whatever 'dist' directory that has been provided.
    // Under such circumstances, unfortunately, we'll have to default to using whatever FileSystem was provided to write the file to disk
    const needsFileSystem = emitFile.startsWith("../") || emitFile.startsWith("..\\") || options.pluginContext.emitFile == null;
    if (needsFileSystem) {
        options.host.getFileSystem().writeFile(nativeNormalize(outputPathCandidate), buildInfo.text);
    }
    // Otherwise, we can use Rollup, which is absolutely preferable
    else {
        options.pluginContext.emitFile({
            type: "asset",
            source: buildInfo.text,
            fileName: nativeNormalize(emitFile)
        });
    }
}

/**
 * Checks if the given piece of code is JSON-like
 */
function isJsonLike(code) {
    try {
        return JSON.parse(code) != null;
    }
    catch (_a) {
        return false;
    }
}

/**
 * The name of the Rollup plugin
 */
const PLUGIN_NAME = "Typescript";
/**
 * A Rollup plugin that transpiles the given input with Typescript
 */
function typescriptRollupPlugin(pluginInputOptions = {}) {
    const pluginOptions = getPluginOptions(pluginInputOptions);
    const { include, exclude, tsconfig, cwd, browserslist, typescript, fileSystem, transpileOnly } = pluginOptions;
    const transformers = pluginOptions.transformers == null ? [] : ensureArray(pluginOptions.transformers);
    // Make sure to normalize the received Browserslist
    const normalizedBrowserslist = getBrowserslist({ browserslist, cwd, fileSystem });
    /**
     * The ParsedCommandLine to use with Typescript
     */
    let parsedCommandLineResult;
    /**
     * The config to use with Babel for each file, if Babel should transpile source code
     */
    let babelConfigFileFactory;
    /**
     * The config to use with Babel for each chunk, if Babel should transpile source code
     */
    let babelConfigChunkFactory;
    /**
     * The CompilerHost to use
     */
    let host;
    /**
     * The ResolveCache to use
     */
    const resolveCache = new ResolveCache({ fileSystem });
    /**
     * The filter function to use
     */
    const internalFilter = pluginutils.createFilter(include, exclude);
    const filter = (id) => internalFilter(id) || internalFilter(normalize(id)) || internalFilter(nativeNormalize(id));
    /**
     * All supported extensions
     */
    let SUPPORTED_EXTENSIONS;
    /**
     * The InputOptions provided to Rollup
     */
    let rollupInputOptions;
    /**
     * A Set of the entry filenames for when using rollup-plugin-multi-entry (we need to track this for generating valid declarations)
     */
    let MULTI_ENTRY_FILE_NAMES;
    /**
     * The virtual module name generated when using @rollup/plugin-multi-entry in combination with this plugin
     */
    let MULTI_ENTRY_MODULE;
    return {
        name: PLUGIN_NAME,
        /**
         * Invoked when Input options has been received by Rollup
         */
        options(options) {
            var _a;
            // Break if the options aren't different from the previous ones
            if (rollupInputOptions != null)
                return;
            // Re-assign the input options
            rollupInputOptions = options;
            const multiEntryPlugin = (_a = options.plugins) === null || _a === void 0 ? void 0 : _a.find(plugin => plugin.name === "multi-entry");
            // If the multi-entry plugin is being used, we can extract the name of the entry module
            // based on it
            if (multiEntryPlugin != null) {
                if (typeof options.input === "string") {
                    MULTI_ENTRY_MODULE = `${ROLLUP_PLUGIN_VIRTUAL_PREFIX}${options.input}`;
                }
            }
            // Make sure we have a proper ParsedCommandLine to work with
            parsedCommandLineResult = getParsedCommandLine({
                tsconfig,
                cwd,
                fileSystem,
                typescript,
                pluginOptions,
                filter,
                forcedCompilerOptions: getForcedCompilerOptions({ pluginOptions, rollupInputOptions, browserslist: normalizedBrowserslist })
            });
            // Prepare a Babel config if Babel should be the transpiler
            if (pluginOptions.transpiler === "babel") {
                // A browserslist may already be provided, but if that is not the case, one can be computed based on the "target" from the tsconfig
                const computedBrowserslist = takeBrowserslistOrComputeBasedOnCompilerOptions(normalizedBrowserslist, parsedCommandLineResult.originalCompilerOptions, typescript);
                const sharedBabelConfigFactoryOptions = {
                    cwd,
                    hook: pluginOptions.hook.babelConfig,
                    babelConfig: pluginOptions.babelConfig,
                    forcedOptions: getForcedBabelOptions({ cwd, pluginOptions, rollupInputOptions, browserslist: computedBrowserslist }),
                    defaultOptions: getDefaultBabelOptions({ pluginOptions, rollupInputOptions, browserslist: computedBrowserslist }),
                    browserslist: computedBrowserslist,
                    rollupInputOptions
                };
                babelConfigFileFactory = getBabelConfig(Object.assign(Object.assign({}, sharedBabelConfigFactoryOptions), { phase: "file" }));
                babelConfigChunkFactory = getBabelConfig(Object.assign(Object.assign({}, sharedBabelConfigFactoryOptions), { phase: "chunk" }));
            }
            SUPPORTED_EXTENSIONS = getSupportedExtensions(Boolean(parsedCommandLineResult.parsedCommandLine.options.allowJs), Boolean(parsedCommandLineResult.parsedCommandLine.options.resolveJsonModule));
            // Hook up a CompilerHost
            host = new CompilerHost({
                filter,
                cwd,
                resolveCache,
                fileSystem,
                typescript,
                extensions: SUPPORTED_EXTENSIONS,
                externalOption: rollupInputOptions.external,
                parsedCommandLineResult,
                transformers: mergeTransformers(...transformers)
            });
            return undefined;
        },
        /**
         * Renders the given chunk. Will emit declaration files if the Typescript config says so.
         * Will also apply any minification via Babel if a minification plugin or preset has been provided,
         * and if Babel is the chosen transpiler. Otherwise, it will simply do nothing
         */
        renderChunk(code, chunk, outputOptions) {
            var _a, _b;
            return tslib.__awaiter(this, void 0, void 0, function* () {
                let updatedSourceDescription;
                // When targeting CommonJS and using babel as a transpiler, we may need to rewrite forced ESM paths for preserved external helpers to paths that are compatible with CommonJS.
                if (pluginOptions.transpiler === "babel" && (outputOptions.format === "cjs" || outputOptions.format === "commonjs")) {
                    updatedSourceDescription = replaceBabelEsmHelpers(code, chunk.fileName);
                }
                if (babelConfigChunkFactory == null) {
                    return updatedSourceDescription == null ? null : updatedSourceDescription;
                }
                const { config } = babelConfigChunkFactory(chunk.fileName);
                // Don't proceed if there is no minification config
                if (config == null) {
                    return updatedSourceDescription == null ? null : updatedSourceDescription;
                }
                const updatedCode = updatedSourceDescription != null ? updatedSourceDescription.code : code;
                const updatedMap = updatedSourceDescription != null ? updatedSourceDescription.map : undefined;
                const transpilationResult = yield core.transformAsync(updatedCode, Object.assign(Object.assign(Object.assign({}, config), { filenameRelative: ensureRelative(cwd, chunk.fileName) }), (updatedMap == null
                    ? {}
                    : {
                        inputSourceMap: Object.assign(Object.assign({}, updatedMap), { file: (_a = updatedMap.file) !== null && _a !== void 0 ? _a : "" })
                    })));
                if (transpilationResult == null || transpilationResult.code == null) {
                    return updatedSourceDescription == null ? null : updatedSourceDescription;
                }
                // Return the results
                return {
                    code: transpilationResult.code,
                    map: (_b = transpilationResult.map) !== null && _b !== void 0 ? _b : undefined
                };
            });
        },
        /**
         * When a file changes, make sure to clear it from any caches to avoid stale caches
         */
        watchChange(id) {
            host.delete(id);
            resolveCache.delete(id);
            host.clearCaches();
        },
        /**
         * Transforms the given code and file
         */
        transform(code, fileInput) {
            var _a;
            return tslib.__awaiter(this, void 0, void 0, function* () {
                const file = ensureHasDriveLetter(fileInput);
                const normalizedFile = normalize(file);
                // If this file represents ROLLUP_PLUGIN_MULTI_ENTRY, we need to parse its' contents to understand which files it aliases.
                // Following that, there's nothing more to do
                if (isMultiEntryModule(normalizedFile, MULTI_ENTRY_MODULE)) {
                    MULTI_ENTRY_FILE_NAMES = new Set(stringutil.matchAll(code, /(import|export)\s*(\*\s*from\s*)?["'`]([^"'`]*)["'`]/).map(([, , , path]) => normalize(path.replace(/\\\\/g, "\\"))));
                    return undefined;
                }
                // Skip the file if it doesn't match the filter or if the helper cannot be transformed
                if (!filter(normalizedFile) || isBabelHelper(normalizedFile)) {
                    return undefined;
                }
                const hasJsonExtension = getExtension(normalizedFile) === JSON_EXTENSION;
                // Files with a .json extension may not necessarily be JSON, for example
                // if a JSON plugin came before rollup-plugin-ts, in which case it shouldn't be treated
                // as JSON.
                const isJsInDisguise = hasJsonExtension && !isJsonLike(code);
                const babelConfigResult = babelConfigFileFactory === null || babelConfigFileFactory === void 0 ? void 0 : babelConfigFileFactory(file);
                // Only pass the file through Typescript if it's extension is supported. Otherwise, if we're going to continue on with Babel,
                // Mock a SourceDescription. Otherwise, return bind undefined
                const sourceDescription = !host.isSupportedFileName(normalizedFile) || isJsInDisguise
                    ? babelConfigResult != null
                        ? { code, map: undefined }
                        : undefined
                    : (() => {
                        // Add the file to the LanguageServiceHost
                        host.add({ fileName: normalizedFile, text: code, fromRollup: true });
                        // Add all dependencies of the file to the File Watcher if missing
                        const dependencies = host.getDependenciesForFile(normalizedFile, true);
                        if (dependencies != null) {
                            for (const dependency of dependencies) {
                                const pickedDependency = pickResolvedModule(dependency, false);
                                if (pickedDependency == null)
                                    continue;
                                this.addWatchFile(pickedDependency);
                            }
                        }
                        // Get some EmitOutput, optionally from the cache if the file contents are unchanged
                        const emitOutput = host.emit(normalizedFile, false);
                        // Return the emit output results to Rollup
                        return getSourceDescriptionFromEmitOutput(emitOutput);
                    })();
                // If nothing was emitted, simply return undefined
                if (sourceDescription == null) {
                    return undefined;
                }
                else {
                    // If Babel shouldn't be used, simply return the emitted results
                    if (babelConfigResult == null) {
                        return sourceDescription;
                    }
                    // Otherwise, pass it on to Babel to perform the rest of the transpilation steps
                    else {
                        const transpilationResult = yield core.transformAsync(sourceDescription.code, Object.assign(Object.assign({}, babelConfigResult.config), { filenameRelative: ensureRelative(cwd, file), inputSourceMap: typeof sourceDescription.map === "string" ? JSON.parse(sourceDescription.map) : sourceDescription.map }));
                        if (transpilationResult == null || transpilationResult.code == null) {
                            return sourceDescription;
                        }
                        // Return the results
                        return {
                            code: transpilationResult.code,
                            map: (_a = transpilationResult.map) !== null && _a !== void 0 ? _a : undefined
                        };
                    }
                }
            });
        },
        /**
         * Attempts to resolve the given id via the LanguageServiceHost
         */
        resolveId(id, parent) {
            // Don't proceed if there is no parent (in which case this is an entry module)
            if (parent == null)
                return null;
            const resolveResult = host.resolve(id, parent);
            const pickedResolveResult = resolveResult == null ? undefined : pickResolvedModule(resolveResult, false);
            return pickedResolveResult == null ? null : nativeNormalize(pickedResolveResult);
        },
        /**
         * Optionally loads the given id. Is used to swap out the regenerator-runtime implementation used by babel
         * to use one that is using ESM by default to play nice with Rollup even when rollup-plugin-commonjs isn't
         * being used
         */
        load(id) {
            const normalizedId = normalize(id);
            // Return the alternative source for the regenerator runtime if that file is attempted to be loaded
            if (normalizedId.endsWith(REGENERATOR_RUNTIME_NAME_1) || normalizedId.endsWith(REGENERATOR_RUNTIME_NAME_2)) {
                return REGENERATOR_SOURCE;
            }
            return null;
        },
        /**
         * Invoked when a full bundle is generated. Will take all modules for all chunks and make sure to remove all removed files
         * from the LanguageService
         */
        generateBundle(outputOptions, bundle) {
            // If debugging is active, log the outputted files
            for (const file of Object.values(bundle)) {
                const normalizedFileName = normalize(file.fileName);
                const text = "code" in file ? file.code : file.source.toString();
                if (shouldDebugEmit(pluginOptions.debug, normalizedFileName, text, "javascript")) {
                    logEmit(normalizedFileName, text);
                }
            }
            // Only emit diagnostics if the plugin options allow it
            if (!Boolean(transpileOnly)) {
                // Emit all reported diagnostics
                emitDiagnostics({ host, pluginOptions, context: this });
            }
            // Emit tsbuildinfo files if required
            if (Boolean(parsedCommandLineResult.parsedCommandLine.options.incremental) || Boolean(parsedCommandLineResult.parsedCommandLine.options.composite)) {
                emitBuildInfo({
                    host,
                    bundle,
                    outputOptions,
                    pluginOptions,
                    pluginContext: this
                });
            }
            // Emit declaration files if required
            if (Boolean(parsedCommandLineResult.originalCompilerOptions.declaration)) {
                emitDeclarations({
                    host,
                    bundle,
                    externalOption: rollupInputOptions.external,
                    outputOptions,
                    pluginOptions,
                    pluginContext: this,
                    multiEntryFileNames: MULTI_ENTRY_FILE_NAMES,
                    multiEntryModule: MULTI_ENTRY_MODULE,
                    originalCompilerOptions: parsedCommandLineResult.originalCompilerOptions
                });
            }
            const bundledFilenames = takeBundledFilesNames(bundle);
            // Walk through all of the files of the LanguageService and make sure to remove them if they are not part of the bundle
            for (const fileName of host.getRollupFileNames()) {
                if (!bundledFilenames.has(fileName)) {
                    host.delete(fileName);
                }
            }
        }
    };
}

module.exports = typescriptRollupPlugin;
//# sourceMappingURL=index.js.map
