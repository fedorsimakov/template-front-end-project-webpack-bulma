const path = require('path');
const fs = require('fs');
const webpack = require('webpack'); // to access built-in plugins

const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // installed via npm
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // installed via npm
const HtmlWebpackPlugin = require('html-webpack-plugin'); // installed via npm
const CopyWebpackPlugin = require('copy-webpack-plugin'); // installed via npm

const generateHtmlPlugins = (templateDir) => {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  const templateFilesFiltered = templateFiles.filter((item) => {
    const extension = item.slice(item.lastIndexOf('.') + 1);
    if (extension === 'html') {
      return true;
    }
    return false;
  });
  return templateFilesFiltered.map((item) => {
    const indexOfSeparator = item.lastIndexOf('.');
    const name = item.slice(0, indexOfSeparator);
    const extension = item.slice(indexOfSeparator + 1);
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false,
    });
  });
};

const htmlPlugins = generateHtmlPlugins('./src/html/views');

module.exports = {
  entry: {
    main: './src/js/index.js',
    style: './src/scss/style.scss',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './js/[name].js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        include: path.resolve(__dirname, 'src/js'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|otf|woff|woff2)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        include: path.resolve(__dirname, 'src/scss'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {},
          },
          {
            loader: 'resolve-url-loader',
            options: {},
          },
          {
            loader: 'sass-loader',
            options: {
              // Prefer `dart-sass`
              implementation: require('node-sass'),
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src/html/includes'),
        use: [
          {
            loader: 'raw-loader',
            options: {},
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.ProvidePlugin({
      // $: 'jquery',
      // jQuery: 'jquery',
    }),
    new MiniCssExtractPlugin({
      // filename: './css/[name].css',
      moduleFilename: ({ name }) => `./css/${name}.css`,
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{
      from: './src/fonts',
      to: './fonts',
    },
    {
      from: './src/favicons',
      to: './favicons',
    },
    {
      from: './src/images',
      to: './images',
    },
    {
      from: './src/uploads',
      to: './uploads',
    },
    ]),
  ].concat(htmlPlugins),
};
