var path = require('path');//built into node
var webpack  = require('webpack');
var extractPlugin = require('mini-css-extract-plugin');//generate a separate css bundle

module.exports = {
	//entry: ['./angularApp'],
	entry: {
	 	main: './app.js'
	 	//router: './router.js'
	},
	output: {
		path: path.resolve('dist/'),//where webpack builds the bundled files to (bundled files typically not checked into source control, so want to serve it from a place not checked in)
		publicPath: '/app/',//alias for where to serve the bundles from
		filename: "[name].js"//dynamic name of of bundled file based on the page that is requested ([name] will be from the entry object)
	},

	//plugins work on entire bundles (they're like grunt tasks) while loaders work on files  
	plugins: [
		new extractPlugin({
			filename: 'styles.css'//what to call the separate css bundle that is generated
		}),
		//make these available to whole app as these aliases without requiring it in each module that needs it
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',

			firebase: 'firebase'
		})
	],

	//create multiple bundles so different html files can reference their own instead of one big bundle
	optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'shared',
                    chunks: 'initial',
                    minChunks: 2
                }
            }
        }
    },

	//tell webserver to look in public for the index.html
	devServer: {
		contentBase: 'public'
	},

	module: {
		//process files and, if necessary, transform them into something else
		rules: [
			{
				test: /\.(es6|js)$/,//what kind of files to run through this loader
				exclude: /node_modules/,
				loader: 'babel-loader'//convert files from es6 to es5		
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					{
						loader: extractPlugin.loader
					},		
					{
						loader: 'css-loader'
					}/*,
					{
						loader: 'autoprefixer-loader'//NOT WORKING adds browser-specific prefixes (ie -webkit)
					},*/
				]
			},
			{
				test: /\.less$/,
				exclude: /node_modules/,
				use: [
					{
						loader: extractPlugin.loader
					},
					{
						loader: 'css-loader'
					},
					/*{
						loader: 'autoprefixer-loader'
					},*/
					{
						loader: 'less-loader'
					}
				]
			},
            //image/font loader
            {
				test: /\.(png|jpg|ttf|otf)(\?v=\d+\.\d+\.\d+)?$/,
				exclude: /node_modules/,
				loader: 'url-loader?limit=10000'//? is for adding params; here we limit any image over this size to be separate from bundle
			},
			{
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'html-loader'
            },
            {
                test: /\.(woff(2)?|eot|svg|gif)(\?v=\d+\.\d+\.\d+)?$/,
                exclude: /node_modules/,
                loader: 'file-loader'
            }
		]
	},

	resolve: {
		//by default webpack process all .js, but we override what it looks for with 
		//'extensions' so have to include .js back in here, and add .es6
		extensions: ['.js', '.es6']
	}
}