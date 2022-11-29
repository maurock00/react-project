import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import AxiosInstance from "../AxiosClient";
import LoadingDots from "./LoadingDots";
import Page from "./Page";

function SinglePost() {
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
  }, []);

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
        <span className="pt-2">
          <a
            href="#"
            data-tip="Edit"
            data-for="edit"
            className="text-primary mr-2"
          >
            <i className="fas fa-edit"></i>
          </a>
          <ReactTooltip id="edit" className="custom-tooltip" />{" "}
          <a
            data-tip="Delete"
            data-for="delete"
            className="delete-post-button text-danger"
          >
            <i className="fas fa-trash"></i>
          </a>
          <ReactTooltip id="delete" className="custom-tooltip" />
        </span>
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
