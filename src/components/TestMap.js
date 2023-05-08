﻿import React, { useRef, useState, createRef } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

import {
  Button,
  ButtonGroup,
  IconButton,
  SkeletonText,
} from "@chakra-ui/react";
import {
  FaLocationArrow,
  FaTimes,
  FaRegCircle,
  FaRegCheckCircle,
  FaPlusCircle,
  FaArrowRight,
  FaWalking,
  FaCarSide,
} from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { RiPinDistanceFill } from "react-icons/ri";
import { TbGps } from "react-icons/tb";
import { CgTimelapse } from "react-icons/cg";
import axios from "axios";
import countries from "./const/countries.json";

import "./MapTest.css";

const CircularJSON = require("circular-json");

export default function TestMap() {
  const centerPoint = { lat: 54.8985, lng: 23.9036 };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAmOOpkKLPbXQ4TnZYJ3xNw868ySAaoylA", //"AIzaSyClg0_pq0WTqIRVmRI10U2pQPZv7f5dQXQ", //"AIzaSyAiB_hv59Hb5MQol934V0jK-t9CVbc2JGY", //process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["geometry", "places"],
  });
  const google = window.google;
  const [map, setMap] = React.useState(null);
  const [directionsRendererInfo, setDirectionsRendererInfo] =
    React.useState(null);

  const [marker, setMarker] = React.useState(null);
  const [infoWindow, setInfoWindow] = React.useState(null);
  const [places, setPlaces] = React.useState([]);
  const [placesState, setPlacesState] = React.useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  //-------- Directions, paths, needs..

  const [restaurants, setRestaurants] = React.useState([]);
  const [rerenderStateForDifferentPath, setRerenderStateForDifferentPath] =
    useState(null);

  const [rerenderStateForDifferentNeed, setRerenderStateForDifferentNeed] =
    useState("NONE");
  const [routeSelectedCountry, setRouteSelectedCountry] = useState("Unknown");
  const [routeName, setRouteName] = useState("Unnamed");

  //--------
  //Validations handlers------------------------------------------------

  const [routeNameValue, setRouteNameValue] = useState(""); // handleRouteNameInputValue

  //Validations handlers------------------------------------------------
  const [saveSectionInputValues, setSaveSectionInputValues] = useState([""]);
  const [savePointInputValues, setSavePointInputValues] = useState([""]);

  const [disabledSectionInputs, setDisabledSectionInputs] = useState([]);
  const [disabledPointInputs, setDisabledPointInputs] = useState([]);
  const [originLatLng, setOriginLatLng] = useState(centerPoint);
  const [travelStyle, setTravelStyle] = useState("DRIVING");

  const [sectionBetweenPoints, setSectionBetweenPoints] = useState([]);
  const [routePoints, setRoutePoints] = useState([]);
  const [isSectionOpen, setIsSectionOpen] = useState([false]); // old isOpen
  const [isPointOpen, setIsPointOpen] = useState([false]);
  function handleSectionClick(id) {
    setIsSectionOpen((prevState) => {
      const newState = [...prevState];
      newState[id] = !newState[id];
      return newState;
    });
  }
  //CHECK - FIX
  function handlePointClick(id) {
    setIsPointOpen((prevState) => {
      const newState = [...prevState];
      newState[id] = !newState[id];
      return newState;
    });
  }

  const initialState = [
    { id: 1, inputValue: "empty" },
    { id: 2, inputValue: "extra" },
    { id: 3, inputValue: "none" },
    { id: 4, inputValue: "none" },
    { id: 5, inputValue: "none" },
    { id: 6, inputValue: "none" },
    { id: 7, inputValue: "none" },
    { id: 8, inputValue: "none" },
    { id: 9, inputValue: "none" },
    { id: 10, inputValue: "empty" },
  ];

  const [data, setData] = useState(initialState);
  const [extraInputs, setExtraInputs] = useState([]);
  const [testKey, setTestKey] = useState([]);
  const arrLength = 8;
  const [waypoints, setWaypoints] = useState([]);
  const [fixedWaypoints, setfixedWaypoints] = useState([]);

  const [directionsRendererKey, setDirectionsRendererKey] = useState(1);
  // const [testKey, setTestKey] = useState(1);

  const originRef = useRef();
  const destiantionRef = useRef();

  const mapRef = useRef();
  React.useEffect(() => {
    // add or remove refs
    setWaypoints((waypoints) =>
      Array(arrLength)
        .fill()
        .map((_, i) => waypoints[i] || createRef())
    );
  }, [arrLength]);
  const onMapLoad = React.useCallback((map) => {
    setMap(map);
  }, []);

  const onMarkerLoad = React.useCallback((marker) => {
    setMarker(marker);
  }, []);

  const onMarkerClick = React.useCallback(() => {
    if (infoWindow !== null) {
      infoWindow.close();
    }

    setInfoWindow(
      new window.google.maps.InfoWindow({
        content: "Click to find restaurants",
      })
    );
    if (infoWindow !== null) {
      infoWindow.open(map, marker);
    }
  }, [infoWindow, map, marker]);

  const onInfoWindowClose = React.useCallback(() => {
    if (infoWindow !== null) {
      infoWindow.close();
    }
  }, [infoWindow]);

  const onInfoWindowClick = React.useCallback(() => {
    const placesService = new window.google.maps.places.PlacesService(map);
    placesService.nearbySearch(
      {
        location: marker.getPosition(),
        radius: 5000,
        type: "restaurant",
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlaces(results);
        }
      }
    );

    infoWindow.close();
  }, [infoWindow, map, marker]);
  const handlePointInputChange = (e) => {
    const updatedInputsValues = [...savePointInputValues];
    updatedInputsValues[e.target.id] = e.target.value;
    setSavePointInputValues(updatedInputsValues);
  };
  function handleRouteNameInputValue(event) {
    if (event.target.value.length >= 8) {
      setRouteNameValue(event.target.value);
    } else {
      setRouteNameValue("");
    }
  }
  function testPrint() {
    const wayptsForDB = [];
    waypoints.map((item) => {
      if (item.current === null) {
        return item;
      } else {
        wayptsForDB.push({
          midWaypointLocation: item.current.value,
          midWaypointStopover: true,
        });
        return item;
      }
    });
    const waypts = [];
    waypoints.map((item) => {
      if (item.current === null) {
        return item;
      } else {
        waypts.push({
          location: item.current.value,
          stopover: true,
        });
        return item;
      }
    });
    setfixedWaypoints(wayptsForDB);
    return waypts;
  }

  const handleTravelTypeChange = (type) => (event) => {
    setTravelStyle(type);
    return type;
  };
  const emptyInput = (inputId) => (event) => {
    const newState = data.map((obj) => {
      if (obj.id === inputId) {
        if (event.target.value !== "") {
          return { ...obj, inputValue: "Done", value: event.target.value };
        } else if (event.target.value === "") {
          return { ...obj, inputValue: "empty", value: event.target.value };
        }
      }
      return obj;
    });
    setData(newState);
  };

  const updateIcons = () => {
    let a = 0;
    const newState = data.map((obj) => {
      if (obj.inputValue === "extra") {
        obj.inputValue = "empty";
        a = obj.id;
      }
      return obj;
    });

    newState[a].inputValue = "extra";
    setData(newState);
  };
  const AddNewInputField = () => {
    updateIcons();
    setExtraInputs((allExtras) => {
      return [...allExtras, <div className="box"></div>];
    });
  };
  const RemoveInputField = (item) => () => {
    setExtraInputs((allExtras) => {
      const indexToRemove = item;
      const newArray = [...allExtras];
      newArray.splice(indexToRemove, 1);
      return newArray;
    });
    updateIcons();
  };

  const ShowInputsState = (data) => {
    return Object.keys(data).map((key, id) => {
      return Array.isArray(data) && data[key].inputValue === "Done" ? (
        <div className="container-small left icons" key={id}>
          <FaRegCheckCircle
            key={id}
            color="#177a23" //"#1f4b56"
            className={data[key].id}
            value={data[key].inputValue}
          />
        </div>
      ) : data[key].inputValue === "empty" ? (
        <div className="container-small left icons" key={id}>
          <FaRegCircle
            key={id}
            color="#550a0f"
            className={data[key].id}
            value={data[key].inputValue}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      ) : data[key].inputValue === "extra" ? (
        extraInputs.length <= 7 ? (
          <div className="container-small left icons" key={id}>
            <FaArrowRight
              key={id}
              color="#177a23" //"#873e23"
              className={data[key].id}
              value={data[key].inputValue}
            />
          </div>
        ) : (
          <></>
        )
      ) : (
        <></>
      );
    });
  };
  if (!isLoaded) {
    return <SkeletonText />;
  }

  const directionsRendererCallback = (response) => {
    if (response !== null) {
      setDirectionsRendererInfo(response);
    }
  };

  function showRestaurants(response) {
    restaurants.forEach((waypoint) => {
      const marker = new window.google.maps.Marker({
        position: waypoint.end_location,
        clickable: true,
        draggable: false,
        map: response.getMap(),
        title: `Step ${1}`,
        label: {
          text: `${1}`,
          color: "white",
        },
      });
    });
  }

  const reloadDirectionsRenderer = () => {
    // increment the key to force a re-render of the DirectionsRenderer component
    setDirectionsRendererKey((prevKey) => prevKey + 1);
    setTestKey((prevKey) => prevKey + 1);
  };
  async function calculateRoute() {
    const fixedWaypoints2 = testPrint();
    setRerenderStateForDifferentPath(null);
    setRerenderStateForDifferentNeed("NONE");
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      waypoints: fixedWaypoints2,
      destination: destiantionRef.current.value,
      provideRouteAlternatives: true,
      // eslint-disable-next-line no-undef
      travelMode: travelStyle,
    });

    const routeMarkersLocations = [];
    routeMarkersLocations.push({
      location: originRef.current.value,
    });
    fixedWaypoints2.map((item) => {
      routeMarkersLocations.push({
        location: item.location,
      });
      return item;
    });
    routeMarkersLocations.push({
      location: destiantionRef.current.value,
    });
    setSavePointInputValues(
      Array.from({ length: fixedWaypoints2.length + 2 }).fill("")
    );

    setDirectionsResponse(results); // UPDATE TIK IS 2 KARTO! REIK TVARKYT // AUTOCOMPLETED MAIN WAYPOINTS
    setDirectionsRendererInfo(results);
    const dataOriginLatLng = {
      lat: results.routes[0].legs[0].start_location.lat(),
      lng: results.routes[0].legs[0].start_location.lng(),
    };

    setOriginLatLng(dataOriginLatLng);
    //Atstumu skaiciavimai
    const distancesBetween = [];
    results.routes[0].legs.map((item) => {
      distancesBetween.push({
        start_address: item.start_address,
        end_address: item.end_address,
        distance: item.distance.text,
        duration: item.duration.text,
      });
      return item;
    });

    setSectionBetweenPoints(distancesBetween);
    setRoutePoints(routeMarkersLocations);
    reloadDirectionsRenderer();
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setSectionBetweenPoints([]);
    setRoutePoints([]);
    setExtraInputs([]);
    setData(initialState);
    setOriginLatLng(centerPoint);
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }
  const exportToJson = (data) => {
    const filename = "data.json";
    const contentType = "application/json;charset=utf-8;";
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      var blob = new Blob(
        [decodeURIComponent(encodeURI(JSON.stringify(data)))],
        {
          type: contentType,
        }
      );
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      var a = document.createElement("a");
      a.download = filename;
      a.href =
        "data:" + contentType + "," + encodeURIComponent(JSON.stringify(data));
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  function exportMap() {
    const exportData = {
      origin: [originRef.current.value],
      midWaypoints: fixedWaypoints,
      destiantion: [destiantionRef.current.value],
    };
    const ccaa = JSON.stringify(exportData);

    const filename = "exportedData.json";
    // const contentType = "application/json;charset=utf-8;";
    const jsonData = JSON.stringify(exportData);
    const fileData = new Blob([jsonData], { type: "application/json" });
    const fileUrl = URL.createObjectURL(fileData);
    const downloadLink = document.createElement("a");
    downloadLink.href = fileUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
  const convertSectionDescriptionsForDb = (savedSectionsValues) => {
    const descForDB = [];
    savedSectionsValues.map((item, i) => {
      if (item === null || item === "") {
        return item;
      } else {
        descForDB.push({
          sectionOnRouteId: i,
          routeSectionDescription: item,
        });
        return item;
      }
    });
    return descForDB;
  };
  const convertPointDescriptionsForDb = (savedPointsValues) => {
    const descForDB = [];
    savedPointsValues.map((item, i) => {
      if (item === null) {
        //|| item === ""
        return item;
      } else {
        descForDB.push({
          pointOnRouteId: i,
          routePointDescription: item,
        });
        return item;
      }
    });
    return descForDB;
  };

  function handleCountrySelect(event) {
    if (event.target.value == "") {
      setRouteSelectedCountry(event.target.value);
    } else {
      setRouteSelectedCountry(event.target.value);
    }
  }
  function handleRouteNameChange() {
    const val = document.getElementById("routeName").value;
    setRouteName(val);
  }
  function saveRoute() {
    // event.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const headers = {
      Authorization: `Bearer ${user.accessToken}`,
    };
    const sectionDescForDB = convertSectionDescriptionsForDb(
      saveSectionInputValues
    );
    saveSectionInputValues.map((item, i) => {
      setDisabledSectionInputs[i] = "disabled";
      // disabled
    });
    const pointDescForDB = convertPointDescriptionsForDb(savePointInputValues);
    savePointInputValues.map((item, i) => {
      setDisabledPointInputs[i] = "disabled";
      // disabled
    });
    const exportData = {
      origin: originRef.current.value,
      midWaypoints: fixedWaypoints,
      destiantion: destiantionRef.current.value,
    };
    axios
      .post(
        "http://localhost:5113/api/troutes",
        {
          rname: routeName,
          rOrigin: exportData.origin,
          rDestination: exportData.destiantion,
          midWaypoints: exportData.midWaypoints,
          sectionDescriptions: sectionDescForDB,
          pointDescriptions: pointDescForDB,
          rCountry: routeSelectedCountry,
          rImagesUrl: [
            {
              rImagesUrlLink:
                "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fHRyYXZlbHxlbnwwfHwwfHw%3D&w=1000&q=80",
            },
            {
              rImagesUrlLink:
                "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8M3x8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60",
            },
          ], // "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fHRyYXZlbHxlbnwwfHwwfHw%3D&w=1000&q=80",
          rRecommendationUrl: [
            { rRecommendationUrlLink: "https://www.google.com/" },
            { rRecommendationUrlLink: "https://cloud.google.com/" },
          ], // "https://www.google.com/",
        },
        { headers }
      ) //"{"rname":"Unnamed","rOrigin":"Kaunas, Kauno m. sav., Lietuva","rDestination":"Vilnius, Vilniaus m. sav., Lietuva","midWaypoints":[{"midWaypointLocation":"Telšiai, Telšių rajono savivaldybė, Lietuva","midWaypointStopover":true},{"midWaypointLocation":"Biržai, Biržų rajono savivaldybė, Lietuva","midWaypointStopover":true},{"midWaypointLocation":"Utena, Utenos r. sav., Lietuva","midWaypointStopover":true}],"sectionDescriptions":[],"pointDescriptions":[{"pointOnRouteId":1},{"pointOnRouteId":2,"routePointDescription":"birzaiii"}],"rCountry":"Unknown","rImagesUrl":[{"rImagesUrlLink":"https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fHRyYXZlbHxlbnwwfHwwfHw%3D&w=1000&q=80"},{"rImagesUrlLink":"https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8M3x8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60"}],"rRecommendationUrl":[{"rRecommendationUrlLink":"https://www.google.com/"},{"rRecommendationUrlLink":"https://cloud.google.com/"}]}"
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  }
  return (
    <>
      <div className="input-container">
        <div className="container-small">
          <div className="container-small left">{ShowInputsState(data)}</div>
          <div className="container-small right">
            <div className="box">
              <Autocomplete autoHighlight={true}>
                <input
                  key={1}
                  type="text"
                  placeholder="Origin"
                  ref={originRef}
                  onBlur={emptyInput(1)}
                />
              </Autocomplete>
            </div>

            {extraInputs.map((item, i) => {
              return (
                <div className="box">
                  <Autocomplete>
                    <input
                      key={i + 1}
                      ref={waypoints[i]}
                      type="text"
                      placeholder="Location"
                      onBlur={emptyInput(i + 2)}
                    />
                  </Autocomplete>
                </div>
              );
            })}
            {extraInputs.length <= 7 ? (
              <div className="box">
                <FaPlusCircle
                  className="plusButton"
                  color="#177a23"
                  alt="logo"
                  onClick={AddNewInputField}
                ></FaPlusCircle>
              </div>
            ) : (
              <></>
            )}
            <div className="box">
              <Autocomplete>
                <input
                  key={10}
                  type="text"
                  placeholder="Destination"
                  ref={destiantionRef}
                  onBlur={emptyInput(10)}
                />
              </Autocomplete>
            </div>
            <ButtonGroup>
              <Button
                style={{
                  backgroundColor: "#1aa32b",
                  border: "1px solid rgba(72,91,35,0.5)",
                  borderRadius: "8px",
                  fontWeight: "bold",
                }}
                colorScheme="pink"
                type="submit"
                onClick={calculateRoute}
              >
                Calculate Route
              </Button>

              <IconButton
                style={{
                  backgroundColor: "#1aa32b",
                  border: "1px solid rgba(72,91,35,0.5)",
                  borderRadius: "30px",
                  width: "30px",
                }}
                aria-label="center back"
                icon={<FaTimes />}
                onClick={clearRoute}
                // TODO:
              />
              <IconButton
                style={{
                  backgroundColor: "#1aa32b",
                  border: "1px solid rgba(72,91,35,0.5)",
                  borderRadius: "30px",
                  width: "30px",
                }}
                aria-label="center back"
                icon={<FaWalking />}
                onClick={handleTravelTypeChange("WALKING")}
                // TODO:
              />
              <IconButton
                style={{
                  backgroundColor: "#1aa32b",
                  border: "1px solid rgba(72,91,35,0.5)",
                  borderRadius: "30px",
                  width: "30px",
                }}
                aria-label="center back"
                icon={<FaCarSide />}
                onClick={handleTravelTypeChange("DRIVING")}
                // TODO:
              />
            </ButtonGroup>
          </div>
        </div>
        <p></p>
        <ul
          className="dropdown-content"
          style={{ color: "white", padding: "0px 0px 0px 0px" }}
        >
          {sectionBetweenPoints.map((item, i) => {
            //SECTION
            return (
              <div
                className="pointInfoOpened"
                key={i}
                onClick={() => handleSectionClick(i)}
              >
                <p style={{ margin: "0px 0px 0px 0px", height: "30px" }}>
                  {/* Click me to {isOpen[i] ? "hide" : "show"} the content! */}
                  {item.start_address.substring(
                    0,
                    item.start_address.indexOf(",")
                  )}{" "}
                  -{" "}
                  {item.end_address.substring(0, item.end_address.indexOf(","))}
                </p>
                {isSectionOpen[i] && (
                  <div key={i}>
                    <p>
                      <TbGps /> 1 - {item.start_address}
                    </p>
                    <p>
                      <TbGps /> 2 - {item.end_address}
                    </p>
                    <p>
                      <RiPinDistanceFill /> Distance: {item.distance}
                    </p>
                    <p>
                      <CgTimelapse /> Duration : {item.duration}
                    </p>
                    <div
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    ></div>
                    <div className="route-part-icons"></div>
                  </div>
                )}
              </div>
            );
          })}
        </ul>
        <ul
          className="dropdown-content"
          style={{ color: "white", padding: "0px 0px 0px 0px" }}
        >
          {routePoints.map((item, i) => {
            //POINT
            return (
              <div
                className="pointInfoOpened"
                key={i}
                onClick={() => handlePointClick(i)}
              >
                <p style={{ margin: "0px 0px 0px 0px", height: "30px" }}>
                  {/* Click me to {isOpen[i] ? "hide" : "show"} the content! */}
                  {item.location.substring(0, item.location.indexOf(","))}
                </p>
                {isPointOpen[i] && (
                  <div key={i}>
                    <p>{item.location}</p>
                    <div
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <textarea
                        key={i}
                        type="text"
                        id={i}
                        placeholder="Point Description"
                        className="pointInfoOpenedInput"
                        // value={textAreaValue}
                        onChange={handlePointInputChange}
                        disabled={disabledPointInputs[i] ? "enabled" : ""}
                      />
                    </div>
                    <div className="route-part-icons"></div>
                  </div>
                )}
              </div>
            );
          })}
        </ul>
        <div className="route-name-button" style={{ fontSize: "12px" }}>
          <button
            className="route-name-button"
            style={{ width: "150px", height: "35px" }}
            onClick={() => {
              map.panTo(originLatLng);
              map.setZoom(9);
            }}
          >
            <p
              className="route-name-button"
              style={{
                display: "inline-block",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "12px",
              }}
            >
              <FaLocationArrow />
              <br />
              Route start
            </p>
          </button>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            paddingTop: "10px",
            height: "100px",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: "10px",
              height: "60%",
              width: "90%",
            }}
          >
            <select
              id="country-select"
              style={{ width: "220px" }}
              className="route-name-input"
              value={routeSelectedCountry}
              onChange={handleCountrySelect}
            >
              <option value="">-- Select a country --</option>
              {countries.map((country, i) => (
                <option key={country.name} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div
            style={{
              display: "flex",
              margin: "auto",
              height: "70%",
              width: "20%",
            }}
          >
            {routeSelectedCountry != "Unknown" &&
              routeSelectedCountry != "" && (
                <GiCheckMark
                  size={35}
                  style={{
                    marginRight: "20px",
                    color: "darkgreen",
                    borderRadius: "25px",
                    border: "4px solid darkgreen",
                    backgroundColor: "white",
                  }}
                />
              )}
          </div>
          <p></p>
        </div>
        <div
          classname="route-name"
          style={{
            display: "flex",
            width: "100%",
            paddingTop: "10px",
            height: "100px",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: "10px",
              height: "60%",
              width: "90%",
            }}
          >
            <input
              className="route-name-input"
              type="text"
              id={"routeName"}
              placeholder="Route title"
              onChange={handleRouteNameInputValue}
            ></input>
          </div>
          <div
            style={{
              display: "flex",
              margin: "auto",
              height: "70%",
              width: "20%",
            }}
          >
            {routeNameValue && routeNameValue != "" && (
              <GiCheckMark
                size={35}
                style={{
                  marginRight: "20px",
                  color: "darkgreen",
                  borderRadius: "25px",
                  border: "4px solid darkgreen",
                  backgroundColor: "white",
                }}
              />
            )}
          </div>
        </div>
        <div className="route-name-button">
          <button className="route-name-button" onClick={handleRouteNameChange}>
            Save title
          </button>
        </div>
        <div className="route-save-style">
          <button
            className="route-save-style"
            id="saveRoute"
            onClick={() => saveRoute()}
          >
            Save route information
          </button>
        </div>
      </div>

      <GoogleMap
        center={originLatLng}
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
        {/* VEIKIA TACIAU - SPAWNINA TA PATI, REIKIA PERDARYTI JOG PRADINIAI MARKERPOINTAI BUTU KAS 10-20KM ARBA KAZKAIP KITAIP PRASTUMDYTI JUOS. */}

        {placesState === true &&
          places.map((place) =>
            place.map((x) => (
              <Marker key={x.place_id} position={x.geometry.location} />
            ))
          )}
        {directionsResponse && (
          <DirectionsRenderer
            key={directionsRendererKey}
            directions={directionsResponse}
            options={{ suppressMarkers: false, draggable: true }}
            onLoad={directionsRendererCallback}
          />
        )}
      </GoogleMap>

      <div id="warnings-panel"></div>
    </>
  );
}
