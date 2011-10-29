# batchy

A small Javscript utility to help get started with Facebook's Graph API batched request feature

## What problem is batchy solving?

Too many connections kills performance. Whether you are a giant social gaming app that makes thousands of connections to third party API's a second, or a HTML5 mobile app that is making tens of connections the same rules apply. 

## What is batchy?

batchy attempts to make it easy to reduce the number of connections made to Facebook's Graph API by utilizing its batched request feature. See this page for documentation on the batched request: https://developers.facebook.com/docs/reference/api/batch/

The main pain point with the batched request feature as it stands is that you need to build the batch message to be sent. You need to JSON stringify some parameters, and then querystring stringify others. Sometimes in wild succession. In the end you are left with a stringified soup of mess.

With batchy, you are (mostly) dealing with Javascript objects and not worrying about the stringification. \^_^/

Additionally, batchy allows you to optionally set individual callbacks for each request in the batch. Be sure to read the link to the Facebook documentation on batched requests, because it will also show you how you can set different access tokens for each request in the batch. Which would be super useful if you were queueing up asynchronous POST requests for multiple users.

Facebook's Graph API batched request allows you to mix GET, POST, and DELETE requests which is awesome, and batchy generalizes things even further by providing a nice params field that is the same regardless of GET or POST. In this manner you don't have to worry about constructing querystring params and appending it to the URL, or constructing a form body.

## Usage

```javascript
var access_token = 'super duper secret token!~';

var batch = [
  {
    request: {
      method: 'GET',
      relative_url: 'me/feed',
      params: { limit: 5 }
    },
    callback: function(response) { console.log('haha ' + response.body); }
  },
  {
    request: {
      method: 'POST',
      relative_url: 'me/feed',
      params: { message: 'woot status update!' }
    }
    // no callback needed for this one!
  },
  {
    request: {
      method: 'GET',
      relative_url: 'me/friends'
    },
    callback: function(response) { console.log('123123 ' + response.body); } 
  },
  {
    request: {
      method: 'GET',
      relative_url: 'me/likes',
      params: { limit: 1, access_token: 'a token from a different person' }
    },
    callback: function(response) { console.log('abcabc ' + response.body); } 
  }
];

batchDispatch(batch, access_token, function(response) {
  // aggregate callback that will fire after all the individual callbacks fire
  // the result is the overall batch request's response
});
```

## FAQ

### Q : You said it is a Javascript utliity, but it is actually node.js specific. You lied to me! LIES!

I was lazy. It was fast for me to test in node.js so that's what I built it for. There are only two real node.js specific things:
 * querystring.stringify - just a nice feature
 * https.request - actually more cumbersome to use than a jquery.post or something
