# WebChat app
## Install the app
```sh
npm install
```

## Start the project
Both commands is necessary for starting.
### Starting the npm project
```sh
$ npm start #for linux and mac
$ npm run win-start #for windows
```
### Building the frontend
```sh
$ npm run build
```

## Debuging
Both commands is necessary for debug.
### Build and Watch the source code
```sh
$ npm run build-debug
```
### Starting npm project for debugging the source code
```sh
$ npm run debug
```


# Attention
This project uses 
[fetch](https://developer.mozilla.org/en/docs/Web/API/Fetch_API). Because of it WebChat might not work in some browsers. If you want to improve browser support you can add [fetch polyfill](https://github.com/github/fetch). But it's still working in Google Chrome without it :)

# Requirements
* npm v2.14.20
* node v5.9.0
