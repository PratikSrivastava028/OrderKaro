import { ClerkProvider } from "@clerk/react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App.jsx";
import "./index.css";
import { store } from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <Toaster closeButton position="top-center" />
      </Provider>
    </BrowserRouter>
  </ClerkProvider>,
);
