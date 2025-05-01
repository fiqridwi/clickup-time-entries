import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRoutes } from "./routes";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>,
);
