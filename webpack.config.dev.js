const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


const SOURCE_PATH = './dev/';
const PUBLIC_PATH = './public/';
const MEDIA_PATH = './dev/media/';
const PORT = 3000;
module.exports = {
    entry: `${SOURCE_PATH}index.js`,
    output: {
        path: path.resolve(__dirname, PUBLIC_PATH),
        filename: '[name].[contenthash].js',
    },
    resolve: {
        alias: {
            COMPONENTS: path.resolve(__dirname, 'dev/components/'),
            REDUX:path.resolve(__dirname, 'dev/redux/'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [
                    {
                        loader: 'style-loader', // inject CSS to page
                    },{
                        loader: 'css-loader', // translates CSS into CommonJS modules
                    },{
                        loader: 'postcss-loader', // Run post css actions
                        options: {
                            plugins: function () { // post css plugins, can be exported to postcss.config.js
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },{
                        loader: 'sass-loader' // compiles SASS to CSS
                    }
                ]
            },            
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],          
                    } 
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: PUBLIC_PATH,
        port:PORT,
        liveReload: true,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            //$: 'jquery',
            //jQuery: 'jquery',
        }),
        new HtmlWebPackPlugin({
            template: path.join(SOURCE_PATH,'index.html'),
            filename: './index.html',
        }),
        new CopyWebpackPlugin([
            { from: `${MEDIA_PATH}favicon.ico` },
        ])
    ],
};
