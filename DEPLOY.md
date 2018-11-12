## Deploy steps


### 1. Create a new version (patch, minor, major)
 ```PowerShell
  npm version patch | minor | major
 ```

### 2. Push tag to remote
 ```PowerShell
  git push origin <new tag>
 ```

### 3. That's it ;)
You can follow the build status here -> https://travis-ci.org/configcat/node-sdk
