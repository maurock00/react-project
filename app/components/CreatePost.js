import React, { useContext, useState } from "react";
import Page from "./Page";
import AxiosInstance from "../AxiosClient";
import { useNavigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function CreatePost(props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const handleCreatePost = async (e) => {
    e.preventDefault();

    try {
      const response = await AxiosInstance.post("create-post", {
        title,
        body,
        token: appState.user.token,
      });
      setTitle("");
      setBody("");
      appDispatch({
        type: "addFlashMessages",
        value: ["You've been created a post succesfully !!!"],
      });
      navigate(`/post/${response.data}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Page title="Create Post">
      <form>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </div>

        <button onClick={handleCreatePost} className="btn btn-primary">
          Save New Post
        </button>
      </form>
    </Page>
  );
}

export default CreatePost;
