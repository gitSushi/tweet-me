import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { TweetsComponent, TweetDetailComponent } from "./tweets";
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

const tweetEl = document.getElementById("tweetMe2");
if (tweetEl) {
  const myComponent = React.createElement(TweetsComponent, tweetEl.dataset);
  ReactDOM.render(myComponent, tweetEl);

  // ReactDOM.render(
  //   <React.StrictMode>
  //     <myComponent />
  //   </React.StrictMode>,
  //   tweetEl
  // );
}

const rCEl = React.createElement;
const tweetDetailElements = document.querySelectorAll(".tweetme-2-detail");

tweetDetailElements.forEach(container => {
  ReactDOM.render(rCEl(TweetDetailComponent, container.dataset), container);
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

// serviceWorker.unregister();
