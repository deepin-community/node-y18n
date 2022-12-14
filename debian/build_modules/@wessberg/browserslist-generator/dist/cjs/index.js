'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Browserslist = require('browserslist');
var caniuseLite = require('caniuse-lite');
var compatData = require('@mdn/browser-compat-data');
var objectPath = require('object-path');
var semver = require('semver');
var uaParserJs = require('ua-parser-js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Browserslist__default = /*#__PURE__*/_interopDefaultLegacy(Browserslist);
var compatData__default = /*#__PURE__*/_interopDefaultLegacy(compatData);

/**
 * Coerces the given version
 */
function ensureSemver(browser, version) {
    if ((browser === "op_mini" || browser === "android") && version === "all") {
        return semver.coerce("0.0.0");
    }
    else if (browser === "safari" && version === "TP") {
        return SAFARI_TP_MAJOR_VERSION;
    }
    return semver.coerce(version);
}
/**
 * Coerces the given version
 */
function coerceToString(browser, version) {
    return ensureSemver(browser, version).toString();
}

/**
 * Compares two versions, a and b
 */
function compareVersions(a, b) {
    const normalizedA = isNaN(parseFloat(a)) ? a : parseFloat(a);
    const normalizedB = isNaN(parseFloat(b)) ? b : parseFloat(b);
    if (typeof normalizedA === "string" && typeof normalizedB !== "string") {
        return 1;
    }
    if (typeof normalizedB === "string" && typeof normalizedA !== "string") {
        return -1;
    }
    if (normalizedA < normalizedB)
        return -1;
    if (normalizedA > normalizedB)
        return 1;
    return 0;
}

/**
 * A Regular Expression that captures the part of a browser version that should be kept
 */
const NORMALIZE_BROWSER_VERSION_REGEXP = /(?![\d.,]+-)-*(.*)/;

const SAFARI_TP_MAJOR_VERSION = (() => {
    const versions = getSortedBrowserVersions("safari");
    const lastVersionBeforeTp = versions[versions.length - 2];
    const coerced = semver.coerce(lastVersionBeforeTp);
    if (coerced.minor === 9) {
        return semver.coerce(coerced.major + 1);
    }
    else {
        return semver.coerce(`${coerced.major}.${coerced.minor + 1}.0`);
    }
})();
/**
 * Ensures that for any given version of a browser, if it is newer than the latest known version, the last known version will be used as a fallback
 */
function normalizeBrowserVersion(browser, givenVersion, versions = getSortedBrowserVersions(browser)) {
    const givenVersionCoerced = ensureSemver(browser, givenVersion);
    const latestVersion = getLatestVersionOfBrowser(browser);
    const latestVersionCoerced = ensureSemver(browser, latestVersion);
    if (givenVersionCoerced == null || latestVersionCoerced == null) {
        throw new TypeError(`Could not detect the version of: '${givenVersion}' for browser: ${browser}`);
    }
    if (givenVersionCoerced.major > latestVersionCoerced.major ||
        (givenVersionCoerced.major === latestVersionCoerced.major && givenVersionCoerced.minor > latestVersionCoerced.minor) ||
        (givenVersionCoerced.major === latestVersionCoerced.major && givenVersionCoerced.minor === latestVersionCoerced.minor && givenVersionCoerced.patch > latestVersionCoerced.patch)) {
        return latestVersion;
    }
    return getClosestMatchingBrowserVersion(browser, givenVersion, versions);
}
/**
 * Gets the known version of the given browser that is closest to the given version
 */
function getClosestMatchingBrowserVersion(browser, version, versions = getSortedBrowserVersions(browser)) {
    const coerced = ensureSemver(browser, version);
    if (browser === "op_mini" && version === "all")
        return "all";
    if (browser === "safari") {
        if (version === "TP")
            return "TP";
        // If the given version is greater than or equal to the latest non-technical preview version of Safari, the closest match IS TP.
        else if (semver.gt(ensureSemver(browser, `${coerced.major}.${coerced.minor}`), ensureSemver(browser, versions.slice(-2)[0])))
            return "TP";
    }
    let candidate = versions[0];
    versions.forEach(currentVersion => {
        const currentCoerced = ensureSemver(browser, currentVersion);
        if (semver.gte(coerced, currentCoerced)) {
            candidate = currentVersion;
        }
    });
    return candidate;
}
function getSortedBrowserVersionsWithLeadingVersion(browser, inputVersion) {
    const versions = getSortedBrowserVersions(browser);
    const [firstVersion] = versions;
    if (firstVersion != null && inputVersion != null) {
        const firstVersionSemver = ensureSemver(browser, firstVersion);
        let nextInputVersion = inputVersion;
        while (true) {
            const nextInputSemver = ensureSemver(browser, nextInputVersion);
            if (semver.gt(firstVersionSemver, nextInputSemver)) {
                versions.unshift(nextInputVersion);
                nextInputVersion = String(nextInputSemver.major + 1);
            }
            else {
                break;
            }
        }
    }
    return versions;
}
/**
 * Gets all versions of the given browser, sorted
 */
function getSortedBrowserVersions(browser) {
    // Generate the Browserslist query
    const queryResult = Browserslist__default['default']([`>= 0%`, `unreleased versions`]);
    const versions = [];
    // First, organize the different versions of the browsers inside the Map
    queryResult.forEach(part => {
        const [currentBrowser, version] = part.split(" ");
        if (currentBrowser !== browser)
            return;
        const versionMatch = version.match(NORMALIZE_BROWSER_VERSION_REGEXP);
        const normalizedVersion = versionMatch == null ? version : versionMatch[1];
        versions.push(normalizedVersion);
    });
    return versions.sort(compareVersions);
}
/**
 * Gets the latest version of the given browser
 */
function getLatestVersionOfBrowser(browser) {
    const versions = getSortedBrowserVersions(browser);
    return versions[versions.length - 1];
}
/**
 * Gets the oldest (stable) version of the given browser
 */
function getOldestVersionOfBrowser(browser) {
    const versions = getSortedBrowserVersions(browser);
    return versions[0];
}
/**
 * Gets the previous version of the given browser from the given version
 */
function getPreviousVersionOfBrowser(browser, version) {
    const versions = getSortedBrowserVersions(browser);
    const indexOfVersion = versions.indexOf(normalizeBrowserVersion(browser, version, versions));
    // If the version isn't included, or if it is the first version of it, return undefined
    if (indexOfVersion <= 0)
        return undefined;
    return versions[indexOfVersion - 1];
}
/**
 * Gets the previous version of the given browser from the given version
 */
function getNextVersionOfBrowser(browser, version) {
    const versions = getSortedBrowserVersions(browser);
    const indexOfVersion = versions.indexOf(normalizeBrowserVersion(browser, version, versions));
    // If the version isn't included, or if it is the first version of it, return undefined
    if (indexOfVersion <= 0)
        return undefined;
    return versions[indexOfVersion + 1];
}

const ES5_FEATURES = [
    "javascript.builtins.Object.create",
    "javascript.builtins.Object.getPrototypeOf",
    "javascript.builtins.Object.defineProperty",
    "javascript.builtins.Object.defineProperties",
    "javascript.builtins.Object.getOwnPropertyDescriptor",
    "javascript.builtins.Object.getOwnPropertyNames",
    "javascript.builtins.Object.keys",
    "javascript.builtins.Object.preventExtensions",
    "javascript.builtins.Object.isExtensible",
    "javascript.builtins.Object.seal",
    "javascript.builtins.Object.isSealed",
    "javascript.builtins.Object.freeze",
    "javascript.builtins.Object.isFrozen",
    "javascript.builtins.Function.bind",
    "javascript.builtins.String.trim",
    "javascript.builtins.Array.isArray",
    "javascript.builtins.Array.every",
    "javascript.builtins.Array.filter",
    "javascript.builtins.Array.forEach",
    "javascript.builtins.Array.indexOf",
    "javascript.builtins.Array.lastIndexOf",
    "javascript.builtins.Array.map",
    "javascript.builtins.Array.reduce",
    "javascript.builtins.Array.some",
    "javascript.builtins.JSON.parse",
    "javascript.builtins.JSON.stringify",
    "javascript.builtins.Date.now",
    "javascript.builtins.Date.toISOString"
];
const ES2015_FEATURES = [
    ...ES5_FEATURES,
    "javascript.classes",
    "javascript.statements.const",
    "javascript.statements.let",
    "javascript.functions.arrow_functions",
    "javascript.functions.rest_parameters",
    "javascript.grammar.template_literals",
    "javascript.operators.destructuring",
    "javascript.operators.spread.spread_in_arrays",
    "javascript.functions.default_parameters",
    "javascript.builtins.RegExp.sticky",
    "javascript.operators.object_initializer.shorthand_property_names",
    "javascript.operators.object_initializer.computed_property_names",
    "javascript.operators.object_initializer.shorthand_method_names"
];
const ES2016_FEATURES = [...ES2015_FEATURES, "javascript.operators.exponentiation", "javascript.builtins.Array.includes"];
const ES2017_FEATURES = [
    ...ES2016_FEATURES,
    "javascript.builtins.AsyncFunction",
    "javascript.builtins.Object.values",
    "javascript.builtins.Object.entries",
    "javascript.builtins.Object.getOwnPropertyDescriptors",
    "javascript.builtins.String.padStart",
    "javascript.builtins.String.padEnd"
];
const ES2018_FEATURES = [...ES2017_FEATURES, "javascript.operators.spread.spread_in_object_literals", "javascript.builtins.Promise.finally"];
const ES2019_FEATURES = [
    ...ES2018_FEATURES,
    "javascript.builtins.Array.flat",
    "javascript.builtins.Array.flatMap",
    "javascript.builtins.Object.fromEntries",
    "javascript.builtins.String.trimStart",
    "javascript.builtins.String.trimEnd",
    "javascript.builtins.JSON.json_superset",
    "javascript.builtins.JSON.stringify.well_formed_stringify",
    "javascript.builtins.Symbol.description",
    "javascript.statements.try_catch.optional_catch_binding"
];
const ES2020_FEATURES = [...ES2019_FEATURES, "javascript.builtins.String.matchAll"];

/**
 * Applies the given correction within the given version range
 */
function rangeCorrection(browser, supportKind, start, end) {
    const versions = getSortedBrowserVersions(browser);
    const corrections = [];
    versions.forEach(version => {
        let shouldSet = false;
        if (start == null && end == null) {
            shouldSet = true;
        }
        else if (start != null && end == null) {
            if (version === "TP") {
                shouldSet = true;
            }
            else if (version === "all") {
                shouldSet = true;
            }
            else {
                shouldSet = semver.gte(coerceToString(browser, version), coerceToString(browser, start));
            }
        }
        else if (start == null && end != null) {
            if (version === "TP") {
                shouldSet = end === "TP";
            }
            else if (version === "all") {
                shouldSet = true;
            }
            else {
                shouldSet = semver.lte(coerceToString(browser, version), coerceToString(browser, end));
            }
        }
        else if (start != null && end != null) {
            if (version === "TP") {
                shouldSet = end === "TP";
            }
            else if (version === "all") {
                shouldSet = true;
            }
            else {
                shouldSet = semver.gte(coerceToString(browser, version), coerceToString(browser, start)) && semver.lte(coerceToString(browser, version), coerceToString(browser, end));
            }
        }
        if (shouldSet) {
            corrections.push({
                kind: supportKind,
                version
            });
        }
    });
    return corrections;
}

const BOT_TO_USER_AGENTS_MAP = {
    /* eslint-disable @typescript-eslint/naming-convention */
    GoogleBot: agent => agent.includes("http://www.google.com/bot.htm"),
    BingBot: agent => agent.includes("http://www.bing.com/bingbot.htm"),
    YahooBot: agent => agent.includes("http://help.yahoo.com/help/us/ysearch/slurp"),
    FacebookCrawler: agent => agent.includes("http://www.facebook.com/externalhit_uatext.php")
    /* eslint-enable @typescript-eslint/naming-convention */
};

// tslint:disable
/**
 * A class that wraps UAParser
 */
class UaParserWrapper {
    constructor(userAgent) {
        this.userAgent = userAgent;
        this.parser = new uaParserJs.UAParser(userAgent);
    }
    /**
     * Gets the IUserAgentBrowser based on the UAParser
     */
    getBrowser() {
        return this.extendGetBrowserResult(this.parser.getBrowser());
    }
    /**
     * Gets the IUserAgentOS based on the UAParser
     */
    getOS() {
        return this.parser.getOS();
    }
    /**
     * Gets the IUserAgentDevice based on the UAParser
     */
    getDevice() {
        return this.parser.getDevice();
    }
    /**
     * Gets the IEngine based on the UAParser
     */
    getEngine() {
        return this.parser.getEngine();
    }
    /**
     * Gets the ICPU based on the UAParser
     */
    getCPU() {
        return this.parser.getCPU();
    }
    /**
     * Extends the result of calling 'getBrowser' on the UAParser and always takes bots into account
     */
    extendGetBrowserResult(result) {
        var _a, _b;
        // Ensure that the EdgeHTML version is used
        if (result.name === "Edge") {
            const engine = this.parser.getEngine();
            if (engine.name === "EdgeHTML") {
                result.version = engine.version;
                result.major = String((_b = (_a = semver.coerce(engine.version)) === null || _a === void 0 ? void 0 : _a.major) !== null && _b !== void 0 ? _b : result.version);
            }
        }
        // If the parse result already includes a Browser, use it as-is
        if (result.name != null)
            return result;
        // Otherwise, check if it is a bot and match it if so
        if (BOT_TO_USER_AGENTS_MAP.GoogleBot(this.userAgent)) {
            result.name = "Chrome";
            result.version = "41";
            // noinspection JSDeprecatedSymbols
            result.major = "41";
        }
        // BingBot, The Facebook Crawler, and Yahoo's "Slurp" can render JavaScript, but they are very limited in what they can do. Mimic IE8 to reflect the limitations of these engines
        if (BOT_TO_USER_AGENTS_MAP.BingBot(this.userAgent) || BOT_TO_USER_AGENTS_MAP.YahooBot(this.userAgent) || BOT_TO_USER_AGENTS_MAP.FacebookCrawler(this.userAgent)) {
            result.name = "IE";
            result.version = "8";
            // noinspection JSDeprecatedSymbols
            result.major = "8";
        }
        return result;
    }
}

/**
 * A Cache between user agent names and generated Browserslists
 */
const userAgentToBrowserslistCache = new Map();
/**
 * A Cache for retrieving browser support for some features
 * @type {Map<string, BrowserSupportForFeaturesCommonResult>}
 */
const browserSupportForFeaturesCache = new Map();
/**
 * A Cache between feature names and their CaniuseStats
 * @type {Map<string, CaniuseStatsNormalized>}
 */
const featureToCaniuseStatsCache = new Map();
/**
 * A Cache between user agents with any amount of features and whether or not they are supported by the user agent
 * @type {Map<string, boolean>}
 */
const userAgentWithFeaturesToSupportCache = new Map();
// tslint:disable:no-magic-numbers
/**
 * A Map between features and browsers that has partial support for them but should be allowed anyway
 * @type {Map<string, string[]>}
 */
const PARTIAL_SUPPORT_ALLOWANCES = new Map([
    ["shadowdomv1", "*"],
    ["custom-elementsv1", "*"],
    ["web-animation", "*"]
]);
/**
 * These browsers will be ignored all-together since they only report the latest
 * version from Caniuse and is considered unreliable because of it
 * @type {Set<string>}
 */
const IGNORED_BROWSERS_INPUT = ["and_chr", "and_ff", "and_uc", "and_qq", "baidu", "op_mini"];
const IGNORED_BROWSERS = new Set(IGNORED_BROWSERS_INPUT);
const TYPED_ARRAY_BASE_DATA_CORRECTIONS_INPUT = {
    /* eslint-disable @typescript-eslint/naming-convention */
    android: rangeCorrection("android", "AVAILABLE" /* AVAILABLE */, `4`),
    chrome: rangeCorrection("and_chr", "AVAILABLE" /* AVAILABLE */, `7`),
    and_chr: rangeCorrection("and_chr", "AVAILABLE" /* AVAILABLE */, `7`),
    edge: rangeCorrection("edge", "AVAILABLE" /* AVAILABLE */, "12"),
    samsung: rangeCorrection("samsung", "AVAILABLE" /* AVAILABLE */, `4`),
    opera: rangeCorrection("opera", "AVAILABLE" /* AVAILABLE */, `12`),
    op_mob: rangeCorrection("op_mob", "AVAILABLE" /* AVAILABLE */, `12`),
    firefox: rangeCorrection("firefox", "AVAILABLE" /* AVAILABLE */, `4`),
    and_ff: rangeCorrection("and_ff", "AVAILABLE" /* AVAILABLE */, `4`),
    safari: rangeCorrection("safari", "AVAILABLE" /* AVAILABLE */, `6`),
    ios_saf: rangeCorrection("safari", "AVAILABLE" /* AVAILABLE */, `5`),
    ie: rangeCorrection("ie", "AVAILABLE" /* AVAILABLE */, `11`),
    op_mini: rangeCorrection("op_mini", "AVAILABLE" /* AVAILABLE */, `all`),
    bb: rangeCorrection("bb", "AVAILABLE" /* AVAILABLE */, `10`),
    and_uc: rangeCorrection("and_uc", "AVAILABLE" /* AVAILABLE */, `11.8`),
    and_qq: rangeCorrection("and_qq", "AVAILABLE" /* AVAILABLE */, `1.2`),
    baidu: rangeCorrection("baidu", "AVAILABLE" /* AVAILABLE */, `7.12`)
    /* eslint-enable @typescript-eslint/naming-convention */
};
const TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT = {
    /* eslint-disable @typescript-eslint/naming-convention */
    android: rangeCorrection("android", "AVAILABLE" /* AVAILABLE */, `45`),
    chrome: rangeCorrection("and_chr", "AVAILABLE" /* AVAILABLE */, `45`),
    and_chr: rangeCorrection("and_chr", "AVAILABLE" /* AVAILABLE */, `45`),
    edge: rangeCorrection("edge", "AVAILABLE" /* AVAILABLE */, "12"),
    samsung: rangeCorrection("samsung", "AVAILABLE" /* AVAILABLE */, `5`),
    opera: rangeCorrection("opera", "AVAILABLE" /* AVAILABLE */, `32`),
    op_mob: rangeCorrection("op_mob", "AVAILABLE" /* AVAILABLE */, `32`),
    firefox: rangeCorrection("firefox", "AVAILABLE" /* AVAILABLE */, `38`),
    and_ff: rangeCorrection("and_ff", "AVAILABLE" /* AVAILABLE */, `38`),
    safari: rangeCorrection("safari", "AVAILABLE" /* AVAILABLE */, `10`),
    ios_saf: rangeCorrection("safari", "AVAILABLE" /* AVAILABLE */, `10`),
    ie: rangeCorrection("ie", "AVAILABLE" /* AVAILABLE */, `11`),
    ie_mob: rangeCorrection("ie", "AVAILABLE" /* AVAILABLE */, `11`)
    /* eslint-enable @typescript-eslint/naming-convention */
};
const TYPED_ARRAY_ES2016_DATA_CORRECTIONS_INPUT = {
    /* eslint-disable @typescript-eslint/naming-convention */
    android: rangeCorrection("android", "AVAILABLE" /* AVAILABLE */, `47`),
    chrome: rangeCorrection("and_chr", "AVAILABLE" /* AVAILABLE */, `47`),
    and_chr: rangeCorrection("and_chr", "AVAILABLE" /* AVAILABLE */, `47`),
    edge: rangeCorrection("edge", "AVAILABLE" /* AVAILABLE */, "14"),
    samsung: rangeCorrection("samsung", "AVAILABLE" /* AVAILABLE */, `5`),
    opera: rangeCorrection("opera", "AVAILABLE" /* AVAILABLE */, `34`),
    op_mob: rangeCorrection("op_mob", "AVAILABLE" /* AVAILABLE */, `34`),
    firefox: rangeCorrection("firefox", "AVAILABLE" /* AVAILABLE */, `43`),
    and_ff: rangeCorrection("and_ff", "AVAILABLE" /* AVAILABLE */, `43`),
    safari: rangeCorrection("safari", "AVAILABLE" /* AVAILABLE */, `10`),
    ios_saf: rangeCorrection("safari", "AVAILABLE" /* AVAILABLE */, `10`)
    /* eslint-enable @typescript-eslint/naming-convention */
};
const TYPED_ARRAY_KEYS_VALUES_ENTRIES_ITERATOR_DATA_CORRECTIONS_INPUT = {
    /* eslint-disable @typescript-eslint/naming-convention */
    android: rangeCorrection("android", "AVAILABLE" /* AVAILABLE */, `38`),
    chrome: rangeCorrection("and_chr", "AVAILABLE" /* AVAILABLE */, `38`),
    and_chr: rangeCorrection("and_chr", "AVAILABLE" /* AVAILABLE */, `38`),
    edge: rangeCorrection("edge", "AVAILABLE" /* AVAILABLE */, "12"),
    samsung: rangeCorrection("samsung", "AVAILABLE" /* AVAILABLE */, `5`),
    opera: rangeCorrection("opera", "AVAILABLE" /* AVAILABLE */, `26`),
    op_mob: rangeCorrection("op_mob", "AVAILABLE" /* AVAILABLE */, `26`),
    firefox: rangeCorrection("firefox", "AVAILABLE" /* AVAILABLE */, `37`),
    and_ff: rangeCorrection("and_ff", "AVAILABLE" /* AVAILABLE */, `37`),
    safari: rangeCorrection("safari", "AVAILABLE" /* AVAILABLE */, `10`),
    ios_saf: rangeCorrection("safari", "AVAILABLE" /* AVAILABLE */, `10`)
    /* eslint-enable @typescript-eslint/naming-convention */
};
const TYPED_ARRAY_SPECIES_DATA_CORRECTIONS_INPUT = {
    /* eslint-disable @typescript-eslint/naming-convention */
    android: rangeCorrection("android", "AVAILABLE" /* AVAILABLE */, `51`),
    chrome: rangeCorrection("and_chr", "AVAILABLE" /* AVAILABLE */, `51`),
    and_chr: rangeCorrection("and_chr", "AVAILABLE" /* AVAILABLE */, `51`),
    edge: rangeCorrection("edge", "AVAILABLE" /* AVAILABLE */, "13"),
    samsung: rangeCorrection("samsung", "AVAILABLE" /* AVAILABLE */, `5`),
    opera: rangeCorrection("opera", "AVAILABLE" /* AVAILABLE */, `38`),
    op_mob: rangeCorrection("op_mob", "AVAILABLE" /* AVAILABLE */, `38`),
    firefox: rangeCorrection("firefox", "AVAILABLE" /* AVAILABLE */, `48`),
    and_ff: rangeCorrection("and_ff", "AVAILABLE" /* AVAILABLE */, `48`),
    safari: rangeCorrection("safari", "AVAILABLE" /* AVAILABLE */, `10`),
    ios_saf: rangeCorrection("safari", "AVAILABLE" /* AVAILABLE */, `10`)
    /* eslint-enable @typescript-eslint/naming-convention */
};
/**
 * Not all Caniuse data is entirely correct. For some features, the data on https://kangax.github.io/compat-table/es6/
 * is more correct. When a Browserslist is generated based on support for specific features, it is really important
 * that it is correct, especially if the browserslist will be used as an input to tools such as @babel/preset-env.
 * This table provides some corrections to the Caniuse data that makes it align better with actual availability
 * @type {[string, CaniuseBrowserCorrection][]}
 */
const FEATURE_TO_BROWSER_DATA_CORRECTIONS_INPUT = [
    /* eslint-disable @typescript-eslint/naming-convention */
    [
        "xhr2",
        {
            ie: [
                {
                    // Caniuse reports that XMLHttpRequest support is partial in Internet Explorer 11, but it is in fact properly supported
                    kind: "AVAILABLE" /* AVAILABLE */,
                    version: "11"
                }
            ]
        }
    ],
    [
        // Caniuse reports that Safari 12.1 and iOS Safari 12.2 has partial support for Web Animations,
        // but they do not - They require enabling it as an experimental feature
        "web-animation",
        {
            safari: rangeCorrection("safari", "UNAVAILABLE" /* UNAVAILABLE */, `0`),
            ios_saf: rangeCorrection("ios_saf", "UNAVAILABLE" /* UNAVAILABLE */, `0`)
        }
    ],
    [
        "es6-class",
        {
            edge: [
                {
                    // Caniuse reports that Microsoft Edge has been supporting classes since v12, but it was prefixed until v13
                    kind: "PREFIXED" /* PREFIXED */,
                    version: "12"
                }
            ],
            ios_saf: [
                {
                    // Caniuse reports that iOS Safari has been supporting classes since v9, but the implementation was only partial
                    kind: "PARTIAL_SUPPORT" /* PARTIAL_SUPPORT */,
                    version: "9"
                },
                {
                    // Caniuse reports that iOS Safari has been supporting classes since v9, but the implementation was only partial
                    kind: "PARTIAL_SUPPORT" /* PARTIAL_SUPPORT */,
                    version: "9.2"
                },
                {
                    // Caniuse reports that iOS Safari has been supporting classes since v9, but the implementation was only partial
                    kind: "PARTIAL_SUPPORT" /* PARTIAL_SUPPORT */,
                    version: "9.3"
                }
            ],
            safari: [
                {
                    // Caniuse reports that Safari has been supporting classes since v9, but the implementation was only partial
                    kind: "PARTIAL_SUPPORT" /* PARTIAL_SUPPORT */,
                    version: "9"
                },
                {
                    // Caniuse reports that Safari has been supporting classes since v9, but the implementation was only partial
                    kind: "PARTIAL_SUPPORT" /* PARTIAL_SUPPORT */,
                    version: "9.1"
                }
            ]
        }
    ],
    [
        "api.Element.classList",
        {
            edge: [
                {
                    // Caniuse reports that Microsoft Edge v15 has only partial support for class-list since it doesn't support SVG elements,
                    // but we don't want feature detections to return false for that browser
                    kind: "AVAILABLE" /* AVAILABLE */,
                    version: "15"
                }
            ],
            ie: [
                {
                    // Caniuse reports that IE 10 has only partial support for class-list since it doesn't support SVG elements,
                    // but we don't want feature detections to return false for that browser
                    kind: "AVAILABLE" /* AVAILABLE */,
                    version: "10"
                },
                {
                    // Caniuse reports that IE 11 has only partial support for class-list since it doesn't support SVG elements,
                    // but we don't want feature detections to return false for that browser
                    kind: "AVAILABLE" /* AVAILABLE */,
                    version: "11"
                }
            ]
        }
    ],
    ["javascript.builtins.TypedArray.from", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.of", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.subarray", TYPED_ARRAY_BASE_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.copyWithin", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.every", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.fill", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.filter", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.find", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.findIndex", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.forEach", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.indexOf", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.join", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.lastIndexOf", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.map", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.reduce", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.reduceRight", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.reverse", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.some", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.sort", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.toLocaleString", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.toString", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.slice", TYPED_ARRAY_ES2015_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.includes", TYPED_ARRAY_ES2016_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.keys", TYPED_ARRAY_KEYS_VALUES_ENTRIES_ITERATOR_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.values", TYPED_ARRAY_KEYS_VALUES_ENTRIES_ITERATOR_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.entries", TYPED_ARRAY_KEYS_VALUES_ENTRIES_ITERATOR_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.@@iterator", TYPED_ARRAY_KEYS_VALUES_ENTRIES_ITERATOR_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray.@@species", TYPED_ARRAY_SPECIES_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.TypedArray", TYPED_ARRAY_BASE_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.Int8Array", TYPED_ARRAY_BASE_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.Int16Array", TYPED_ARRAY_BASE_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.Int32Array", TYPED_ARRAY_BASE_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.Float32Array", TYPED_ARRAY_BASE_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.Float64Array", TYPED_ARRAY_BASE_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.Uint8Array", TYPED_ARRAY_BASE_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.Uint8ClampedArray", TYPED_ARRAY_BASE_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.Uint16ClampedArray", TYPED_ARRAY_BASE_DATA_CORRECTIONS_INPUT],
    ["javascript.builtins.Uint32ClampedArray", TYPED_ARRAY_BASE_DATA_CORRECTIONS_INPUT],
    [
        "javascript.builtins.String.@@iterator",
        {
            android: rangeCorrection("chrome", "AVAILABLE" /* AVAILABLE */, `38`),
            chrome: rangeCorrection("chrome", "AVAILABLE" /* AVAILABLE */, `38`),
            and_chr: rangeCorrection("and_chr", "AVAILABLE" /* AVAILABLE */, `38`),
            edge: rangeCorrection("edge", "AVAILABLE" /* AVAILABLE */, `12`),
            opera: rangeCorrection("opera", "AVAILABLE" /* AVAILABLE */, `25`),
            op_mob: rangeCorrection("op_mob", "AVAILABLE" /* AVAILABLE */, `25`),
            firefox: rangeCorrection("firefox", "AVAILABLE" /* AVAILABLE */, `36`),
            and_ff: rangeCorrection("and_ff", "AVAILABLE" /* AVAILABLE */, `36`),
            safari: rangeCorrection("safari", "AVAILABLE" /* AVAILABLE */, `9`),
            ios_saf: rangeCorrection("ios_saf", "AVAILABLE" /* AVAILABLE */, `9`),
            samsung: rangeCorrection("samsung", "AVAILABLE" /* AVAILABLE */, `3`)
        }
    ],
    [
        "javascript.builtins.Symbol.asyncIterator",
        {
            android: rangeCorrection("android", "AVAILABLE" /* AVAILABLE */, `63`),
            chrome: rangeCorrection("chrome", "AVAILABLE" /* AVAILABLE */, `63`),
            and_chr: rangeCorrection("and_chr", "AVAILABLE" /* AVAILABLE */, `63`),
            opera: rangeCorrection("opera", "AVAILABLE" /* AVAILABLE */, `50`),
            op_mob: rangeCorrection("op_mob", "AVAILABLE" /* AVAILABLE */, `50`),
            firefox: rangeCorrection("firefox", "AVAILABLE" /* AVAILABLE */, `57`),
            and_ff: rangeCorrection("and_ff", "AVAILABLE" /* AVAILABLE */, `57`),
            safari: rangeCorrection("safari", "AVAILABLE" /* AVAILABLE */, `11.1`),
            ios_saf: rangeCorrection("ios_saf", "AVAILABLE" /* AVAILABLE */, `11.1`)
        }
    ],
    [
        "javascript.builtins.Array.@@species",
        {
            android: rangeCorrection("android", "AVAILABLE" /* AVAILABLE */, `51`),
            // MDN reports that it doesn't support Array.@@species, but it does and has done since Chrome v51
            chrome: rangeCorrection("chrome", "AVAILABLE" /* AVAILABLE */, `51`),
            // MDN reports that it doesn't support Array.@@species, but it does and has done since Chrome for Android v51
            and_chr: rangeCorrection("and_chr", "AVAILABLE" /* AVAILABLE */, `51`),
            // MDN reports that it doesn't support Array.@@species, but it does and has done since Edge v14
            edge: rangeCorrection("edge", "AVAILABLE" /* AVAILABLE */, `14`),
            // MDN reports that it doesn't support Array.@@species, but it does and has done since Firefox v41
            firefox: rangeCorrection("firefox", "AVAILABLE" /* AVAILABLE */, `41`),
            // MDN reports that it doesn't support Array.@@species, but it does and has done since Firefox for Android v41
            and_ff: rangeCorrection("and_ff", "AVAILABLE" /* AVAILABLE */, `41`),
            // MDN reports that it doesn't support Array.@@species, but it does and has done since Opera v38
            opera: rangeCorrection("opera", "AVAILABLE" /* AVAILABLE */, `38`),
            // MDN reports that it doesn't support Array.@@species, but it does and has done since Opera for Android v38
            op_mob: rangeCorrection("op_mob", "AVAILABLE" /* AVAILABLE */, `38`),
            // MDN reports that it doesn't support Array.@@species, but it does and has done since Safari v10
            safari: rangeCorrection("safari", "AVAILABLE" /* AVAILABLE */, `10`),
            // MDN reports that it doesn't support Array.@@species, but it does and has done since Safari for iOS v10
            ios_saf: rangeCorrection("ios_saf", "AVAILABLE" /* AVAILABLE */, `10`)
        }
    ],
    [
        "javascript.builtins.Date.@@toPrimitive",
        {
            android: rangeCorrection("android", "AVAILABLE" /* AVAILABLE */, `48`),
            // MDN reports that it doesn't support Date.@@toPrimitive, but it does and has done since Chrome v48
            chrome: rangeCorrection("chrome", "AVAILABLE" /* AVAILABLE */, `48`),
            // MDN reports that it doesn't support Date.@@toPrimitive, but it does and has done since Chrome for Android v48
            and_chr: rangeCorrection("and_chr", "AVAILABLE" /* AVAILABLE */, `48`),
            // MDN reports that it doesn't support Date.@@toPrimitive, but it does and has done in all Edge versions
            edge: rangeCorrection("edge", "AVAILABLE" /* AVAILABLE */),
            // MDN reports that it doesn't support Date.@@toPrimitive, but it does and has done since Firefox v44
            firefox: rangeCorrection("firefox", "AVAILABLE" /* AVAILABLE */, `44`),
            // MDN reports that it doesn't support Date.@@toPrimitive, but it does and has done since Firefox for Android v44
            and_ff: rangeCorrection("and_ff", "AVAILABLE" /* AVAILABLE */, `44`),
            // MDN reports that it doesn't support Date.@@toPrimitive, but it does and has done since Opera v35
            opera: rangeCorrection("opera", "AVAILABLE" /* AVAILABLE */, `35`),
            // MDN reports that it doesn't support Date.@@toPrimitive, but it does and has done since Opera for Android v35
            op_mob: rangeCorrection("op_mob", "AVAILABLE" /* AVAILABLE */, `35`),
            // MDN reports that it doesn't support Date.@@toPrimitive, but it does and has done since Safari v10
            safari: rangeCorrection("safari", "AVAILABLE" /* AVAILABLE */, `10`),
            // MDN reports that it doesn't support Date.@@toPrimitive, but it does and has done since Safari for iOS v10
            ios_saf: rangeCorrection("ios_saf", "AVAILABLE" /* AVAILABLE */, `10`),
            // MDN reports that it doesn't support the Date.@@toPrimitive method, but it does and has done for all Samsung Internet versions
            samsung: rangeCorrection("samsung", "AVAILABLE" /* AVAILABLE */)
        }
    ],
    [
        "fetch",
        {
            edge: [
                {
                    // Caniuse reports that Microsoft Edge has been supporting fetch since v14, but the implementation was quite unstable until v15
                    kind: "UNAVAILABLE" /* UNAVAILABLE */,
                    version: "14"
                }
            ]
        }
    ],
    [
        "api.Window",
        {
            chrome: rangeCorrection("chrome", "UNAVAILABLE" /* UNAVAILABLE */, `0`, `18`),
            safari: rangeCorrection("safari", "UNAVAILABLE" /* UNAVAILABLE */, `0`, `5.1`),
            ie: rangeCorrection("ie", "UNAVAILABLE" /* UNAVAILABLE */, `0`, `7`),
            opera: rangeCorrection("safari", "UNAVAILABLE" /* UNAVAILABLE */, `0`, `11.1`)
        }
    ],
    [
        "javascript.builtins.String.matchAll",
        {
            samsung: rangeCorrection("samsung", "UNAVAILABLE" /* UNAVAILABLE */, `0`, `9.4`)
        }
    ],
    [
        "resizeobserver",
        {
            safari: rangeCorrection("safari", "UNAVAILABLE" /* UNAVAILABLE */, `0`)
        }
    ]
    /* eslint-enable @typescript-eslint/naming-convention */
];
/**
 * A Map between caniuse features and corrections to apply (see above)
 * @type {Map<string, CaniuseBrowserCorrection>}
 */
const FEATURE_TO_BROWSER_DATA_CORRECTIONS_MAP = new Map(FEATURE_TO_BROWSER_DATA_CORRECTIONS_INPUT);
/**
 * Returns the input query, but extended with the given options
 */
function extendQueryWith(query, extendWith) {
    const normalizedExtendWith = Array.isArray(extendWith) ? extendWith : [extendWith];
    return [...new Set([...query, ...normalizedExtendWith])];
}
/**
 * Normalizes the given Browserslist
 */
function normalizeBrowserslist(browserslist) {
    return Browserslist__default['default'](browserslist);
}
/**
 * Returns the input query, but extended with 'unreleased versions'
 *
 * @param query
 * @param browsers
 * @returns
 */
function extendQueryWithUnreleasedVersions(query, browsers) {
    return extendQueryWith(query, Array.from(browsers).map(browser => `unreleased ${browser} versions`));
}
/**
 * Generates a Browserslist based on browser support for the given features
 *
 * @param features
 * @returns
 */
function browsersWithSupportForFeatures(...features) {
    const { query, browsers } = browserSupportForFeaturesCommon(">=", ...features);
    return extendQueryWithUnreleasedVersions(query, browsers);
}
/**
 * Returns true if the given Browserslist supports the given EcmaVersion
 * @param browserslist
 * @param version
 */
function browserslistSupportsEcmaVersion(browserslist, version) {
    switch (version) {
        case "es3":
            // ES3 is the lowest possible target and will always be treated as supported
            return true;
        case "es5":
            return browserslistSupportsFeatures(browserslist, ...ES5_FEATURES);
        case "es2015":
            return browserslistSupportsFeatures(browserslist, ...ES2015_FEATURES);
        case "es2016":
            return browserslistSupportsFeatures(browserslist, ...ES2016_FEATURES);
        case "es2017":
            return browserslistSupportsFeatures(browserslist, ...ES2017_FEATURES);
        case "es2018":
            return browserslistSupportsFeatures(browserslist, ...ES2018_FEATURES);
        case "es2019":
            return browserslistSupportsFeatures(browserslist, ...ES2019_FEATURES);
        case "es2020":
            return browserslistSupportsFeatures(browserslist, ...ES2020_FEATURES);
    }
}
/**
 * Returns the appropriate Ecma version for the given Browserslist
 *
 * @param browserslist
 * @returns
 */
function getAppropriateEcmaVersionForBrowserslist(browserslist) {
    if (browserslistSupportsEcmaVersion(browserslist, "es2020"))
        return "es2020";
    if (browserslistSupportsEcmaVersion(browserslist, "es2019"))
        return "es2019";
    if (browserslistSupportsEcmaVersion(browserslist, "es2018"))
        return "es2018";
    else if (browserslistSupportsEcmaVersion(browserslist, "es2017"))
        return "es2017";
    else if (browserslistSupportsEcmaVersion(browserslist, "es2016"))
        return "es2016";
    else if (browserslistSupportsEcmaVersion(browserslist, "es2015"))
        return "es2015";
    else if (browserslistSupportsEcmaVersion(browserslist, "es5"))
        return "es5";
    else
        return "es3";
}
/**
 * Generates a Browserslist based on browser support for the given ECMA version
 *
 * @param version
 * @returns
 */
function browsersWithSupportForEcmaVersion(version) {
    switch (version) {
        case "es3":
            return browsersWithoutSupportForFeatures(...ES5_FEATURES);
        case "es5":
            return browsersWithSupportForFeatures(...ES5_FEATURES);
        case "es2015":
            return browsersWithSupportForFeatures(...ES2015_FEATURES);
        case "es2016":
            return browsersWithSupportForFeatures(...ES2016_FEATURES);
        case "es2017":
            return browsersWithSupportForFeatures(...ES2017_FEATURES);
        case "es2018":
            return browsersWithSupportForFeatures(...ES2018_FEATURES);
        case "es2019":
            return browsersWithSupportForFeatures(...ES2019_FEATURES);
        case "es2020":
            return browsersWithSupportForFeatures(...ES2020_FEATURES);
    }
}
/**
 * Returns true if the given browserslist support all of the given features
 *
 * @param browserslist
 * @param features
 * @returns
 */
function browserslistSupportsFeatures(browserslist, ...features) {
    // First, generate an ideal browserslist that would target the given features exactly
    const normalizedIdealBrowserslist = normalizeBrowserslist(browsersWithSupportForFeatures(...features));
    // Now, normalize the input browserslist
    const normalizedInputBrowserslist = normalizeBrowserslist(browserslist);
    // Now, compare the two and see if they align. If they do, the input browserslist *does* support all of the given features.
    // They align if all members of the input browserslist are included in the ideal browserslist
    return normalizedInputBrowserslist.every(option => normalizedIdealBrowserslist.includes(option));
}
/**
 * Generates a Browserslist based on browsers that *doesn't* support the given features
 *
 * @param features
 * @returns
 */
function browsersWithoutSupportForFeatures(...features) {
    return browserSupportForFeaturesCommon("<", ...features).query;
}
/**
 * Returns true if the given browser should be ignored. The data reported from Caniuse is a bit lacking.
 * For example, only the latest version of and_ff, and_qq, and_uc and baidu is reported, and since
 * android went to use Chromium for the WebView, it has only reported the latest Chromium version
 *
 * @param browser
 * @param version
 * @returns
 */
function shouldIgnoreBrowser(browser, version) {
    return ((browser === "android" && semver.gt(coerceToString(browser, version), coerceToString(browser, "4.4.4"))) ||
        (browser === "op_mob" && semver.gt(coerceToString(browser, version), coerceToString(browser, "12.1"))) ||
        IGNORED_BROWSERS.has(browser));
}
/**
 * Normalizes the given ICaniuseLiteFeature
 *
 * @param stats
 * @param featureName
 * @returns
 */
function getCaniuseLiteFeatureNormalized(stats, featureName) {
    // Check if a correction exists for this browser
    const featureCorrectionMatch = FEATURE_TO_BROWSER_DATA_CORRECTIONS_MAP.get(featureName);
    const keys = Object.keys(stats);
    keys.forEach(browser => {
        const browserDict = stats[browser];
        Object.entries(browserDict).forEach(([version, support]) => {
            const versionMatch = version.match(NORMALIZE_BROWSER_VERSION_REGEXP);
            const normalizedVersion = versionMatch == null ? version : versionMatch[1];
            let supportKind;
            if (support === "AVAILABLE" /* AVAILABLE */ ||
                support === "UNAVAILABLE" /* UNAVAILABLE */ ||
                support === "PARTIAL_SUPPORT" /* PARTIAL_SUPPORT */ ||
                support === "PREFIXED" /* PREFIXED */) {
                supportKind = support;
            }
            else if (support.startsWith("y")) {
                supportKind = "AVAILABLE" /* AVAILABLE */;
            }
            else if (support.startsWith("n")) {
                supportKind = "UNAVAILABLE" /* UNAVAILABLE */;
            }
            else if (support.startsWith("a")) {
                supportKind = "PARTIAL_SUPPORT" /* PARTIAL_SUPPORT */;
            }
            else {
                supportKind = "PREFIXED" /* PREFIXED */;
            }
            // Delete the rewritten version
            if (version !== normalizedVersion) {
                delete browserDict[version];
            }
            if (support !== supportKind) {
                browserDict[normalizedVersion] = supportKind;
            }
            // If a feature correction exists for this feature, apply applicable corrections
            if (featureCorrectionMatch != null) {
                // Check if the browser has some corrections
                const browserMatch = featureCorrectionMatch[browser];
                if (browserMatch != null) {
                    // Apply all corrections
                    browserMatch.forEach(correction => {
                        browserDict[correction.version] = correction.kind;
                    });
                }
            }
        });
    });
    return stats;
}
/**
 * Gets the support from caniuse for the given feature
 *
 * @param feature
 * @returns
 */
function getCaniuseFeatureSupport(feature) {
    const rawStats = caniuseLite.feature(caniuseLite.features[feature]).stats;
    for (const browser of Object.keys(rawStats)) {
        const browserDict = rawStats[browser];
        for (const version of Object.keys(browserDict)) {
            // If browser is Android and version is greater than "4.4.4", or if the browser is Chrome, Firefox, UC, QQ for Android, or Baidu,
            // strip it entirely from the data, since Caniuse only reports the latest versions of those browsers
            if (shouldIgnoreBrowser(browser, version)) {
                delete browserDict[version];
            }
        }
    }
    return getCaniuseLiteFeatureNormalized(rawStats, feature);
}
/**
 * Returns true if the given feature is a Caniuse feature
 * @param feature
 */
function isCaniuseFeature(feature) {
    return caniuseLite.features[feature] != null;
}
/**
 * Returns true if the given feature is a MDN feature
 * @param feature
 */
function isMdnFeature(feature) {
    return objectPath.get(compatData__default['default'], feature) != null;
}
/**
 * Asserts that the given feature is a valid Caniuse or MDN feature name
 *
 * @param feature
 */
function assertKnownFeature(feature) {
    if (!isCaniuseFeature(feature) && !isMdnFeature(feature)) {
        throw new TypeError(`The given feature: '${feature}' is unknown. It must be a valid Caniuse or MDN feature!`);
    }
}
/**
 * Gets the feature support for the given feature
 *
 * @param feature
 * @returns
 */
function getFeatureSupport(feature) {
    // First check if the cache has a match and return it if so
    const cacheHit = featureToCaniuseStatsCache.get(feature);
    if (cacheHit != null)
        return cacheHit;
    // Assert that the feature is in fact known
    assertKnownFeature(feature);
    const result = isMdnFeature(feature) ? getMdnFeatureSupport(feature) : getCaniuseFeatureSupport(feature);
    // Store it in the cache before returning it
    featureToCaniuseStatsCache.set(feature, result);
    return result;
}
/**
 * Gets the support from caniuse for the given feature
 *
 * @param feature
 * @returns
 */
function getMdnFeatureSupport(feature) {
    const match = objectPath.get(compatData__default['default'], feature);
    const supportMap = match.__compat.support;
    const formatBrowser = (mdnBrowser, caniuseBrowser) => {
        const versionMap = supportMap[mdnBrowser];
        const versionAdded = versionMap == null
            ? false
            : Array.isArray(versionMap)
                ? // If there are multiple entries, take the one that hasn't been removed yet, if any
                    (() => {
                        const versionStillInBrowser = versionMap.filter(element => element.version_removed == null)[0];
                        return versionStillInBrowser == null || versionStillInBrowser.version_added == null ? false : versionStillInBrowser.version_added;
                    })()
                : versionMap.version_added;
        const dict = {};
        const supportedSince = versionAdded === false ? null : versionAdded === true ? getOldestVersionOfBrowser(caniuseBrowser) : versionAdded;
        getSortedBrowserVersionsWithLeadingVersion(caniuseBrowser, typeof versionAdded === "string" ? versionAdded : undefined).forEach(version => {
            // If the features has never been supported, mark the feature as unavailable
            if (supportedSince == null) {
                dict[version] = "UNAVAILABLE" /* UNAVAILABLE */;
            }
            else {
                dict[version] =
                    version === "TP" || version === "all" || semver.gte(coerceToString(caniuseBrowser, version), coerceToString(caniuseBrowser, supportedSince))
                        ? "AVAILABLE" /* AVAILABLE */
                        : "UNAVAILABLE" /* UNAVAILABLE */;
            }
        });
        return dict;
    };
    const stats = {
        /* eslint-disable @typescript-eslint/naming-convention */
        and_chr: formatBrowser("chrome_android", "and_chr"),
        chrome: formatBrowser("chrome", "chrome"),
        and_ff: formatBrowser("firefox_android", "and_ff"),
        and_qq: {},
        and_uc: {},
        android: formatBrowser("webview_android", "android"),
        baidu: {},
        bb: {},
        edge: formatBrowser("edge", "edge"),
        samsung: formatBrowser("samsunginternet_android", "samsung"),
        ie: formatBrowser("ie", "ie"),
        ie_mob: formatBrowser("ie", "ie_mob"),
        safari: formatBrowser("safari", "safari"),
        ios_saf: formatBrowser("safari_ios", "ios_saf"),
        opera: formatBrowser("opera", "opera"),
        op_mini: {},
        op_mob: {},
        firefox: formatBrowser("firefox", "firefox")
        /* eslint-enable @typescript-eslint/naming-convention */
    };
    return getCaniuseLiteFeatureNormalized(stats, feature);
}
/**
 * Gets the first version that matches the given CaniuseSupportKind
 *
 * @param kind
 * @param stats
 * @returns
 */
function getFirstVersionWithSupportKind(kind, stats) {
    // Sort all keys of the object
    const sortedKeys = Object.keys(stats).sort(compareVersions);
    for (const key of sortedKeys) {
        if (stats[key] === kind) {
            return key;
        }
    }
    return undefined;
}
/**
 * Sorts the given browserslist. Ensures that 'not' expressions come last
 *
 * @param a
 * @param b
 * @returns
 */
function sortBrowserslist(a, b) {
    if (a.startsWith("not") && !b.startsWith("not"))
        return 1;
    if (!a.startsWith("not") && b.startsWith("not"))
        return -1;
    return 0;
}
/**
 * Gets a Map between browser names and the first version of them that supported the given feature
 *
 * @param feature
 * @returns
 */
function getFirstVersionsWithFullSupport(feature) {
    const support = getFeatureSupport(feature);
    // A map between browser names and their required versions
    const browserMap = new Map();
    const entries = Object.entries(support);
    entries.forEach(([browser, stats]) => {
        const fullSupportVersion = getFirstVersionWithSupportKind("AVAILABLE" /* AVAILABLE */, stats);
        if (fullSupportVersion != null) {
            browserMap.set(browser, fullSupportVersion);
        }
    });
    return browserMap;
}
/**
 * Gets the Cache key for the given combination of a comparison operator and any amount of features
 *
 * @param comparisonOperator
 * @param features
 */
function getBrowserSupportForFeaturesCacheKey(comparisonOperator, features) {
    return `${comparisonOperator}.${features.sort().join(",")}`;
}
/**
 * Common logic for the functions that generate browserslists based on feature support
 *
 * @param comparisonOperator
 * @param features
 * @returns
 */
function browserSupportForFeaturesCommon(comparisonOperator, ...features) {
    const cacheKey = getBrowserSupportForFeaturesCacheKey(comparisonOperator, features);
    // First check if the cache has a hit and return it if so
    const cacheHit = browserSupportForFeaturesCache.get(cacheKey);
    if (cacheHit != null) {
        return cacheHit;
    }
    // All of the generated browser maps
    const browserMaps = [];
    for (const feature of features) {
        const support = getFeatureSupport(feature);
        // A map between browser names and their required versions
        const browserMap = new Map();
        const entries = Object.entries(support);
        entries.forEach(([browser, stats]) => {
            const fullSupportVersion = getFirstVersionWithSupportKind("AVAILABLE" /* AVAILABLE */, stats);
            const partialSupportVersion = getFirstVersionWithSupportKind("PARTIAL_SUPPORT" /* PARTIAL_SUPPORT */, stats);
            let versionToSet;
            if (fullSupportVersion != null) {
                versionToSet = fullSupportVersion;
            }
            // Otherwise, check if partial support exists and should be allowed
            if (partialSupportVersion != null) {
                // Get all partial support allowances for this specific feature
                const partialSupportMatch = PARTIAL_SUPPORT_ALLOWANCES.get(feature);
                // Check if partial support exists for the browser. // If no full supported version exists or if the partial supported version has a lower version number than the full supported one, use that one instead
                if (partialSupportMatch != null &&
                    (partialSupportMatch === "*" || partialSupportMatch.includes(browser)) &&
                    (fullSupportVersion == null || compareVersions(partialSupportVersion, fullSupportVersion) < 0)) {
                    versionToSet = partialSupportVersion;
                }
            }
            if (versionToSet == null) {
                // Apply additional checks depending on the comparison operator
                switch (comparisonOperator) {
                    case "<":
                    case "<=":
                        // Add all browsers with no support whatsoever, or those that require prefixing or flags
                        versionToSet = "-1";
                }
            }
            if (versionToSet != null) {
                browserMap.set(browser, versionToSet);
            }
        });
        browserMaps.push(browserMap);
    }
    // Now, remove all browsers that isn't part of all generated browser maps
    for (const browserMap of browserMaps) {
        for (const browser of browserMap.keys()) {
            if (!browserMaps.every(map => map.has(browser))) {
                // Delete the browser if it isn't included in all of the browser maps
                browserMap.delete(browser);
            }
        }
    }
    // Now, prepare a combined browser map
    const combinedBrowserMap = new Map();
    for (const browserMap of browserMaps) {
        for (const [browser, version] of browserMap.entries()) {
            // Take the existing entry from the combined map
            const existingVersion = combinedBrowserMap.get(browser);
            // The browser should be set in the map if it has no entry already
            const shouldSet = existingVersion !== "-1" && (existingVersion == null || version === "-1" || compareVersions(version, existingVersion) >= 0);
            if (shouldSet) {
                // Set the version in the map
                combinedBrowserMap.set(browser, version);
            }
        }
    }
    // Finally, generate a string array of the browsers
    // Make sure that 'not' expressions come last
    const query = [].concat
        .apply([], Array.from(combinedBrowserMap.entries()).map(([browser, version]) => {
        // The version is not a number, so we can't do comparisons on it.
        if (isNaN(parseFloat(version))) {
            switch (comparisonOperator) {
                case "<":
                case "<=": {
                    const previousVersion = getPreviousVersionOfBrowser(browser, version);
                    return [`not ${browser} ${version}`, ...(previousVersion == null ? [] : [`${browser} ${comparisonOperator} ${previousVersion}`])];
                }
                case ">":
                case ">=": {
                    const nextVersion = getNextVersionOfBrowser(browser, version);
                    return [`${browser} ${version}`, ...(nextVersion == null ? [] : [`${browser} ${comparisonOperator} ${nextVersion}`])];
                }
            }
        }
        return parseInt(version) === -1
            ? [
                `${comparisonOperator === ">" || comparisonOperator === ">=" ? "not " : ""}${browser} ${browser === "op_mini" ? "all" : "> 0"}`,
                `${comparisonOperator === ">" || comparisonOperator === ">=" ? "not " : ""}unreleased ${browser} versions`
            ]
            : [`${browser} ${comparisonOperator} ${version}`];
    }))
        .sort(sortBrowserslist);
    const returnObject = {
        query,
        browsers: new Set(combinedBrowserMap.keys())
    };
    // Store it in the cache before returning it
    browserSupportForFeaturesCache.set(cacheKey, returnObject);
    return returnObject;
}
/**
 * Gets the matching CaniuseBrowser for the given UseragentBrowser. Not all are supported, so it may return undefined
 *
 * @param parser
 * @returns
 */
function getCaniuseBrowserForUseragentBrowser(parser) {
    const browser = parser.getBrowser();
    const device = parser.getDevice();
    const os = parser.getOS();
    const engine = parser.getEngine();
    // First, if it is a Blackberry device, it will always be the 'bb' browser
    if (device.vendor === "BlackBerry" || os.name === "BlackBerry") {
        return "bb";
    }
    switch (browser.name) {
        case "Samsung Browser":
            return "samsung";
        case "Android Browser": {
            // If the vendor is Samsung, the default browser is Samsung Internet
            if (device.vendor === "Samsung") {
                return "samsung";
            }
            // Default to the stock android browser
            return "android";
        }
        case "WebKit":
            // This will be the case if we're in an iOS Safari WebView
            if (device.type === "mobile" || device.type === "tablet" || device.type === "smarttv" || device.type === "wearable" || device.type === "embedded") {
                return "ios_saf";
            }
            // Otherwise, fall back to Safari
            return "safari";
        case "Baidu":
            return "baidu";
        case "Chrome Headless":
        case "Chrome WebView":
            return "chrome";
        case "Facebook":
            // If the OS is iOS, it is actually Safari that drives the WebView
            if (os.name === "iOS") {
                return "ios_saf";
            }
            // Otherwise, we're on Android and inside of a WebView
            return "chrome";
        case "Chrome":
            // Check if the OS is Android, in which case this is actually Chrome for Android. Make it report as regular Chrome
            if (os.name === "Android") {
                return "chrome";
            }
            // If the OS is iOS, it is actually Safari that drives the WebView
            else if (os.name === "iOS") {
                return "ios_saf";
            }
            // Otherwise, fall back to chrome
            return "chrome";
        case "Edge":
            return "edge";
        case "Firefox":
            // Check if the OS is Android, in which case this is actually Firefox for Android.
            if (os.name === "Android") {
                return "and_ff";
            }
            // If the OS is iOS, it is actually Safari that drives the WebView
            else if (os.name === "iOS") {
                return "ios_saf";
            }
            // Default to Firefox
            return "firefox";
        case "IE":
            return "ie";
        case "IE Mobile":
        case "IEMobile":
            return "ie_mob";
        case "Safari":
            return "safari";
        case "Mobile Safari":
        case "MobileSafari":
        case "Safari Mobile":
        case "SafariMobile":
            return "ios_saf";
        case "Opera":
            return "opera";
        case "Opera Mini":
            return "op_mini";
        case "Opera Mobi":
            return "op_mob";
        case "QQBrowser":
            return "and_qq";
        case "UCBrowser":
            return "and_uc";
        default:
            switch (engine.name) {
                case "Blink":
                    return "chrome";
                case "WebKit":
                    if (os.name === "iOS") {
                        return "ios_saf";
                    }
                    return "safari";
                case "EdgeHTML":
                    return "edge";
                case "Presto":
                    return "opera";
            }
    }
    return undefined;
}
/**
 * Normalizes the version of the browser such that it plays well with Caniuse
 */
function getCaniuseVersionForUseragentVersion(browser, version, useragentBrowser, useragentOs, useragentEngine) {
    var _a;
    // Ensure that we have a normalized version to work with
    version = normalizeBrowserVersion(browser, version);
    // Always use 'all' with Opera Mini
    if (browser === "op_mini") {
        return "all";
    }
    else if (browser === "safari") {
        // Check if there is a newer version of the browser
        const nextBrowserVersion = getNextVersionOfBrowser(browser, version);
        // If there isn't we're in the Technology Preview
        if (nextBrowserVersion == null) {
            return "TP";
        }
    }
    const coerced = ensureSemver(browser, version);
    // Make sure that we have a proper Semver version to work with
    if (coerced == null)
        throw new TypeError(`Could not detect the version of: '${version}' for browser: ${browser}`);
    // Unpack the semver version
    const { major, minor, patch } = coerced;
    // Generates a Semver version
    const buildSemverVersion = (majorVersion, minorVersion, patchVersion) => `${majorVersion}${minorVersion == null || minorVersion === 0 ? "" : `.${minorVersion}`}${patchVersion == null || patchVersion === 0 ? "" : `.${patchVersion}`}`;
    switch (browser) {
        case "chrome":
            if (useragentEngine.name === "Blink") {
                return buildSemverVersion(ensureSemver(browser, (_a = useragentEngine.version) !== null && _a !== void 0 ? _a : version).major);
            }
            return buildSemverVersion(major);
        case "ie":
        case "ie_mob":
        case "edge":
        case "bb":
        case "and_chr":
        case "and_ff":
            // Always use the major version of these browser
            return buildSemverVersion(major);
        case "opera":
        case "op_mob":
            // Opera may have minor versions before it went to Chromium. After that, always use major versions
            if (major === 10 || major === 11 || major === 12) {
                return buildSemverVersion(major, minor);
            }
            // For anything else, only use the major version
            return buildSemverVersion(major);
        case "ios_saf": {
            // For browsers that report as iOS safari, they may actually be other browsers using Safari's WebView.
            // We want them to report as iOS safari since they will support the same browsers, but we have to apply
            // some tricks in order to get the version number
            // If it is in fact mobile Safari, just use the reported version
            if (useragentBrowser.name === "Safari" || useragentBrowser.name === "Mobile Safari") {
                // iOS may have minor releases, but never patch releases, according to caniuse
                return buildSemverVersion(major, minor);
            }
            // Otherwise, try to get the assumed Safari version from the OS version
            else {
                if (useragentOs.version == null)
                    throw new ReferenceError(`Could not detect OS version of iOS for ${useragentBrowser.name} on iOS`);
                // Decide the Semver version
                const osSemver = ensureSemver(undefined, useragentOs.version);
                // Use only the main version
                return `${osSemver.major}`;
            }
        }
        case "safari":
        case "firefox": {
            // These may have minor releases, but never patch releases, according to caniuse
            return buildSemverVersion(major, minor);
        }
        case "android":
            // Up to version 4.4.4, these could include patch releases. After that, only use major versions
            if (major < 4) {
                return buildSemverVersion(major, minor);
            }
            else if (major === 4) {
                return buildSemverVersion(major, minor, patch);
            }
            else {
                return buildSemverVersion(major);
            }
        case "and_uc":
        case "samsung":
        case "and_qq":
        case "baidu":
            // These may always contain minor versions
            return buildSemverVersion(major, minor);
        default:
            // For anything else, just use the major version
            return buildSemverVersion(major);
    }
}
/**
 * Generates a browserslist from the provided useragent string
 *
 * @param useragent
 * @returns
 */
function generateBrowserslistFromUseragent(useragent) {
    // Check if a user agent has been generated previously for this specific user agent
    const cacheHit = userAgentToBrowserslistCache.get(useragent);
    if (cacheHit != null)
        return cacheHit;
    // Otherwise, generate a new one
    const parser = new UaParserWrapper(useragent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const engine = parser.getEngine();
    const version = browser.version;
    // Prepare a CaniuseBrowser name from the useragent string
    const browserName = getCaniuseBrowserForUseragentBrowser(parser);
    // If the browser name or version couldn't be determined, return false immediately
    if (browserName == null || version == null) {
        console.log(`No caniuse browser and/or version could be determined for:`);
        console.log("os:", parser.getOS());
        console.log("browser:", parser.getBrowser());
        console.log("device:", parser.getDevice());
        console.log("cpu:", parser.getCPU());
        console.log("engine:", parser.getEngine());
        userAgentToBrowserslistCache.set(useragent, []);
        return [];
    }
    // Prepare a version from the useragent that plays well with caniuse
    const browserVersion = getCaniuseVersionForUseragentVersion(browserName, version, browser, os, engine);
    // Prepare a browserslist from the useragent itself
    const normalizedBrowserslist = normalizeBrowserslist([`${browserName} ${browserVersion}`]);
    // Store it in the cache before returning it
    userAgentToBrowserslistCache.set(useragent, normalizedBrowserslist);
    return normalizedBrowserslist;
}
/**
 * Generates a browserslist from the provided useragent string and checks if it matches
 * the given browserslist
 */
function matchBrowserslistOnUserAgent(useragent, browserslist) {
    const useragentBrowserslist = generateBrowserslistFromUseragent(useragent);
    // Pipe the input browserslist through Browserslist to normalize it
    const normalizedInputBrowserslist = normalizeBrowserslist(browserslist);
    // Now, compare the two, and if the normalized input browserslist includes every option from the user agent, it is matched
    return useragentBrowserslist.every(option => normalizedInputBrowserslist.includes(option));
}
/**
 * Returns a key to use for the cache between user agents with feature names and whether or not the user agent supports them
 *
 * @param useragent
 * @param features
 */
function userAgentWithFeaturesCacheKey(useragent, features) {
    return `${useragent}.${features.join(",")}`;
}
/**
 * Returns true if the given user agent supports the given features
 *
 * @param useragent
 * @param features
 * @returns
 */
function userAgentSupportsFeatures(useragent, ...features) {
    // Check if these features has been computed previously for the given user agent
    const cacheKey = userAgentWithFeaturesCacheKey(useragent, features);
    const cacheHit = userAgentWithFeaturesToSupportCache.get(cacheKey);
    // If so, return the cache hit
    if (cacheHit != null)
        return cacheHit;
    // Prepare a browserslist from the useragent itself
    const useragentBrowserslist = generateBrowserslistFromUseragent(useragent);
    // Prepare a browserslist for browsers that support the given features
    const supportedBrowserslist = normalizeBrowserslist(browsersWithSupportForFeatures(...features));
    // Now, compare the two, and if the browserslist with supported browsers includes every option from the user agent, the user agent supports all of the given features
    const support = useragentBrowserslist.every(option => supportedBrowserslist.includes(option));
    // Set it in the cache and return it
    userAgentWithFeaturesToSupportCache.set(cacheKey, support);
    return support;
}

exports.browsersWithSupportForEcmaVersion = browsersWithSupportForEcmaVersion;
exports.browsersWithSupportForFeatures = browsersWithSupportForFeatures;
exports.browsersWithoutSupportForFeatures = browsersWithoutSupportForFeatures;
exports.browserslistSupportsEcmaVersion = browserslistSupportsEcmaVersion;
exports.browserslistSupportsFeatures = browserslistSupportsFeatures;
exports.generateBrowserslistFromUseragent = generateBrowserslistFromUseragent;
exports.getAppropriateEcmaVersionForBrowserslist = getAppropriateEcmaVersionForBrowserslist;
exports.getFirstVersionsWithFullSupport = getFirstVersionsWithFullSupport;
exports.matchBrowserslistOnUserAgent = matchBrowserslistOnUserAgent;
exports.normalizeBrowserslist = normalizeBrowserslist;
exports.userAgentSupportsFeatures = userAgentSupportsFeatures;
//# sourceMappingURL=index.js.map
