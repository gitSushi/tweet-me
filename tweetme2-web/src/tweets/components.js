import React, { createRef, useEffect, useState } from "react";
import { loadTweets } from "../lookup";

export function TweetsComponent(props) {
  const textareaRef = createRef();
  const [newTweets, setNewTweets] = useState([]);
  const handleSubmit = event => {
    event.preventDefault();
    const newValue = textareaRef.current.value;
    let tempNewTweets = [...newTweets];
    tempNewTweets.unshift({
      content: newValue,
      likes: 0,
      id: 46453
    });
    setNewTweets(tempNewTweets);
    textareaRef.current.value = "";
  };
  return (
    <div className={props.className}>
      <div className="col-12 mb-3">
        <form onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            required
            className="form-control"
            name="tweet"
          />
          <button type="submit" className="btn btn-primary my-3">
            Tweet
          </button>
        </form>
      </div>
      <TweetList newTweets={newTweets} />
    </div>
  );
}

function TweetList(props) {
  const [tweetsInit, setTweetsInit] = useState([]);

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

  useEffect(() => {
    const myCallback = (response, status) => {
      // console.log(response, status);
      if (status === 200) {
        setTweetsInit(response);
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

  const [likes, setLikes] = useState(tweet.likes ? tweet.likes : 0);
  // const [userLike, setUserLike] = useState(false);
  const [userLike, setUserLike] = useState(
    tweet.userLike === true ? true : false
  );

  const className = props.className
    ? props.className
    : "btn btn-primary btn-sm";
  const actionDisplay = action.display ? action.display : "Action";
  const display =
    action.type === "like" ? `${likes} ${actionDisplay}` : actionDisplay;

  const handleClick = event => {
    event.preventDefault();
    if (action.type === "like") {
      if (userLike === true) {
        setLikes(likes - 1);
        setUserLike(false);
      } else {
        setLikes(likes + 1);
        setUserLike(true);
      }
    }
  };

  return (
    <button className={className} onClick={handleClick}>
      {display}
    </button>
  );
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
        <ActionBtn tweet={tweet} action={{ type: "like", display: "Likes" }} />
        <ActionBtn
          tweet={tweet}
          action={{ type: "unlike", display: "Unlike" }}
        />
        <ActionBtn
          tweet={tweet}
          action={{ type: "retweet", display: "Retweet" }}
        />
      </div>
    </div>
  );
}
