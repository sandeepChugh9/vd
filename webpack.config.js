var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: './app.js',

    output: {
        filename: 'bundle.js'
    },

    resolve: {
        root: [path.join(__dirname, "bower_components")]
    },
    
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
    ]
};