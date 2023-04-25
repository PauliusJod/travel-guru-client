import React, { useState, useEffect } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  // placesService,
  InfoWindow,
  Geocoder,
} from "@react-google-maps/api";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./PreviewTripMap.css";
import { SkeletonText, calc, flexbox } from "@chakra-ui/react";

export default function PreviewTripMap(textas) {
  const centerPoint = { lat: 54.8985, lng: 23.9036 };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyClg0_pq0WTqIRVmRI10U2pQPZv7f5dQXQ", // "AIzaSyAiB_hv59Hb5MQol934V0jK-t9CVbc2JGY", //AIzaSyClg0_pq0WTqIRVmRI10U2pQPZv7f5dQXQ //process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["geometry", "places"],
  });
  const google = window.google;
  const [map, setMap] = React.useState(null);

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [centerByPoint, setCenterByPoint] = useState(null);
  const [zoomByPoint, setZoomByPoint] = useState(null);

  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isPageContentLoaded, setIsPageContentLoaded] = useState(false);
  const [directionsRendererKey, setDirectionsRendererKey] = useState(1);

  const [allRouteMidWaypoints, setAllRouteMidWaypoints] = useState(null);
  const [allRouteSectionsDescriptions, setAllRouteSectionsDescriptions] = useState(null);
  const [allRoutePointsDescriptions, setAllRoutePointsDescriptions] = useState([]);
  const [pointDescriptionValue, setPointDescriptionValue] = useState(null);
  const [allMapPlaces, setAllMapPlaces] = useState([]);

  const [error, setError] = useState(null);
  useEffect(() => {
    console.log("useEffect");
    async function GetMidWaypointsFromDatabase() {
      console.log("aaa");
      axios
        .get(
          "http://localhost:5113/api/troutesprivate/" +
            location.state.message.routeId +
            "/midwaypoints"
        )
        .then((resp) => {
          const midwaypointsFromDB = [];
          resp.data.map((item) => {
            if (item.current === null) {
              return item;
            } else {
              midwaypointsFromDB.push({
                location: item.midWaypointLocation,
                stopover: item.midWaypointStopover,
              });
              return item;
            }
          });
          setAllRouteMidWaypoints(midwaypointsFromDB);
          setIsPageContentLoaded(true);
          GetPointsDescFromDatabase();
        });
    }
    GetMidWaypointsFromDatabase();
  }, []);
  async function GetPointsDescFromDatabase() {
    console.log("GetPointsDescFromDatabase");
    axios
      .get(
        "http://localhost:5113/api/troutesprivate/" +
          location.state.message.routeId +
          "/routepoints"
      )
      .then((resp) => {
        const pointsDescFromDB = [];
        resp.data.map((item) => {
          if (item.current === null) {
            return item;
          } else {
            pointsDescFromDB.push({
              pointOnRouteId: item.pointOnRouteId,
              routePointDescription: item.routePointDescription,
            });
            return item;
          }
        });
        console.log("GetPointsDescFromDatabase: ", pointsDescFromDB);
        setAllRoutePointsDescriptions(pointsDescFromDB);
        setIsPageContentLoaded(true);
      });
  }
  const onMapLoad = (map) => {
    setMap(map);
    testas();
  };
  async function getMapPointsPlacesIds(results) {
    //Setup all marked places ids
    console.log("results", results);
    const allMapPlaces = [];
    results.geocoded_waypoints.map((item) => {
      if (item === null) {
        return item;
      } else {
        allMapPlaces.push({
          place_id: item.place_id,
        });
        return item;
      }
    });
    console.log("allMapPlaces", allMapPlaces);
    getAllMapPointsLocations(allMapPlaces);
  }
  async function getAllMapPointsLocations(allMapPlaces) {
    const geocoder = new google.maps.Geocoder();
    const promises = [];

    for (let i = 0; i < allMapPlaces.length; i++) {
      const promise = new Promise((resolve, reject) => {
        geocoder.geocode({ placeId: allMapPlaces[i].place_id }, (results, status) => {
          if (status === "OK") {
            resolve({
              point_Place_Id: allMapPlaces[i].place_id,
              point_Location_X: results[0].geometry.location.lat(),
              point_Location_Y: results[0].geometry.location.lng(),
            });
          } else {
            reject(new Error("Geocode failed due to: " + status));
          }
        });
      });

      promises.push(promise);
    }

    const allMapPlacesLocations = await Promise.all(promises);

    setAllMapPlaces(allMapPlacesLocations);
  }

  async function testas() {
    try {
      if (isLoaded) {
        const data = location.state.message;
        if (data.origin === "" || data.destination === "") {
          return;
        }
        console.log("allRouteMidWaypoints---", allRouteMidWaypoints);
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService();
        console.log("directionsService", directionsService);
        const results = await directionsService.route({
          origin: data.rOrigin,
          waypoints: allRouteMidWaypoints,
          destination: data.rDestination,
          provideRouteAlternatives: true,
          // eslint-disable-next-line no-undef
          travelMode: "DRIVING",
        });
        setDirectionsResponse(results);
        getMapPointsPlacesIds(results);
        setIsPageLoaded(true);
        reloadDirectionsRenderer();
      }
    } catch (error) {
      console.log(error);
      setError("Failed to load.");
    }
  }
  const reloadDirectionsRenderer = () => {
    setDirectionsRendererKey((prevKey) => prevKey + 1);
  };
  const directionsRendererCallback = (response) => {
    if (response !== null) {
    }
  };
  const changeTextAreaValueByPoint = (item) => (event) => {
    console.log("allMapPlaces", allMapPlaces);
    const centerPoint = {
      lat: allMapPlaces[item.pointOnRouteId].point_Location_X,
      lng: allMapPlaces[item.pointOnRouteId].point_Location_Y,
    };
    console.log(item.pointOnRouteId);
    // map.setCenter(centerPoint);
    // const geocoder = new google.maps.Geocoder();
    // geocoder.geocode({}).then(({}) => {
    //   map.setZoom(11);
    //   map.setCenter(centerPoint);
    // });

    // console.log("item.geometry.location", allMapPlacesIds);
    console.log("item", item);
    setCenterByPoint(centerPoint);
    setZoomByPoint(11);
    setPointDescriptionValue(item.routePointDescription);
  };
  const location = useLocation();
  if (!isLoaded) {
    return <SkeletonText />;
  }
  return (
    // <div className="preview-container">
    //   <h1>Pavadinimas</h1>
    //   <div className="preview-container-main">
    //     <div className="preview-container-main-left">ddddd</div>
    //     <div className="preview-container-main-right">sssss</div>
    //   </div>
    // </div>

    <div className="preview-container">
      {!isPageLoaded && (
        <div>
          <p>Error</p>
          <p>{location.state.message.routeId}</p>
        </div>
      )}{" "}
      <h1 style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        {location.state.message.routeId}
      </h1>
      <div className="preview-container-main">
        <div className="preview-container-main-left">
          <div className="preview-container-main-left top">
            <h1>{location.state.message.routeId}</h1>
          </div>
          <div className="preview-container-main-left buttons">
            {allRoutePointsDescriptions.map((item) => (
              <button onClick={changeTextAreaValueByPoint(item)}>{item.pointOnRouteId}</button>
            ))}
          </div>
          <textarea
            rows="4"
            cols="50"
            placeholder="There is no content!"
            value={pointDescriptionValue}
            readOnly
          />
        </div>
        <div className="preview-container-main-right">
          {isPageContentLoaded && (
            <GoogleMap
              center={centerByPoint || centerPoint}
              zoom={zoomByPoint || 9}
              mapContainerClassName="preview-map-container"
              options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
              onLoad={onMapLoad}
            >
              {directionsResponse && (
                <DirectionsRenderer
                  key={directionsRendererKey}
                  directions={directionsResponse}
                  options={{ suppressMarkers: false, draggable: false }}
                  onLoad={directionsRendererCallback}
                />
              )}
            </GoogleMap>
          )}
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
