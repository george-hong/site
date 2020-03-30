const webpackBaseConfig = require('./webpack.base.config');
const WebpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const Uglify = require('uglifyjs-webpack-plugin');

webpackBaseConfig.plugins.push(new Uglify({
    uglifyOptions: {
        mangle: false,
        output: {
            comments: false
        },
    }
}))

module.exports = WebpackMerge(webpackBaseConfig, {
    mode: 'production',
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },{
            test: /\.(scss|sass)$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
        }]
    },
    optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})]
    }
});