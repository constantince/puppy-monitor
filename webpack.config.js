
const Terser =  require('terser-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FileZiperAndUploader = require('file-ziper-and-uploader');

const isPro = process.env.NODE_ENV === 'production';
module.exports = {
    mode: 'none',//todo
    entry: {
        'puppy-monitor': './src/index.ts',
        'puppy-monitor-pay.min': './src/index.ts',
        'puppy-monitor-my.min': './src/index.ts'
    },
    output: {
        filename: '[name].js',
        library: 'puppy-monitor',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    resolve: {
        extensions :['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.(j|t)s$/,
                loader: 'eslint-loader',
                enforce: "pre",
                include: [path.resolve(__dirname, 'src')], // 指定检查的目录
                options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
                    formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
                }
            },
            {
                test: /\.ts$/,
                use: 'awesome-typescript-loader'
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new Terser({
                include: /\.min\.js$/
            })
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        
        new FileZiperAndUploader([
            {
                url: 'http://localhost:8181/upload',
                token: 'auth7yttx8nh0',
                zipName: 'puppy-js.zip',
                target: /\.min\.js$/
            },
            {
                url: 'http://localhost:8181/upload',
                token: 'auth7yttx8nh0',
                zipName: 'puppy-map.zip',
                target: /\.js\.map$/
            },
            {
                url: 'http://localhost:8181/upload',
                token: 'auth7yttx8nh0',
                zipName: 'all1.zip',
                target: 'all'
            },
            {
                url: 'http://localhost:8181/upload',
                token: 'auth7yttx8nh0',
                zipName: 'all2.zip',
                target: 'all'
            }
        ])
    ],
    devtool: isPro ? 'none' : 'source-map',
    watchOptions:{
        poll:1000,//监测修改的时间(ms)
        // aggregeateTimeout:500, //防止重复按键，500毫米内算按键一次
        ignored:/node_modules/,//不监测
    }
}