import { Home } from "./components/Home";
import MapExplorer from "./components/MapExplorer";
import TestMap from "./components/TestMap";
import Login from "./components/Login";
import Register from "./components/Register";
import MapsGallery from "./components/MapsGallery";
import PreviewTripMap from "./components/PreviewTripMap";

const AppRoutes = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: "/mapsGallery",
    element: <MapsGallery />,
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
