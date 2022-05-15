const webpack = require("webpack");

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        serviceWorker: "./src/serviceWorker/serviceWorker.js",
        popup: "./src/popup/popup.js",
        content: "./src/content/content.js"
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
                "babel-loader",
            ],
            enforce: "pre"
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            // "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            },
            "process.env.BUILD_ENV": JSON.stringify(process.env.BUILD_ENV)
        })
    ]
};