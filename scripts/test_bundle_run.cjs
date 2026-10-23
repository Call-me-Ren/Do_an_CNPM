const fs = require('fs');
const path = require('path');
const http = require('http');
const { JSDOM, VirtualConsole } = require('jsdom');

// Start a tiny local server to serve dist/
const distDir = path.join(__dirname, '..', 'dist');
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath.startsWith('/Test_CNPM/')) {
    reqPath = reqPath.slice('/Test_CNPM/'.length);
  }
  if (!reqPath || reqPath === '/') reqPath = 'index.html';
  const filePath = path.join(distDir, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
    if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
    if (filePath.endsWith('.html')) res.setHeader('Content-Type', 'text/html');
    res.end(fs.readFileSync(filePath));
  } else {
    res.statusCode = 404;
    res.end('Not found: ' + reqPath);
  }
});

server.listen(4567, () => {
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('error', (err) => console.error('CONSOLE ERROR:', err));
  virtualConsole.on('warn', (warn) => console.warn('CONSOLE WARN:', warn));
  virtualConsole.on('log', (log) => console.log('CONSOLE LOG:', log));

  JSDOM.fromURL('http://localhost:4567/Test_CNPM/', {
    runScripts: 'dangerously',
    resources: 'usable',
    virtualConsole
  }).then(dom => {
    dom.window.addEventListener('error', (e) => {
      console.error('WINDOW ERROR:', e.error || e.message);
    });

    setTimeout(() => {
      const rootHtml = dom.window.document.getElementById('root')?.innerHTML;
      console.log('ROOT HTML LENGTH:', rootHtml ? rootHtml.length : 0);
      if (rootHtml) {
        console.log('ROOT PREVIEW:', rootHtml.substring(0, 200));
      } else {
        console.log('(ROOT IS EMPTY!)');
      }
      server.close();
      process.exit(0);
    }, 2500);
  }).catch(err => {
    console.error('FAIL TO LOAD FROM URL:', err);
    server.close();
  });
});
