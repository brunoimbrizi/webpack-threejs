const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const __root = path.resolve(__dirname, '../');

module.exports = {
	entry: {
		index: ['@babel/polyfill', './src/scripts/index.js'],
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
				use: ['glslify-import-loader', 'raw-loader', 'glslify-loader']
			},
			/*
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: 'file-loader'
			},
			{
				test: /\.(jpe?g|png|gif)$/i,
				use: 'file-loader'
			}
			*/
		]
	},
	plugins: [
		new CleanWebpackPlugin(
			['dist'],
			{ root: __root },
		),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__root, 'static'),
			}
		]),
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
	]
};
