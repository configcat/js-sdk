npm i configcat-common@latest
git add .
git commit -m "updating configcat-common"
git push origin $(npm version patch)
git push