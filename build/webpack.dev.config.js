const webpackBaseConfig = require('./webpack.base.config');
const WebpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = WebpackMerge(webpackBaseConfig, {
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                use: 'css-loader',
                fallback: 'style-loader'
            })
        },{
            test: /\.(scss|sass)$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
        }]
    },
});