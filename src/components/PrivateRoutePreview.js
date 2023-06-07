import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

import { SkeletonText } from "@chakra-ui/react";

import { GiCheckMark } from "react-icons/gi";
import { TiStarOutline } from "react-icons/ti";
import { RiDeleteBackFill, RiRestaurantLine } from "react-icons/ri";
import { CiSaveDown1 } from "react-icons/ci";
import {
  MdDataSaverOn,
  MdOutlineMuseum,
  MdLocalGasStation,
  MdOutlineMedicalServices,
} from "react-icons/md";
import {
  HiOutlineArrowCircleUp,
  HiOutlineLockOpen,
  HiOutlineLockClosed,
  HiOutlineShoppingCart,
} from "react-icons/hi";

import { GrCircleInformation } from "react-icons/gr";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import jwt_decode from "jwt-decode";
import "./PrivateRoutePreview.css";
export default function PrivateRoutePreview(textas) {
  const centerPoint = { lat: 54.8985, lng: 23.9036 };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAmOOpkKLPbXQ4TnZYJ3xNw868ySAaoylA",
    libraries: ["geometry", "places"],
    utcOffset: -240,
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
  const [allRoutePointsDescriptions, setAllRoutePointsDescriptions] = useState(
    []
  );
  const [additionalPointsFromDB, setAdditionalPointsFromDB] = useState([]);
  const [allImagesUrlsForRoute, setAllImagesUrlsForRoute] = useState([]);
  const [allRecommendationsUrlsForRoute, setAllRecommendationsUrlsForRoute] =
    useState([]);
  const [newRecommendationTextURL, setNewRecommendationTextURL] = useState("");
  const [newRoutePointTextChanges, setNewRoutePointTextChanges] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isValidImageUrl, setIsValidImageUrl] = useState(false);

  const [currentAddPointIdInList, setCurrentAddPointIdInList] = useState(0);
  const [currentPointId, setCurrentPointId] = useState(0);
  const [noMoreAdditionalPoints, setNoMoreAdditionalPoints] = useState(false);

  const [pointDescriptionValue, setPointDescriptionValue] = useState(null);

  const [allMapPlaces, setAllMapPlaces] = useState([]);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [additionalMarkerDescription, setAdditionalMarkerDescription] =
    useState("");
  const [
    additionalMarkerDescriptionDisplay,
    setAdditionalMarkerDescriptionDisplay,
  ] = useState("");
  const [toggleAdditionalButton, setToggleAdditionalButton] = useState(false);
  const [pointIdIsEditing, setPointIdIsEditing] = useState(null);
  const [additionalMarkersOnEdit, setAdditionalMarkersOnEdit] = useState([]);
  const [allAdditionalMarkersOnEdit, setAllAdditionalMarkersOnEdit] = useState(
    Array.from({ length: 10 })
  );
  const [allAdditionalMarkersForDB, setAllAdditionalMarkersForDB] = useState(
    []
  );
  const [
    allPossibleLocationsForAdditionalPoint,
    setAllPossibleLocationsForAdditionalPoint,
  ] = useState([]);

  const [
    choosenRouteMarkForAdditionalTable,
    setChoosenRouteMarkForAdditionalTable,
  ] = useState(null);

  const settings = {
    dots: true,
    dotsClass: "slick-dots",
    accessibility: true,
    adaptiveHeight: false,
    variableWidth: false,
    infinite: true,
    speed: 500,
    centerMode: true,
    slidesToShow: 1,
    initialSlide: 1,
    slidesToScroll: 1,
    slide: "div",
  };

  const [error, setError] = useState(null);
  const [rerenderPage, setRerenderPage] = useState(0);
  useEffect(() => {
    async function GetMidWaypointsFromDatabase() {
      axios
        .get(
          "http://localhost:5113/api/troutes/" +
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
  }, [rerenderPage]);
  useEffect(() => {
    if (allAdditionalMarkersForDB) {
      updateRouteToDB(allAdditionalMarkersForDB);
    }
  }, [allAdditionalMarkersForDB]);
  useEffect(() => {
    if (additionalPointsFromDB && allRoutePointsDescriptions) {
      testasaa();
    }
  }, [additionalPointsFromDB, allRoutePointsDescriptions]);

  async function GetPointsDescFromDatabase() {
    axios
      .get(
        "http://localhost:5113/api/troutes/" +
          location.state.message.routeId +
          "/routepointsadditional"
      )
      .then((resp) => {
        const pointsDescFromDB = [];
        resp.data.map((item) => {
          if (item.current === null) {
            return item;
          } else {
            let additionalPoints =
              item.addinionalPointMarks !== undefined
                ? [...item.addinionalPointMarks]
                : [];
            pointsDescFromDB.push({
              pointId: item.pointId,
              pointOnRouteId: item.pointOnRouteId,
              routePointDescription: item.routePointDescription,
              additionalPoints: additionalPoints,
            });
            return item;
          }
        });
        setAllRoutePointsDescriptions(pointsDescFromDB);
        setIsPageContentLoaded(true);
      });
  }
  async function GetImagesUrlsFromDatabase() {
    axios
      .get(
        "http://localhost:5113/api/troutes/" +
          location.state.message.routeId +
          "/imageurl"
      )
      .then((resp) => {
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
        setAllImagesUrlsForRoute(imagesUrlsFromDB);
      });
  }
  async function GetRecommendationsUrlsFromDatabase() {
    axios
      .get(
        "http://localhost:5113/api/troutes/" +
          location.state.message.routeId +
          "/recommendationurl"
      )
      .then((resp) => {
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
      });
  }
  async function GetAdditionalPointsFromDatabase() {
    axios
      .get(
        "http://localhost:5113/api/troutes/" +
          location.state.message.routeId +
          "/additionalpoints"
      )
      .then((resp) => {
        const additionalPointsFromDBTemp = [];
        resp.data.map((item) => {
          if (item.current === null) {
            return item;
          } else {
            additionalPointsFromDBTemp.push({
              pointId: item.troutePointDescriptionpointId,
              additionalPointInformation: item.additionalPointInformation,
              additionalPointCoordX: item.additionalPointCoordX,
              additionalPointCoordY: item.additionalPointCoordY,
            });
            return item;
          }
        });
        setAdditionalPointsFromDB(additionalPointsFromDBTemp);
      })
      .catch((err) => console.log("err", err));
  }
  function showList() {
    var div = document.querySelector(".additional-table-list-container");
    div.style.display = "block";
  }
  function hideList() {
    var div = document.querySelector(".additional-table-list-container");
    div.style.display = "none";
  }
  const testasaa = () => {
    for (let i = 0; i < allRoutePointsDescriptions.length; i++) {
      const oneRoutePointAllMarkers = [];
      for (let j = 0; j < additionalPointsFromDB.length; j++) {
        const element2 = additionalPointsFromDB[j];
        if (allRoutePointsDescriptions[i].pointId === element2.pointId) {
          oneRoutePointAllMarkers.push({
            pointId: element2.pointId,
            additionalPointInformation: element2.additionalPointInformation,
            additionalPointCoordX: element2.additionalPointCoordX,
            additionalPointCoordY: element2.additionalPointCoordY,
          });
        }
      }
      saveAdditionalMarkersextra(i, oneRoutePointAllMarkers);
    }
  };

  const onMapLoad = (map) => {
    setMap(map);
    testas();
  };
  async function getMapPointsPlacesIds(results) {
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
    getAllMapPointsLocations(allMapPlaces);
  }
  async function getAllMapPointsLocations(allMapPlaces) {
    const geocoder = new google.maps.Geocoder();
    const promises = [];

    for (let i = 0; i < allMapPlaces.length; i++) {
      const promise = new Promise((resolve, reject) => {
        geocoder.geocode(
          { placeId: allMapPlaces[i].place_id },
          (results, status) => {
            if (status === "OK") {
              resolve({
                point_Place_Id: allMapPlaces[i].place_id,
                point_Location_X: results[0].geometry.location.lat(),
                point_Location_Y: results[0].geometry.location.lng(),
                point_Name: results[0].address_components[1].long_name,
              });
            } else {
              reject(new Error("Geocode failed due to: " + status));
            }
          }
        );
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
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService();
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

    setCurrentPointId(item.pointId);
    setZoomByPoint(11);
    setNewRoutePointTextChanges(item.routePointDescription);
    setPointDescriptionValue(item.routePointDescription);
    document.getElementById("add-r-p-d").value = item.routePointDescription;

    setNoMoreAdditionalPoints(false);
    setPointIdIsEditing(item.pointId);
    setChoosenRouteMarkForAdditionalTable(item.pointOnRouteId);
  };
  //-----

  const handleMapClick = (event) => {
    setMarkerPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleSaveNewExtraCoords = (event) => {
    console.log(
      "aaa",
      allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable]
        .additionalPoints.length
    );
    console.log("ccccc", choosenRouteMarkForAdditionalTable);

    const additionalPoints =
      allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable]
        .additionalPoints;

    if (additionalPoints.length === 5 || additionalPoints.length > 5) {
      setNoMoreAdditionalPoints(true);
    } else if (additionalPoints.length < 5) {
      axios
        .post(
          "http://localhost:5113/api/troutes/" +
            location.state.message.routeId +
            "/point/" +
            pointIdIsEditing +
            "/additionalpoints",
          {
            additionalPointIdInList: additionalPoints.length,
            additionalPointCoordX: markerPosition.lat,
            additionalPointCoordY: markerPosition.lng,
            additionalPointInformation: "",
            additionalPointPlaceName: null,
            additionalPointPlaceId: null,
            additionalPointPlaceRating: null,
            additionalPointPlaceType: null,
            additionalPointPlaceRefToMaps: null,
          }
        )
        .then((response) => {
          console.log(response.data);
          GetPointsDescFromDatabase();
        });

      setMarkerPosition(null);
    }
    console.log(
      "end of method:",
      allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable]
        .additionalPoints
    );
  };

  const saveDescriptionTextToDB = (event) => {
    var routeIdLocal = location.state.message.routeId;
    var pointRouteIdLocal = pointIdIsEditing;
    var pointDescriptionTextLocal = newRoutePointTextChanges;
    axios
      .put(
        "http://localhost:5113/api/troutes/" +
          routeIdLocal +
          "/routepoints/" +
          pointRouteIdLocal,
        {
          pointId: pointRouteIdLocal,
          routePointDescription: pointDescriptionTextLocal,
          routeId: routeIdLocal,
        }
      )
      .then((response) => {
        allRoutePointsDescriptions[
          response.data.pointOnRouteId
        ].routePointDescription = pointDescriptionTextLocal;
        return response.data;
      })
      .catch((err) => console.log("err", err));
  };

  const saveNewRecommendationText = (event) => {
    if (newRecommendationTextURL != null && newRecommendationTextURL !== "") {
      if (newRecommendationTextURL.length < 10) {
        console.log("Please insert https link");
      } else {
        axios
          .post(
            "http://localhost:5113/api/troutes/" +
              location.state.message.routeId +
              "/recommendationurl",
            {
              rRecommendationUrlLink: newRecommendationTextURL,
            }
          )
          .then((response) => {
            const item = response.data;
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
  const saveNewImage = (event) => {
    if (imageUrl != null && imageUrl !== "") {
      if (imageUrl.length < 10) {
        console.log("Please insert https link");
      } else {
        const user = JSON.parse(localStorage.getItem("user"));
        const headers = {
          Authorization: `Bearer ${user.accessToken}`,
        };
        axios
          .post(
            "http://localhost:5113/api/troutes/" +
              location.state.message.routeId +
              "/newimageurl",
            {
              rImagesUrlLink: imageUrl,
            },
            { headers }
          )
          .then((response) => {
            const item = response.data;
            if (item !== null) {
              setRerenderPage(rerenderPage + 1);
              setAllImagesUrlsForRoute((prevArray) => {
                const updatedArray = [...prevArray];
                updatedArray[allImagesUrlsForRoute.length] = {
                  rImagesUrlLink: item.rImagesUrlLink,
                };
                return updatedArray;
              });
            }
          });
      }
    }
  };
  const unpublishRoute = (event) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const headers = {
      Authorization: `Bearer ${user.accessToken}`,
    };
    axios
      .put(
        "http://localhost:5113/api/troutes/" +
          location.state.message.routeId +
          "/publish",
        {
          rIsPublished: false,
        },
        { headers }
      )
      .then((response) => {
        setRerenderPage(rerenderPage + 1);
        location.state.message.rIsPublished = false;
      })

      .catch((err) => console.log("err", err));
  };
  const publishRoute = (event) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const headers = {
      Authorization: `Bearer ${user.accessToken}`,
    };
    axios
      .put(
        "http://localhost:5113/api/troutes/" +
          location.state.message.routeId +
          "/publish",
        {
          rIsPublished: true,
        },
        { headers }
      )
      .then((response) => {
        setRerenderPage(rerenderPage + 1);
        location.state.message.rIsPublished = true;
      })

      .catch((err) => console.log("err", err));
  };
  function handleNewRecommendationText(event) {
    setNewRecommendationTextURL(event.target.value);
  }
  function handleRoutePointDescriptionChange(event) {
    setNewRoutePointTextChanges(event.target.value);
  }

  function handleAdditionalMarkerDescription(event) {
    const val = document.getElementById("add-m-d").value;
    setAdditionalMarkerDescription({
      pointId: additionalMarkerDescription.pointId,
      additionalPointInformation: val,
    });
    if (
      allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable]
        .additionalPoints[additionalMarkerDescription.pointId]
        .additionalPointInformation !== undefined
    ) {
      allRoutePointsDescriptions[
        choosenRouteMarkForAdditionalTable
      ].additionalPoints[
        additionalMarkerDescription.pointId
      ].additionalPointInformation = val;
    }
    setAdditionalMarkerDescriptionDisplay(event.target.value);
  }
  const handleUrlChange = (event) => {
    const inputUrl = event.target.value;
    setImageUrl(inputUrl);
    setIsValidImageUrl(validateUrl(inputUrl));
  };

  const validateUrl = (url) => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  const targetExtraPointOnMap = (item, id) => () => {
    const centerPoint = {
      lat: item.additionalPointCoordX,
      lng: item.additionalPointCoordY,
    };
    setAdditionalMarkerDescription({
      pointId: id,
      additionalPointInformation: item.additionalPointInformation,
    });
    setCenterByPoint(centerPoint);
    setZoomByPoint(9);
    setNoMoreAdditionalPoints(false);
    setCurrentAddPointIdInList(item.additionalPointIdInList);
    if (
      item.additionalPointInformation == null &&
      document.getElementById("add-m-d")
    ) {
      document.getElementById("add-m-d").value = "";
    } else if (document.getElementById("add-m-d")) {
      document.getElementById("add-m-d").value =
        item.additionalPointInformation;
    }
    setAllPossibleLocationsForAdditionalPoint([]);
    setAdditionalMarkerDescriptionDisplay(item.additionalPointInformation);
  };
  const removeAdditionalPoint = () => {
    console.log("remove point?: ", currentAddPointIdInList);

    const foundPoint = allRoutePointsDescriptions[
      choosenRouteMarkForAdditionalTable
    ].additionalPoints.find(
      (point) => point.additionalPointIdInList === currentAddPointIdInList
    );

    if (foundPoint) {
      axios
        .delete(
          "http://localhost:5113/api/troutes/" +
            location.state.message.routeId +
            "/point/" +
            currentPointId +
            "/removeadditional/" +
            currentAddPointIdInList
        )
        .then((response) => {
          console.log(response.data);

          GetPointsDescFromDatabase();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Choose any point to delete");
      console.log("Can't delete. Try later");
    }
  };

  const saveAdditionalMarkersextra = (index, additionalMarkersOnEditextra) => {
    setAllAdditionalMarkersOnEdit((prevArray) => {
      if (allAdditionalMarkersOnEdit[index] != null) {
        // setToggleAdditionalButton(false);
        const updatedArray = [...prevArray];
        updatedArray[index] = additionalMarkersOnEditextra;
        return updatedArray;
      } else if (allAdditionalMarkersOnEdit[index] === undefined) {
        // setToggleAdditionalButton(false);
        const updatedArray = [...prevArray];
        updatedArray[index] = additionalMarkersOnEditextra;
        return updatedArray;
      } else {
        return [...prevArray, additionalMarkersOnEditextra];
      }
    });
    setAdditionalMarkersOnEdit([]);
  };

  const saveAdditionalMarkers = () => {
    setAllAdditionalMarkersOnEdit((prevArray) => {
      if (
        allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable] != null
      ) {
        const updatedArray = [...prevArray];
        updatedArray[choosenRouteMarkForAdditionalTable] =
          additionalMarkersOnEdit;
        return updatedArray;
      } else if (
        allAdditionalMarkersOnEdit[choosenRouteMarkForAdditionalTable] ===
        undefined
      ) {
        const updatedArray = [...prevArray];
        updatedArray[choosenRouteMarkForAdditionalTable] =
          additionalMarkersOnEdit;
        return updatedArray;
      } else {
        return [...prevArray, additionalMarkersOnEdit];
      }
    });
    setAdditionalMarkersOnEdit([]);
  };
  const removeRecommendationLocal = (
    id,
    recommendation_id_db,
    recommendation_routeid_db
  ) => {
    axios
      .delete(
        "http://localhost:5113/api/troutes/" +
          location.state.message.routeId +
          "/recommendationurl/" +
          recommendation_id_db
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    const newArray = [...allRecommendationsUrlsForRoute];
    newArray.splice(id, 1);

    setAllRecommendationsUrlsForRoute(newArray);
  };
  const SaveAllChangesToDB = () => {
    console.log(
      allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable]
        .additionalPoints
    );
    if (
      !allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable]
        .additionalPoints
    ) {
      console.log("allAdditionalMarkersOnEdit is undefined or null");
      return;
    }

    const extra = allRoutePointsDescriptions[
      choosenRouteMarkForAdditionalTable
    ].additionalPoints.map((item) => {
      if (!item) {
        return null;
      }

      const {
        pointId,
        additionalPointCoordX,
        additionalPointCoordY,
        additionalPointInformation,
        additionalPointPlaceId,
        additionalPointPlaceName,
        additionalPointPlaceRating,
        additionalPointPlaceRefToMaps,
        additionalPointPlaceType,
      } = item;

      return {
        additionalPointRouteId: location.state.message.routeId,
        additionalPointIdInList: item.additionalPointIdInList,
        additionalPointCoordX,
        additionalPointCoordY,
        additionalPointInformation,
        additionalPointPlaceId,
        additionalPointPlaceName,
        additionalPointPlaceRating,
        additionalPointPlaceRefToMaps,
        additionalPointPlaceType,
        TroutePointDescriptionpointId: pointId,
      };
    });

    setAllAdditionalMarkersForDB(extra);
    setRerenderPage(rerenderPage + 1);
  };

  function updateRouteToDB() {
    const user = JSON.parse(localStorage.getItem("user"));
    const userInfo = jwt_decode(user.accessToken);
    const data = location.state.message;
    axios
      .put(
        "http://localhost:5113/api/troutes/" + location.state.message.routeId,
        {
          rOrigin: data.rOrigin,
          rDestination: data.rDestination,
          rTripCost: 50,
          rRating: 4.5,
          rIsPublished: false,
          rCountry: "LT", //data.rCountry,
          rImagesUrl: allImagesUrlsForRoute,
          rRecommendationUrl: allRecommendationsUrlsForRoute,
          midWaypoints: allRouteMidWaypoints,
          pointDescriptions: allRoutePointsDescriptions,
          additionalMarkers: allAdditionalMarkersForDB, // update in useEffect
          UserId: userInfo.sub,
        }
      )
      .then((response) => {
        setRerenderPage(rerenderPage + 1);
        console.log(response.data);
        return response.data;
      })
      .catch((err) => console.log("err", err));
  }
  function showPopUpElement(id) {
    var option = document.querySelector("#options-" + id);
    option.style.display = "block";

    var element = document.querySelector("#element-" + id);
    element.style.borderStyle = "solid solid none solid";
    element.style.borderRadius = "0px";
  }
  function hidePopUpElement(id) {
    var option = document.querySelector("#options-" + id);
    option.style.display = "none";
    var element = document.querySelector("#element-" + id);
    element.style.borderStyle = "solid solid solid solid";
    element.style.borderRadius = "5px";
  }
  function searchNearbyRestaurants(pointLocation) {
    const placesService = new window.google.maps.places.PlacesService(map);
    placesService.nearbySearch(
      {
        location: pointLocation,
        radius: 1000,
        type: ["restaurant", "bar", "bakery", "cafe"],
        business_status: "OPERATIONAL",
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setAllPossibleLocationsForAdditionalPoint(results);

          results.forEach((place) => {
            placesService.getDetails(
              {
                placeId: place.place_id,
                fields: ["opening_hours"],
              },
              (details, detailsStatus) => {
                if (
                  detailsStatus ===
                  window.google.maps.places.PlacesServiceStatus.OK
                ) {
                  const isOpen = details.opening_hours?.isOpen();
                  console.log(`Place ${place.place_id} is open: ${isOpen}`);
                }
              }
            );
          });
        }
      }
    );
  }

  function searchNearbyShopping(pointLocation) {
    const placesService = new window.google.maps.places.PlacesService(map);
    placesService.nearbySearch(
      {
        location: pointLocation,
        radius: 1000,
        type: ["shopping_mall", "store"],
        business_status: "OPERATIONAL",
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setAllPossibleLocationsForAdditionalPoint(results);
        }
      }
    );
  }
  function searchNearbyServices(pointLocation) {
    const placesService = new window.google.maps.places.PlacesService(map);
    placesService.nearbySearch(
      {
        location: pointLocation,
        radius: 1000,
        type: ["hospital"],
        business_status: "OPERATIONAL",
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setAllPossibleLocationsForAdditionalPoint(results);
        }
      }
    );
  }

  function searchNearbyMuseums(pointLocation) {
    const placesService = new window.google.maps.places.PlacesService(map);
    placesService.nearbySearch(
      {
        location: pointLocation,
        radius: 1000,
        type: [
          "museum",
          "park",
          "tourist_attraction",
          "point_of_interest",
          "art_gallery",
        ],
        business_status: "OPERATIONAL",
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setAllPossibleLocationsForAdditionalPoint(results);
        }
      }
    );
  }

  function searchNearbyGasStation(pointLocation) {
    const placesService = new window.google.maps.places.PlacesService(map);
    placesService.nearbySearch(
      {
        location: pointLocation,
        radius: 1000,
        type: "gas_station",
        business_status: "OPERATIONAL",
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setAllPossibleLocationsForAdditionalPoint(results);
        }
      }
    );
  }
  function saveChoosenPlaceToVisit(choosenItem, choosenAdPoint, divId) {
    const alldivs = document.querySelectorAll(".single-options");
    alldivs.forEach((divs) => {
      divs.style.backgroundColor = "white";
    });

    const div = document.querySelector(
      `[data-div-id="${divId}"].single-options`
    );
    div.getAttribute("id", `${divId}`);
    div.style.backgroundColor = "#e3fff1";
    saveAdditionalMarkersextra(choosenAdPoint, {
      additionalPointCoordX: choosenItem.geometry.location.lat(),
      additionalPointCoordY: choosenItem.geometry.location.lng(),
      additionalPointId: choosenAdPoint.additionalPointId,
      additionalPointIdInList: choosenAdPoint.additionalPointIdInList,
      additionalPointInformation: choosenAdPoint.additionalPointInformation,
      additionalPointPlaceId: choosenItem.place_id,
      additionalPointPlaceName: choosenItem.name,
      additionalPointPlaceRating: choosenItem.rating,
      additionalPointPlaceRefToMaps:
        choosenItem.photos &&
        choosenItem.photos.length > 0 &&
        choosenItem.photos[0].html_attributions.length > 0
          ? choosenItem.photos[0].html_attributions[0]
          : "",
      additionalPointPlaceType: choosenItem.types[0],
    });

    axios
      .put(
        "http://localhost:5113/api/troutes/" +
          location.state.message.routeId +
          "/point/" +
          currentPointId +
          "/additionalpointdata/" +
          choosenAdPoint.additionalPointIdInList,
        {
          additionalPointCoordX: choosenItem.geometry.location.lat(),
          additionalPointCoordY: choosenItem.geometry.location.lng(),
          additionalPointPlaceName: choosenItem.name,
          additionalPointPlaceId: choosenItem.place_id,
          additionalPointPlaceRating: choosenItem.rating,
          additionalPointPlaceType: choosenItem.types[0],
          additionalPointPlaceRefToMaps:
            choosenItem.photos &&
            choosenItem.photos.length > 0 &&
            choosenItem.photos[0].html_attributions.length > 0
              ? choosenItem.photos[0].html_attributions[0]
              : "",
        }
      )
      .then((response) => {
        setRerenderPage(rerenderPage + 1);
        hideList();
        return response.data;
      })
      .catch((err) => console.log("err", err));
  }
  function saveAdditionalPointDescriptionTextToLocal() {
    axios
      .put(
        "http://localhost:5113/api/troutes/" +
          location.state.message.routeId +
          "/point/" +
          currentPointId +
          "/additionalpoints/" +
          currentAddPointIdInList,
        {
          additionalPointInformation: additionalMarkerDescriptionDisplay,
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((err) => console.log("err", err));
  }
  //-----
  const location = useLocation();
  if (!isLoaded) {
    return <SkeletonText />;
  }
  return (
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
      <div
        id="additional-table-list-container-1"
        className="additional-table-list-container"
      >
        <div className="additional-table-list-container-content">
          {allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable] &&
          allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable]
            .additionalPoints[currentAddPointIdInList] ? (
            <div style={{ paddingBottom: "5px" }}>
              <div
                id={`element-${allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable].additionalPoints[currentAddPointIdInList].additionalPointIdInList}`}
                className="additional-table-list-container-content-element"
                onClick={() =>
                  showPopUpElement(
                    allRoutePointsDescriptions[
                      choosenRouteMarkForAdditionalTable
                    ].additionalPoints[currentAddPointIdInList]
                      .additionalPointIdInList
                  )
                }
              >
                <p style={{ paddingLeft: "10px", paddingTop: "10px" }}>
                  Mark near point -{" "}
                  {
                    allRoutePointsDescriptions[
                      choosenRouteMarkForAdditionalTable
                    ].additionalPoints[currentAddPointIdInList]
                      .additionalPointIdInList
                  }
                </p>
                <button
                  style={{ display: "block", margin: "10px 10px" }}
                  onClick={() =>
                    //NEARBY MUSEUM
                    searchNearbyRestaurants({
                      lat: allRoutePointsDescriptions[
                        choosenRouteMarkForAdditionalTable
                      ].additionalPoints[currentAddPointIdInList]
                        .additionalPointCoordX,
                      lng: allRoutePointsDescriptions[
                        choosenRouteMarkForAdditionalTable
                      ].additionalPoints[currentAddPointIdInList]
                        .additionalPointCoordY,
                    })
                  }
                >
                  <RiRestaurantLine size={25} style={{ color: "darkred" }} />
                </button>
                <button
                  style={{ display: "block", margin: "10px 10px" }}
                  onClick={() =>
                    //NEARBY shopping mall, stores
                    searchNearbyShopping({
                      lat: allRoutePointsDescriptions[
                        choosenRouteMarkForAdditionalTable
                      ].additionalPoints[currentAddPointIdInList]
                        .additionalPointCoordX,
                      lng: allRoutePointsDescriptions[
                        choosenRouteMarkForAdditionalTable
                      ].additionalPoints[currentAddPointIdInList]
                        .additionalPointCoordY,
                    })
                  }
                >
                  <HiOutlineShoppingCart
                    size={25}
                    style={{ color: "darkred" }}
                  />
                </button>
                <button
                  style={{ display: "block", margin: "10px 10px" }}
                  onClick={() =>
                    //NEARBY services
                    searchNearbyServices({
                      lat: allRoutePointsDescriptions[
                        choosenRouteMarkForAdditionalTable
                      ].additionalPoints[currentAddPointIdInList]
                        .additionalPointCoordX,
                      lng: allRoutePointsDescriptions[
                        choosenRouteMarkForAdditionalTable
                      ].additionalPoints[currentAddPointIdInList]
                        .additionalPointCoordY,
                    })
                  }
                >
                  <MdOutlineMedicalServices
                    size={25}
                    style={{ color: "darkred" }}
                  />
                </button>
                <button
                  style={{ display: "block", margin: "10px 10px" }}
                  onClick={() =>
                    //NEARBY GAS STATION
                    searchNearbyGasStation({
                      lat: allRoutePointsDescriptions[
                        choosenRouteMarkForAdditionalTable
                      ].additionalPoints[currentAddPointIdInList]
                        .additionalPointCoordX,
                      lng: allRoutePointsDescriptions[
                        choosenRouteMarkForAdditionalTable
                      ].additionalPoints[currentAddPointIdInList]
                        .additionalPointCoordY,
                    })
                  }
                >
                  <MdLocalGasStation size={25} style={{ color: "darkred" }} />
                </button>
                <button
                  style={{ display: "block", margin: "10px 10px" }}
                  onClick={() =>
                    searchNearbyMuseums({
                      lat: allRoutePointsDescriptions[
                        choosenRouteMarkForAdditionalTable
                      ].additionalPoints[currentAddPointIdInList]
                        .additionalPointCoordX,
                      lng: allRoutePointsDescriptions[
                        choosenRouteMarkForAdditionalTable
                      ].additionalPoints[currentAddPointIdInList]
                        .additionalPointCoordY,
                    })
                  }
                >
                  <MdOutlineMuseum size={25} style={{ color: "darkred" }} />
                </button>
              </div>
              {/* OPENED */}
              <div
                id={`options-${allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable].additionalPoints[currentAddPointIdInList].additionalPointIdInList}`}
                className="additional-table-list-container-content-element-options"
                onClick={() =>
                  hidePopUpElement(
                    allRoutePointsDescriptions[
                      choosenRouteMarkForAdditionalTable
                    ].additionalPoints[currentAddPointIdInList]
                      .additionalPointIdInList
                  )
                }
              >
                <div style={{ height: "85%", overflow: "auto" }}>
                  {allPossibleLocationsForAdditionalPoint &&
                    allPossibleLocationsForAdditionalPoint.map((itemR, i) => (
                      <>
                        <div
                          id={i}
                          data-div-id={i}
                          className="single-options"
                          onClick={(e) => {
                            e.stopPropagation();
                            saveChoosenPlaceToVisit(
                              itemR,
                              allRoutePointsDescriptions[
                                choosenRouteMarkForAdditionalTable
                              ].additionalPoints[currentAddPointIdInList],
                              i
                            );
                          }}
                        >
                          <p
                            style={{
                              display: "flex",
                              width: "35%",
                              justifyContent: "center",
                              margin: "auto",
                            }}
                          >
                            "{itemR.name}"
                          </p>
                          <p
                            style={{
                              display: "flex",
                              width: "15%",
                              margin: "auto",
                              justifyContent: "center",
                            }}
                          >
                            {itemR?.opening_hours?.open_now ? (
                              <HiOutlineLockOpen
                                size={20}
                                title="Working now"
                                style={{ color: "darkgreen" }}
                              />
                            ) : (
                              <HiOutlineLockClosed
                                size={20}
                                title="Not working now"
                                style={{ color: "darkred" }}
                              />
                            )}
                          </p>
                          <p
                            style={{
                              display: "flex",
                              width: "30%",
                              justifyContent: "center",
                              margin: "auto",
                            }}
                          >
                            {itemR.rating ? (
                              <p
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  margin: "auto",
                                }}
                              >
                                {itemR.rating}
                                <TiStarOutline
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    margin: "auto",
                                    color: "#d3b202",
                                  }}
                                  size={18}
                                />
                              </p>
                            ) : (
                              "?"
                            )}
                          </p>
                          <p
                            style={{
                              display: "flex",
                              width: "10%",
                              justifyContent: "center",
                              margin: "auto",
                            }}
                          >
                            {itemR.geometry.location.lat().toFixed(2)}
                          </p>
                          <p
                            style={{
                              display: "flex",
                              width: "10%",
                              justifyContent: "center",
                              margin: "auto",
                            }}
                          >
                            {itemR.geometry.location.lng().toFixed(2)}
                          </p>
                        </div>
                      </>
                    ))}
                </div>
                <div
                  style={{
                    backgroundColor: "rgb(255, 250, 226)",
                    width: "100%",
                    height: "10%",
                  }}
                >
                  <HiOutlineArrowCircleUp
                    size={30}
                    style={{
                      display: "flex",
                      margin: "auto",
                      color: "darkred",
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p></p>
          )}
        </div>
        <div className="additional-table-list-container-bottom">
          <button id="hide-button" onClick={hideList}>
            Close menu
          </button>
        </div>
      </div>
      <div className="publish-button">
        <button style={{ display: "none" }} onClick={SaveAllChangesToDB}>
          Save changes
        </button>
        {location.state.message.rIsPublished ? (
          <button onClick={unpublishRoute}>Unpublish</button>
        ) : (
          <button onClick={publishRoute}>Publish</button>
        )}
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
                      {item.pointId + 11}
                    </button>
                    {indexas === 4 ? <br /> : null}
                  </>
                ))}
              </div>
            </div>
          )}
          {allRoutePointsDescriptions.length <= 5 && (
            <div className="private-container-main-left buttons">
              {allRoutePointsDescriptions.map((item, i) => (
                <button
                  style={{
                    backgroundColor:
                      currentPointId === item.pointId ? "#17c3b2" : "",
                  }}
                  onClick={changeTextAreaValueByPoint(item)}
                  title={
                    allMapPlaces[item.pointOnRouteId]?.point_Name
                      ? allMapPlaces[item.pointOnRouteId].point_Name
                      : ""
                  }
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
          <textarea
            className="private-container-main-left"
            style={{ width: "80%", margin: "auto" }}
            id="add-r-p-d"
            rows="4"
            cols="20"
            placeholder="There is no content!"
            defaultValue={pointDescriptionValue}
            onChange={handleRoutePointDescriptionChange}
          ></textarea>
          <div className="preview-page-save-button">
            <button
              className="preview-page-save-button"
              onClick={saveDescriptionTextToDB}
            >
              Save description
            </button>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "0px",
              textAlign: "center",
              width: "100%",
            }}
          >
            {/* TODO */}
            <h3>
              Recommendations{" "}
              <GrCircleInformation
                size={20}
                title="Optional recommendations links"
              />
            </h3>
            {allRecommendationsUrlsForRoute && (
              <div
                style={{
                  display: "block",
                  maxHeight:
                    allRecommendationsUrlsForRoute.length > 3
                      ? "100px"
                      : "none",
                  maxWidth:
                    allRecommendationsUrlsForRoute.length > 3 ? "90%" : "90%",
                  overflowY:
                    allRecommendationsUrlsForRoute.length > 3
                      ? "scroll"
                      : "none",
                  margin:
                    allRecommendationsUrlsForRoute.length > 3
                      ? "0px auto"
                      : "0px auto",
                }}
              >
                {allRecommendationsUrlsForRoute.map((recommendation, i) => (
                  <div
                    style={{
                      display: "flex",
                      width: "70%",
                      margin: "0px auto",
                      justifyContent: "space-between",
                    }}
                    key={i}
                  >
                    <p
                      style={{
                        margin: "0px 0px 4px",
                        maxWidth:
                          recommendation.rRecommendationUrlLink.length > 30
                            ? "250px"
                            : "none",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={recommendation.rRecommendationUrlLink}
                      alt={`Recommendation ${i}`}
                    >
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
              </div>
            )}
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
            <p>{location.state.message.rRecommendationUrl}</p>
          </div>
        </div>
        <div
          className="preview-container-main-right"
          style={{ margin: "auto" }}
        >
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
              {allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable] &&
                allRoutePointsDescriptions[
                  choosenRouteMarkForAdditionalTable
                ].additionalPoints.map((item) => (
                  <Marker
                    position={{
                      lat: item.additionalPointCoordX,
                      lng: item.additionalPointCoordY,
                    }}
                  />
                ))}
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
            {markerPosition && !noMoreAdditionalPoints && (
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
            {noMoreAdditionalPoints && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(255, 0, 0, 0.5)",
                  borderRadius: "10px",
                  textAlign: "center",
                  fontSize: "16px",
                }}
              >
                Maximum amount of additional points
              </div>
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
            </div>
            <div className="private-container-main-left buttons">
              {allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable] &&
                allRoutePointsDescriptions[
                  choosenRouteMarkForAdditionalTable
                ].additionalPoints.map((itemA, i) => (
                  <button
                    id="aaaaa"
                    style={{
                      backgroundColor:
                        currentAddPointIdInList ===
                        itemA.additionalPointIdInList
                          ? "#17c3b2"
                          : "",
                    }}
                    onClick={targetExtraPointOnMap(itemA, i)}
                    key={i}
                  >
                    {i + 1}
                  </button>
                ))}

              {allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable]
                .additionalPoints.length < 1 && (
                <p>Choose new points on the map</p>
              )}
            </div>
            {allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable] &&
            allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable]
              .additionalPoints[currentAddPointIdInList] ? (
              <div
                className="additional-content-table"
                style={{
                  margin: "auto",
                  width: "90%",
                  border: "2px solid black",
                  borderRadius: "10px",
                  boxShadow: "inset 5px 10px 50px rgba(253, 188, 70, 0.3)",
                  backgroundColor: "rgba(253, 255, 255, 0.)",
                  fontWeight: "bold",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "2px 10%",
                  }}
                >
                  <p style={{ textAlign: "left" }}>Place title: </p>
                  <p
                    style={{
                      maxWidth:
                        allRoutePointsDescriptions[
                          choosenRouteMarkForAdditionalTable
                        ].additionalPoints[currentAddPointIdInList]
                          .additionalPointPlaceName != null &&
                        allRoutePointsDescriptions[
                          choosenRouteMarkForAdditionalTable
                        ].additionalPoints[currentAddPointIdInList]
                          .additionalPointPlaceName.length > 30
                          ? "170px"
                          : "none",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={
                      allRoutePointsDescriptions[
                        choosenRouteMarkForAdditionalTable
                      ].additionalPoints[currentAddPointIdInList]
                        .additionalPointPlaceName
                    }
                  >
                    {
                      allRoutePointsDescriptions[
                        choosenRouteMarkForAdditionalTable
                      ].additionalPoints[currentAddPointIdInList]
                        .additionalPointPlaceName
                    }
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "2px 10%",
                  }}
                >
                  <p style={{ textAlign: "left" }}>Rating: </p>
                  <p>
                    {
                      allRoutePointsDescriptions[
                        choosenRouteMarkForAdditionalTable
                      ].additionalPoints[currentAddPointIdInList]
                        .additionalPointPlaceRating
                    }
                  </p>
                </div>
                {allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable]
                  .additionalPoints[currentAddPointIdInList]
                  .additionalPointPlaceRefToMaps && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      margin: "2px 10%",
                    }}
                  >
                    <p style={{ textAlign: "left" }}>More information: </p>
                    <div
                      style={{
                        margin: "4px",
                        maxWidth:
                          allRoutePointsDescriptions[
                            choosenRouteMarkForAdditionalTable
                          ].additionalPoints[currentAddPointIdInList]
                            .additionalPointPlaceRefToMaps.length > 30
                            ? "170px"
                            : "none",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          allRoutePointsDescriptions[
                            choosenRouteMarkForAdditionalTable
                          ].additionalPoints[currentAddPointIdInList]
                            .additionalPointPlaceRefToMaps,
                      }}
                      title={
                        allRoutePointsDescriptions[
                          choosenRouteMarkForAdditionalTable
                        ].additionalPoints[currentAddPointIdInList]
                          .additionalPointPlaceRefToMaps
                      }
                    ></div>
                  </div>
                )}
              </div>
            ) : (
              <p>No Content</p>
            )}
            {additionalMarkerDescription && (
              <div>
                {allRoutePointsDescriptions[
                  choosenRouteMarkForAdditionalTable
                ] != null &&
                  allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable]
                    .additionalPoints.length > 0 && (
                    <>
                      <textarea
                        style={{ width: "80%", margin: "auto" }}
                        id="add-m-d"
                        rows="4"
                        cols="50"
                        placeholder="There is no content!"
                        value={additionalMarkerDescriptionDisplay}
                        onChange={handleAdditionalMarkerDescription}
                      ></textarea>
                      <div className="preview-page-save-button">
                        <button
                          className="preview-page-save-button"
                          onClick={saveAdditionalPointDescriptionTextToLocal}
                        >
                          Save additional description
                        </button>
                      </div>
                    </>
                  )}
              </div>
            )}
            {additionalMarkersOnEdit &&
              additionalMarkersOnEdit.map((item, i) => (
                <p key={i}>
                  {item.additionalPointCoordX} - {item.additionalPointCoordY}
                </p>
              ))}
            {toggleAdditionalButton && (
              <button
                className="additional-markers-button"
                onClick={saveAdditionalMarkers}
              >
                Save markers - local
              </button>
            )}
            {allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable] &&
              allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable] &&
              allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable]
                .additionalPoints.length != 0 && (
                <div className="simple-button-style">
                  <button
                    style={{ display: "flex", margin: "auto" }}
                    onClick={showList}
                  >
                    Show Options
                  </button>
                </div>
              )}
            <div>
              {allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable]
                .additionalPoints.length > 0 &&
                currentAddPointIdInList != null && (
                  <div
                    style={{
                      display: "flex",
                      bottom: "0",

                      justifyContent: "center",
                    }}
                  >
                    <button
                      style={{
                        display: "flex",
                        margin: "auto",
                        borderRadius: "10px",
                        border: "2px solid darkred",
                        backgroundColor: "red",
                      }}
                      onClick={removeAdditionalPoint}
                    >
                      Delete point
                    </button>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
      {/* IMAGES */}
      <div className="images-container">
        <div className="images-container left">
          <input
            className="images-container"
            placeholder="Input image URL"
            id="url-input"
            type="text"
            value={imageUrl}
            onChange={handleUrlChange}
          ></input>
        </div>

        <div className="images-container right">
          {imageUrl && imageUrl.length > 8 && (
            <GiCheckMark
              size={40}
              style={{
                border: "1px solid white",
                borderRadius: "999px",
                backgroundColor: "white",
              }}
            />
          )}
        </div>
      </div>
      {imageUrl && imageUrl.length > 8 ? (
        <button
          style={{
            display: "block",
            width: "150px",
            height: "40px",
            margin: "5px auto",
            border: "2px solid rgb(255, 238, 202)",
            backgroundColor: "rgb(255, 238, 202)",
            borderRadius: "15px",
            color: "#000000",
            fontWeight: "bold",
          }}
          disabled={!isValidImageUrl ? "disabled" : ""}
          onClick={saveNewImage}
        >
          Save image
        </button>
      ) : imageUrl.length > 0 && imageUrl.length < 7 ? (
        <p
          style={{
            display: "block",
            margin: "20px auto",
            color: "red",
            fontWeight: "bold",
          }}
        >
          Invalid URL
        </p>
      ) : (
        <></>
      )}
      {allImagesUrlsForRoute && (
        <div className="preview-images-container">
          <Slider {...settings}>
            {allImagesUrlsForRoute.map((image, i) => (
              <div key={i}>
                <img
                  style={{
                    display: "block",
                    margin: "auto",
                    maxWidth: "100%",
                    height: "auto",
                  }}
                  src={image.rImagesUrlLink}
                  alt={`Slide ${i}`}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
}
