import {
  createBrowserRouter,
} from "react-router";

import { DMSRoutes } from "./dms-routes";
import PageNotFound from "@/components/custom/common/page-not-found";

const MainRouter = createBrowserRouter([
  ...DMSRoutes,
  {
    path: "*",
    Component: PageNotFound,
  }
])
export { MainRouter };