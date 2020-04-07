#Update sample apps to the latest
set -e
cd samples/react-sample
npm i configcat-js@latest
cd ../angular-sample
npm i configcat-js@latest
cd ../react-native
npm i configcat-js@latest