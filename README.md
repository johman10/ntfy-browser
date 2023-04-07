![ntfy logo](https://raw.githubusercontent.com/binwiederhier/ntfy/main/web/public/static/img/ntfy.png)

# ntfy browser

Unofficial browser extension for [ntfy](https://github.com/binwiederhier/ntfy). The aim is to support Chrome and Firefox, but it's build so that other browsers that support the webextension API can be added in the future.

## Contributing

This project aims to encourage others to contribute. Feel free to do so by forking this repository and follow the steps below.

### Prerequisites

- [Node](https://nodejs.org/) >= 19
- [NPM](https://npmjs.org/) >= 9

### Setup

Install dependencies and watch for file changes

```
npm install
npm run watch
```

By default this will build and watch changes for Chrome. Alternatively you can run watch for a specific browser by doing:

```
npm run watch:firefox
```

Add the extension to the browser by following the respective instructions:

- [Chrome](https://support.google.com/chrome/a/answer/2714278?hl=en#:~:text=Step%202%3A%20Test%20the%20app%20or%20extension)
- [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing)
  The files for the extension will live in the `dist` folder.

### Test

Some automated test are present. You can run them with: `npm test`
