import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function loadTweets(callback) {
  const xhr = new XMLHttpRequest();
  const method = "GET";
  const url = "http://127.0.0.1:8080/api/tweets";
  const responseType = "json";

  xhr.responseType = responseType;
  xhr.open(method, url);
  xhr.onload = function() {
    callback(xhr.response, xhr.status);
  };
  xhr.onerror = function(e) {
    console.log(e);
    callback({ message: "the request was an error" }, 400);
  };
  xhr.send();
}

function App() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const myCallback = (response, status) => {
      console.log(response, status);
      if (status === 200) {
        setTweets(response);
      }
    };
    loadTweets(myCallback);
    /*
    // both syntax work -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Using_object_initializers
    let tweetItems = [{"content": 123}, {content: "Hi there"}]
    setTweets(tweetItems);
    */
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ul>
          {tweets.map((tweet, index) =>
            <li key={index}>
              {tweet.content}
            </li>
          )}
        </ul>
      </header>
    </div>
  );
}

export default App;
