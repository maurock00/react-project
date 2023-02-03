import React, { useContext, useEffect, useState } from "react";
import { NavLink, Route, Routes, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import AxiosInstance from "../AxiosClient";
import StateContext from "../StateContext";
import Page from "./Page";
import PostList from "./PostList";
import ProfileFollows from "./ProfileFollows";

function Profile() {
  const { username } = useParams();
  const appState = useContext(StateContext);
  const [localState, setLocalState] = useImmer({
    startFollowRequestCount: 0,
    stopFollowRequestCount: 0,
    followLoading: false,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: { postCount: 0, followerCount: 0, followingCount: 0 },
    },
  });

  useEffect(() => {
    async function getProfileData() {
      try {
        const response = await AxiosInstance.post(`/profile/${username}`, {
          token: appState.user.token,
        });
        setLocalState((draft) => {
          draft.profileData = response.data;
        });
      } catch (e) {
        console.error(e);
      }
    }

    getProfileData();
  }, [username]);

  function handleFollowRequest() {
    setLocalState((draft) => {
      draft.startFollowRequestCount++;
    });
  }

  useEffect(() => {
    if (localState.startFollowRequestCount > 0) {
      setLocalState((draft) => {
        draft.followLoading = true;
      });

      async function followRequest() {
        try {
          const response = await AxiosInstance.post(
            `/addFollow/${localState.profileData.profileUsername}`,
            {
              token: appState.user.token,
            }
          );
          setLocalState((draft) => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followLoading = false;
          });
        } catch (e) {
          console.error(e);
        }
      }

      followRequest();
    }
  }, [localState.startFollowRequestCount]);

  function handleUnfollowRequest() {
    setLocalState((draft) => {
      draft.stopFollowRequestCount++;
    });
  }

  useEffect(() => {
    if (localState.stopFollowRequestCount > 0) {
      setLocalState((draft) => {
        draft.followLoading = true;
      });

      async function unfollowRequest() {
        try {
          const response = await AxiosInstance.post(
            `/removeFollow/${localState.profileData.profileUsername}`,
            {
              token: appState.user.token,
            }
          );
          setLocalState((draft) => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followLoading = false;
          });
        } catch (e) {
          console.error(e);
        }
      }

      unfollowRequest();
    }
  }, [localState.stopFollowRequestCount]);

  return (
    <Page title="RP | Profile">
      <div className="container container--narrow py-md-5">
        <h2>
          <img
            className="avatar-small"
            src={localState.profileData.profileAvatar}
          />{" "}
          {localState.profileData.profileUsername}
          {appState.loggedIn &&
            appState.user.username != localState.profileData.profileUsername &&
            !localState.profileData.isFollowing &&
            localState.profileData.profileUsername != "..." && (
              <button
                onClick={handleFollowRequest}
                disabled={localState.followLoading}
                className="btn btn-primary btn-sm ml-2"
              >
                Follow <i className="fas fa-user-plus"></i>
              </button>
            )}
          {appState.loggedIn &&
            appState.user.username != localState.profileData.profileUsername &&
            localState.profileData.isFollowing &&
            localState.profileData.profileUsername != "..." && (
              <button
                onClick={handleUnfollowRequest}
                disabled={localState.followLoading}
                className="btn btn-danger btn-sm ml-2"
              >
                Unfollow <i className="fas fa-user-times"></i>
              </button>
            )}
        </h2>

        <div className="profile-nav nav nav-tabs pt-2 mb-4">
          <NavLink to="" end className="nav-item nav-link">
            Posts: {localState.profileData.counts.postCount}
          </NavLink>
          <NavLink to="followers" className="nav-item nav-link">
            Followers: {localState.profileData.counts.followerCount}
          </NavLink>
          <NavLink to="following" className="nav-item nav-link">
            Following: {localState.profileData.counts.followingCount}
          </NavLink>
        </div>
        <Routes>
          <Route path="" element={<PostList />}></Route>
          <Route
            path="followers"
            element={<ProfileFollows kind="followers" />}
          ></Route>
          <Route
            path="following"
            element={<ProfileFollows kind="following" />}
          ></Route>
        </Routes>
      </div>
    </Page>
  );
}

export default Profile;
