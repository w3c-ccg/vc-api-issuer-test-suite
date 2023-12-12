# vc-api-issuer-test-suite

Test Suite for Issuers that implement the VC HTTP API

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Implementation](#implementation)


## Background

Provides interoperability tests for issuers that support [VC-API](https://w3c-ccg.github.io/vc-api/).

## Install

```js
npm i
```

## Usage

```
npm test
```


## Implementation

To add your implementation to this test suite see the
`w3c-ccg/vc-test-suite-implementations` [README](https://github.com/w3c-ccg/vc-test-suite-implementations/blob/main/README.md). Add the tag `vc-api` to the issuers you want
to run the tests against.

Note: To run the tests, some implementations require client secrets that can be
passed as env variables to the test script. To see which ones require client
secrets, you can check configs in the `w3c-ccg/vc-test-suite-implementations`
repo.
