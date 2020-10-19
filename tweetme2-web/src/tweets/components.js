import React, { useEffect, useState } from "react";
import { loadTweets } from "../lookup";

export function TweetList() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const myCallback = (response, status) => {
      // console.log(response, status);
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

  return tweets.map((tweet, index) =>
    <Tweet
      tweet={tweet}
      key={index}
      className="my-5 py-5 border bg-white text-dark"
    />
  );
}

function ActionBtn(props) {
  const { tweet, action } = props;
  const className = props.className
    ? props.className
    : "btn btn-primary btn-sm";
  return action.type === "like"
    ? <button className={className}>
        {tweet.likes} Likes
      </button>
    : null;
}

function Tweet(props) {
  const { tweet } = props;
  const className = props.className
    ? props.className
    : "col-10 mx-auto col-md-6";
  return (
    <div className={className}>
      <p>
        {tweet.id} - {tweet.content}
      </p>
      <div className="btn btn-group">
        <ActionBtn tweet={tweet} action={{ type: "like" }} />
      </div>
    </div>
  );
}
