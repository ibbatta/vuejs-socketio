# __PERSONAL VUE.JS + SOCKET.IO CHAT PROJECT__

| [![bitHound Code](https://www.bithound.io/github/ibbatta/vuejs-socketio/badges/code.svg)](https://www.bithound.io/github/ibbatta/vuejs-socketio) | [![bitHound Dependencies](https://www.bithound.io/github/ibbatta/vuejs-socketio/badges/dependencies.svg)](https://www.bithound.io/github/ibbatta/vuejs-socketio/master/dependencies/npm) |
| --- | --- |


>This repo contains a personal javascript chat to learn and test something about Vue.js, Socket.io and Firebase (+ Bulma css framework)

---


## __What this project contains__

<img src="./repo_readme_assets/logo-npm.png" height="55">&nbsp;&nbsp;
<img src="./repo_readme_assets/logo-node.png" height="55">&nbsp;&nbsp;
<img src="./repo_readme_assets/logo-webpack.png" height="55">&nbsp;&nbsp;
<img src="./repo_readme_assets/logo-es6.png" height="55">&nbsp;&nbsp;
<img src="./repo_readme_assets/logo-vue.png" height="55">&nbsp;&nbsp;
<img src="./repo_readme_assets/logo-firebase.png" height="55">&nbsp;&nbsp;
<img src="./repo_readme_assets/logo-bulma.png" height="55">&nbsp;&nbsp;
<img src="./repo_readme_assets/logo-yarn.png" height="55">&nbsp;&nbsp;
<img src="./repo_readme_assets/logo-babel.png" height="55">&nbsp;&nbsp;

- [x] Vue.js framework
- [x] Bulma css framework
- [x] Webpack
- [x] ES6 supported
- [x] Socket.io
- [x] Firebase DB
- [x] Login with GitHub (to retrieve user information and profile pict)

---


## __Browsers Support__

| <img src="./repo_readme_assets/browsers/browser-ie.svg" height="35"> | <img src="./repo_readme_assets/browsers/browser-firefox.svg" height="35"> | <img src="./repo_readme_assets/browsers/browser-chrome.svg" height="35"> | <img src="./repo_readme_assets/browsers/browser-safari.svg" height="35"> |
| --- | --- | --- | --- |
| 9+ | latest | latest | latest |

---


## __Set up__

Before cloning the repo **be sure** you have installed:

* [NodeJs & npm](http://nodejs.org/download/) (version >= 8.9.x)
* [Yarn](https://yarnpkg.com/en/docs/install) (version >= 1.3.x)
* [Npm](https://www.npmjs.com/) (version >= 5.5.x)

Then:

- Choose a folder project in your system and switch in `cd [folder path]`
- Clone the repo in your folder `git clone https://github.com/ibbatta/vuejs-socketio.git`

---


## __Installation__

- Be sure to have a [Firebase](https://www.firebase.com/) account
- Set up the Firebase auth with GitHub
- Create an `.env` file and import your Firebase credentials _(like the example below)_
```javascript
NODE_ENV=development
APIKEY=FIREBASE_API_KEY
AUTHDOMAIN=FIREBASE_AUTH_DOMAIN
DATABASEURL=FIREBASE_DATABSE_URL
PROJECTID=FIREBASE_PROJECT_ID
STORAGEBUCKET=FIREBASE_STORAGE_BUCKET
```
- From the directory of the project run `yarn`

---


## __Usage__

Once everything is installed, use Yarn from the terminal to start the build tasks.<br>
The package.json expose these tasks:

- `yarn start` (start the project locally)

---


## __Todo__

- [ ] Add Google login / auth
- [ ] Parse markdown for bold, italic and underline texts (???)
- [ ] Manage user connection notification
- [ ] Manage new chat notification
- [ ] Manage message delete watcher
- [ ] Develop hashtag system (???)
- [ ] Develop search by user / hashtag


---


## __Contributing__

- Fork it!
- Create your feature branch: `git checkout -b my-new-feature`
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request

---


## __Credits__

- [Maurizio Battaghini](https://github.com/ibbatta) (project lead and main developer)
- [Davide Bontempelli](https://github.com/ilbonte) (project support)

---


### __Troubleshootings__ ###

This is just a personal project, created for study and demostration purpose only. It may or may not be a good fit for your need(s).

---


> GitHub [@ibbatta](https://github.com/ibbatta) &nbsp;&middot;&nbsp;
> Twitter [@battago](https://twitter.com/battago)
