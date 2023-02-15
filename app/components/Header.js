import React, { useContext, useState } from "react";
import StateContext from "../StateContext";
import HeaderLoggedIn from "./HeaderLoggedIn";
import HeaderLoggedOut from "./HeaderLoggedOut";

function Header(props) {
  const { loggedIn } = useContext(StateContext);
  const Header = loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />;

  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <a href="/" className="text-white">
            {" "}
            ComplexApp{" "}
          </a>
        </h4>
        {!props.staticEmpty ? Header : ""}
      </div>
    </header>
  );
}

export default Header;
