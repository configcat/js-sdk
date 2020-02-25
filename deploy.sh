#Run this script to update configcat-common to the latest and release a new version of configcat-js
set -e #Making sure script stops on error
npm i configcat-common@latest
npm test
git add .
git commit -m "updating configcat-common"
git push origin $(npm version patch)
git push