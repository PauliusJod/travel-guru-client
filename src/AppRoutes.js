import { Home } from "./components/Home";
import { useLocation, Navigate } from "react-router-dom";
import MapExplorer from "./components/MapExplorer";
import TestMap from "./components/TestMap";
import Login from "./components/Login";
import Register from "./components/Register";
import MapsGallery from "./components/MapsGallery";
import PreviewTripMap from "./components/PreviewTripMap";
import Profile from "./components/Profile";
import PrivateRoutePreview from "./components/PrivateRoutePreview";
const RedirectToPreviewTripMap = () => {
  const location = useLocation();
  console.log("dsdfsdffdsdfsfds");

  if (location.pathname.startsWith("/previewTripMap/")) {
    const itemRouteId = decodeURIComponent(location.pathname.split("/")[2]);
    const itemRouteName = decodeURIComponent(location.pathname.split("/")[3]);
    const itemRouteOrigin = decodeURIComponent(location.pathname.split("/")[4]);
    const itemRouteDestination = decodeURIComponent(
      location.pathname.split("/")[5]
    );
    const state = {
      message: {
        routeId: itemRouteId,
        rName: itemRouteName,
        rOrigin: itemRouteOrigin,
        rDestination: itemRouteDestination,
      },
    };
    console.log("state", state);
    return <Navigate to={`/previewTripMap`} state={state} replace />; // Redirect to PreviewTripMap with routeId as state
  } else {
    // Handle other cases if needed
    return null;
  }
};
const AppRoutes = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/mapsGallery",
    element: <MapsGallery />,
  },
  {
    path: "/privateRoutePreview",
    element: <PrivateRoutePreview />,
  },
  {
    path: "/previewTripMap",
    element: <PreviewTripMap />,
  },
  {
    path: "/mapExplorer",
    element: <MapExplorer />,
  },
  {
    path: "/testMap",
    element: <TestMap />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/previewTripMap/:itemRouteId/:itemRouteName/:itemRouteOrigin/:itemRouteDestination",
    element: <RedirectToPreviewTripMap />,
  },
];

export default AppRoutes;
