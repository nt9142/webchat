# WebChat
## Install the app
```sh
npm install
```

## Start the project
Both commands are necessary for starting.
### Building the frontend
```sh
$ npm run build
```
### Starting the npm project
```sh
$ npm start # if you use linux or mac
$ npm run win-start # if you use windows
```

## Debuging
Both commands are necessary for debug.
### Build and Watch the source code
```sh
$ npm run build-debug
```
### Starting npm project for debugging the source code
```sh
$ npm run debug # if you use linux or mac
$ npm run win-debug # if you use windows
```


# Attention
This project uses 
[fetch](https://developer.mozilla.org/en/docs/Web/API/Fetch_API). Because of it WebChat might not work in some browsers. If you want to improve browser support you can add the [fetch polyfill](https://github.com/github/fetch). But it's still working in Google Chrome without it :)

# Requirements
* npm v2.14.20
* node v5.9.0
