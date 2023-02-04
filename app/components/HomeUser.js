import React, { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import AxiosInstance from "../AxiosClient";
import StateContext from "../StateContext";
import LoadingDots from "./LoadingDots";
import Page from "./Page";
import PostItem from "./PostItem";

function HomeUser() {
  const controller = new AbortController();
  const appState = useContext(StateContext);
  const [localState, setLocalState] = useImmer({
    loading: false,
    feedPosts: [],
  });

  useEffect(() => {
    setLocalState((draft) => {
      draft.loading = true;
    });
    async function fetchResults() {
      try {
        const response = await AxiosInstance.post(
          "/getHomeFeed",
          {
            token: appState.user.token,
          },
          {
            signal: controller.signal,
          }
        );

        setLocalState((draft) => {
          draft.feedPosts = response.data;
          draft.loading = false;
        });
      } catch (e) {
        console.error(e);
      }
    }

    fetchResults();
    return () => controller.abort();
  }, []);

  if (localState.loading) {
    return <LoadingDots />;
  }

  return (
    <Page title="Feed">
      {localState.feedPosts.length <= 0 && (
        <>
          <h2 className="text-center">
            Hello <strong>{appState.user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you follow. If
            you don&rsquo;t have any friends to follow that&rsquo;s okay; you
            can use the &ldquo;Search&rdquo; feature in the top menu bar to find
            content written by people with similar interests and then follow
            them.
          </p>
        </>
      )}
      {localState.feedPosts.length > 0 && (
        <>
          <h2 className="text-center mb-4">The latest from those you follow</h2>
          <div className="list-group">
            {localState.feedPosts.map((post) => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
        </>
      )}
    </Page>
  );
}

export default HomeUser;
