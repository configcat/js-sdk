# ConfigCat SDK for JavaScript frontend applications

ConfigCat SDK for JavaScript provides easy integration between ConfigCat service and frontend applications.

ConfigCat is a feature flag, feature toggle and configuration management service. That lets you launch new features and change your software configuration remotely without actually (re)deploying code.
https://configcat.com  

[![Build Status](https://travis-ci.com/configcat/js-sdk.svg?branch=master)](https://travis-ci.com/configcat/js-sdk) [![codecov](https://codecov.io/gh/configcat/js-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/configcat/js-sdk) [![Known Vulnerabilities](https://snyk.io/test/github/configcat/js-sdk/badge.svg?targetFile=package.json)](https://snyk.io/test/github/configcat/js-sdk?targetFile=package.json) ![License](https://img.shields.io/github/license/configcat/js-sdk.svg) [![](https://data.jsdelivr.com/v1/package/npm/configcat-js/badge)](https://www.jsdelivr.com/package/npm/configcat-js) \
[![NPM](https://nodei.co/npm/configcat-js.png)](https://nodei.co/npm/configcat-js/)

## Getting Started

**1. Install and import package:**

*via NPM [package]( https://npmjs.com/package/configcat-js):*
```PowerShell
npm i configcat-js
```
```js
import * as configcat from "configcat-js";
```

*via CDN:*
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/configcat-js@1.1.12/dist/configcat.min.js"></script>
```

**2. <a href="https://configcat.com/Account/Login" target="_blank">Log in to ConfigCat Management Console</a> and go to your *Project* to get your *API Key*:**

![API-KEY](https://raw.githubusercontent.com/ConfigCat/js-sdk/master/media/readme01.png  "API-KEY")

**3. Create a *ConfigCat* client instance:**
```javascript
var client = configcat.createClient("#YOUR-API-KEY#");
```

**4. Get your setting value:**
```javascript
client.getValue("isMyAwesomeFeatureEnabled", false, (value) => {
    if(value) {
        do_the_new_thing();
    } else {
        do_the_old_thing();
    }
});
```

## Getting user specific setting values with Targeting
Using this feature you will be able get different setting values for different users in your application by passing a `User Object` to the `getValue()` function.

Read more about [Targeting here](https://docs.configcat.com/docs/advanced/targeting/).
```js
client.getValue("isMyAwesomeFeatureEnabled", false, (value) => {
    if(value) {
        do_the_new_thing();
    } else {
        do_the_old_thing();
    }},
    { identifier : "#USER-IDENTIFIER#" }
);
```

## Sample/Demo apps
  - [Angular 2+](https://github.com/configcat/js-sdk/tree/master/samples/angular-sample)
  - [React](https://github.com/configcat/js-sdk/tree/master/samples/react-sample)
  - [Pure HTML + JS](https://github.com/configcat/js-sdk/tree/master/samples/html)

## Caching Policies
The ConfigCat SDK supports three different caching policies to acquire the configuration values from ConfigCat. When the client downloads the latest configuration value, puts it into the internal cache and then serves all requests the from cache. With the following caching policies you can customize the caching to suit your needs.

Read more in the [ConfigCat Docs](https://docs.configcat.com/docs/sdk-reference/js/)

---

## License
[MIT](https://raw.githubusercontent.com/ConfigCat/js-sdk/master/LICENSE)
