import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AxiosInstance from "../AxiosClient";
import LoadingDots from "./LoadingDots";

function PostList() {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await AxiosInstance.get(`/profile/${username}/posts`);
        setPosts(response.data);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    }

    fetchPosts();
  }, []);

  if (loading) return <LoadingDots />;

  return (
    <div className="list-group">
      {posts.map((post) => {
        return (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={post.avatar} />{" "}
            <strong>{post.title}</strong>
            <span className="text-muted small">
              {" "}
              on {new Date(post.createdDate).toLocaleDateString("en-US")}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export default PostList;
