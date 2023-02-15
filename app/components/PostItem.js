import React from "react";
import { Link } from "react-router-dom";

function PostItem(props) {
  const post = props.post;

  return (
    <Link
      to={`/post/${post._id}`}
      onClick={props.onClick}
      className="list-group-item list-group-item-action"
    >
      <img className="avatar-tiny" src={post.author.avatar} />{" "}
      <strong>{post.title}</strong>
      <span className="text-muted small">
        {" "}
        on {new Date(post.createdDate).toLocaleDateString("en-US")}{" "}
        {!props.hideAuthor && <> {" by " + post.author.username}</>}
      </span>
    </Link>
  );
}

export default PostItem;
