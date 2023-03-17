'use es6';
/* eslint-disable */

import * as utils from '../utils';

function addFacebookPixelScript(pixels, utk) {
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return;

    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };

    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.agent = 'tmhubspot';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  for (var index = 0; index < pixels.length; index++) {
    if (pixels[index].limitedDataUseEnabled) {
      fbq('dataProcessingOptions', ['LDU'], 0, 0);
    }

    fbq('init', pixels[index].pixelId, {
      external_id: utk
    });
  }

  fbq('track', 'PageView');
}

function appendAdWordsTagManagerScript(pixelId) {
  const wrapper = document.createElement('script');
  wrapper.async = true;
  wrapper.src = `https://www.googletagmanager.com/gtag/js?id=AW-${pixelId}`;
  document.head.appendChild(wrapper);
}

function addAdWordsPixelScript(conversionIds) {
  window.dataLayer = window.dataLayer || [];
  var developerId = utils.getEnv() === 'qa' ? 'dZWU5Zm' : 'dZTQ1Zm';

  function gtag() {
    dataLayer.push(arguments);
  }

  gtag('js', new Date());
  gtag('set', 'developer_id.' + developerId, true);

  for (var index = 0; index < conversionIds.length; index++) {
    gtag('config', `AW-${conversionIds[index].pixelId}`);
  }
}

function addLinkedInPixelScript(pixels) {
  for (var index = 0; index < pixels.length; index++) {
    const _linkedin_partner_id = pixels[index].pixelId;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];

    window._linkedin_data_partner_ids.push(_linkedin_partner_id);
  }

  (function () {
    var s = document.getElementsByTagName('script')[0];
    var b = document.createElement('script');
    b.type = 'text/javascript';
    b.async = true;
    b.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
    s.parentNode.insertBefore(b, s);
  })();
}

export function addPixels(config, utk) {
  for (var adNetwork in config) {
    if (config.hasOwnProperty(adNetwork) && config[adNetwork].length > 0) {
      var pixels = config[adNetwork];

      switch (adNetwork) {
        case 'FACEBOOK':
          {
            if (utk && !config.loadedFbPixel) {
              addFacebookPixelScript(pixels, utk);
              config.loadedFbPixel = true;
            }

            break;
          }

        case 'ADWORDS':
          {
            appendAdWordsTagManagerScript(pixels[0].pixelId);
            addAdWordsPixelScript(pixels);
            break;
          }

        case 'LINKEDIN':
          {
            addLinkedInPixelScript(pixels);
            break;
          }
      }
    }
  }
}
export function onUtkReady(config, utk) {
  for (var adNetwork in config) {
    if (config.hasOwnProperty(adNetwork) && config[adNetwork].length > 0) {
      switch (adNetwork) {
        case 'FACEBOOK':
          {
            if (!config.loadedFbPixel) {
              addFacebookPixelScript(config[adNetwork], utk);
              config.loadedFbPixel = true;
            }

            break;
          }
      }
    }
  }
}
export function reinstallPixels(config, utk) {
  for (var adNetwork in config) {
    if (config.hasOwnProperty(adNetwork) && config[adNetwork].length > 0) {
      switch (adNetwork) {
        case 'FACEBOOK':
          {
            fbq('consent', 'grant');
            break;
          }

        case 'ADWORDS':
          {
            dataLayer.push('consent', 'update', {
              ad_storage: 'granted',
              analytics_storage: 'granted'
            });
            break;
          }
      }
    }
  }
}
export function disablePixels(config) {
  if (config.hasOwnProperty('LINKEDIN')) {
    // LinkedIn does not support disabling their pixel.
    window.location.reload();
    return;
  }

  for (var adNetwork in config) {
    if (config.hasOwnProperty(adNetwork) && config[adNetwork].length > 0) {
      switch (adNetwork) {
        case 'FACEBOOK':
          {
            fbq('consent', 'revoke');
            break;
          }

        case 'ADWORDS':
          {
            dataLayer.push('consent', 'update', {
              ad_storage: 'denied',
              analytics_storage: 'denied'
            });
            break;
          }
      }
    }
  }
}