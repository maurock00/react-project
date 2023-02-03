import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AxiosInstance from "../AxiosClient";
import LoadingDots from "./LoadingDots";

function ProfileFollows(props) {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await AxiosInstance.get(
          `/profile/${username}/${[props.kind]}`
        );
        setPosts(response.data);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    }

    fetchPosts();
  }, [username, props.kind]);

  if (loading) return <LoadingDots />;

  return (
    <div className="list-group">
      {posts.map((user, index) => {
        return (
          <Link
            key={index}
            to={`/profile/${user.username}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={user.avatar} />{" "}
            <span className="text-muted small">{user.username}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default ProfileFollows;
