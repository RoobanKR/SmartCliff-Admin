import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./components/redux/store";

const BotsonicScript = () => {
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.innerHTML = `
  //     (function (w, d, s, o, f, js, fjs) {
  //       w["botsonic_widget"] = o;
  //       w[o] =
  //         w[o] ||
  //         function () {
  //           (w[o].q = w[o].q || []).push(arguments);
  //         };
  //       (js = d.createElement(s)), (fjs = d.getElementsByTagName(s)[0]);
  //       js.id = o;
  //       js.src = f;
  //       js.async = 1;
  //       fjs.parentNode.insertBefore(js, fjs);
  //     })(window, document, "script", "Botsonic", "https://widget.botsonic.com/CDN/botsonic.min.js");
  //     Botsonic("init", {
  //       serviceBaseUrl: "https://api-azure.botsonic.ai",
  //       token: "23ae6fbe-71a0-40ce-9f80-8f0f40886998",
  //     });
  //   `;
  //   document.body.appendChild(script);
  // }, []);

  return null;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <BotsonicScript />
    </Provider>
  </React.StrictMode>
);

// Performance logging
reportWebVitals();
