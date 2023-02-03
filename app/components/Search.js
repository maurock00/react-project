import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useImmer } from "use-immer";
import AxiosInstance from "../AxiosClient";
import DispatchContext from "../DispatchContext";

function Search() {
  const controller = new AbortController();
  const appDispatch = useContext(DispatchContext);
  const [localState, setLocalState] = useImmer({
    searchTerm: "",
    results: [],
    show: "neither",
    requestCount: 0,
  });

  useEffect(() => {
    document.addEventListener("keyup", handleEscapeKey);
    return () => document.removeEventListener("keyup", handleEscapeKey);
  }, []);

  useEffect(() => {
    if (localState.searchTerm.trim()) {
      setLocalState((draft) => {
        draft.show = "loader";
      });
      const delayForSearch = setTimeout(() => {
        setLocalState((draft) => {
          draft.requestCount++;
        });
      }, 700);
      return () => clearTimeout(delayForSearch);
    } else {
      setLocalState((draft) => {
        draft.show = "neither";
      });
    }
  }, [localState.searchTerm]);

  useEffect(() => {
    if (localState.requestCount) {
      async function fetchResults() {
        try {
          const response = await AxiosInstance.post(
            "/search",
            {
              searchTerm: localState.searchTerm,
            },
            {
              signal: controller.signal,
            }
          );

          setLocalState((draft) => {
            draft.results = response.data;
            draft.show = "results";
          });
        } catch (e) {
          console.error(e);
        }
      }

      fetchResults();
      return () => controller.abort();
    }
  }, [localState.requestCount]);

  function handleEscapeKey(e) {
    if (e.keyCode == 27) appDispatch({ type: "closeSearch" });
  }

  function handleSearchTyping(e) {
    const value = e.target.value;
    setLocalState((draft) => {
      draft.searchTerm = value;
    });
  }

  return (
    <>
      <div className="search-overlay">
        <div className="search-overlay-top shadow-sm">
          <div className="container container--narrow">
            <label htmlFor="live-search-field" className="search-overlay-icon">
              <i className="fas fa-search"></i>
            </label>
            <input
              onChange={handleSearchTyping}
              autoFocus
              type="text"
              autoComplete="off"
              id="live-search-field"
              className="live-search-field"
              placeholder="What are you interested in?"
            />
            <span
              onClick={() => appDispatch({ type: "closeSearch" })}
              className="close-live-search"
            >
              <i className="fas fa-times-circle"></i>
            </span>
          </div>
        </div>

        <div className="search-overlay-bottom">
          <div className="container container--narrow py-3">
            <div
              className={
                "circle-loader " +
                (localState.show === "loader" ? "circle-loader--visible" : "")
              }
            ></div>
            <div
              className={
                "live-search-results " +
                (localState.show === "results"
                  ? "live-search-results--visible"
                  : "")
              }
            >
              {Boolean(localState.results.length) && (
                <div className="list-group shadow-sm">
                  <div className="list-group-item active">
                    <strong>Search Results</strong> ({localState.results.length}{" "}
                    item{localState.results.length > 1 ? "s" : ""} found)
                  </div>
                  {localState.results.map((post) => {
                    return (
                      <Link
                        key={post._id}
                        to={`/post/${post._id}`}
                        className="list-group-item list-group-item-action"
                        onClick={() => appDispatch({ type: "closeSearch" })}
                      >
                        <img className="avatar-tiny" src={post.author.avatar} />{" "}
                        <strong>{post.title}</strong>
                        <span className="text-muted small">
                          {" "}
                          on{" "}
                          {new Date(post.createdDate).toLocaleDateString(
                            "en-US"
                          )}{" "}
                          {" by " + post.author.username}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
              {!Boolean(localState.results.length) && (
                <p className="alert alert-danger text-center shadow-sm">
                  Sorry, we cannot find results for your search
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
