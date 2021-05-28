const path = require('path');
const ejs = require('ejs');
const expect = require('chai').expect;
require('./testUtil');

global.appRoot = path.resolve(__dirname + '/../../') + '/';

const obnizJsonValidator = require('./obnizJsonValidator');

process.on('exit', () => {
  console.warn(obnizJsonValidator.checkResults('json', 'obniz.js <=> json '));
  console.warn(obnizJsonValidator.checkResults('wscommand', 'json <=> binary'));
});

describe('all', function () {
  require('mocha-directory')();

  const testUtil = require(global.appRoot + '/test/functiontest/testUtil.js');
  const _ = require('underscore');
  const fs = require('fs');

  const exclude = [
    //  path.resolve(__dirname, './index.js'),
  ];

  const recursiveTestImport = function (root_directory) {
    let file_list = fs.readdirSync(root_directory);

    // build
    _.chain(file_list)
      .filter(function (file) {
        return !file.match(/^\..*/);
      })
      .filter(function (file) {
        return file.match(/.*\.js$/);
      })
      .filter(function (file) {
        return !file.match(/.*_ejs\.html$/);
      })
      .map(function (file) {
        return path.resolve(root_directory, file);
      })
      .filter(function (file) {
        return fs.lstatSync(file).isFile();
      })
      .filter(function (file) {
        return !exclude.includes(file);
      })
      .each(function (file) {
        const src = fs.readFileSync(file, 'utf8');
        const describeIndex = src.search('describe');
        const noTestIndex = src.search('no_html_test_build');
        if (describeIndex < 0) return;
        if (noTestIndex >= 0) return;
        const template = fs.readFileSync(
          global.appRoot + '/test/functiontest/testTemplate.ejs',
          'utf8'
        );
        const param = {
          appRoot: global.appRoot,
          describe: src.substring(describeIndex),
        };

        const html = ejs.render(template, param);

        const newFilename = file.replace('.js', '') + '.html';

        fs.writeFileSync(newFilename, html);
      });

    // refresh
    file_list = fs.readdirSync(root_directory);

    // Run files
    _.chain(file_list)
      .filter(function (file) {
        return !file.match(/^\..*/);
      })
      .filter(function (file) {
        return file.match(/.*\.html$/);
      })
      .filter(function (file) {
        return !file.match(/.*_ejs\.html$/);
      })
      .map(function (file) {
        return path.resolve(root_directory, file);
      })
      .filter(function (file) {
        return fs.lstatSync(file).isFile();
      })
      .filter(function (file) {
        return !exclude.includes(file);
      })
      .each(function (file) {
        const basename = path.basename(file, '.html');
        const relativePath = path.relative(__dirname, file);

        describe(basename, function () {
          this.timeout(60000);
          it('runs ' + relativePath, () => {
            return testUtil.browser(file).then((results) => {
              expect(results.passes).to.be.at.least(1);
              expect(results.failures).to.equal(0);
            });
          });
        });
      });

    // Recurse on directories
    _.chain(file_list)
      .filter(function (file) {
        const file_path = path.resolve(root_directory, file);
        return fs.lstatSync(file_path).isDirectory();
      })
      .each(function (file) {
        const file_path = path.resolve(root_directory, file);
        describe(file, function () {
          recursiveTestImport(file_path);
        });
      });
  };

  if (testUtil.needBrowserTest()) {
    describe('browser', () => {
      recursiveTestImport(__dirname);
    });
  }
});
