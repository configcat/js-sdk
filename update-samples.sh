#Update sample apps to the latest
cd samples/react-sample
npm i configcat-js@latest
cd ../angular-sample
npm i configcat-js@latest
cd ../..
git add .
git commit -m "updating sample apps"
git push