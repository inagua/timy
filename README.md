# Timy

Run:

```
node t
```

# Unit tests

- https://buddy.works/guides/how-automate-nodejs-unit-tests-with-mocha-chai

Install `mocha` (unit test runner) and `chai` (unit test framework):
```
npm install mocha chai --save-dev
```

Configure launcher in `package.json`:
```
  "scripts": {
    "test": "mocha test",
    "autotest": "mocha test --watch"
  },
```

Create test in `test/some-test.js`:
```
const expect = require('chai').expect;
describe('Some test', function () {
    it('Some case', function () {
        expect(22).to.equal(22);
    });
});
```

Run unit tests:

```
npm run autotest
```
