/* hs-eslint ignored failing-rules */

/* eslint-disable no-use-before-define */
'use es6';

import { browserSupportsCors, getPortalId } from 'adsscriptloaderstatic/utils'; // makes the proper API call to fetch configs/access-control for the script

export function fetchConfig({
  jsonUrl,
  jsonpUrl
}, callback, scriptName) {
  if (!jsonUrl && !jsonpUrl) {
    throw new Error('Missing jsonUrl and jsonpUrl args');
  }

  if (browserSupportsCors()) {
    fetchConfigWithXHR(jsonUrl, callback);
  } else {
    fetchConfigWithScript(jsonpUrl, callback, scriptName);
  }
}

const resolveUrl = function resolveUrl(url) {
  return `https://${url}?portalId=${getPortalId()}`;
};

const fetchConfigWithXHR = function fetchConfigWithXHR(jsonUrl, callback) {
  const request = new XMLHttpRequest();
  request.addEventListener('load', () => {
    const config = JSON.parse(request.responseText);
    callback(config);
  });
  request.open('GET', resolveUrl(jsonUrl));
  request.send();
};

const getJsonpCallbackName = scriptName => {
  return `hubspotJsonpCallbackName${scriptName}`;
};

const getJsonpUrl = function getJsonpUrl(jsonpUrl, jsonpCallbackName) {
  const params = [`portalId=${getPortalId()}`, `callback=${jsonpCallbackName}`].join('&');
  return `https://${jsonpUrl}?${params}`;
};

const fetchConfigWithScript = function fetchConfigWithScript(jsonpUrl, callback, scriptName) {
  const script = document.createElement('script');
  const jsonpCallbackName = getJsonpCallbackName(scriptName);

  window[jsonpCallbackName] = function (config) {
    callback(config);
    document.body.removeChild(script);
    delete window[jsonpCallbackName];
  };

  script.src = getJsonpUrl(jsonpUrl, jsonpCallbackName);
  document.body.appendChild(script);
};