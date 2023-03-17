/* hs-eslint ignored failing-rules */

/* eslint-disable hubspot-dev/no-unsafe-storage */
'use es6';

const LOCAL_STORAGE_KEY = 'HS_SPROCKET_MENU_LOCAL_OVERRIDE';
const LOCAL_SRC = 'https://local.hsappstatic.net/HubspotToolsMenu/static/js/index.js';

const localScriptExists = () => Array.from(document.body.getElementsByTagName('script')).some(scriptEl => scriptEl.src === LOCAL_SRC);

export const isLocal = () => {
  const useLocal = window.localStorage.getItem(LOCAL_STORAGE_KEY) || false;

  if (useLocal) {
    // Assume that this IS the local version if the local script already exists
    return !localScriptExists();
  }

  return false;
};
export const loadLocalVersion = () => {
  const newScript = document.createElement('script');
  newScript.src = LOCAL_SRC;

  newScript.onload = () => {
    // Give the app a bit of time to load
    setTimeout(() => {
      const loadEvent = new Event('DOMContentLoaded');
      document.dispatchEvent(loadEvent);
    }, 100);
  };

  document.body.appendChild(newScript);
};

if (isLocal()) {
  loadLocalVersion();
}