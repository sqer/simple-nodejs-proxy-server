var http = require('http');
var httpProxy = require('http-proxy');
var modifyResponse = require('http-proxy-response-rewrite');

// Create a proxy server
var proxy = httpProxy.createProxyServer({
  secure: false,
  target: 'https://target-server.com/v1',
  changeOrigin: true,
  headers: {
    'Authorization': 'ZudqcZTuXzXgR4WgsUlwoBZZ0Ue987tx'
  },
  ws: true,
  port: 443
});

// Create your server and then proxies the request
http.createServer(function(req, res) {
  proxy.web(req, res);
}).listen(3000);

// Listen for the `proxyRes` event on `proxy`.
proxy.on('proxyRes', function(proxyRes, req, res) {
  modifyResponse(res, proxyRes.headers['content-encoding'], function(body) {
    if (!body) {
      return undefined;
    } else if (req.url.includes('/search/')) {
      var modifiedBody = JSON.parse(body);
      // Modify body
      modifiedBody.someProperty = 'test';
      return JSON.stringify(modifiedBody);
    }

    // return as is
    return body;
  });

});

proxy.on('error', function(err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something went wrong. And we are reporting a custom error message.');
});

// Listen to the `upgrade` event and proxy the
// WebSocket requests as well.
proxy.on('upgrade', function(req, socket, head) {
  proxy.ws(req, socket, head);
}); 

 
 
