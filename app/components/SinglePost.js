import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import AxiosInstance from "../AxiosClient";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import LoadingDots from "./LoadingDots";
import NotContent from "./NotContent";
import Page from "./Page";

function SinglePost() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState({});
  const controller = new AbortController();

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await AxiosInstance.get(`/post/${id}`, {
          signal: controller.signal,
        });
        setPost(response.data);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    }

    fetchPost();

    // CleanUp function - this is exectuted when component is unmount
    return () => {
      controller.abort();
    };
  }, [id]);

  function isOwner() {
    return appState.loggedIn && appState.user.username === post.author.username;
  }

  async function deleteHandler() {
    const deletePost = window.confirm(
      "Do you really want to delete this post ?"
    );
    try {
      if (deletePost) {
        const deleteResponse = await AxiosInstance.delete(`/post/${post._id}`, {
          data: { token: appState.user.token },
        });

        if (deleteResponse.data === "Success") {
          appDispatch({
            type: "addFlashMessages",
            value: ["Post deleted succesfully"],
          });
          navigate(`/profile/${appState.user.username}`);
        } else {
          appDispatch({
            type: "addFlashMessages",
            value: [`${deleteResponse.data}`],
          });
        }
      }

      return;
    } catch (e) {
      console.error(e);
    }
  }

  if (!loading && !post) {
    return <NotContent></NotContent>;
  }

  if (loading)
    return (
      <Page title="Loading...">
        <LoadingDots />
      </Page>
    );

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a
              onClick={deleteHandler}
              data-tip="Delete"
              data-for="delete"
              className="delete-post-button text-danger"
            >
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {new Date(post.createdDate).toLocaleDateString("en-US")}
      </p>

      <div className="body-content">
        <ReactMarkdown children={post.body} />
      </div>
    </Page>
  );
}

export default SinglePost;
