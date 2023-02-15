import React, { useContext, useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import io from "socket.io-client";
import { v4 } from "uuid";
import { Link } from "react-router-dom";

function Chat() {
  const socket = useRef();
  const chatInput = useRef();
  const chatLog = useRef();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [localState, setLocalState] = useImmer({
    inputValue: "",
    messages: [],
  });

  useEffect(() => {
    socket.current = io("http://localhost:8080");
    socket.current.on("chatFromServer", (message) => {
      setLocalState((draft) => {
        draft.messages.push(message);
      });
    });

    return socket.current.disconnect();
  }, []);

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
    if (localState.messages.length && !appState.chatIsOpen)
      appDispatch({ type: "incrementUnreadChatCount" });
  }, [localState.messages]);

  useEffect(() => {
    if (appState.chatIsOpen) {
      chatInput.current.focus();
      appDispatch({ type: "clearUnreadChatCount" });
    }
  }, [appState.chatIsOpen]);

  function handleInputChange(e) {
    const inputValue = e.target.value;
    setLocalState((draft) => {
      draft.inputValue = inputValue;
    });
  }

  function handleSendMessage(e) {
    e.preventDefault();
    setLocalState((draft) => {
      socket.current.emit("chatFromBrowser", {
        message: localState.inputValue,
        token: appState.user.token,
      });

      draft.messages.push({
        message: localState.inputValue,
        username: appState.user.username,
        avatar: appState.user.avatar,
      });
      draft.inputValue = "";
    });
  }

  return (
    <div
      id="chat-wrapper"
      className={
        "chat-wrapper shadow border-top border-left border-right" +
        (appState.chatIsOpen ? " chat-wrapper--is-visible" : "")
      }
    >
      <div className="chat-title-bar bg-primary">
        Chat
        <span
          onClick={() => appDispatch({ type: "closeChat" })}
          className="chat-title-bar-close"
        >
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {localState.messages.map((message) => {
          if (message.username === appState.user.username) {
            return (
              <div key={v4()} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            );
          }

          return (
            <div key={v4()} className="chat-other">
              <Link to={`/profile/${message.username}`}>
                <img className="avatar-tiny" src={message.avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${message.username}`}>
                    <strong>{message.username}:</strong>
                  </Link>{" "}
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleSendMessage}
        id="chatForm"
        className="chat-form border-top"
      >
        <input
          onChange={handleInputChange}
          value={localState.inputValue}
          ref={chatInput}
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
        />
      </form>
    </div>
  );
}

export default Chat;
