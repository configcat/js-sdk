# ConfigCat SDK for JS

> This project is under development. Not recommended to use in production yet.

[![Build Status](https://travis-ci.com/configcat/js-sdk.svg?branch=master)](https://travis-ci.org/configcat/js-sdk) [![Known Vulnerabilities](https://snyk.io/test/github/configcat/js-sdk/badge.svg?targetFile=package.json)](https://snyk.io/test/github/configcat/js-sdk?targetFile=package.json) ![License](https://img.shields.io/github/license/configcat/js-sdk.svg) \
[![NPM](https://nodei.co/npm/configcat-js.png)](https://nodei.co/npm/configcat-js/)

## Getting Started

 1. Install [NPM](https://docs.npmjs.com/cli/install) package: [configcat-js]( https://npmjs.com/package/configcat-js)
 ```PowerShell
  npm i configcat-js
 ```
 2. Get your Api Key from [configcat.com](https://configcat.com) portal:
![API-KEY](https://raw.githubusercontent.com/ConfigCat/node-sdk/master/media/readme01.png  "API-KEY")

 3. Create a **ConfigCat** client instance:
```javascript
var configcat = require("configcat-js");

var client = configcat.createClient("#YOUR-API-KEY#");
```
 4. Get your config value:
```javascript
client.getValue("isMyAwesomeFeatureEnabled", false, (value) => {
    if(value) {
        //show your awesome feature to the world!
    }
});
```

## Configuration
The ConfigCat SDK supports three different caching policies to acquire the configuration values from ConfigCat. When the client downloads the latest configuration value, puts it into the internal cache and then serves all requests the from cache. With the following caching policies you can customize the caching to suit your needs.

### Auto polling (default)
Client downloads the latest configuration and puts it into a cache repeatedly. Use ```pollingIntervalSeconds``` parameter to manage polling interval.
You can subscribe to the ```configChanged``` event to get notification about configuration changes. 

### Lazy loading
Client downloads the latest configuration only when it is not present or expired in the cache. Use ```cacheTimeToLiveSeconds``` parameter to manage configuration lifetime.

### Manual polling
With this mode you always have to invoke ```.forceRefresh()``` method to download a latest configuration into the cache. When the cache is empty (for example after client initialization) and you try to acquire any value you'll get the default value!

---

https://configcat.com
## License
[MIT](https://raw.githubusercontent.com/ConfigCat/js-sdk/master/LICENSE)
