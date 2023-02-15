import React from "react";
import { Link } from "react-router-dom";
import Page from "./Page";

function NotContent() {
  return (
    <Page title="Not Content">
      <div className="text-cetner">
        <h2>Whoops, we cannot find that page.</h2>
        <p className="lead text-muted">
          You can alwayse visit <Link to="/"> Homepage </Link> to start from the
          beginning
        </p>
      </div>
    </Page>
  );
}

export default NotContent;
