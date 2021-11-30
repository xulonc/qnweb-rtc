const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            title: '七牛RTC',
            header: '七牛RTC',
            template: "./src/index.html",
            filename: 'index.html',
            inject: "body"
        })
    ],
    output: {
        clean: true
    }
}