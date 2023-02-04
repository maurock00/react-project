import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AxiosInstance from "../AxiosClient";
import LoadingDots from "./LoadingDots";
import PostItem from "./PostItem";

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
  }, [username]);

  if (loading) return <LoadingDots />;

  return (
    <div className="list-group">
      {posts.map((post) => {
        return <PostItem hideAuthor={true} key={post._id} post={post} />;
      })}
    </div>
  );
}

export default PostList;
