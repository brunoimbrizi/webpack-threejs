const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const __root = path.resolve(__dirname, '../');

module.exports = {
	entry: {
		index: ['@babel/polyfill', './src/scripts/index.js', './src/styles/main.scss'],
	},
	output: {
		path: path.resolve(__root, 'dist'),
		filename: 'scripts/[name].[chunkhash].js',
		chunkFilename: 'scripts/[name].[chunkhash].js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: ['@babel/plugin-syntax-dynamic-import']
					}
				},
				exclude: /node_modules\/(?!(postprocessing)\/).*/,
			},
			{
				test: /\.(glsl|frag|vert)$/,
				use: [
					{ loader: 'glslify-import-loader' },
					{ loader: 'raw-loader', options: { esModule: false } },
					{ loader: 'glslify-loader' }
				]
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							path: path.resolve(__root, 'dist'),
							name: 'styles/[name].css',
						}
					},
					{ loader: 'extract-loader' },
					{ loader: 'css-loader' },
					{
						loader: 'postcss-loader',
						options: {
					 		postcssOptions: {
					 			plugins: [ ['postcss-preset-env'] ]
					 		}
						}
					},
					{
						loader: 'sass-loader',
						options: {
							implementation: require('sass'),
							webpackImporter: false,
							sassOptions: {
								includePaths: ['./node_modules']
							},
						},
					},
				]
			}
		]
	},
	resolve: {
		extensions: ['.js', '.scss']
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{ from: path.resolve(__root, 'static'), }
			]
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
	]
};
