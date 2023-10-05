![ntfy logo](./public/ntfy.svg)

# ntfy-browser

Unofficial browser extension for [ntfy](https://github.com/binwiederhier/ntfy). The aim is to support Chrome and Firefox, but it's build so that other browsers that support the webextension API can be added in the future.

**Please note: this project is still under heavy development, and should so be considered a beta.** Star & follow this repository to keep track of future updates. Once considered stable I will publish the extension.

## Contributing

This project aims to encourage others to contribute. Feel free to do so by forking this repository and follow the steps below.

### Prerequisites

- [Node](https://nodejs.org/) >= 19
- [NPM](https://npmjs.org/) >= 9

### Setup

Install dependencies and watch for file changes

```
npm install
npm start
```

By default this will build and watch changes for Chrome. Alternatively you can start for a specific browser by doing:

```
npm run start:firefox
```

Add the extension to the browser by following the respective instructions:

- [Chrome](https://support.google.com/chrome/a/answer/2714278?hl=en#:~:text=Step%202%3A%20Test%20the%20app%20or%20extension)
- [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing)

The files for the extension will live in the `dist/[browser]` folder.

Please note that some changes will require you to refresh the browser extension before testing.

### Test

Some automated test are present. You can run them with: `npm test`

### Production build

If you want to test for production you can use:

```
npm run build
```

This will build the extension in a production manner for all configured browsers.
