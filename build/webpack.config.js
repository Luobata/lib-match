var path = require('path');
var webpack = require('webpack');
var root = path.resolve(__dirname, '../');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'source-map',

    entry:  [
        'webpack-hot-middleware/client?quiet=true',
        root + "/src/test.js",
    ],
    output: {
        path: root + "/",
        filename: "match.js"
    },
    resolve: {
        alias: {
           MATCH: path.resolve(__dirname, '../src/match'),
           LIB: path.resolve(__dirname, '../src/lib'),
           TEST: path.resolve(__dirname, '../src/test')
        }
    },
    module: {
        loaders: [
        {
            test: /\.json$/,
            loader: "json-loader"
        },
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            include: root
        },
        {
            test: /\.css$/,
            loader: 'style!css'//添加对样式表的处理
        }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new htmlWebpackPlugin({
            filename: 'test.html',
            // template: 'test.html',
            inject: true,
        }),
    ],

    // devServer: {
    //     contentBase: "./src/",
    //     port: 9999,
    //     historyApiFallback: true,
    //     inline: true
    // }
}
