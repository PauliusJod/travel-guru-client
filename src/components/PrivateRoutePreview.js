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

import { RiDeleteBackFill } from "react-icons/ri";
import { CiSaveDown1 } from "react-icons/ci";
import { MdDataSaverOn } from "react-icons/md";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import jwt_decode from "jwt-decode";
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

  //SET on AXIOS GET
  const [allRouteMidWaypoints, setAllRouteMidWaypoints] = useState(null);
  // const [allRouteSectionsDescriptions, setAllRouteSectionsDescriptions] = useState(null);
  const [allRoutePointsDescriptions, setAllRoutePointsDescriptions] = useState([]);
  const [additionalPointsFromDB, setAdditionalPointsFromDB] = useState([]);
  const [allImagesUrlsForRoute, setAllImagesUrlsForRoute] = useState([]);
  const [allRecommendationsUrlsForRoute, setAllRecommendationsUrlsForRoute] = useState([]);
  //SET on AXIOS GET -----------------------------------------------------------------------
  //SET local handlers+++++++++++++++++++++++++++++++
  const [newRecommendationTextURL, setNewRecommendationTextURL] = useState("");
  //SET local handlers+++++++++++++++++++++++++++++++

  const [pointDescriptionValue, setPointDescriptionValue] = useState(null);

  const [allMapPlaces, setAllMapPlaces] = useState([]);
  //---click on map setPointIdIsEditing
  const [markerPosition, setMarkerPosition] = useState(null);
  const [additionalMarkerDescription, setAdditionalMarkerDescription] = useState("");
  const [toggleAdditionalButton, setToggleAdditionalButton] = useState(false);
  const [pointIdIsEditing, setPointIdIsEditing] = useState(null);
  const [additionalMarkersOnEdit, setAdditionalMarkersOnEdit] = useState([]); // visi sitie i setAllAdditionalMarkersOnEdit
  const [allAdditionalMarkersOnEdit, setAllAdditionalMarkersOnEdit] = useState(
    Array.from({ length: 10 })
  ); // array is setAdditionalMarkersOnEdit
  const [allAdditionalMarkersForDB, setAllAdditionalMarkersForDB] = useState([]); // DB
  //
  //
  //
  const [choosenRouteMarkForAdditionalTable, setChoosenRouteMarkForAdditionalTable] =
    useState(null);
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
    console.log("allAdditionalMarkersOnEdit", allAdditionalMarkersOnEdit);
    // console.log("location.state.message", location.state.message);
    async function GetMidWaypointsFromDatabase() {
      // console.log("aaa");
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
          GetAdditionalPointsFromDatabase();
          GetRecommendationsUrlsFromDatabase();
        });
    }
    GetMidWaypointsFromDatabase();
  }, []);
  useEffect(() => {
    if (allAdditionalMarkersForDB) {
      console.log("5555555555555555555", allAdditionalMarkersForDB);
      updateRouteToDB(allAdditionalMarkersForDB);
    }
  }, [allAdditionalMarkersForDB]);
  useEffect(() => {
    if (additionalPointsFromDB && allRoutePointsDescriptions) {
      testasaa();
    }
  }, [additionalPointsFromDB, allRoutePointsDescriptions]);

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
    // console.log("GetPointsDescFromDatabase");
    axios
      .get(
        "http://localhost:5113/api/troutesprivate/" +
          location.state.message.routeId +
          "/routepoints"
      )
      .then((resp) => {
        // console.log("resp.data", resp.data);
        const pointsDescFromDB = [];
        resp.data.map((item) => {
          if (item.current === null) {
            return item;
          } else {
            pointsDescFromDB.push({
              pointId: item.pointId,
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
    // console.log("GetImagesUrlsFromDatabase");
    axios
      .get(
        "http://localhost:5113/api/troutesprivate/" + location.state.message.routeId + "/imageurl"
      )
      .then((resp) => {
        // console.log("-----------------------------------------", resp.data);
        const imagesUrlsFromDB = [];
        resp.data.map((item) => {
          if (item.current === null) {
            return item;
          } else {
            imagesUrlsFromDB.push({
              rImagesUrlLink: item.rImagesUrlLink,
            });
            return item;
          }
        });
        // console.log("GetImagesUrlsFromDatabase: ", imagesUrlsFromDB);
        setAllImagesUrlsForRoute(imagesUrlsFromDB);
        // setIsPageContentLoaded(true);
      });
  }
  async function GetRecommendationsUrlsFromDatabase() {
    axios
      .get(
        "http://localhost:5113/api/troutesprivate/" +
          location.state.message.routeId +
          "/recommendationurl"
      )
      .then((resp) => {
        console.log("recommendations: ", resp.data);
        const recommendationsUrlsFromDB = [];
        resp.data.map((item) => {
          if (item.current === null) {
            return item;
          } else {
            recommendationsUrlsFromDB.push({
              rRecommendationUrlId: item.rRecommendationUrlId,
              rRecommendationUrlLink: item.rRecommendationUrlLink,
              tRoutePrivaterouteId: item.tRoutePrivaterouteId,
            });
            return item;
          }
        });
        setAllRecommendationsUrlsForRoute(recommendationsUrlsFromDB);
        // setIsPageContentLoaded(true);
      });
  }
  async function GetAdditionalPointsFromDatabase() {
    axios
      .get(
        "http://localhost:5113/api/troutesprivate/" +
          location.state.message.routeId +
          "/additionalpoints"
      )
      .then((resp) => {
        const additionalPointsFromDBTemp = [];
        console.log(resp.data);
        resp.data.map((item) => {
          if (item.current === null) {
            return item;
          } else {
            //pointId: pointIdIsEditing, desc: "", lat: markerPosition.lat, lng: markerPosition.lng
            additionalPointsFromDBTemp.push({
              pointId: item.troutePointDescriptionpointId,
              desc: item.additionalPointInformation,
              lat: item.additionalPointCoordX,
              lng: item.additionalPointCoordY,
            });
            return item;
          }
        });
        setAdditionalPointsFromDB(additionalPointsFromDBTemp);
        console.log("+++++++++++++++", additionalPointsFromDBTemp);
      })
      .catch((err) => console.log("err", err));
  }
  const testasaa = () => {
    // pointsDescFromDB pointOnRouteId =choosen.. pointId == pointId(additional)        setAllRoutePointsDescriptions
    // additionalPointsFromDB     additionalPointsFromDB
    //saveAdditionalMarkers();
    console.log("00000000000000", allRoutePointsDescriptions);
    console.log("88888888888888888", additionalPointsFromDB);

    for (let i = 0; i < allRoutePointsDescriptions.length; i++) {
      const oneRoutePointAllMarkers = [];
      for (let j = 0; j < additionalPointsFromDB.length; j++) {
        const element2 = additionalPointsFromDB[j];

        if (allRoutePointsDescriptions[i].pointId == element2.pointId) {
          oneRoutePointAllMarkers.push({
            pointId: element2.pointId,
            desc: element2.desc,
            lat: element2.lat,
            lng: element2.lng,
          });
          // break;
        } else {
          // break;
        }
        // setAdditionalMarkersOnEdit((prevPositions) => [
        //   ...prevPositions,
        //   { pointId: element2.pointId, desc: element2.desc, lat: element2.lat, lng: element2.lng }, // desc: "aa", STRUCTURE
        // ]);
      }
      console.log("++++++++++++++++++++++++", oneRoutePointAllMarkers);
      saveAdditionalMarkersextra(i, oneRoutePointAllMarkers);
    }

    // setAllAdditionalMarkersOnEdit((prevArray) => {

    //   for (let i = 0; i < allRoutePointsDescriptions.length; i++) {
    //     // const element = allRoutePointsDescriptions[i];
    //     for (let j = 0; j < additionalPointsFromDB.length; j++) {
    //       const element2 = additionalPointsFromDB[j];
    //       if (element2.pointId == allRoutePointsDescriptions[i].pointId) {
    //         if (allAdditionalMarkersOnEdit[element.pointOnRouteId] != null) {
    //           const updatedArray = [...prevArray];
    //           updatedArray[element.pointOnRouteId] = {
    //             pointId: element2.pointId,
    //             desc: element2.desc,
    //             lat: element2.lat,
    //             lng: element2.lng,
    //           }; //additionalPointsFromDB
    //           return updatedArray;
    //         } else if (allAdditionalMarkersOnEdit[element.pointOnRouteId] == undefined) {
    //           const updatedArray = [...prevArray];
    //           updatedArray[element.pointOnRouteId] = {
    //             pointId: element2.pointId,
    //             desc: element2.desc,
    //             lat: element2.lat,
    //             lng: element2.lng,
    //           }; //additionalPointsFromDB
    //           return updatedArray;
    //         } else {
    //           return [
    //             ...prevArray,
    //             {
    //               pointId: element2.pointId,
    //               desc: element2.desc,
    //               lat: element2.lat,
    //               lng: element2.lng,
    //             },
    //           ]; //additionalPointsFromDB
    //         }
    //       } else {
    //         // continue;
    //       }
    //     }
    //   }
    // });
  };

  const onMapLoad = (map) => {
    setMap(map);
    testas();
  };
  async function getMapPointsPlacesIds(results) {
    //Setup all marked places ids
    // console.log("results", results);
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
    // console.log("allMapPlaces", allMapPlaces);
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
        // console.log("allRouteMidWaypoints---", allRouteMidWaypoints);
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService();
        // console.log("directionsService", directionsService);
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
      // console.log(error);
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
    const centerPoint = {
      lat: allMapPlaces[item.pointOnRouteId].point_Location_X,
      lng: allMapPlaces[item.pointOnRouteId].point_Location_Y,
    };

    setCenterByPoint(centerPoint);
    setZoomByPoint(11);
    setPointDescriptionValue(item.routePointDescription);
    setPointIdIsEditing(item.pointId);
    console.log("aaa", item.routePointDescription);
    setChoosenRouteMarkForAdditionalTable(item.pointOnRouteId);

    console.log("AllAdditionalMarkersOnEdit ", allAdditionalMarkersOnEdit);

    // console.log("choosenRouteMarkForAdditionalTable", choosenRouteMarkForAdditionalTable);
  };
  //-----

  const handleMapClick = (event) => {
    setMarkerPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    // console.log("event.latLng.lat() : ", event.latLng.lat());
    // console.log("event.latLng.lat() : ", event.latLng.lng());
  };
  const handleSaveNewExtraCoords = (event) => {
    if (additionalMarkersOnEdit.length == 5 || additionalMarkersOnEdit.length > 5) {
    } else if (additionalMarkersOnEdit.length < 5) {
      setAdditionalMarkersOnEdit((prevPositions) => [
        ...prevPositions,
        { pointId: pointIdIsEditing, desc: "", lat: markerPosition.lat, lng: markerPosition.lng }, // desc: "aa", STRUCTURE
      ]);
      setToggleAdditionalButton(true);
    }
  };
  const saveNewRecommendationText = (event) => {
    console.log("newRecommendationTextURL", newRecommendationTextURL);
    if (newRecommendationTextURL != null && newRecommendationTextURL != "") {
      if (newRecommendationTextURL.length < 10) {
        console.log("Please insert https link");
      } else {
        axios
          .post(
            "http://localhost:5113/api/troutesprivate/" +
              location.state.message.routeId +
              "/recommendationurl",
            {
              rRecommendationUrlLink: newRecommendationTextURL,
            }
            // { headers }
          )
          .then((response) => {
            const item = response.data; // Assuming the response data is an array with one item
            if (item !== null) {
              setAllRecommendationsUrlsForRoute((prevArray) => {
                const updatedArray = [...prevArray];
                updatedArray[allRecommendationsUrlsForRoute.length] = {
                  rRecommendationUrlId: item.rRecommendationUrlId,
                  rRecommendationUrlLink: item.rRecommendationUrlLink,
                  tRoutePrivaterouteId: item.tRoutePrivaterouteId,
                };
                return updatedArray;
              });
            }
          });
      }
    }
  };

  function handleNewRecommendationText(event) {
    setNewRecommendationTextURL(event.target.value);
  }

  function handleAdditionalMarkerDescription() {
    const val = document.getElementById("add-m-d").value;
    console.log(additionalMarkerDescription.id, "val", val);
    setAdditionalMarkerDescription({ id: additionalMarkerDescription.id, desc: val });
    // allAdditionalMarkersOnEdit[additionalMarkerDescription.id] == val;
    if (
      allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable][additionalMarkerDescription.id]
        .desc != undefined
    ) {
      allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable][
        additionalMarkerDescription.id
      ].desc = val;
    }
    console.log("//////////////////", allAdditionalMarkersOnEdit);
  }
  const targetExtraPointOnMap = (item, id) => (event) => {
    console.log("7777777777777777", item);
    const centerPoint = {
      // desc: additionalMarkerDescription,
      lat: item.lat,
      lng: item.lng,
    };
    setAdditionalMarkerDescription({ id: id, desc: item.desc });
    // console.log("item.desc", item.desc, "-id:", id);
    setCenterByPoint(centerPoint);
    setZoomByPoint(9);
    // console.log("item", item);
    if (item.desc == null && document.getElementById("add-m-d")) {
      console.log("item.desc", item.desc);
      document.getElementById("add-m-d").value = "";
    } else if (document.getElementById("add-m-d")) {
      console.log("item.desc", item.desc);
      document.getElementById("add-m-d").value = item.desc;
    }
  };
  const saveAdditionalMarkersextra = (index, additionalMarkersOnEditextra) => {
    console.log("AllAdditionalMarkersOnEdit", allAdditionalMarkersOnEdit);
    console.log("allAdditionalMarkersOnEdit");
    setAllAdditionalMarkersOnEdit((prevArray) => {
      if (allAdditionalMarkersOnEdit[index] != null) {
        setToggleAdditionalButton(false);
        const updatedArray = [...prevArray];
        updatedArray[index] = additionalMarkersOnEditextra;
        return updatedArray;
      } else if (allAdditionalMarkersOnEdit[index] == undefined) {
        setToggleAdditionalButton(false);
        const updatedArray = [...prevArray];
        updatedArray[index] = additionalMarkersOnEditextra;
        return updatedArray;
      } else {
        return [...prevArray, additionalMarkersOnEditextra];
      }
    });
    console.log("setAllAdditionalMarkersOnEdit: ", allAdditionalMarkersOnEdit);
    setAdditionalMarkersOnEdit([]);
  };
  const saveAdditionalMarkers = () => {
    console.log("AllAdditionalMarkersOnEdit", allAdditionalMarkersOnEdit);
    setAllAdditionalMarkersOnEdit((prevArray) => {
      if (allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable] != null) {
        setToggleAdditionalButton(false);
        const updatedArray = [...prevArray];
        updatedArray[choosenRouteMarkForAdditionalTable] = additionalMarkersOnEdit;
        return updatedArray;
      } else if (allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable] == undefined) {
        setToggleAdditionalButton(false);
        const updatedArray = [...prevArray];
        updatedArray[choosenRouteMarkForAdditionalTable] = additionalMarkersOnEdit;
        return updatedArray;
      } else {
        return [...prevArray, additionalMarkersOnEdit];
      }
    });
    console.log("setAllAdditionalMarkersOnEdit: ", allAdditionalMarkersOnEdit);
    setAdditionalMarkersOnEdit([]);
  };
  const removeRecommendationLocal = (id, recommendation_id_db, recommendation_routeid_db) => {
    console.log("allRecommendationsUrlsForRoute", allRecommendationsUrlsForRoute);
    console.log("id", id);
    axios
      .delete(
        "http://localhost:5113/api/troutesprivate/" +
          location.state.message.routeId +
          "/recommendationurl/" +
          recommendation_id_db
      )
      .then((response) => {
        console.log(response.data); // Log response data if the request was successful
      })
      .catch((error) => {
        console.log(error); // Log error if the request was unsuccessful
      });
    const newArray = [...allRecommendationsUrlsForRoute];
    newArray.splice(id, 1);

    setAllRecommendationsUrlsForRoute(newArray);
  };
  const SaveAllChangesToDB = () => {
    console.log(
      "******************allAdditionalMarkersOnEdit****************",
      allAdditionalMarkersOnEdit
    );

    if (!allAdditionalMarkersOnEdit) {
      console.log("allAdditionalMarkersOnEdit is undefined or null");
      return;
    }
    const extra = allAdditionalMarkersOnEdit.map((item, index) =>
      item
        ? item.map((itemB, j) => {
            if (!itemB) {
              console.log("---");
              return null; // or handle the null case as needed
            }
            return {
              additionalPointRouteId: location.state.message.routeId,
              additionalPointIdInList: j,
              additionalPointCoordX: itemB.lat,
              additionalPointCoordY: itemB.lng,
              additionalPointInformation: itemB.desc,
              TroutePointDescriptionpointId: itemB.pointId, //pointIdIsEditing, // BLOGAI
              // TroutePointDescriptionpointId: index,
            };
          })
        : []
    );
    console.log("extra", extra);
    setAllAdditionalMarkersForDB(extra);
  };
  function updateRouteToDB() {
    console.log("DB");
    // console.log("++++allAdditionalMarkersOnEdit", allAdditionalMarkersOnEdit);
    const user = JSON.parse(localStorage.getItem("user"));
    const userInfo = jwt_decode(user.accessToken);
    const data = location.state.message;
    console.log(data);
    console.log("allRoutePointsDescriptions-----", allRoutePointsDescriptions);
    console.log("++++++++allRecommendationsUrlsForRoute-----", allRecommendationsUrlsForRoute);
    axios
      .put("http://localhost:5113/api/troutesprivate/" + location.state.message.routeId, {
        rOrigin: data.rOrigin,
        rDestination: data.rDestination,
        rCountry: "LT", //data.rCountry,
        rImagesUrl: allImagesUrlsForRoute,
        rRecommendationUrl: allRecommendationsUrlsForRoute,
        midWaypoints: allRouteMidWaypoints,
        pointDescriptions: allRoutePointsDescriptions,
        additionalMarkers: allAdditionalMarkersForDB, // update in useEffect
        UserId: userInfo.sub,
      })
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((err) => console.log("err", err));

    // console.log("allRouteMidWaypoints", allRouteMidWaypoints);
    // console.log("allRoutePointsDescriptions", allRoutePointsDescriptions);
    // console.log("allAdditionalMarkersOnEdit", allAdditionalMarkersOnEdit);
    // console.log("allImagesUrlsForRoute", allImagesUrlsForRoute);
    // console.log("allRecommendationsUrlsForRoute", allRecommendationsUrlsForRoute);
    console.log("location.state.message", location.state.message.routeId);
  }

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
        {/* TODO */}
        {/* <button onClick={updateRouteToDB}>Save markers DB</button> */}
        <button onClick={SaveAllChangesToDB}>Save changes</button>

        <button>Publish</button>
      </div>
      <div className="preview-container-main">
        <div className="private-container-main-left">
          <div className="private-container-main-left top">
            <h1>{location.state.message.rCountry}</h1>
          </div>
          {allRoutePointsDescriptions.length > 5 && (
            <div className="private-container-main-left buttons">
              <div style={{ display: "block" }}>
                {allRoutePointsDescriptions.map((item, indexas) => (
                  <>
                    <button onClick={changeTextAreaValueByPoint(item)}>
                      {/* {item.pointOnRouteId + 1} */}
                      {item.pointId}
                    </button>
                    {indexas === 4 ? <br /> : null}
                  </>
                ))}
              </div>
            </div>
          )}
          {allRoutePointsDescriptions.length <= 5 && (
            <div className="private-container-main-left buttons">
              {allRoutePointsDescriptions.map((item) => (
                <button onClick={changeTextAreaValueByPoint(item)}>{item.pointId}</button>
              ))}
            </div>
          )}
          <textarea
            className="private-container-main-left"
            id="add-r-p-d"
            rows="4"
            cols="20"
            placeholder="There is no content!"
            value={pointDescriptionValue}
            // defaultValue={""}
            // readOnly
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
            {/* TODO */}
            <h3>Recommendations</h3>
            {allRecommendationsUrlsForRoute && (
              <div style={{ display: "block" }}>
                {allRecommendationsUrlsForRoute.map((recommendation, i) => (
                  <div
                    style={{
                      display: "flex",
                      width: "80%",
                      margin: "auto",
                      justifyContent: "space-around",
                    }}
                    key={i}
                  >
                    <p style={{ margin: "0px 0px 4px" }} alt={`Recommendation ${i}`}>
                      {recommendation.rRecommendationUrlLink}
                    </p>
                    <p className="recommendation-delete">
                      {
                        <RiDeleteBackFill
                          onClick={() =>
                            removeRecommendationLocal(
                              i,
                              recommendation.rRecommendationUrlId,
                              recommendation.tRoutePrivaterouteId
                            )
                          }
                        />
                      }
                    </p>
                  </div>
                ))}
                <input
                  style={{ width: "250px", textAlign: "center" }}
                  type="text"
                  placeholder="Enter recommendation URL"
                  onChange={handleNewRecommendationText}
                ></input>
                <CiSaveDown1
                  size={30}
                  className="styled-CiSaveDown1"
                  onClick={saveNewRecommendationText}
                />
              </div>
            )}
            <p>{location.state.message.rRecommendationUrl}</p>
          </div>
        </div>
        <div className="preview-container-main-right" style={{ margin: "auto" }}>
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
              {/* {console.log("markerPosition", markerPosition)} */}
              {console.log(allAdditionalMarkersOnEdit)}
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
                <p>Latitude: {markerPosition.lat.toFixed(7)}</p>
                <p>Longtitude: {markerPosition.lat.toFixed(7)}</p>
                <MdDataSaverOn
                  size={50}
                  className="float-over-map-MdDataSaverOn"
                  onClick={() => handleSaveNewExtraCoords()}
                />
              </>
            )}
          </div>
        </div>
        {choosenRouteMarkForAdditionalTable != null && (
          <div
            style={{ display: "block" }}
            className="private-container-main-left additional-table"
          >
            <div className="private-container-main-left top">
              <h3>Points manager</h3>
              {/* <h1>{location.state.message.rCountry}</h1> */}
            </div>
            <div className="private-container-main-left buttons">
              {/* {console.log(
                "choosenRouteMarkForAdditionalTable",
                choosenRouteMarkForAdditionalTable
              )}
              {console.log("allAdditionalMarkersOnEdit", allAdditionalMarkersOnEdit)}
              {console.log(
                "allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable]",
                allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable]
              )} */}
              {/* TODO1 */}
              {allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable] &&
                allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable].map((itemA, i) => (
                  <button id="aaaaa" onClick={targetExtraPointOnMap(itemA, i)} key={i}>
                    {i}
                  </button>
                ))}
            </div>
            {additionalMarkerDescription && (
              <div>
                <textarea
                  id="add-m-d"
                  rows="4"
                  cols="50"
                  placeholder="There is no content!"
                  // defaultValue={
                  //   (additionalMarkerDescription.id &&
                  //     allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable][
                  //       additionalMarkerDescription.id
                  //     ].desc != undefined) ||
                  //   ""
                  // }
                  defaultValue={""}
                  onChange={handleAdditionalMarkerDescription}
                ></textarea>
                {/* <button onClick={handleAdditionalMarkerDescription}>Save</button> */}
              </div>
            )}
            {additionalMarkersOnEdit &&
              additionalMarkersOnEdit.map((item, i) => (
                <p key={i}>
                  {item.lat} - {item.lng}
                </p>
              ))}
            {toggleAdditionalButton && ( //!additionalMarkerDescription &&
              <button className="additional-markers-button" onClick={saveAdditionalMarkers}>
                Save markers - local
              </button>
            )}
          </div>
        )}
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
                {/* {console.log("i++++++++++", i)}
                {console.log("image_url++++++++++", image.image_url)} */}
                <img
                  style={{ display: "block", margin: "auto" }}
                  src={image.rImagesUrlLink}
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
