import React, { createRef } from "react";
import { apiTweetCreate } from "./lookup";

export function TweetCreate(props) {
  const { didTweet } = props;
  const textareaRef = createRef();

  /*
   * backend API handler
  */
  const handleBackendUpdate = (response, status) => {
    if (status === 201) {
      didTweet(response);
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
  );
}
