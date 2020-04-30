const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require("path");
const fs = require('fs'); // to check if the file exists
const HtmlWebpackPlugin = require('html-webpack-plugin');

const prjPath = path.join(__dirname);
const srcPath = path.resolve(__dirname, "src");
const distPath = path.resolve(__dirname, "build");


module.exports = (env) => {
    // Create the fallback path (the production .env)
    const basePath = prjPath + '/.env';

    // We're concatenating the environment name to our filename to specify the correct env file!
    const envPath = basePath + '.' + env.ENVIRONMENT;

    // Check if the file exists, otherwise fall back to the production .env
    const finalPath = fs.existsSync(envPath) ? envPath : basePath;

    // Set the path parameter in the dotenv config
    const fileEnv = dotenv.config({ path: finalPath }).parsed;

    // reduce it to a nice object, the same as before (but with the variables from the file)
    const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
        return prev;
    }, {});

    return {
        devtool: 'source-map',
        entry: [
            srcPath + "/main.js"
        ],
        output: {
            path: distPath,
            publicPath: '/',
            filename: "bundle.js"
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        module: {
            rules: [
                {
                    test: /\.js?$/,
                    exclude: /node_modules/,
                    include: /src/,
                    loader: "babel-loader",
                    query: {
                        presets: ['es2015']
                    }
                }, {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    include: /src/,
                    loader: "babel-loader",
                    query: {
                        presets: ['es2015', 'stage-2', 'react']
                    }
                }, {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    exclude: /node_modules/
                }, {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }, {
                    test: /\.s[ac]ss$/i,
                    use: [
                        // Creates `style` nodes from JS strings
                        'style-loader',
                        // Translates CSS into CommonJS
                        'css-loader',
                        // Compiles Sass to CSS
                        'sass-loader',
                    ],
                }, {
                    test: /\.(gif|png|jpe?g|svg)$/i,
                    use: [
                        'file-loader',
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                bypassOnDebug: true, // webpack@1.x
                                disable: true, // webpack@2.x and newer
                            },
                        },
                    ],
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: srcPath + '/index.html'
            }),
            new webpack.DefinePlugin(envKeys)
        ],
        devServer: {
            hot: true,
            port: 8001,
            historyApiFallback: true,
            open: true
        }
    }
};
