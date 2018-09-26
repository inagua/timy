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

Run unit tests:

```
npm run autotest
```
