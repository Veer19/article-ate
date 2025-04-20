const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: {
		index: "./src/index.tsx",
	},
	mode: "development",
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: "ts-loader",
						options: {
							compilerOptions: { noEmit: false },
							transpileOnly: true,
						},
					},
				],
				exclude: /node_modules/,
			},
			{
				exclude: /node_modules/,
				test: /\.css$/,
				use: ["style-loader", "css-loader", "postcss-loader"],
			},
		],
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: "manifest.json", to: "../manifest.json" }],
		}),
		new HTMLPlugin({
			template: "./public/index.html",
			filename: "index.html",
		}),
	],
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
		alias: {
			react: path.resolve("./node_modules/react"),
			"react-dom": path.resolve("./node_modules/react-dom"),
		},
	},
	output: {
		path: path.join(__dirname, "dist/js"),
		filename: "[name].js",
	},
	optimization: {
		minimize: false,
	},
};
