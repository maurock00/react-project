import React from "react";
import ReactDOM from "react-dom";

function App() {
  return (
    <div>
      <h1>This is a fucking APP for the win my friendo akjsdjkaksjksjadad </h1>
    </div>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));
root.render(<App />);

if (module.hot) {
  module.hot.accept();
}
