import React, { useEffect, useState } from "react";
import { apiTweetList } from "./lookup";
import { Tweet } from "./detail";

export function TweetList(props) {
  const { username } = props;
  const [tweetsInit, setTweetsInit] = useState([]);
  const [tweetsDidSet, setTweetsDidSet] = useState(false);

  // Maybe useReducer instead
  const [tweets, setTweets] = useState([]);

  useEffect(
    () => {
      const final = [...props.newTweets].concat(tweetsInit);
      if (final.length !== tweets.length) {
        setTweets(final);
      }
    },
    [props.newTweets, tweets, tweetsInit]
  );

  useEffect(
    () => {
      if (tweetsDidSet === false) {
        const handleTweetListLookup = (response, status) => {
          // console.log(response, status);
          if (status === 200) {
            setTweetsInit(response);
            setTweetsDidSet(true);
          } else {
            alert("There was an error");
          }
        };
        apiTweetList(username, handleTweetListLookup);
      }
      /*
    // both syntax work -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Using_object_initializers
    let tweetItems = [{"content": 123}, {content: "Hi there"}]
    setTweets(tweetItems);
    */
    },
    [setTweetsInit, tweetsDidSet, setTweetsDidSet, username]
  );

  const handleDidRetweet = newTweet => {
    const updatedTweetsInit = [...tweetsInit];
    updatedTweetsInit.unshift(newTweet);
    setTweetsInit(updatedTweetsInit);

    const updatedFinalTweets = [...tweets];
    updatedFinalTweets.unshift(tweets);
    setTweets(updatedFinalTweets);
  };

  return tweets.map((tweet, index) =>
    <div className="col-12" key={`${index}-{tweet.id}`}>
      <Tweet
        tweet={tweet}
        didRetweet={handleDidRetweet}
        className="my-5 py-4 border bg-white text-dark"
      />
    </div>
  );
}
