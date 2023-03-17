'use es6';

import { isLocal } from './localVersionOverride';
import SprocketMenu from './SprocketMenu';
import PostFilterWidget from './PostFilterWidget';

const isValidSprocketContext = () => {
  const windowLocation = window.location;
  const {
    port,
    hostname,
    pathname
  } = windowLocation;
  const isIframe = windowLocation !== window.parent.location;
  const isTemplatePreview = pathname.includes('_hcms/preview/template');
  const maybeLocalProxy = port !== '' || hostname.includes('hslocal.net') || hostname.includes('localhost');

  if (isIframe || isTemplatePreview || isLocal() || maybeLocalProxy) {
    return false;
  }

  return true;
};

(function () {
  /**
   * documentMode is an IE-only property
   * https://www.w3schools.com/jsref/prop_doc_documentmode.asp
   */
  // holds major version number for IE, or NaN if UA is not IE.
  // Support: IE 9-11 only
  const msie = window.document.documentMode;

  if (msie) {
    return;
  }

  const loadHubspotToolsMenu = () => {
    const menu = new SprocketMenu(window.hsVars);
    menu.showToolsMenuIfAuthor();
    const postFilterWidget = new PostFilterWidget();
    postFilterWidget.setup();
  };

  if (isValidSprocketContext()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function init() {
        loadHubspotToolsMenu();
        document.removeEventListener('DOMContentLoaded', init);
      }, false);
    } else {
      loadHubspotToolsMenu();
    }
  }
})();