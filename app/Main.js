import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useImmerReducer } from "use-immer";

// Components
import Header from "./components/Header";
import Content from "./components/Content";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
import HomeUser from "./components/HomeUser";
import CreatePost from "./components/CreatePost";
import SinglePost from "./components/SinglePost";
import FlashMessages from "./components/FlashMessages";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import Profile from "./components/Profile";

function App() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("rpToken")),
    flashMessages: [],
    user: {
      username: localStorage.getItem("rpUsername"),
      token: localStorage.getItem("rpToken"),
      avatar: localStorage.getItem("rpAvatar"),
    },
  };

  function AppReducer(stateDraft, action) {
    switch (action.type) {
      case "login":
        stateDraft.loggedIn = true;
        stateDraft.user = action.user;
        return;
      case "logout":
        stateDraft.loggedIn = false;
        return;
      case "addFlashMessages":
        stateDraft.flashMessages.push(action.value);
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(AppReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("rpToken", state.user.token);
      localStorage.setItem("rpAvatar", state.user.avatar);
      localStorage.setItem("rpUsername", state.user.username);
    } else {
      localStorage.removeItem("rpToken");
      localStorage.removeItem("rpAvatar");
      localStorage.removeItem("rpUsername");
    }
  }, [state.loggedIn]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Routes>
            <Route
              path="/"
              element={state.loggedIn ? <HomeUser /> : <Content />}
            />
            <Route path="/profile/:username/*" element={<Profile />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/post/:id" element={<SinglePost />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/about-us" element={<About />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<App />);

if (module.hot) {
  module.hot.accept();
}
