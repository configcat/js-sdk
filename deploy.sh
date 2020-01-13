#Run this script to update configcat-common to the latest and release a new version of configcat-js
npm i configcat-common@latest
git add .
git commit -m "updating configcat-common"
git push origin $(npm version patch)
git push