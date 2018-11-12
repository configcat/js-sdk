### 1. Create a new version (patch, minor, major)
Increase version number by using `npm version patch | minor | major`

 *Example: increasing patch version* 
```PowerShell
npm version patch
```

### 2. Push tag to remote
 ```PowerShell
  git push origin <new tag>
 ```

### 3. That's it ;)
You can follow the build status here -> https://travis-ci.com/configcat/js-sdk