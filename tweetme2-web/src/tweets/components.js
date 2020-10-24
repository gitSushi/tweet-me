import React, { createRef, useEffect, useState } from "react";
import { apiTweetList, apiTweetCreate, apiTweetAction } from "./lookup";

export function TweetsComponent(props) {
  const textareaRef = createRef();
  const [newTweets, setNewTweets] = useState([]);

  /*
   * backend API handler
  */
  const handleBackendUpdate = (response, status) => {
    let tempNewTweets = [...newTweets];

    if (status === 201) {
      tempNewTweets.unshift(response);
      setNewTweets(tempNewTweets);
    } else {
      console.log(response);
      alert("An error occured please try again");
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    const newValue = textareaRef.current.value;

    apiTweetCreate(newValue, handleBackendUpdate);
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
        apiTweetList(handleTweetListLookup);
      }
      /*
    // both syntax work -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Using_object_initializers
    let tweetItems = [{"content": 123}, {content: "Hi there"}]
    setTweets(tweetItems);
    */
    },
    [tweetsDidSet, setTweetsDidSet]
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
    <div className="col-12">
      <Tweet
        tweet={tweet}
        didRetweet={handleDidRetweet}
        key={index}
        className="my-5 py-4 border bg-white text-dark"
      />
    </div>
  );
}

function ActionBtn(props) {
  const { tweet, action, didPerformAction } = props;

  const likes = tweet.likes ? tweet.likes : 0;
  // const [likes, setLikes] = useState(tweet.likes ? tweet.likes : 0);
  // const [userLike, setUserLike] = useState(false);
  // const [userLike, setUserLike] = useState(
  //   tweet.userLike === true ? true : false
  // );

  const className = props.className
    ? props.className
    : "btn btn-primary btn-sm";
  const actionDisplay = action.display ? action.display : "Action";
  const display =
    action.type === "like" ? `${likes} ${actionDisplay}` : actionDisplay;

  const handleActionBackendEvent = (response, status) => {
    console.log(response, status);
    if ((status === 200 || status === 201) && didPerformAction) {
      // setLikes(response.likes);
      didPerformAction(response);
    }
    // if (action.type === "like") {
    //   if (userLike === true) {
    //     setLikes(likes - 1);
    //     setUserLike(false);
    //   } else {
    //     setLikes(likes + 1);
    //     setUserLike(true);
    //   }
    // }
  };

  const handleClick = event => {
    event.preventDefault();
    apiTweetAction(tweet.id, action.type, handleActionBackendEvent);
  };

  return (
    <button className={className} onClick={handleClick}>
      {display}
    </button>
  );
}

function ParentTweet(props) {
  const { tweet } = props;
  return (
    <div className="col-11 mx-auto p-3 border rounded">
      <p className="mb-0 text-muted small">Retweet</p>
      <Tweet hideActions className={" "} tweet={tweet.parent} />
    </div>
  );
}

function Tweet(props) {
  const { tweet, didRetweet, hideActions } = props;
  const [actionTweet, setActionTweet] = useState(
    props.tweet ? props.tweet : null
  );
  const className = props.className
    ? props.className
    : "col-10 mx-auto col-md-6";

  const handlePerformAction = (newActionTweet, status) => {
    if (status === 200) {
      setActionTweet(newActionTweet);
    } else if (status === 201) {
      if (didRetweet) {
        didRetweet(newActionTweet);
      }
    }
  };

  return (
    <div className={className}>
      <div className="px-2">
        <p>
          {tweet.id} - {tweet.content}
        </p>
        {tweet.parent && <ParentTweet tweet={tweet} />}
      </div>
      {actionTweet &&
        hideActions !== true &&
        <div className="btn btn-group">
          <ActionBtn
            tweet={actionTweet}
            didPerformAction={handlePerformAction}
            action={{ type: "like", display: "Likes" }}
          />
          <ActionBtn
            tweet={actionTweet}
            didPerformAction={handlePerformAction}
            action={{ type: "unlike", display: "Unlike" }}
          />
          <ActionBtn
            tweet={actionTweet}
            didPerformAction={handlePerformAction}
            action={{ type: "retweet", display: "Retweet" }}
          />
        </div>}
    </div>
  );
}
