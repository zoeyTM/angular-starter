# Angular-starter

## Overview

[Angular-starter](https://github.com/morgansliman/angular-starter/) is a mildly opinionated boilerplate for MEAN stack web development, with tools for building a great experience across many devices. Designed to build productive programmers.

### Features

| Feature                                | Summary                                                                                                                                                                                                                                                     |
|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Auto-Injection | Seamlessly integrated with [gulp-inject](https://www.npmjs.com/package/gulp-inject), newly compiled CSS files, all necessary AngularJS files, and [Bower](https://bower.io/) components are automatically injected directly into `index.html` so your code just works. No more fumbling through `<script>` tags.                          |
| Built-in Express Server                   | Simple [Express](http://expressjs.com/) server complete with [body-parser](https://www.npmjs.com/package/body-parser), [morgan](https://www.npmjs.com/package/morgan), and [mongoose](https://www.npmjs.com/package/mongoose) pre-configured. (Run `npm start` to start with [gulp-nodemon](https://www.npmjs.com/package/gulp-nodemon))                                                                                                                                                                          |
| Cross-device Synchronization           | Synchronize clicks, scrolls, forms and live-reload across multiple devices as you edit your project. Powered by [BrowserSync](http://browsersync.io). (Run `npm start` and open up the IP provided on other devices on your network)                       |
| Sass support                           | Compile [Sass](http://sass-lang.com/) into CSS with ease, bringing support for variables, mixins and more. (Run `gulp styles` to compile, or just `gulp` to compile and auto-inject CSS files into `index.html`)                                                                                                   |


## Prerequisites

Node.js and npm are essential to Angular development.

<a href="https://docs.npmjs.com/getting-started/installing-node" target="_blank" title="Installing Node.js and updating npm">
Get it now</a> if it's not already installed on your machine.

**Verify that you are running at least node `v4.x.x` and npm `3.x.x`**
by running `node -v` and `npm -v` in a terminal/console window.
Older versions produce errors.


## Create a new project based on the QuickStart

Clone this repo into new project folder (e.g., `my-proj`).
```shell
git clone https://github.com/morgansliman/angular-starter my-proj
cd my-proj
```

### Delete _non-essential_ files

You can quickly delete the _non-essential_ files
by entering the following commands while in the project folder:

> Note: this will also delete the README.md file. If you're reading this in your IDE, [open it in a browser first](https://github.com/morgansliman/angular-starter#delete-non-essential-files)!

##### OS/X (bash)
```shell
xargs rm -rf < non-essential-files.osx.txt
rm src/app/*.spec*.ts
rm non-essential-files.osx.txt
```

##### Windows
```shell
for /f %i in (non-essential-files.txt) do del %i /F /S /Q
rd .git /s /q
rd e2e /s /q
```

### Create a new git repo
You _could_ start writing code now and throw it all away when you're done.
If you'd rather preserve your work under source control, consider taking the following steps.

Initialize this project as a *local git repo* and make the first commit:
```shell
git init
git add .
git commit -m "Initial commit"
```


Create a *remote repository* for this project on the service of your choice.

Grab its address (e.g. *`https://github.com/<my-profile>/my-proj.git`*) and push the *local repo* to the *remote*.
```shell
git remote add origin <repo-address>
git push -u origin master
```
## Install npm packages

> See npm version notes above

Install the npm packages described in the `package.json` and verify that it works:

```shell
npm install
npm start
```


The `npm install` command will first install all dependencies listed in `package.json`, then it will call `bower install` to install the front-end dependencies listed in `bower.json` ([AngularJS](https://angularjs.org/) & [UI-Router](https://ui-router.github.io/) by default).

When Bower finishes installing its packages, it will call `gulp inject-bower` which will inject the newly installed dependencies into `src/client/index.html` automatically.

> When installing additional packages with bower, always check your `index.html` file to be sure they were injected correctly. This code is not perfect yet; please [open an issue](https://github.com/morgansliman/angular-starter/issues) if you find an error in your dependency injections.

The `npm start` command first compiles any `.sass` or `.scss` files within `src/client/sass` then auto-injects these along with all your custom AngularJS into the appropriate places in `index.html` then simultaneously re-compiles and runs the Express server in `src/server/index.js` using `gulp-nodemon`.

> Changes made to any `.js`, `.sass`, or `.scss` files are tracked by `gulp-nodemon` and will restart the server, triggering a Sass re-compile and full auto-injection. Changes made to any `.html` file is tracked by `BrowserSync`, and will automatically live-reload the page. If this isn't working as expected, please [open an issue](https://github.com/morgansliman/angular-starter/issues).

Shut it down manually with `Ctrl-C`.

You're ready to write your application.