const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    mode: "production",
    entry: {
        background: path.resolve(__dirname, "..", "src", "background", "background.ts"),
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "[name].js",
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
            {
                exclude: /public/,
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            }
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{from: ".", to: ".", context: "public"}]
        }),
    ],
};
