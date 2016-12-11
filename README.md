# VEB-Stack

> A Bootstrap + Vue + Electron Stack

## Structure

- `src` is where the frontend part of your app is located, using pug(a.k.a. jade) scss and babel to trans/compile your files into the main folder.
- `app` is where the app itself lies: main.js is the electron entry point that forwards to index.html. From there you can navigate to the frontend folder `/public/` or the backend `api` and `bin` folders.
- `release` is where the deployed app ends up.

## Commands

**Gulp tasks:**

- `gulp build` runs the main compile tasks, namely `js`,`html` and `css`
- `gulp dist` runs the same as build, plus `bower`,`bootstrap` and `favicon`
- `gulp dev` starts watch and a local server at `http://localhost:8000/`
- `gulp electron` deploys the electron app
