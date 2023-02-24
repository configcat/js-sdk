declare var require: any;

const testsContext = require.context(".", true, /\.ts$/);

for (const key of testsContext.keys()) {
  testsContext(key);
}
