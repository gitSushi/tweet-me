import React from "react";
import { apiTweetAction } from "./lookup";

export function ActionBtn(props) {
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
    if (status === 403) {
      console.log(response, status);
    }
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
