import React, { useRef, useState, createRef } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

import { useNavigate } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  IconButton,
  SkeletonText,
} from "@chakra-ui/react";
import {
  FaLocationArrow,
  FaTimes,
  FaRegCheckCircle,
  FaPlusCircle,
  FaWalking,
  FaCarSide,
} from "react-icons/fa";
import { RiPinDistanceFill } from "react-icons/ri";
import { RxCrossCircled, RxCrosshair1 } from "react-icons/rx";
import { TbGps } from "react-icons/tb";
import { CgTimelapse } from "react-icons/cg";
import axios from "axios";
import countries from "./const/countries.json";

import "./MapTest.css";
const apiKey = process.env.REACT_APP_API_KEY;

export default function CreateMap() {
  const navigate = useNavigate();
  const centerPoint = { lat: 54.8985, lng: 23.9036 };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ["geometry", "places"],
  });
  const google = window.google;
  const [map, setMap] = React.useState(null);
  const [directionsRendererInfo, setDirectionsRendererInfo] =
    React.useState(null);
  function handleNavigate() {
    navigate("/profile");
  }

  const [directionsResponse, setDirectionsResponse] = useState(null);

  const [extraInputsArray, setExtraInputsArray] = useState([]);
  const [extraInputValues, setExtraInputValues] = useState(Array(7).fill(""));
  const autocompleteRefs = useRef([]);

  const [rerenderStateForDifferentPath, setRerenderStateForDifferentPath] =
    useState(null);

  const [rerenderStateForDifferentNeed, setRerenderStateForDifferentNeed] =
    useState("NONE");
  const [routeSelectedCountry, setRouteSelectedCountry] = useState("Unknown");
  const [routeName, setRouteName] = useState("Unnamed");
  const [routeCalculatedSuccesfully, setRouteCalculatedSuccesfully] =
    useState(false);

  const [routeNameValue, setRouteNameValue] = useState("");

  const [savePointInputValues, setSavePointInputValues] = useState([""]);

  const [disabledPointInputs, setDisabledPointInputs] = useState([]);
  const [originLatLng, setOriginLatLng] = useState(centerPoint);
  const [travelStyle, setTravelStyle] = useState("DRIVING");

  const [sectionBetweenPoints, setSectionBetweenPoints] = useState([]);
  const [waypointsForDB, setWaypointsForDB] = useState([]);
  const [routePoints, setRoutePoints] = useState([]);
  const [isSectionOpen, setIsSectionOpen] = useState([false]);
  const [isPointOpen, setIsPointOpen] = useState([false]);
  const [originInputValue, setOriginInputValue] = useState("");

  const handleOriginInputChange = (event) => {
    setOriginInputValue(event.target.value);
  };

  const handlePlaceChanged = (index) => {
    const autocomplete = autocompleteRefs.current[index];
    if (autocomplete && autocomplete !== undefined) {
      const place = autocomplete.getPlace();

      if (place && place.formatted_address) {
        const updatedValues = [...extraInputValues];
        updatedValues[index] = place.formatted_address;
        setExtraInputValues(updatedValues);

        const updatedArray = extraInputsArray.slice(0, updatedValues.length);
        setExtraInputsArray(updatedArray);

        console.log(place.formatted_address);
      }
    }
  };

  const handleAutocompleteLoad = (autocomplete, index) => {
    autocompleteRefs.current[index] = autocomplete;
  };
  const searchOptions = {
    types: ["geocode"],
  };
  const handleExtraInputChange = (index, event) => {
    const updatedValues = [...extraInputValues];
    updatedValues[index] = event.target.value;
    setExtraInputValues(updatedValues);

    const updatedArray = extraInputsArray.slice(0, updatedValues.length);
    setExtraInputsArray(updatedArray);
  };

  const cleanUpInputArray = () => {
    const updatedValues = extraInputValues.filter(
      (value) => value != "" || undefined
    );
    const updatedArray = extraInputsArray.slice(0, updatedValues.length);
    setExtraInputsArray(updatedArray);
    setExtraInputValues(updatedValues);
  };
  const cleanUpInputArrayForRoute = () => {
    const updatedValues = extraInputValues.filter(
      (value) => value != "" && value != undefined
    );
    const updatedArray = extraInputsArray.slice(0, updatedValues.length);
    setExtraInputsArray(updatedArray);
    setExtraInputValues(updatedValues);
    return updatedValues;
  };
  function handleSectionClick(id) {
    setIsSectionOpen((prevState) => {
      const newState = [...prevState];
      newState[id] = !newState[id];
      return newState;
    });
  }
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
  const arrLength = 8;
  const [waypoints, setWaypoints] = useState([]);
  const [fixedWaypoints, setfixedWaypoints] = useState([]);

  const [directionsRendererKey, setDirectionsRendererKey] = useState(1);

  const originRef = useRef(null);
  const destiantionRef = useRef();

  React.useEffect(() => {
    setWaypoints((waypoints) =>
      Array(arrLength)
        .fill()
        .map((_, i) => waypoints[i] || createRef())
    );
  }, [arrLength]);
  const onMapLoad = React.useCallback((map) => {
    setMap(map);
  }, []);

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
    console.log(waypoints);
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
  function ValidateWaypoints(wp) {
    if (wp != undefined && wp != null && wp.length > 0) {
      const wayptsForDB = [];
      wp.map((item) => {
        console.log(item);
        if (item === null) {
          return item;
        } else {
          wayptsForDB.push({
            midWaypointLocation: item,
            midWaypointStopover: true,
          });
          return item;
        }
      });
      const waypts = [];
      wp.map((item) => {
        if (item === null) {
          return item;
        } else {
          waypts.push({
            location: item,
            stopover: true,
          });
          return item;
        }
      });
      console.log(wayptsForDB);
      setWaypointsForDB(wayptsForDB);
      return waypts;
    } else {
      return null;
    }
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

  const AddNewInputField = () => {
    if (extraInputsArray.length < 7) {
      setExtraInputsArray([...extraInputsArray, ""]);
    }
  };
  if (!isLoaded) {
    return <SkeletonText />;
  }

  const directionsRendererCallback = (response) => {
    if (response !== null) {
      setDirectionsRendererInfo(response);
    }
  };
  const reloadDirectionsRenderer = () => {
    setDirectionsRendererKey((prevKey) => prevKey + 1);
  };
  async function calculateRoute() {
    const fixedWaypoints2 = testPrint();
    console.log(fixedWaypoints2);
    const arr = cleanUpInputArrayForRoute();
    console.log(arr);
    const waypt = ValidateWaypoints(arr);
    console.log(waypt);
    setRerenderStateForDifferentPath(null);
    setRerenderStateForDifferentNeed("NONE");
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      alert("Origin or destination unavailable");
      return;
    }

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      waypoints: waypt,
      destination: destiantionRef.current.value,
      provideRouteAlternatives: true,
      // eslint-disable-next-line no-undef
      travelMode: travelStyle,
    });
    if (results.status !== "OK") {
      setRouteCalculatedSuccesfully(false);
      alert("Unable to calculate route");
      return;
    } else {
      setRouteCalculatedSuccesfully(true);
    }

    console.log("results", results);
    const routeMarkersLocations = [];
    routeMarkersLocations.push({
      location: originRef.current.value,
    });
    waypt.map((item) => {
      routeMarkersLocations.push({
        location: item.location,
      });
      return item;
    });
    routeMarkersLocations.push({
      location: destiantionRef.current.value,
    });
    setSavePointInputValues(Array.from({ length: waypt.length + 2 }).fill(""));

    setDirectionsResponse(results);
    setDirectionsRendererInfo(results);
    const dataOriginLatLng = {
      lat: results.routes[0].legs[0].start_location.lat(),
      lng: results.routes[0].legs[0].start_location.lng(),
    };

    setOriginLatLng(dataOriginLatLng);
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
    console.log(routeMarkersLocations);
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
    setExtraInputValues([]);
    setExtraInputsArray([]);
  }

  const convertPointDescriptionsForDb = (savedPointsValues) => {
    const descForDB = [];
    savedPointsValues.map((item, i) => {
      console.log("convertPointDescriptionsForDb", savedPointsValues.length);
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
      setRouteSelectedCountry("");
    } else {
      setRouteSelectedCountry(event.target.value);
    }
  }
  function handleRouteNameChange() {
    if (routeNameValue.length < 8) {
      alert("Short route title");
    } else {
      setRouteName(routeNameValue);
    }
  }
  function saveRoute() {
    const user = JSON.parse(localStorage.getItem("user"));
    const headers = {
      Authorization: `Bearer ${user.accessToken}`,
    };
    const pointDescForDB = convertPointDescriptionsForDb(savePointInputValues);
    savePointInputValues.map((item, i) => {
      setDisabledPointInputs[i] = "disabled";
    });
    const exportData = {
      origin: originRef.current.value,
      midWaypoints: waypointsForDB, //fixedWaypoints,
      destiantion: destiantionRef.current.value,
    };
    if (routeNameValue.length <= 0) {
      alert("Route title not saved");
    }
    axios
      .post(
        "http://localhost:5113/api/troutes",
        {
          rname: routeName,
          rOrigin: exportData.origin,
          rDestination: exportData.destiantion,
          midWaypoints: exportData.midWaypoints,
          pointDescriptions: pointDescForDB,
          rCountry: routeSelectedCountry,
          rImagesUrl: null,
          rRecommendationUrl: null,
        },
        { headers }
      )
      .then((response) =>
        response.status != 201
          ? alert("Something went wrong. Please Try again later")
          : (alert("Created succesfully"), handleNavigate())
      )
      .catch((err) => console.log(err));
  }
  return (
    <>
      <div className="input-container">
        <div style={{ width: "100%" }}>
          <div className="box">
            <Autocomplete autoHighlight={true}>
              <input
                id="originInput"
                key={1}
                type="text"
                placeholder="Origin"
                ref={originRef}
                onChange={(event) => handleOriginInputChange(event)}
              />
            </Autocomplete>
            {originInputValue && originInputValue.length > 0 && (
              <FaRegCheckCircle
                size={25}
                style={{
                  marginLeft: "-30px",
                  color: "darkgreen",
                }}
              />
            )}
            {originInputValue.length == 0 && (
              <RxCrossCircled
                size={25}
                style={{
                  marginLeft: "-30px",
                  color: "darkred",
                }}
              />
            )}
          </div>
          {extraInputsArray.length < 7 && (
            <div className="box">
              <FaPlusCircle
                className="plusButton"
                color="#177a23"
                alt="logo"
                onClick={AddNewInputField}
              ></FaPlusCircle>
            </div>
          )}
          {extraInputsArray.map((_, index) => (
            <div className="box" key={index}>
              <Autocomplete
                onLoad={(autocomplete) =>
                  handleAutocompleteLoad(autocomplete, index)
                }
                onPlaceChanged={() => handlePlaceChanged(index)}
                options={searchOptions}
                autoHighlight={true}
              >
                <input
                  id={`extraInput${index}`}
                  key={index}
                  type="text"
                  placeholder="Location"
                  value={extraInputValues[index]}
                  onChange={(event) => handleExtraInputChange(index, event)}
                />
              </Autocomplete>
              {extraInputValues[index] &&
                extraInputValues[index].length > 0 && (
                  <FaRegCheckCircle
                    size={25}
                    style={{
                      marginLeft: "-30px",
                      color: "darkgreen",
                    }}
                  />
                )}
              {extraInputValues[index] &&
                extraInputValues[index].length == 0 && (
                  <RxCrossCircled
                    size={25}
                    style={{
                      marginLeft: "-30px",
                      color: "darkred",
                    }}
                  />
                )}
            </div>
          ))}

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
          <div style={{ margin: "10px" }}>
            <ButtonGroup>
              <Button
                style={{
                  backgroundColor: "rgb(134, 145, 252)",
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
                  backgroundColor: "rgb(134, 145, 252)",
                  border: "1px solid rgba(72,91,35,0.5)",
                  borderRadius: "30px",
                  width: "30px",
                }}
                aria-label="center back"
                icon={<FaTimes />}
                onClick={clearRoute}
              />
              <IconButton
                style={{
                  backgroundColor: "rgb(134, 145, 252)",
                  border: "1px solid rgba(72,91,35,0.5)",
                  borderRadius: "30px",
                  width: "30px",
                }}
                aria-label="center back"
                icon={<FaWalking />}
                onClick={handleTravelTypeChange("WALKING")}
              />
              <IconButton
                style={{
                  backgroundColor: "rgb(134, 145, 252)",
                  border: "1px solid rgba(72,91,35,0.5)",
                  borderRadius: "30px",
                  width: "30px",
                }}
                aria-label="center back"
                icon={<FaCarSide />}
                onClick={handleTravelTypeChange("DRIVING")}
              />
            </ButtonGroup>
          </div>
        </div>
        <div className="container-small">
          <div className="container-small right"></div>
        </div>
        <p></p>
        <ul
          className="dropdown-content"
          style={{ color: "white", padding: "0px 0px 0px 0px" }}
        >
          {sectionBetweenPoints.map((item, i) => {
            return (
              <div
                className="pointInfoOpened"
                key={i}
                onClick={() => handleSectionClick(i)}
              >
                <p style={{ margin: "0px 0px 0px 0px", height: "30px" }}>
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
            return (
              <div
                className="pointInfoOpened"
                key={i}
                onClick={() => handlePointClick(i)}
              >
                <p style={{ margin: "0px 0px 0px 0px", height: "30px" }}>
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
              Center map
            </p>
          </button>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            padding: "10px",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: "10px",
              height: "30%",
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
                <FaRegCheckCircle
                  size={20}
                  style={{
                    marginLeft: "-33px",
                    color: "darkgreen",
                    borderRadius: "25px",
                    backgroundColor: "#e2e2e2",
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
            padding: "10px",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: "10px",
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
              <FaRegCheckCircle
                size={20}
                style={{
                  marginLeft: "-33px",
                  color: "darkgreen",
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
            className={`route-save-style${
              routeName == "Unnamed" ||
              routeName == null ||
              originRef.current.value === "" ||
              destiantionRef.current.value === "" ||
              routeSelectedCountry == "" ||
              routeSelectedCountry == "Unknown" ||
              !routeCalculatedSuccesfully
                ? " disabled"
                : ""
            }`}
            id="saveRoute"
            onClick={() => saveRoute()}
            disabled={
              routeName == "Unnamed" ||
              routeName == null ||
              originRef.current.value === "" ||
              destiantionRef.current.value === "" ||
              routeSelectedCountry == "" ||
              routeSelectedCountry == "Unknown" ||
              !routeCalculatedSuccesfully
                ? "disabled"
                : ""
            }
          >
            {console.log(routeCalculatedSuccesfully)}
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
