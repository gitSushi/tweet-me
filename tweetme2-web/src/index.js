import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { TweetsComponent } from "./tweets";
// import * as serviceWorker from './serviceWorker';

const appEL = document.getElementById("root");
if (appEL) {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    appEL
  );
}

const tweetEL = document.getElementById("tweetMe2");
if (tweetEL) {
  ReactDOM.render(
    <React.StrictMode>
      <TweetsComponent />
    </React.StrictMode>,
    tweetEL
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

// serviceWorker.unregister();
