import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from "../AxiosClient";
import StateContext from "../StateContext";
import Page from "./Page";
import PostList from "./PostList";

function Profile() {
  const { username } = useParams();
  const appState = useContext(StateContext);
  const [profileData, setProfileData] = useState({
    profileUsername: "...",
    profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
    isFollowing: false,
    counts: { postCount: 0, followerCount: 0, followingCount: 0 },
  });

  useEffect(() => {
    async function getProfileData() {
      try {
        const response = await AxiosInstance.post(`/profile/${username}`, {
          token: appState.user.token,
        });
        setProfileData(response.data);
      } catch (e) {
        console.error(e);
      }
    }

    getProfileData();
  }, []);

  return (
    <Page title="RP | Profile">
      <div className="container container--narrow py-md-5">
        <h2>
          <img className="avatar-small" src={profileData.profileAvatar} />{" "}
          {profileData.profileUsername}
          <button className="btn btn-primary btn-sm ml-2">
            Follow <i className="fas fa-user-plus"></i>
          </button>
        </h2>

        <div className="profile-nav nav nav-tabs pt-2 mb-4">
          <a href="#" className="active nav-item nav-link">
            Posts: {profileData.counts.postCount}
          </a>
          <a href="#" className="nav-item nav-link">
            Followers: {profileData.counts.followerCount}
          </a>
          <a href="#" className="nav-item nav-link">
            Following: {profileData.counts.followingCount}
          </a>
        </div>
        <PostList />
      </div>
    </Page>
  );
}

export default Profile;
