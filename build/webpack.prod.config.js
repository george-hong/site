const webpackBaseConfig = require('./webpack.base.config');
const WebpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack');
const Uglify = require('uglifyjs-webpack-plugin');

module.exports = WebpackMerge(webpackBaseConfig, {
    mode: 'production',
    module: {
        rules: [{
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader']
        },{
            test: /\.(scss|sass)$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'sass-loader',
                {
                    loader: 'sass-resources-loader',      // 此插件为scss提供全局配置
                    options: {
                        resources: ['src/common/scss/globalVariable.scss']
                    },
                }
            ]
        }]
    },
    plugins: [
        new Uglify({
            uglifyOptions: {
                compress: false,
                mangle: false,
                output: {
                    ast: true,
                }
            }
        }),
        new MiniCssExtractPlugin({
          filename: 'main-[hash].css'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
    ]
});