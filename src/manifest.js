const fs = require("fs");

const packageJsonText = fs.readFileSync("../package.json");
const packageJson = JSON.parse(packageJsonText);

const localPublicKeyText = fs.readFileSync("../public-key-base64.txt", "utf8");
console.log({localPublicKeyText});
console.log("Build environment:", {BUILD_ENV: process.env.BUILD_ENV, NODE_ENV: process.env.NODE_ENV});

const iconSizes = [16, 32, 48, 64];

const iconDirectory = "icons";
const iconFilenamePrefix = "icon";
const iconFiletypeSuffix = "png";

const iconsObj = Object.fromEntries(
    iconSizes.map(iconSize => (
        [iconSize, `${iconDirectory}/${iconFilenamePrefix}${iconSize}.${iconFiletypeSuffix}`]
    ))
);

const manifest = {

    key: (
        process.env.BUILD_ENV === "local-dev"
            ? localPublicKeyText
            : undefined
    ),

    manifest_version: 3,
    name: packageJson.longName || "package.json is missing a name",
    description: packageJson.description || "package.json is missing a description",
    version: packageJson.version,

    icons: iconsObj,

    action: {
        default_icon: iconsObj,
        default_title: packageJson.longName,
        default_popup: "popup.html"
    },

    background: {
        service_worker: "serviceWorker.js"
    },

    content_scripts: [
        {
            matches: ["<all_urls>"], // TODO: Make this more specific, rather than the template default of matching everything.
            js: ["content.js"],
            // all_frames: true
        }
    ],

    host_permissions: [
    ],

    // web_accessible_resources: {
    //     resources: [/* resources */],
    //     matches: [/* urls */],
    //     extension_ids: [/* keys */]
    // },

    permissions: [
        // "activeTab",
        // "alarms",
        // "background",
        // "bookmarks",
        // "browsingData",
        // "certificateProvider",
        // "clipboardRead",
        // "clipboardWrite",
        // "contentSettings",
        // "contextMenus",
        // "cookies",
        // "debugger",
        // "declarativeContent",
        // "declarativeNetRequest",
        // "declarativeNetRequestFeedback",
        // "declarativeWebRequest",
        // "desktopCapture",
        // "displaySource",
        // "dns",
        // "documentScan",
        // "downloads",
        // "enterprise.deviceAttributes",
        // "enterprise.hardwarePlatform",
        // "enterprise.networkingAttributes",
        // "enterprise.platformKeys",
        // "experimental",
        // "fileBrowserHandler",
        // "fileSystemProvider",
        // "fontSettings",
        // "gcm",
        // "geolocation",
        // "history",
        // "identity",
        // "idle",
        // "idltest",
        // "login",
        // "loginScreenStorage",
        // "loginState",
        // "management",
        // "nativeMessaging",
        // "networking.config",
        // "notifications",
        // "pageCapture",
        // "platformKeys",
        // "power",
        // "printerProvider",
        // "printing",
        // "printingMetrics",
        // "privacy",
        // "processes",
        // "proxy",
        // "sessions",
        // "signedInDevices",
        // "storage",
        // "system.cpu",
        // "system.display",
        // "system.memory",
        // "system.storage",
        // "tabCapture",
        // "tabs",
        // "topSites",
        // "tts",
        // "ttsEngine",
        // "unlimitedStorage",
        // "vpnProvider",
        // "wallpaper",
        // "webNavigation",
        // "webRequest",
        // "webRequestBlocking"
    ]

};

fs.writeFileSync("../dist/manifest.json", JSON.stringify(manifest));