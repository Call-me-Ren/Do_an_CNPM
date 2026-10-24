import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="root"></div></body></html>', {
  url: 'https://call-me-ren.github.io/Test_CNPM', // WITHOUT TRAILING SLASH!
  pretendToBeVisual: true
});

for (const prop of Object.getOwnPropertyNames(dom.window)) {
  if (!(prop in global)) {
    try {
      Object.defineProperty(global, prop, {
        value: dom.window[prop],
        writable: true,
        configurable: true
      });
    } catch {}
  }
}

global.window = dom.window;
global.document = dom.window.document;
global.location = dom.window.location;
global.localStorage = dom.window.localStorage;
global.sessionStorage = dom.window.sessionStorage;
global.history = dom.window.history;

// Now load the bundle!
import('../dist/assets/index.js').then(() => {
  console.log('SUCCESSFULLY LOADED BUNDLE (NO TRAILING SLASH)!');
  setTimeout(() => {
    const root = dom.window.document.getElementById('root');
    console.log('Root children count:', root ? root.children.length : 0);
    console.log('Root HTML length:', root ? root.innerHTML.length : 0);
    if (root && root.innerHTML.length > 0) {
      console.log('SUCCESS! First 300 chars:');
      console.log(root.innerHTML.substring(0, 300));
    } else {
      console.log('FAILED: Root is EMPTY when URL has NO trailing slash!');
    }
    process.exit(0);
  }, 500);
}).catch(err => {
  console.error('ERROR EXEC BUNDLE:', err);
  process.exit(1);
});
