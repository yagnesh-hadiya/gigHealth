import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./Routes";
import { Suspense } from "react";
import PrivateRoute from "./PrivateRoute";
import Loader from "../components/custom/CustomSpinner";
import { RouteType } from "../types/RouteTypes";

const router = createBrowserRouter(
  routes.map((route: RouteType) => {
    return {
      ...route,
      element: route.needsAuth ? (
        <PrivateRoute key={Math.random()} isTalentRoute={route.isTalentRoute}>
          <Suspense fallback={<Loader />}>{route.element}</Suspense>
        </PrivateRoute>
      ) : (
        <Suspense fallback={<Loader />}>{route.element}</Suspense>
      ),
    };
  })
);

const Router = () => <RouterProvider router={router} />;
export default Router;
