var https = require('https');
var querystring = require('querystring');

// where batch is in the form
// [
//   {
//     request: {
//       method: 'GET',
//       relative_url: '/me',
//       params: { ... querystring or post params as an associative array }
//     },
//     callback: function(response) { ... }
//   },
//  { ... repeat ... }
// ]
module.exports.batchDispatch = function(batch, access_token, callback) {
  var preppedRequests = prepareRequests(batch);
  var preppedBody = querystring.stringify({
    access_token: access_token,
    batch: JSON.stringify(preppedRequests)
  });
  
  var options = {
    host: 'graph.facebook.com',
    port: 443,
    path: '/',
    method: 'POST'
  };

  var request = https.request(options);
  request.write(preppedBody);

  getCompleteResponseBody(request, function(response) {
    var data = JSON.parse(response);

    // i am counting on the order of the return data to match that sent
    batch.forEach(function(item, index) {
      if (item.callback) { item.callback(data[index]); }
    });

    // execute aggregate callback if it exists
    if (callback) { callback(data); }
  });
};

function prepareRequests(requests) {
  return requests.map(function(request) {
    return formatRequest(request.request);
  });
};

function formatRequest(request) {
  var result = {
    method: request.method,
    relative_url: request.relative_url
  };

  if (request.params) {
    if (request.method == 'GET') {
      result.relative_url += '?' + querystring.stringify(request.params);
    } else if (request.method == 'POST') {
      result.body = querystring.stringify(request.params);
    }
  }

  return result;
};

function getCompleteResponseBody(request, callback) {
  request.end();
  request.on('response', function (response) {
    var text = [];

    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      text.push(chunk);
    });

    response.on('end', function () {
      callback(text.join(''));
    });
  });
};
