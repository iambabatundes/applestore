import { Routes, Route } from "react-router-dom";
import routesConfig from "./routesConfig";

const AppRoutes = (props) => {
  return (
    <Routes>
      {routesConfig(props).map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default AppRoutes;
