import { Routes, Route } from "react-router";
import { paths } from "./paths";
import App from "../App";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={paths.home} element={<App />} />
    </Routes>
  );
};
