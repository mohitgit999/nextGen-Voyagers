'use strict';

/* API base URL is empty locally so Vite can proxy /api to the backend. */
var configuredApiBase = window.__API_BASE_URL__ || '';
var API_BASE_URL = configuredApiBase.indexOf('%VITE_API_URL%') === 0
  ? ''
  : configuredApiBase.replace(/\/+$/, '');

function apiUrl(path) {
  return API_BASE_URL + path;
}