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
import { Heading, SkeletonText, calc, flexbox } from "@chakra-ui/react";

import jwt_decode from "jwt-decode";
import { CgProfile } from "react-icons/cg";
import { MdExpandLess, MdExpandMore, MdPublishedWithChanges } from "react-icons/md";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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

  //--------------------------
  const [choosenRouteMarkForAdditionalTable, setChoosenRouteMarkForAdditionalTable] =
    useState(null);

  const [additionalMarkerDescription, setAdditionalMarkerDescription] = useState("");

  const [allImagesUrlsForRoute, setAllImagesUrlsForRoute] = useState([]);
  const [allRecommendationsUrlsForRoute, setAllRecommendationsUrlsForRoute] = useState([]);
  const [allCommentsForRoute, setAllCommentsForRoute] = useState(null);

  const [additionalPointsFromDB, setAdditionalPointsFromDB] = useState([]);
  //--------------------------
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const [userName, setUserName] = useState(null);
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
    const user = JSON.parse(localStorage.getItem("user"));
    const userInfo = jwt_decode(user.accessToken);

    setUserName(userInfo["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);

    console.log("useEffect");
    async function GetMidWaypointsFromDatabase() {
      console.log("aaa");
      axios
        .get(
          "http://localhost:5113/api/troutes/" + location.state.message.routeId + "/midwaypoints"
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
          GetAdditionalPointsFromDatabase();
          GetImagesUrlsFromDatabase();
          GetRecommendationsUrlsFromDatabase();
          GetCommentsFromDatabase();
        });
    }
    GetMidWaypointsFromDatabase();
  }, []);
  async function GetPointsDescFromDatabase() {
    axios
      .get(
        "http://localhost:5113/api/troutes/" +
          location.state.message.routeId +
          "/routepointsadditional"
      )
      .then((resp) => {
        console.log(resp.data);
        const pointsDescFromDB = [];
        resp.data.map((item) => {
          if (item.current === null) {
            return item;
          } else {
            console.log(item.AddinionalPointMarks);
            // let additionalPoints = [];
            // additionalPoints = [...item.AddinionalPointMarks];
            let additionalPoints =
              item.addinionalPointMarks != undefined ? [...item.addinionalPointMarks] : [];
            pointsDescFromDB.push({
              pointId: item.pointId,
              pointOnRouteId: item.pointOnRouteId,
              routePointDescription: item.routePointDescription,
              additionalPoints: additionalPoints,
            });
            return item;
          }
        });
        console.log("GetPointsDescFromDatabase: ", pointsDescFromDB);
        setAllRoutePointsDescriptions(pointsDescFromDB);
        setIsPageContentLoaded(true);
      });
  }
  async function GetAdditionalPointsFromDatabase() {
    axios
      .get(
        "http://localhost:5113/api/troutes/" + location.state.message.routeId + "/additionalpoints"
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
        console.log("GetAdditionalPointsFromDatabase", additionalPointsFromDBTemp);
      })
      .catch((err) => console.log("err", err));
  }
  async function GetImagesUrlsFromDatabase() {
    // console.log("GetImagesUrlsFromDatabase");
    axios
      .get("http://localhost:5113/api/troutes/" + location.state.message.routeId + "/imageurl")
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
        "http://localhost:5113/api/troutes/" + location.state.message.routeId + "/recommendationurl"
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
  async function GetCommentsFromDatabase() {
    axios
      .get("http://localhost:5113/api/routecomments/" + location.state.message.routeId)
      .then((resp) => {
        // console.log("recommendations: ", resp.data);
        const commentsFromDB = [];
        resp.data.map((item) => {
          if (item.current === null) {
            return item;
          } else {
            const date = new Date(item.commentDate);
            const formattedDate = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            });
            commentsFromDB.push({
              commentId: item.commentId,
              commentText: item.commentText,
              commentRating: item.commentRating,
              commentDate: formattedDate,
              TRouterouteId: item.TRouterouteId,
            });
            return item;
          }
        });
        setAllCommentsForRoute(commentsFromDB);

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
    // console.log("item", item);
    const centerPoint = {
      lat: allMapPlaces[item.pointOnRouteId].point_Location_X,
      lng: allMapPlaces[item.pointOnRouteId].point_Location_Y,
    };
    // console.log(item.pointOnRouteId);
    // document.getElementById("additional-show").style.display = "block";
    // console.log("item", item);
    setCenterByPoint(centerPoint);
    setZoomByPoint(7);
    setPointDescriptionValue(item.routePointDescription);
    setChoosenRouteMarkForAdditionalTable(item.pointOnRouteId);
    if (!allRoutePointsDescriptions[item.pointOnRouteId].additionalPoints.length) {
      document.getElementById("additional-show").style.display = "none";
    } else {
      document.getElementById("additional-show").style.display = "block";
    }
    // console.log("+++++++++++++++++++", allRoutePointsDescriptions);
  };
  const targetExtraPointOnMap = (item, id) => {
    console.log("item", item);
    console.log("id", id);
    const centerPoint = {
      lat: item.additionalPointCoordX,
      lng: item.additionalPointCoordY,
    };
    setCenterByPoint(centerPoint);
    setZoomByPoint(12);
    if (item.additionalPointInformation == null && document.getElementById("add-m-d")) {
      document.getElementById("add-m-d").value = "";
    } else if (document.getElementById("add-m-d")) {
      document.getElementById("add-m-d").value = item.additionalPointInformation;
    }
  };

  function handleAdditionalMarkerDescription() {
    const val = document.getElementById("add-m-d").value;
    setAdditionalMarkerDescription({ id: additionalMarkerDescription.id, desc: val });
    if (
      allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable][additionalMarkerDescription.id]
        .desc != undefined
    ) {
      allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable][
        additionalMarkerDescription.id
      ].desc = val;
    }
  }
  const saveUserComment = () => (event) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userInfo = jwt_decode(user.accessToken);
    const userId = userInfo.sub;
    const commentFieldValue = document.getElementById("c-f").value;
    const headers = {
      Authorization: `Bearer ${user.accessToken}`,
    };
    axios
      .post(
        "http://localhost:5113/api/routecomments/" + location.state.message.routeId + "/newcomment",
        {
          commentText: commentFieldValue,
        },
        { headers }
      )
      // );
      .then((response) => {
        GetCommentsFromDatabase();
        console.log(allCommentsForRoute);

        document.getElementById("c-f").value = "";
      });
  };
  const location = useLocation();
  if (!isLoaded) {
    return <SkeletonText />;
  }
  return (
    <div className="view-container">
      {!isPageLoaded && (
        <div>
          <p>Error</p>
          <p>{location.state.message.rName}</p>
        </div>
      )}{" "}
      <h1 style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        {location.state.message.rName}
      </h1>
      <div className="view-container-main">
        <div className="view-container-main-left">
          <div className="view-container-main-left top">
            <h1>{location.state.message.rName}</h1>
          </div>
          <div className="view-container-main-left buttons">
            {allRoutePointsDescriptions.map((item) => (
              <>
                {/* {console.log(item)} */}
                <button onClick={changeTextAreaValueByPoint(item)}>
                  {item.pointOnRouteId + 1}
                </button>
              </>
            ))}
          </div>
          <textarea
            // rows="4"
            // cols="30"
            placeholder="There is no content!"
            value={pointDescriptionValue}
          />
        </div>
        <div className="view-container-main-right">
          {isPageContentLoaded && (
            <GoogleMap
              center={centerByPoint || centerPoint}
              zoom={zoomByPoint || 9} //zoomByPoint ||
              mapContainerClassName="view-map-container"
              options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
              onLoad={onMapLoad}
            >
              {allRoutePointsDescriptions &&
                allRoutePointsDescriptions.map(
                  (item) =>
                    item.additionalPoints &&
                    item.additionalPoints.map((point) => (
                      <>
                        {/* {console.log(point)} */}
                        <Marker
                          key={point.id}
                          position={{
                            lat: point.additionalPointCoordX,
                            lng: point.additionalPointCoordY,
                          }}
                        />
                      </>
                    ))
                )}

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
      <div id="additional-show" style={{ display: "none" }}>
        {/* TODO display: none */}
        <div className="trip-points-section">
          {allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable] &&
            allRoutePointsDescriptions[choosenRouteMarkForAdditionalTable].additionalPoints.map(
              (point, i) => (
                <button id="aaaaa" onClick={() => targetExtraPointOnMap(point, i)} key={i}>
                  {i}
                </button>
              )
            )}
        </div>
        <div className="trip-points-section text">
          <textarea
            id="add-m-d"
            rows="4"
            cols="50"
            placeholder="There is no content!"
            defaultValue={""}
            onChange={handleAdditionalMarkerDescription}
          ></textarea>
        </div>
      </div>
      {allImagesUrlsForRoute && (
        <div className="view-images-container">
          <Slider {...settings}>
            {allImagesUrlsForRoute.map((image, i) => (
              <div key={i}>
                {/* {console.log("i++++++++++", i)}
                {console.log("image_url++++++++++", image.image_url)} */}
                <img
                  className="view-images-container-img"
                  src={image.rImagesUrlLink}
                  alt={`Slide ${i}`}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
      <div className="trip-comments-section">
        <div className="comment add">
          <div className="comment add-left">
            <CgProfile size={25} style={{ margin: "auto" }}></CgProfile>
            <p style={{ fontWeight: 500 }}>{userName}</p>
          </div>
          <div className="comment add-right">
            <input id="c-f" placeholder="Write your comment"></input>
            <div className="class-MdPublished">
              <button>
                <MdPublishedWithChanges size={35} onClick={saveUserComment()} />
              </button>
            </div>
          </div>
        </div>
        <div>
          {allCommentsForRoute &&
            allCommentsForRoute
              .slice(0, expanded ? allCommentsForRoute.length : 3)
              .map((item, i) => (
                <div key={i} className="comment">
                  <div className="comment add-left">
                    <CgProfile size={25} style={{ margin: "auto" }}></CgProfile>
                    <p style={{ fontWeight: 500 }}>{item.commentId}</p>

                    <p>{item.commentDate}</p>
                  </div>
                  <div className="comment add-right">
                    <span placeholder="Write your comment">{item.commentText}</span>
                  </div>
                </div>
              ))}
          {allCommentsForRoute && allCommentsForRoute.length > 3 && (
            <div className="more-comments">
              <button className="more-comments" onClick={handleExpandClick}>
                {expanded ? "Show Less" : "Show More"}
                {expanded ? (
                  <MdExpandLess style={{ marginLeft: "5px" }} />
                ) : (
                  <MdExpandMore style={{ marginLeft: "5px" }} />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
