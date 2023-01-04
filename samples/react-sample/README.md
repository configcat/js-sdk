# ConfigCat React Sample App

### Start sample:
1. Install dependencies
```
npm install
```
2. Run sample app
```
npm start
```
3. Open browser at `http://localhost:3000/`

## Troubleshooting

* If you have trouble running the `npm start`:

  Sample app dependencies conflict sometimes with the SDK root dependencies.
  Make sure the `/js-sdk/node_modules` is deleted before running `npm start` on `/js-sdk/samples/react-sample`.

* If `npm start` fails with "error:0308010C:digital envelope routines::unsupported":
  
  Modify the `start` script in `package.json` to use `react-scripts --openssl-legacy-provider start`.
  (For more details, see this [answer](https://stackoverflow.com/a/73145035/8656352).)