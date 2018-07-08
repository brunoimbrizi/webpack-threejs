const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		app: './src/scripts/index.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'scripts/[name].[chunkhash].js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(glsl|frag|vert)$/,
				use: ['raw-loader', 'glslify-loader']
			},
		]
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			title: 'Production'
		}),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, 'static'),
			}
		])
	]
};
