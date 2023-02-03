import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import AxiosInstance from "../AxiosClient";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import LoadingDots from "./LoadingDots";
import NotContent from "./NotContent";
import Page from "./Page";

function EditPost() {
  const navigate = useNavigate();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const controller = new AbortController();
  const initialState = {
    post: {
      _id: useParams().id,
      title: {
        value: "",
        hasError: false,
        errorMessage: "",
      },
      body: {
        value: "",
        hasError: false,
        errorMessage: "",
      },
    },
    isFetching: true,
    isSaving: false,
    notFound: false,
    editCount: 0,
  };

  function LocalReducer(stateDraft, action) {
    switch (action.type) {
      case "setPost":
        stateDraft.post._id = action.value._id;
        stateDraft.post.title.value = action.value.title;
        stateDraft.post.body.value = action.value.body;
        return;
      case "finishFetch":
        stateDraft.isFetching = false;
        return;
      case "setTitle":
        if (action.value.trim()) {
          stateDraft.post.title.hasError = false;
          stateDraft.post.title.errorMessage = "";
        }
        stateDraft.post.title.value = action.value;
        return;
      case "titleRules":
        if (!action.value.trim()) {
          stateDraft.post.title.hasError = true;
          stateDraft.post.title.errorMessage = "You must provide a title";
        }
        return;
      case "setBody":
        if (action.value.trim()) {
          stateDraft.post.body.hasError = false;
          stateDraft.post.body.errorMessage = "";
        }
        stateDraft.post.body.value = action.value;
        return;
      case "bodyRules":
        if (!action.value.trim()) {
          stateDraft.post.body.hasError = true;
          stateDraft.post.body.errorMessage = "You must provide body content";
        }
        return;
      case "submitEditRequest":
        if (!stateDraft.post.title.hasError && !stateDraft.post.body.hasError)
          stateDraft.editCount++;
        return;
      case "editRequestStart":
        stateDraft.isSaving = true;
        return;
      case "editRequestEnd":
        stateDraft.isSaving = false;
        return;
      case "notFound":
        stateDraft.notFound = true;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(LocalReducer, initialState);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: "titleRules", value: state.post.title.value });
    dispatch({ type: "bodyRules", value: state.post.body.value });
    dispatch({
      type: "submitEditRequest",
    });
  }

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await AxiosInstance.get(`/post/${state.post._id}`, {
          signal: controller.signal,
        });
        dispatch({ type: "setPost", value: response.data });

        if (response.data) {
          dispatch({ type: "finishFetch" });

          if (response.data.author.username != appState.user.username) {
            appDispatch({
              type: "addFlashMessages",
              value: ["You don't have permissions to edit this post !!!"],
            });
            navigate("/");
          }
        } else {
          dispatch({ type: "notFound" });
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchPost();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (state.editCount > 0) {
      dispatch({ type: "editRequestStart" });

      async function editPost() {
        try {
          await AxiosInstance.post(
            `/post/${state.post._id}/edit`,
            {
              title: state.post.title.value,
              body: state.post.body.value,
              token: appState.user.token,
            },
            {
              signal: controller.signal,
            }
          );
          appDispatch({
            type: "addFlashMessages",
            value: ["You've been edit the post succesfully !!!"],
          });
          dispatch({ type: "editRequestEnd" });
          // navigate(`/post/${state.post._id}`);
        } catch (e) {
          console.error(e);
        }
      }

      editPost();

      return () => {
        controller.abort();
      };
    }
  }, [state.editCount]);

  if (state.notFound) {
    return <NotContent></NotContent>;
  }

  if (state.isFetching)
    return (
      <Page title="Loading...">
        <LoadingDots />
      </Page>
    );

  return (
    <Page title="Create Post">
      <Link className="small font-weigth-bold" to={`/post/${state.post._id}`}>
        {" "}
        &laquo;Back to the post{" "}
      </Link>
      <form className="mt-3" onSubmit={handleSubmit}>
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
            onBlur={(e) =>
              dispatch({ type: "titleRules", value: e.target.value })
            }
            onChange={(e) =>
              dispatch({ type: "setTitle", value: e.target.value })
            }
            value={state.post.title.value}
          />
          {state.post.title.hasError && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.post.title.errorMessage}
            </div>
          )}
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
            onChange={(e) =>
              dispatch({ type: "setBody", value: e.target.value })
            }
            onBlur={(e) =>
              dispatch({ type: "bodyRules", value: e.target.value })
            }
            value={state.post.body.value}
          ></textarea>
          {state.post.body.hasError && (
            <div className="alert alert-danger small liveValidateMessage">
              {state.post.body.errorMessage}
            </div>
          )}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          {state.isSaving ? "..." : "Edit Post"}
        </button>
      </form>
    </Page>
  );
}

export default EditPost;
