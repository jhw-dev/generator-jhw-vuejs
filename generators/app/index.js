'use strict'
var yeoman = require('yeoman-generator')
var chalk = require('chalk')
var yosay = require('yosay')
var mkdirp = require('mkdirp')

module.exports = yeoman.Base.extend({
  constructor: function() {
    yeoman.Base.apply(this, arguments);
  },
  initializing: function() {
    this.pkg = require('../../package.json');
  },

  prompting: function() {
    var done=this.async();
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the jhw\'s ' + chalk.red('Vue.js') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'project',
      message: 'What is the project\'s name?',
      default: this.appname
    }, {
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'vue-router',
        value: 'includeRouter',
        checked: true
      }, {
        name: 'vue-resource',
        value: 'includeResource',
        checked: true
      }]
    }];

    this.prompt(prompts).then(function(answers) {
      console.dir(answers);
      var features = answers.features
      this.projectName = answers.project

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1
      }

      this.includeRouter = hasFeature('includeRouter')
      this.includeResource = hasFeature('includeResource')
        // this.config.set('includeRouter', this.includeRouter)
        // this.config.set('includeResource', this.includeResource)
      done();
    }.bind(this));
  },
  writing: {
    gulpfile: function() {
      this._copy('_gulpfile.js', 'gulpfile.js')
    },
    packageJson: function() {
      this._copyTpl('_package.json', 'package.json', {
        includeRouter: this.includeRouter,
        includeResource: this.includeResource,
        projectName:this.projectName
      });
    },
    git: function() {
      this._copy('_gitignore', '.gitignore');
    },
    eslint: function() {
      this._copy('_eslintrc', '.eslintrc');
    },
    webpack: function() {
      this._copy('_webpack.config.js', 'webpack.config.js');
    },
    vuefile: function() {
      this._copyTpl('_app.vue', './src/app.vue', {
        includeRouter: this.includeRouter
      });

      this._copyTpl('_main.js', './src/main.js', {
        includeRouter: this.includeRouter,
        includeResource: this.includeResource
      });
    },
    sass: function() {
      this._copy('_main.scss', './src/main.scss');
    },
    html: function() {
      this._copy('_index.html', './src/index.html');
    },
    misc: function() {
      mkdirp(this.destinationPath('./src/components'));
      mkdirp(this.destinationPath('./src/images'));
      mkdirp(this.destinationPath('./src/static'));
    }
  },
  _copy: function(from, to) {
    this.fs.copy(this.templatePath(from), this.destinationPath(to))
  },

  _copyTpl: function(from, to, params) {
    this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), params)
  },

  install: function() {
    this.installDependencies({
      bower: false
    })
  }
})
