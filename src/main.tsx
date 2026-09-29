import ReactDOM from "react-dom/client";
import App from "./App.js";

// No StrictMode: the SDK's session/StreamManager singletons aren't
// double-mount safe, so StrictMode's dev double-invoke tears the stream
// down mid-connect (surfaces as "StreamManager is disposed").
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
