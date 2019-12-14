const Application = require('spectron').Application;
const assert = require('assert');
const path = require('path');

const appPath =
          process.OS === 'Windows' ? 'dist_electron\\Аниме Центр Setup 0.1.0.exe' :
          'dist_electron/mac/Аниме Центр.app/Contents/MacOS/Аниме Центр';

describe('Application launch', function() {
  this.timeout(1000000);

  beforeEach(function() {
    this.app = new Application({
      // Your electron path can be any binary
      // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
      // But for the sake of the example we fetch it from our node_modules.
      path: path.resolve(__dirname, '../../', appPath),

      // Assuming you have the following directory structure

      //  |__ my project
      //     |__ ...
      //     |__ main.js
      //     |__ package.json
      //     |__ index.html
      //     |__ ...
      //     |__ test
      //        |__ spec.js  <- You are here! ~ Well you should be.

      // The following line tells spectron to look and use the main.js file
      // and the package.json located 1 level above.
      args: [path.join(__dirname, '../..')],
    });
    return this.app.start();
  });

  afterEach(function() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('shows an initial window', async function() {
    const count = await this.app.client.getWindowCount();
    return assert.equal(count, 1);
    // Please note that getWindowCount() will return 2 if `dev tools` are opened.
    // assert.equal(count, 2);
  });

  it('shows has right title', async function() {
    const title = await this.app.client.getTitle();
    return assert.equal(title, 'Медиа центр');
  });

  it('does not have the developer tools open', async function() {
    const devToolsAreOpen = await this.app.client.waitUntilWindowLoaded().browserWindow.isDevToolsOpened();
    return assert.equal(devToolsAreOpen, false);
  });

  it('should have one <v-app-bar> when it starts up', async function() {
    await this.app.client.waitUntilWindowLoaded();
    const headers = await this.app.client.$$('header.v-app-bar');
    return assert.equal(headers.length, 1);
  });
});
