
const Terser =  require('terser-webpack-plugin');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FileZiperAndUploader = require('file-ziper-and-uploader');



const isPro = process.env.NODE_ENV === 'production';
console.log(isPro);
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
        new CleanWebpackPlugin()
        // new FileZiperAndUploader([
        //     {
        //         url: 'http://localhost:8181/upload',
        //         token: 'auth7yttx8nh0',
        //         zipName: 'puppy.zip',
        //         target: 'all',
        //         folderName: 'puppy'
        //     }
            
        // ])
    ],
    devtool: isPro ? 'none' : 'source-map'
}