import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
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

import { Button, ButtonGroup, IconButton, SkeletonText, Textarea } from "@chakra-ui/react";

import { MdDataSaverOn } from "react-icons/md";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./PrivateRoutePreview.css";
export default function PrivateRoutePreview(textas) {
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
  const [allImagesUrlsForRoute, setAllImagesUrlsForRoute] = useState([]);
  const [pointDescriptionValue, setPointDescriptionValue] = useState(null);
  const [allMapPlaces, setAllMapPlaces] = useState([]);

  //---click on map

  const [markerPosition, setMarkerPosition] = useState(null);
  const [additionalMarkersOnEdit, setAdditionalMarkersOnEdit] = useState([]); // visi sitie i setAllAdditionalMarkersOnEdit
  const [allAdditionalMarkersOnEdit, setAllAdditionalMarkersOnEdit] = useState(
    Array.from({ length: 10 })
  ); // array is setAdditionalMarkersOnEdit
  const [allAdditionalMarkersPosition, setAllAdditionalMarkersPosition] = useState([]); // DB
  //
  //
  //
  const [choosenRouteMarkForAdditionalTable, setChoosenRouteMarkForAdditionalTable] = useState([]);
  //----
  const settings = {
    // className: "preview-images-container", // gadina uzkrovima
    dots: true,
    dotsClass: "slick-dots",
    accessibility: true,
    adaptiveHeight: false,
    infinite: true,
    speed: 500,
    // autoplay: false,
    // autoplaySpeed: 3000,
    centerMode: true,
    slidesToShow: 1,
    initialSlide: 1,
    slidesToScroll: 1,
    slide: "div",
  };
  const [error, setError] = useState(null);
  useEffect(() => {
    console.log("useEffect");
    console.log("location.state.message", location.state.message);
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
          GetImagesUrlsFromDatabase();
        });
    }
    GetMidWaypointsFromDatabase();
  }, []);

  // .post(
  //   "http://localhost:5113/api/troutesprivate",
  //   {
  //     rname: "My trip to Italy",
  //     rOrigin: exportData.origin,
  //     rDestination: exportData.destiantion,
  //     midWaypoints: exportData.midWaypoints,
  //     sectionDescriptions: sectionDescForDB,
  //     pointDescriptions: pointDescForDB,
  //     rCountry: "Italy",
  //     rImagesUrl:
  //       "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fHRyYXZlbHxlbnwwfHwwfHw%3D&w=1000&q=80",
  //     rRecommendationUrl: "https://www.google.com/",
  //   },
  //   { headers }
  // )

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
  async function GetImagesUrlsFromDatabase() {
    console.log("GetImagesUrlsFromDatabase");
    axios
      .get(
        "http://localhost:5113/api/troutesprivate/" + location.state.message.routeId + "/imageurl"
      )
      .then((resp) => {
        console.log("-----------------------------------------", resp.data);
        const imagesUrlsFromDB = [];
        resp.data.map((item) => {
          if (item.current === null) {
            return item;
          } else {
            imagesUrlsFromDB.push({
              image_url: item.rImagesUrlLink,
            });
            return item;
          }
        });
        console.log("GetImagesUrlsFromDatabase: ", imagesUrlsFromDB);
        setAllImagesUrlsForRoute(imagesUrlsFromDB);
        // setIsPageContentLoaded(true);
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
    setChoosenRouteMarkForAdditionalTable(item.pointOnRouteId);
  };
  //-----

  const handleMapClick = (event) => {
    setMarkerPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    console.log("event.latLng.lat() : ", event.latLng.lat());
    console.log("event.latLng.lat() : ", event.latLng.lng());
  };
  const handleSaveNewExtraCoords = (event) => {
    console.log("handleSaveNewExtraCoords", markerPosition);
    console.log(additionalMarkersOnEdit.length);
    if (additionalMarkersOnEdit.length == 5 || additionalMarkersOnEdit.length > 5) {
      console.log("Max amount of extra marks");

      console.log("1-additionalMarkersOnEdit", additionalMarkersOnEdit);
    } else if (additionalMarkersOnEdit.length < 5) {
      setAdditionalMarkersOnEdit((prevPositions) => [
        ...prevPositions,
        { lat: markerPosition.lat, lng: markerPosition.lng },
      ]);
      console.log("2-additionalMarkersOnEdit", additionalMarkersOnEdit);
    }
  };
  const targetExtraPointOnMap = (item) => (event) => {
    const centerPoint = {
      lat: item.lat,
      lng: item.lng,
    };
    setCenterByPoint(centerPoint);
    setZoomByPoint(9);
    // setPointDescriptionValue(item.routePointDescription);
  };
  // const saveAdditionalMarkers = () => {
  //   console.log("saveAdditionalMarkers");
  //   setAllAdditionalMarkersOnEdit((prevPositions) => [
  //     ...prevPositions,
  //     additionalMarkersOnEdit,
  //     // { id: choosenRouteMarkForAdditionalTable, additionalMarkersOnEdit },
  //   ]);

  //   console.log("-----", allAdditionalMarkersOnEdit);
  // };

  const saveAdditionalMarkers = () => {
    console.log("saveAdditionalMarkers");
    setAllAdditionalMarkersOnEdit((prevArray) => {
      if (allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable] != null) {
        const updatedArray = [...prevArray];
        updatedArray[choosenRouteMarkForAdditionalTable] = additionalMarkersOnEdit;
        return updatedArray;
      } else if (allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable] == undefined) {
        const updatedArray = [...prevArray];
        updatedArray[choosenRouteMarkForAdditionalTable] = additionalMarkersOnEdit;
        return updatedArray;
      } else {
        return [...prevArray, additionalMarkersOnEdit];
      }
    });
    setAdditionalMarkersOnEdit([]);
    console.log("-----", allAdditionalMarkersOnEdit);
  };
  // const saveAdditionalMarkers = () => {
  //   console.log("saveAdditionalMarkers");
  //   setAllAdditionalMarkersOnEdit((prevPositions) => {
  //     // const itemIndex = prevPositions.findIndex(
  //     //   (item) => (
  //     //     console.log("item", item),
  //     //     console.log("item.id", item.id),
  //     //     item.id === choosenRouteMarkForAdditionalTable
  //     //   )
  //     // );
  //     // console.log("itemIndex:", itemIndex);
  //     if (allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable] != null) {
  //       console.log("!= null");

  //       allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable] = {
  //         additionalMarkersOnEdit,
  //       };

  //       // // Overwrite the existing item with the same id
  //       // const updatedPositions = [...prevPositions];
  //       // updatedPositions[choosenRouteMarkForAdditionalTable] = {
  //       //   // id: choosenRouteMarkForAdditionalTable,
  //       //   additionalMarkersOnEdit,
  //       // };
  //       return allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable];
  //     } else {
  //       // Add the new item to the array
  //       return [
  //         ...prevPositions,
  //         additionalMarkersOnEdit,
  //         // { id: choosenRouteMarkForAdditionalTable, ...additionalMarkersOnEdit },
  //       ];
  //     }
  //   });
  //   setAdditionalMarkersOnEdit([]);
  //   console.log("-----", allAdditionalMarkersOnEdit);
  // };
  //-----
  const location = useLocation();
  if (!isLoaded) {
    return <SkeletonText />;
  }
  return (
    // <div className="preview-container">
    //   <h1>Pavadinimas</h1>
    //   <div className="preview-container-main">
    //     <div className="private-container-main-left">ddddd</div>
    //     <div className="preview-container-main-right">sssss</div>
    //   </div>
    // </div>

    <div className="preview-container">
      {!isPageLoaded && (
        <div>
          <p>Error</p>
          <p>{location.state.message.routeId}</p>
        </div>
      )}
      <h1
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          color: "rgba(223,99,39,255)",
        }}
      >
        {location.state.message.rName}
      </h1>
      <div className="publish-button">
        <button onClick={saveAdditionalMarkers}>Save markers DB</button>
        <button>Publish</button>
      </div>
      <div className="preview-container-main">
        <div className="private-container-main-left">
          <div className="private-container-main-left top">
            <h1>{location.state.message.rCountry}</h1>
          </div>
          <div className="private-container-main-left buttons">
            {allRoutePointsDescriptions.map((item) => (
              <button onClick={changeTextAreaValueByPoint(item)}>{item.pointOnRouteId}</button>
            ))}
          </div>
          <textarea
            className="private-container-main-left"
            // rows="4"
            // cols="20"
            placeholder="There is no content!"
            value={pointDescriptionValue}
            readOnly
          />
          <div
            style={{
              position: "absolute",
              bottom: "0px",
              textAlign: "center",
              // margin: "auto",
              width: "100%",
            }}
          >
            <h3>Recommendations</h3>
            <p>{location.state.message.rRecommendationUrl}</p>
          </div>
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
              onClick={handleMapClick}
            >
              {markerPosition && <Marker position={markerPosition} />}
              {console.log("markerPosition", markerPosition)}
              {allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable] &&
                allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable].map((item) => (
                  <Marker position={{ lat: item.lat, lng: item.lng }} />
                ))}
              {/* {additionalMarkersOnEdit &&
                additionalMarkersOnEdit.map((item) => (
                  <Marker position={{ lat: item.lat, lng: item.lng }} />
                ))} */}
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
          <div className="float-over-map">
            {markerPosition && (
              <>
                <p>Latitude: {markerPosition.lat}</p>
                <p>Longtitude: {markerPosition.lat}</p>
                <MdDataSaverOn
                  size={50}
                  className="float-over-map-MdDataSaverOn"
                  onClick={() => handleSaveNewExtraCoords()}
                />
              </>
            )}
          </div>
        </div>

        <div style={{ display: "block" }} className="private-container-main-left additional-table">
          <div className="private-container-main-left top">
            <h1>{location.state.message.rName}</h1>
          </div>
          <div className="private-container-main-left buttons">
            {console.log("choosenRouteMarkForAdditionalTable", choosenRouteMarkForAdditionalTable)}
            {console.log("allAdditionalMarkersOnEdit", allAdditionalMarkersOnEdit)}
            {console.log(
              "allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable]",
              allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable]
            )}
            {allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable] &&
              allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable].map((itemA, i) => (
                <button onClick={targetExtraPointOnMap(itemA)} key={i}>
                  {i}
                </button>
              ))}
          </div>
          <textarea
            rows="4"
            cols="50"
            placeholder="There is no content!"
            value={pointDescriptionValue}
            readOnly
          />
          {additionalMarkersOnEdit &&
            additionalMarkersOnEdit.map((item, i) => (
              <p key={i}>
                {item.lat} - {item.lng}
              </p>
            ))}
          {additionalMarkersOnEdit && (
            <button className="additional-markers-button" onClick={saveAdditionalMarkers}>
              Save markers - local
            </button>
          )}
        </div>
      </div>
      {/* IMAGES */}
      {/* {console.log("location.state.message.rImagesUrl:", location.state.message.rImagesUrl)}
      <div className="preview-images-container"> 
      {console.log("allImagesUrlsForRoute++++++++++", allImagesUrlsForRoute)} */}
      {allImagesUrlsForRoute && (
        <div className="preview-images-container">
          <Slider {...settings}>
            {allImagesUrlsForRoute.map((image, i) => (
              <div key={i}>
                {console.log("i++++++++++", i)}
                {console.log("image_url++++++++++", image.image_url)}
                <img
                  style={{ display: "block", margin: "auto" }}
                  src={image.image_url}
                  alt={`Slide ${i}`}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
      {/* <Slideshow images={images} /> */}
      {/* </div> */}
      {/* {allImagesUrlsForRoute &&
        allImagesUrlsForRoute.map((item) => (
          <img
            className="preview-images-container"
            src={item.image_url}
            alt="Trip Images"
            height={600}
          ></img>
        ))} */}
    </div>
  );
}
