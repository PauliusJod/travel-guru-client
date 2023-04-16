import React, { useState, useEffect } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  // DirectionsService,
  DirectionsRenderer,
  // PlacesService,
  InfoWindow,
} from "@react-google-maps/api";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./PreviewTripMap.css";
import exportedData from "./exportedData.json";
import { SkeletonText, calc } from "@chakra-ui/react";

export default function PreviewTripMap(textas) {
  // const [mapData, setMapData] = useState([]);
  const centerPoint = { lat: 54.8985, lng: 23.9036 };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyClg0_pq0WTqIRVmRI10U2pQPZv7f5dQXQ", // "AIzaSyAiB_hv59Hb5MQol934V0jK-t9CVbc2JGY", //AIzaSyClg0_pq0WTqIRVmRI10U2pQPZv7f5dQXQ //process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["geometry", "places"],
  });
  const google = window.google;
  const [map, setMap] = React.useState(null);

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [directionsRendererKey, setDirectionsRendererKey] = useState(1);

  const [error, setError] = useState(null);
  useEffect(() => {
    console.log("useEffect");
    testas();
  }, []);
  // const onMapLoad = React.useCallback((map) => {
  //   setMap(map);
  //   console.log("onMapLoad");
  //   testas();
  // }, []);
  const onMapLoad = (map) => {
    setMap(map);
    console.log("onMapLoad");
    testas();
  };
  async function testas() {
    try {
      if (isLoaded) {
        const data = exportedData;
        console.log("data", data);
        if (data.origin === "" || data.destination === "") {
          return;
        }
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService();
        console.log("directionsService", directionsService);
        const results = await directionsService.route({
          origin: data.origin[0],
          waypoints: data.midWaypoints,
          destination: data.destiantion[0],
          provideRouteAlternatives: true,
          // eslint-disable-next-line no-undef
          travelMode: "DRIVING",
        });
        setDirectionsResponse(results);
        setIsPageLoaded(true);
        reloadDirectionsRenderer();
      }
    } catch (error) {
      console.log(error);
      setError("Failed to load.");
    }
  }
  // window.onload = async function () {
  //   const data = exportedData;
  //   if (data.origin === "" || data.destination === "") {
  //     return;
  //   }

  //   console.log("directionsService");
  //   console.log("data.origin", data.midWaypoints);
  //   // eslint-disable-next-line no-undef
  //   const directionsService = new google.maps.DirectionsService();
  //   console.log("directionsService", directionsService);
  //   const results = await directionsService.route({
  //     origin: data.origin[0],
  //     waypoints: data.midWaypoints,
  //     destination: data.destiantion[0],
  //     provideRouteAlternatives: true,
  //     // eslint-disable-next-line no-undef
  //     travelMode: "DRIVING",
  //   });
  //   setDirectionsResponse(results);
  //   setIsPageLoaded(true);
  //   reloadDirectionsRenderer();
  //   // }
  // };
  const reloadDirectionsRenderer = () => {
    setDirectionsRendererKey((prevKey) => prevKey + 1);
  };
  const directionsRendererCallback = (response) => {
    if (response !== null) {
    }
  };

  const location = useLocation();
  if (!isLoaded) {
    return <SkeletonText />;
  }
  return (
    <>
      <div>
        {!isPageLoaded && (
          <div>
            <p>Error</p>
            <p>{location.state.message}</p>
          </div>
        )}

        {/* {isPageLoaded && ( */}
        <GoogleMap
          center={centerPoint}
          zoom={7}
          mapContainerClassName="only-map-container"
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={onMapLoad}
        >
          {/* {
          (placesState === true && console.log("places--------------------------", places),
          places.map(
            // console.log("places--------------------------", place),
            (place) =>
              place.map((x) => (
                <Marker key={x.place_id} position={x.geometry.location} />
                // console.log("places--------------------------", place)
              ))
          ))
          } */}
          {directionsResponse && (
            <DirectionsRenderer
              key={directionsRendererKey}
              directions={directionsResponse}
              options={{ suppressMarkers: false, draggable: false }}
              onLoad={directionsRendererCallback}
            />
          )}
        </GoogleMap>
        {/* )}\
         */}
      </div>
    </>
  );
}
