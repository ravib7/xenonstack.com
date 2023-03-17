'use es6';

import { getPortalId } from 'adsscriptloaderstatic/utils';
import * as utils from '../utils';
import { addPixels, disablePixels, reinstallPixels, onUtkReady } from './pixels';
import { fetchConfig } from '../configFetcher';

const start = function start() {
  const envString = utils.getEnv() === 'qa' ? 'qa' : '';
  const hublet = utils.getHublet();
  const hubletString = hublet === 'na1' || !hublet ? '' : `-${hublet}`;
  const configDomain = `api${hubletString}.hubapi${envString}.com`;
  let config = null;
  let utk = null;
  window.enabledEventSettings = {};

  if (window.disabledHsPopups && window.disabledHsPopups.indexOf('ADS') > -1) {
    return;
  } // For GDPR purposes, users must consent to privacy policy before pixel is added


  window._hsp = window._hsp || [];

  window._hsp.push(['addPrivacyConsentListener', function (consent) {
    if (consent.categories.advertisement) {
      if (!config) {
        fetchConfig({
          jsonUrl: `${configDomain}/hs-script-loader-public/v1/config/pixels-and-events/json`,
          jsonpUrl: `${configDomain}/hs-script-loader-public/v1/config/pixels-and-events/jsonp`
        }, response => {
          config = response.pixels;
          addPixels(response.pixels, utk);
          window.enabledEventSettings = {
            data: response.enhancedConversionEventSettings,
            portalId: getPortalId()
          };
        }, 'addPixels');
      } else {
        reinstallPixels(config, utk);
      }
    } else if (config) {
      disablePixels(config);
    }
  }]);

  window._hsq = window._hsq || [];

  window._hsq.push(['addUserTokenListener', function (newUtk) {
    utk = newUtk;

    if (config) {
      onUtkReady(config, utk);
    }
  }]); // form submission event listener


  window.addEventListener('message', event => {
    let gtag;

    if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmitted') {
      gtag = function () {
        window.dataLayer = window.dataLayer || []; //eslint-disable-next-line prefer-rest-params

        window.dataLayer.push(arguments);
      };

      const {
        data: {
          data: {
            conversionId: transaction_id,
            formGuid
          }
        }
      } = event;
      const {
        enabledEventSettings: {
          data: eventSettingsData,
          portalId
        }
      } = window;
      eventSettingsData.forEach(({
        hubSpotFormId,
        pixelId,
        conversionLabel
      }) => {
        if (formGuid === hubSpotFormId && conversionLabel !== null) {
          gtag('event', 'conversion', {
            send_to: `AW-${pixelId}/${conversionLabel}`,
            transaction_id
          });
          fetch(`https://${configDomain}/hs-script-loader-public/v1/config/gtag-conversion-monitor`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              portalId,
              hubSpotFormId,
              formSubmissionId: transaction_id,
              pixelId,
              conversionLabel,
              webpageUrl: window.location.href
            })
          });
        }
      });
    }
  }, false);
};

window.PIXELS_RAN = window.PIXELS_RAN || false;

if (!window.PIXELS_RAN) {
  window.PIXELS_RAN = true; // Code entry point

  start();
}