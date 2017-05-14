var path = require('path');

module.exports = {
    entry: './script/app.js',
    output: {
        path: path.join(__dirname, './'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.json',]
    }
};
module: {
    loaders: [
        {
            test: /\.js$/,
            loader: "babel-loader"
        }
    ]
};