# demo

## use
1. npm install
2. npm run dev / build

## 构建问题
1. 无法找到python2 管理员运行powershell npm install --global --production windows-build-tools
2. 安装node-sass
> npm install -g cnpm --registry=https://registry.npm.taobao.org 
> cnpm install --save-dev node-sass
3. 在项目内根据打包环境使用不同的配置
> 需要使用到webpack.DefinePlugin插件
> 1. 在webpack的plugins配置项中添加配置
```javascript
new webpack.DefinePlugin({
    'process.env': process.env, // 定义变量
    'process.env.NODE_ENV': JSON.stringify('development'), // 定义字符串
})
```
> 2.使用定义好的值 直接在项目中使用定义的key值即可
> 3.[参考地址](https://www.webpackjs.com/plugins/define-plugin/)