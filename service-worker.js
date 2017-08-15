/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/blog/2015/11/11/Would-you-tell-me-please-which-way-I-ought-to-go-from-here/index.html","dec50da4f27d99191fd49d263237d857"],["/blog/2015/11/14/Why-I-am-an-atheist/index.html","7194da53fe21164fbb044acee692a736"],["/blog/2015/11/17/Writing-readable-code/index.html","e00887331a6bf878c4dc6cfb73bf3077"],["/blog/2015/12/03/Netflix-to-save-the-world/index.html","47cfb670e57f209156cb75a4413e28df"],["/blog/2016/04/08/Review-your-code/code-review.gif","46b14533f1304e9dd154a505b958aa17"],["/blog/2016/04/08/Review-your-code/index.html","ba4691e28b266c049e790f27c9fa594c"],["/blog/2017/08/06/Understanding-objects-in-javascript/index.html","6bf0d6b5552dc64a1cd0b220bab66d5b"],["/blog/2017/08/06/Understanding-objects-in-javascript/main.png","682a05c836511bb24c6b2e4b9cafe7b4"],["/blog/2017/08/11/How-orthogonality-can-make-you-a-better-developer/better-dev.gif","ef15a5d524878dd1af4862452e1140f3"],["/blog/2017/08/11/How-orthogonality-can-make-you-a-better-developer/css.gif","7529d793e0955fdd881ea976093d5847"],["/blog/archives/2015/11/index.html","1273cff4ec848e0184fcbd979de3d47e"],["/blog/archives/2015/12/index.html","2ad7c94bb9dbe672e15e554e04c3bec7"],["/blog/archives/2015/index.html","6bd6fe18d04638378d7e9bdec81f871f"],["/blog/archives/2016/04/index.html","60eb776ff84afbe2d25485c959a06f7e"],["/blog/archives/2016/index.html","60eb776ff84afbe2d25485c959a06f7e"],["/blog/archives/2017/08/index.html","4dd20d5f67cadb6a1b25d04b881a57bb"],["/blog/archives/2017/index.html","4dd20d5f67cadb6a1b25d04b881a57bb"],["/blog/archives/index.html","bf4c7e9f08f624ce76de7a33041e843b"],["/blog/archives/page/2/index.html","8a9f0d1373a563cda02321da5635cad2"],["/blog/css/apollo.css","d42d751d63247917797daef0183c1b71"],["/blog/favicon.png","c65b459ddc2d82738b8ef02a423a98c9"],["/blog/font/sourcesanspro.woff","5097f81039d71344019a2ffbf6160f6c"],["/blog/font/sourcesanspro.woff2","2e1e934a85462e0e8b754a6317ccaa6f"],["/blog/index.html","1fb1ee4a7caf9e8c8aa0bf269a5d650b"],["/blog/logo.png","cf58d0577d877214a21f729d8f2eef55"],["/blog/page/2/index.html","44b12883e6788a85a4a740f04a0a1939"],["/blog/tags/ES6/index.html","4dd20d5f67cadb6a1b25d04b881a57bb"],["/blog/tags/atheism/index.html","ee18c19ae622361e3b914adeaac12632"],["/blog/tags/bugs/index.html","29c20c53b21162bd52e64f1c504f5324"],["/blog/tags/career-advice/index.html","ebf36884ff2788b056814cc43f9c3a2f"],["/blog/tags/disruptiveness/index.html","2ad7c94bb9dbe672e15e554e04c3bec7"],["/blog/tags/good-practices/index.html","c4fd5adf9aa432574cba42e3d0ce6047"],["/blog/tags/humanism/index.html","ee18c19ae622361e3b914adeaac12632"],["/blog/tags/information/index.html","2ad7c94bb9dbe672e15e554e04c3bec7"],["/blog/tags/javascript/index.html","b0eb7bebb58e7ff56a629c72b03b6f1c"],["/blog/tags/learning/index.html","ebf36884ff2788b056814cc43f9c3a2f"],["/blog/tags/object-oriented/index.html","4dd20d5f67cadb6a1b25d04b881a57bb"],["/blog/tags/programming/index.html","29c20c53b21162bd52e64f1c504f5324"],["/blog/tags/prototype/index.html","4dd20d5f67cadb6a1b25d04b881a57bb"],["/blog/tags/religion/index.html","ee18c19ae622361e3b914adeaac12632"],["/blog/tags/software-development/index.html","ebf36884ff2788b056814cc43f9c3a2f"],["/blog/tags/streaming/index.html","2ad7c94bb9dbe672e15e554e04c3bec7"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







