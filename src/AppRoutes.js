import { Home } from "./components/Home";
import MapExplorer from "./components/MapExplorer";
import TestMap from "./components/TestMap";
import Login from "./components/Login";
import Register from "./components/Register";
import MapsGallery from "./components/MapsGallery";
import PreviewTripMap from "./components/PreviewTripMap";
import Profile from "./components/Profile";
import PrivateRoutePreview from "./components/PrivateRoutePreview";

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
];

export default AppRoutes;
