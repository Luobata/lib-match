var path = require('path');
var webpack = require('webpack');
var root = path.resolve(__dirname, './');

module.exports = {
    devtool: 'source-map',

    entry:  __dirname + "/src/index.js",
    output: {
        stats: {
            colors: true
        },
        noInfo: true,
        path: __dirname + "/",
        filename: "bundle.js"
    },

    module: {
        loaders: [
        {
            test: /\.json$/,
            loader: "json"
        },
        {
            test: /\.js$/,
            loader: 'babel',
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
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],

    devServer: {
        contentBase: "./",
        port: 8888,
        colors: true,
        historyApiFallback: true,
        inline: true
    }
}
