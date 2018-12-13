const webpack = require('webpack');
const path = require('path');

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

/*
 * We've enabled ExtractTextPlugin for you. This allows your app to
 * use css modules that will be moved into a separate CSS file instead of inside
 * one of your module entries!
 *
 * https://github.com/webpack-contrib/extract-text-webpack-plugin
 *
 */

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const HtmlWebpackPlugin = require("html-webpack-plugin");//根据模板html生成引入js后的html

const CleanWebpackPlugin = require('clean-webpack-plugin')

const CopyWebpackPlugin = require('copy-webpack-plugin')

const src = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')

const isDev = () => {
    return process.env.NODE_ENV === 'development'
}

module.exports = {
    // mode: 'development',
    entry: src + '/index',
    output: {
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[name].js',
        publicPath: '/',
        path: dist
    },
    resolve: {
        extensions: [".js", ".css", ".scss"],
        alias: {
            '@': src,
            'jquery': path.resolve(src, 'js/jQuery'),
        }
    },
    devServer: {
        contentBase: dist,
        hot: true,
        progress:true,
        port: 9080,
    },
    optimization: {
        // 公共js分割
        splitChunks: {
            chunks: 'initial', // 只对入口文件处理
            cacheGroups: {
                vendor: { // split `node_modules`目录下被打包的代码到 `page/vendor.js && .css` 没找到可打包文件的话，则没有。css需要依赖 `ExtractTextPlugin`
                    test: /node_modules\//,
                    name: 'vendor',
                    priority: 10,
                    enforce: true
                },
                commons: { // split `common`和`components`目录下被打包的代码到`page/commons.js && .css`
                    test: /common\/|components\//,
                    name: 'commons',
                    priority: 10,
                    enforce: true
                }
            }
        },
        runtimeChunk: {
            name: 'manifest'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
                loader: 'babel-loader',

                options: {
                    presets: ['env']
                }
            },
            {
                test: /\.(scss|css)$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.html$/,
                use: [ {
                    loader: 'html-loader',
                    options: {
                        minimize: false
                    }
                }],
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'imgs/[name].[ext]',
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 90
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                        },
                    },
                ]
            },
            /*{
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'imgs/[name].[ext]',
                        }
                    }
                ]
            }*/
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(['dist']),
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({"process.env.NODE_ENV": JSON.stringify("development")}),
         new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: src + "/index-temp.html",
            /*minify: {
                collapseWhitespace: false,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            }*/
        }),
        new UglifyJSPlugin(),
        new ExtractTextPlugin('css/style.css'),
        /* new CopyWebpackPlugin([{
            from: src + '/locales',
            to: dist + '/locales'
        }]) */
    ]
}

