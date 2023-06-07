import { Home } from "./components/Home";
import { useLocation, Navigate } from "react-router-dom";
import MapExplorer from "./components/MapExplorer";
import CreateMap from "./components/CreateMap";
import Login from "./components/Login";
import Register from "./components/Register";
import MapsGallery from "./components/MapsGallery";
import PreviewTripMap from "./components/PreviewTripMap";
import Profile from "./components/Profile";
import PrivateRoutePreview from "./components/PrivateRoutePreview";
const RedirectToPreviewTripMap = () => {
  const location = useLocation();

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
    return <Navigate to={`/previewTripMap`} state={state} replace />;
  } else {
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
    path: "/mapCreate",
    element: <CreateMap />,
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
