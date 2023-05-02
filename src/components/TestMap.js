import React, { useRef, /*useEffect,*/ useState, createRef } from "react";
// import iconGPS from "../destination.png";
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

// import { decodePath } from "google.maps.geometry.encoding";
import { Button, ButtonGroup, IconButton, SkeletonText, Textarea } from "@chakra-ui/react";
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
import { RiRestaurantLine, RiGasStationLine } from "react-icons/ri";
import { GiBinoculars } from "react-icons/gi";
import { FiDownload } from "react-icons/fi";
import { func } from "prop-types";
import axios from "axios";
import countries from "./const/countries.json";

const CircularJSON = require("circular-json");
//TODO:
// kiekvienas routas turi aprasyma bendra ir tasku - kaip blog'as
// Db-> routai, new route -> db.
// Print list su id, pav, likes
//
// Sukurti user profili ir imones profili, imones profilis gali ikelti savo mark'a ir duoti jam info
//
//
// Paspaudimas ant žemėlapio pasirinkti tašką
//
//
//
export default function TestMap() {
  const centerPoint = { lat: 54.8985, lng: 23.9036 };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyClg0_pq0WTqIRVmRI10U2pQPZv7f5dQXQ", //"AIzaSyAiB_hv59Hb5MQol934V0jK-t9CVbc2JGY", //process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["geometry", "places"],
  });
  const google = window.google;
  // console.log(isLoaded.libraries);
  // console.log(libraries);
  const [map, setMap] = React.useState(null);
  const [directionsRendererInfo, setDirectionsRendererInfo] = React.useState(null);

  const [markersArray, setMarkersArray] = useState([]);
  const [marker, setMarker] = React.useState(null);
  const [infoWindow, setInfoWindow] = React.useState(null);
  const [places, setPlaces] = React.useState([]);
  const [placesState, setPlacesState] = React.useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  // const [curretMarkersOnTheMap, setCurretMarkersOnTheMap] = useState(null);
  //-------- Directions, paths, needs..

  const [restaurants, setRestaurants] = React.useState([]);
  const [rerenderStateForDifferentPath, setRerenderStateForDifferentPath] = useState(null);

  const [rerenderStateForDifferentNeed, setRerenderStateForDifferentNeed] = useState("NONE");
  const [routeSelectedCountry, setRouteSelectedCountry] = useState("Unknown");
  const [routeName, setRouteName] = useState("Unnamed");

  //--------
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
    console.log(isSectionOpen);
    setIsSectionOpen((prevState) => {
      const newState = [...prevState];
      newState[id] = !newState[id];
      return newState;
    });
  }
  //CHECK - FIX
  function handlePointClick(id) {
    console.log(isPointOpen);
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

  // .
  // .
  // .   IDEJOS
  // .  DARYTI JOG visi taskai butu vienam useState([]). Kuomet reikia skirtingu dalyku naudotis tuo vienu sarasu.
  // .  Taip pat isvalyti ji vienam metode, kuri issikviesti skirtingose vietose.
  // .
  // .
  // .

  // .
  // .
  // .

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
    // console.log("infoWindow ? null");
    if (infoWindow !== null) {
      // console.log("infoWindow != null");
      infoWindow.open(map, marker);
    }
  }, [infoWindow, map, marker]);

  const onInfoWindowClose = React.useCallback(() => {
    if (infoWindow !== null) {
      infoWindow.close();
    }
  }, [infoWindow]);

  const onInfoWindowClick = React.useCallback(() => {
    // console.log("aaaaaaaaaaaaa");
    const placesService = new window.google.maps.places.PlacesService(map);
    // console.log("placesService:", placesService);
    // console.log("marker.getPosition():", marker.getPosition());
    placesService.nearbySearch(
      {
        location: marker.getPosition(),
        radius: 5000,
        type: "restaurant",
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlaces(results);
          // console.log("results:", results);
        }
      }
    );

    infoWindow.close();
  }, [infoWindow, map, marker]);

  // .
  // .
  // .
  // .
  // .
  // .
  // .
  const handleSectionInputChange = (e) => {
    console.log(e.target.value);
    const updatedInputsValues = [...saveSectionInputValues];
    updatedInputsValues[e.target.id] = e.target.value;
    setSaveSectionInputValues(updatedInputsValues);
    console.log(e.target.id);
    console.log("saveSectionInputValues", saveSectionInputValues);
  };
  const handlePointInputChange = (e) => {
    console.log(e.target.value);
    const updatedInputsValues = [...savePointInputValues];
    updatedInputsValues[e.target.id] = e.target.value;
    setSavePointInputValues(updatedInputsValues);
    console.log("updatedInputsValues", updatedInputsValues);
    console.log(e.target.id);
    console.log("savePointInputValues", savePointInputValues);
  };
  // .
  // .
  // .

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
    // console.log("waypts", waypts);
  }

  const handleTravelTypeChange = (type) => (event) => {
    setTravelStyle(type);
    return type;
  };
  //Užduotis
  //Ant handleChoosenCountry -> gauti tos šalies miestus iš GOOGLE Maps API į -> console.log();

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
    // console.log(newState);
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

  //Warning: Each child in a list should have a unique "key" prop
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
        // </div>
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
      // setDirections(response);
      //   console.log(response.getDirections().routes[0].overview_polyline);
      //   // Get polyline from response and create Path object
      //   const polyline = response.getDirections().routes[0].overview_polyline;
      //   console.log("polyline", polyline);
      //   const path = new window.google.maps.Polyline({
      //     path: google.maps.geometry.encoding.decodePath(polyline),
      //   });
      //   console.log(path);
      //   // Search for restaurants along the path
      //   const placesService = new window.google.maps.places.PlacesService(
      //     document.createElement("div")
      //   );
      //   // gauna bet neprintina.. nerodo..
      //   path.getPath().forEach((latLng) => {
      //     console.log("111");
      //     placesService.nearbySearch(
      //       {
      //         location: latLng,
      //         radius: 1000, // search within 1km radius
      //         type: "restaurant",
      //       },
      //       (results, status) => {
      //         if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      //           setRestaurants((prevRestaurants) => [...prevRestaurants, ...results]);
      //         }
      //       }
      //     );
      //   });
      //   console.log(restaurants);
      //   // showRestaurants(response);
      //   console.log(restaurants.length);
      //   restaurants.forEach((waypoint) => {
      //     const marker = new window.google.maps.Marker(
      //       {
      //         position: waypoint.geometry.location,
      //         clickable: true,
      //         draggable: false,
      //         map: response.getMap(),
      //         title: `Step ${1}`,
      //         label: {
      //           text: `${1}`,
      //           color: "white",
      //         },
      //       }
      //       // onMarkerClick
      //     );
      //     // onelegArray.push(marker);
      //     // marker.addListener("click", () => {
      //     //   setSelectedMarker(index);
      //     // });
      //   });
    }
  };

  function showRestaurants(response) {
    console.log(restaurants.length);
    restaurants.forEach((waypoint) => {
      const marker = new window.google.maps.Marker(
        {
          position: waypoint.end_location,
          clickable: true,
          draggable: false,
          map: response.getMap(),
          title: `Step ${1}`,
          label: {
            text: `${1}`,
            color: "white",
          },
        }
        // onMarkerClick
      );
      // onelegArray.push(marker);
      // marker.addListener("click", () => {
      //   setSelectedMarker(index);
      // });
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
    console.log("fixedWaypoints2", fixedWaypoints2);
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

    console.log("originRef.current.value:", originRef.current.value);
    console.log("fixedWaypoints2:", fixedWaypoints2);
    console.log("destiantionRef.current.value:", destiantionRef.current.value);
    const routeMarkersLocations = [];
    routeMarkersLocations.push({
      location: originRef.current.value,
    });
    fixedWaypoints2.map((item) => {
      console.log("fixed -> routeMarkersLocations:", item.location);
      routeMarkersLocations.push({
        location: item.location,
      });
      return item;
    });
    routeMarkersLocations.push({
      location: destiantionRef.current.value,
    });
    console.log("fixedWaypoints2.length", fixedWaypoints2.length);
    setSavePointInputValues(Array.from({ length: fixedWaypoints2.length + 2 }).fill(""));
    console.log(routeMarkersLocations);
    console.log("-----=-=-=-=-=:", savePointInputValues);
    //REIKIA PERDUOTI
    /*
originRef.current.value
destiantionRef.current.value
    */
    // console.log("originRef", originRef.current.value);
    // console.log("fixedWaypoints2", fixedWaypoints2);
    // const ccaa = JSON.stringify(fixedWaypoints2);
    // console.log("ccaa", ccaa);
    // console.log("destiantionRef", destiantionRef.current.value);
    setDirectionsResponse(results); // UPDATE TIK IS 2 KARTO! REIK TVARKYT // AUTOCOMPLETED MAIN WAYPOINTS
    setDirectionsRendererInfo(results);
    const dataOriginLatLng = {
      lat: results.routes[0].legs[0].start_location.lat(),
      lng: results.routes[0].legs[0].start_location.lng(),
    };

    setOriginLatLng(dataOriginLatLng);
    console.log("results for points get: ", results);
    //Atstumu skaiciavimai
    const distancesBetween = [];
    results.routes[0].legs.map((item) => {
      distancesBetween.push({
        start_address: item.start_address,
        end_address: item.end_address,
        distance: item.distance.text,
        duration: item.duration.text,
      });
      // console.log("----", item);
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
      var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(data)))], {
        type: contentType,
      });
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      var a = document.createElement("a");
      a.download = filename;
      a.href = "data:" + contentType + "," + encodeURIComponent(JSON.stringify(data));
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  // function getMapPoints() {
  //   console.log("directionsRendererInfo", directionsRendererInfo);
  //   if (directionsRendererInfo !== null) {
  //     const infoWindow = new google.maps.InfoWindow();
  //     fixedWaypoints2.addListener("dragend", (event) => {
  //       const position = draggableMarker.position;

  //       infoWindow.close();
  //       infoWindow.setContent(`Pin dropped at: ${position.lat()}, ${position.lng()}`);
  //       infoWindow.open(draggableMarker.map, draggableMarker);
  //     });

  //     // const markers = mapRef.current.getMarkers();
  //     // const markers = directionsRendererInfo; // .current.getMarkers();
  //     // console.log("markers", markers);
  //   }
  // }
  function exportMap() {
    const exportData = {
      origin: [originRef.current.value],
      midWaypoints: fixedWaypoints,
      destiantion: [destiantionRef.current.value],
    };
    const ccaa = JSON.stringify(exportData);
    console.log("ccaa", ccaa);

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

    // console.log(map.length);
    // console.log(map);
  }
  const convertSectionDescriptionsForDb = (savedSectionsValues) => {
    const descForDB = [];
    console.log("convertSectionDescriptionsForDb", savedSectionsValues);
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
    console.log("convertPointDescriptionsForDb", savedPointsValues);
    savedPointsValues.map((item, i) => {
      if (item === null) {
        //|| item === ""
        return item;
      } else {
        console.log("item", item);
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
    setRouteSelectedCountry(event.target.value);
    console.log(event.target.value);
  }
  function handleRouteNameChange() {
    const val = document.getElementById("routeName").value;
    setRouteName(val);
    console.log(val);
  }
  function saveRoute() {
    // event.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const headers = {
      Authorization: `Bearer ${user.accessToken}`,
    };
    const sectionDescForDB = convertSectionDescriptionsForDb(saveSectionInputValues);
    console.log("sectionDescForDB", sectionDescForDB);
    saveSectionInputValues.map((item, i) => {
      console.log("asasasa", item, "---", i);
      setDisabledSectionInputs[i] == "disabled";
      // disabled
    });
    console.log("saveSectionInputValues", saveSectionInputValues);
    const pointDescForDB = convertPointDescriptionsForDb(savePointInputValues);
    console.log("pointDescForDB", pointDescForDB);
    savePointInputValues.map((item, i) => {
      console.log("asasasa", item, "---", i);
      setDisabledPointInputs[i] == "disabled";
      // disabled
    });
    console.log("savePointInputValues", savePointInputValues);
    const exportData = {
      origin: originRef.current.value,
      midWaypoints: fixedWaypoints,
      destiantion: destiantionRef.current.value,
    };
    console.log(exportData.origin);
    console.log(exportData.midWaypoints);
    console.log(exportData.destiantion);
    console.log("sectionDescForDB", sectionDescForDB);
    console.log("pointDescForDB", pointDescForDB);
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

    // setDisabledPointInputs;cd
    console.log("Save route");
  }
  return (
    <>
      <div className="input-container">
        <div className="container-small">
          {/*ERROR: unknown key warning */}
          <div className="container-small left">{ShowInputsState(data)}</div>
          <div className="container-small right">
            <div className="box">
              <Autocomplete autoHighlight={true}>
                <input
                  key={1}
                  type="text"
                  placeholder="Origin"
                  ref={originRef}
                  onBlur={emptyInput(1)} // , "done"
                />
              </Autocomplete>
            </div>

            {extraInputs.map((item, i) => {
              return (
                <div className="box">
                  <Autocomplete>
                    <input
                      key={i + 1}
                      // id={i}
                      ref={waypoints[i]}
                      type="text"
                      placeholder="Location"
                      // ref={originRef}
                      onBlur={emptyInput(i + 2)} // , "done"
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
                  onBlur={emptyInput(10)} // , "done"
                />
              </Autocomplete>
            </div>
            <ButtonGroup>
              <Button
                style={{
                  backgroundColor: "#177a23",
                  border: "1px solid rgba(72,91,35,0.5)",
                  borderRadius: "8px",
                }}
                colorScheme="pink"
                type="submit"
                onClick={calculateRoute}
              >
                Calculate Route
              </Button>

              <IconButton
                aria-label="center back"
                icon={<FaTimes />}
                onClick={clearRoute}
                // TODO:
                //clear mid-waypoints
              />
              <IconButton
                aria-label="center back"
                icon={<FaWalking />}
                onClick={handleTravelTypeChange("WALKING")}
                // TODO:
                //walking style
              />
              <IconButton
                aria-label="center back"
                icon={<FaCarSide />}
                onClick={handleTravelTypeChange("DRIVING")}
                // TODO:
                //driving style
              />
            </ButtonGroup>
          </div>
        </div>
        <p></p>
        <ul className="dropdown-content" style={{ color: "white", padding: "0px 0px 0px 0px" }}>
          {sectionBetweenPoints.map((item, i) => {
            //SECTION
            return (
              <div className="pointInfoOpened" key={i} onClick={() => handleSectionClick(i)}>
                <p style={{ margin: "0px 0px 0px 0px", height: "30px" }}>
                  {/* Click me to {isOpen[i] ? "hide" : "show"} the content! */}
                  {item.start_address.substring(0, item.start_address.indexOf(","))} -{" "}
                  {item.end_address.substring(0, item.end_address.indexOf(","))}
                </p>
                {isSectionOpen[i] && (
                  <div key={i}>
                    <p>1 - {item.start_address}</p>
                    <p>2 - {item.end_address}</p>
                    <p>Distance: {item.distance}</p>
                    <p>Duration : {item.duration}</p>
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
                        placeholder="Route Section Description"
                        className="pointInfoOpenedInput" //FIX -SECTION POINT??
                        onChange={handleSectionInputChange}
                        disabled={disabledSectionInputs[i] ? "enabled" : ""}
                      />
                    </div>
                    <div className="route-part-icons">
                      <IconButton
                        className="route-part-icons icont-button"
                        aria-label="center back"
                        icon={<RiRestaurantLine size={30} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleTravelTypeChange("WALKING");
                          setRerenderStateForDifferentPath(i); //which path
                          setRerenderStateForDifferentNeed("RESTAURANT"); //which type of services
                          setTimeout(() => {
                            reloadDirectionsRenderer();
                          }, 2000);
                        }}
                        // TODO:
                        // Show all restaurant around
                      />
                      <IconButton
                        className="route-part-icons icont-button"
                        aria-label="center back"
                        icon={<GiBinoculars size={30} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleTravelTypeChange("WALKING");
                          setRerenderStateForDifferentPath(i); //which path
                          setRerenderStateForDifferentNeed("SIGNSEEING"); //which type of services
                          reloadDirectionsRenderer();
                        }}
                        // TODO:
                        // Show all signseeing places
                      />
                      <IconButton
                        className="route-part-icons icont-button"
                        aria-label="center back"
                        icon={<RiGasStationLine size={30} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleTravelTypeChange("WALKING");
                          setRerenderStateForDifferentPath(i); //which path
                          setRerenderStateForDifferentNeed("GASSTATION"); //which type of services
                          reloadDirectionsRenderer();
                        }}
                        // TODO:
                        // Show all gas stations
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </ul>
        <ul className="dropdown-content" style={{ color: "white", padding: "0px 0px 0px 0px" }}>
          {routePoints.map((item, i) => {
            //POINT
            return (
              <div className="pointInfoOpened" key={i} onClick={() => handlePointClick(i)}>
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
                        //next todo
                      />
                      {/* {textAreaValue && <p key={i}>You entered: {textAreaValue}</p>} */}
                    </div>
                    <div className="route-part-icons">
                      <IconButton
                        className="route-part-icons icont-button"
                        aria-label="center back"
                        icon={<RiRestaurantLine size={30} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleTravelTypeChange("WALKING");
                          setRerenderStateForDifferentPath(i); //which path
                          setRerenderStateForDifferentNeed("RESTAURANT"); //which type of services
                          setTimeout(() => {
                            reloadDirectionsRenderer();
                          }, 2000);
                        }}
                        // TODO:
                        // Show all restaurant around
                      />
                      <IconButton
                        className="route-part-icons icont-button"
                        aria-label="center back"
                        icon={<GiBinoculars size={30} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleTravelTypeChange("WALKING");
                          setRerenderStateForDifferentPath(i); //which path
                          setRerenderStateForDifferentNeed("SIGNSEEING"); //which type of services
                          reloadDirectionsRenderer();
                        }}
                        // TODO:
                        // Show all signseeing places
                      />
                      <IconButton
                        className="route-part-icons icont-button"
                        aria-label="center back"
                        icon={<RiGasStationLine size={30} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          // handleTravelTypeChange("WALKING");
                          setRerenderStateForDifferentPath(i); //which path
                          setRerenderStateForDifferentNeed("GASSTATION"); //which type of services
                          reloadDirectionsRenderer();
                        }}
                        // TODO:
                        // Show all gas stations
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </ul>
        <div className="box">
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(originLatLng);
              map.setZoom(9);
            }}
          />
        </div>
        <div className="box">
          <IconButton
            width="50px"
            height="50px"
            aria-label="center back"
            icon={<FiDownload />}
            isRound
            onClick={() => {
              exportMap();
              // map.panTo(originLatLng);
              // map.setZoom(9);
            }}
          />
        </div>
        <button
          id="saveRoute"
          style={{ width: "100px", height: "100px" }}
          onClick={() => saveRoute()}
        >
          Save
        </button>

        <div>
          <select value={routeSelectedCountry} onChange={handleCountrySelect}>
            <option value="">-- Select a country --</option>
            {countries.map((country, i) => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          <p>Selected country: {routeSelectedCountry}</p>
        </div>
        <div>
          <input type="text" id={"routeName"} placeholder="Route name"></input>
          <button onClick={handleRouteNameChange}>sd</button>
        </div>

        {/* <div className="box">
          <IconButton
            width="50px"
            height="50px"
            aria-label="center back"
            icon={<AiFillCheckCircle />}
            isRound
            onClick={() => {
              getMapPoints();
            }}
          />
        </div> */}
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
        {/* <Marker
          position={originLatLng} // marker pos,for infowindow
          onLoad={onMarkerLoad}
          onClick={onMarkerClick}
        /> */}
        {/* {infoWindow !== null && (
          <InfoWindow
            position={originLatLng} // infowindow position
            onCloseClick={onInfoWindowClose}
            onLoad={() => {
              infoWindow.open(map, marker);
              console.log("clickas", marker);
              console.log("clickas", map);
              console.log("clickas", originLatLng);
            }}
          >
            <div onClick={onInfoWindowClick}>
              Click here to find Restaurants
            </div>
          </InfoWindow>
        )}{" "}
        {infoWindow === null && <p>cdscd</p>} */}

        {/* VEIKIA TACIAU - SPAWNINA TA PATI, REIKIA PERDARYTI JOG PRADINIAI MARKERPOINTAI BUTU KAS 10-20KM ARBA KAZKAIP KITAIP PRASTUMDYTI JUOS. */}

        {
          (placesState === true && console.log("places--------------------------", places),
          places.map(
            // console.log("places--------------------------", place),
            (place) =>
              place.map((x) => (
                <Marker key={x.place_id} position={x.geometry.location} />
                // console.log("places--------------------------", place)
              ))
          ))
        }
        {directionsResponse && (
          <DirectionsRenderer
            key={directionsRendererKey} // Naujas key - dirbam is naujo
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

// const directionsRendererCallback = (directionsRenderer) => {
//   console.log("directionsRenderer", directionsRenderer);
//   directionsRendererRef.current = directionsRenderer;
//   if (directionsRenderer !== null) {
//     // clean up map direction points
//     if (markersArray !== null) {
//       console.log("markersArray", markersArray);
//       for (let i = 0; i < markersArray.length; i++) {
//         const element = markersArray[i]; //[i][j]
//         element.setMap(null);
//       }
//     }
//     if (rerenderStateForDifferentPath !== null && rerenderStateForDifferentNeed !== "NONE") {
//       setPlaces([]);
//       setPlacesState(false);
//       const pathIndex = rerenderStateForDifferentPath;
//       const arr = [];
//       var index = 0;
//       const onelegArray = [];
//       const waypoints = directionsRenderer.getDirections().routes[0].legs[pathIndex].steps;
//       switch (rerenderStateForDifferentNeed) {
//         case "RESTAURANT":
//           waypoints.forEach((waypoint) => {
//             // papildomu mark'u generavimas
//             const marker = new window.google.maps.Marker(
//               {
//                 position: waypoint.end_location,
//                 clickable: true,
//                 draggable: false,
//                 map: directionsRenderer.getMap(),
//                 title: `Step ${index + 1}`,
//                 label: {
//                   text: `${index + 1}`,
//                   color: "black",
//                 },
//                 // icon: markerIcon,
//               }
//               // onMarkerClick
//             );
//             index = index + 1;
//             onelegArray.push(marker);
//             marker.addListener("click", () => {
//               setSelectedMarker(index);
//             });
//           });

//           setMarkersArray(onelegArray);

//           // TODO !
//           // perkelti i kita metoda, tiek daug skirtingu reikalu cia but negali !!!
//           const placesService = new window.google.maps.places.PlacesService(map);
//           console.log("markersArray", markersArray);
//           if (markersArray !== null) {
//             for (let i = 0; i < markersArray.length; i++) {
//               // for (let j = 0; j < markersArray[i].length; j++) {
//               const marker = markersArray[i]; //[i][j]
//               placesService.nearbySearch(
//                 {
//                   location: marker.getPosition(),
//                   radius: 5000,
//                   type: "restaurant",
//                 },
//                 (results, status) => {
//                   if (status === window.google.maps.places.PlacesServiceStatus.OK) {
//                     setPlaces((places) => [...places, results]);
//                     console.log("results after nearbySearch:", marker, results);
//                   }
//                 }
//               );
//               // }
//             }
//             console.log("SWITCH METHOD --- ARRAY OF PLACES:", places);
//           } else if (markersArray === null) {
//             return console.log("RESTAURANT       markersArray === null");
//           }

//           setPlacesState(true);

//           // infoWindow.close();
//           // }, [infoWindow, map, marker]);
//           return console.log("RESTAURANT");
//         case "SIGNSEEING":
//           // waypoints.forEach((waypoint) => {
//           //   const marker = new window.google.maps.Marker(
//           //     {
//           //       position: waypoint.end_location,
//           //       clickable: true,
//           //       draggable: false,
//           //       map: directionsRenderer.getMap(),
//           //       title: `Step ${index + 1}`,
//           //       label: {
//           //         text: `${index + 1}`,
//           //         color: "white",
//           //       },
//           //     },
//           //     onMarkerClick
//           //   );
//           //   index = index + 1;
//           //   onelegArray.push(marker);
//           //   marker.addListener("click", () => {
//           //     setSelectedMarker(index);
//           //   });
//           // });

//           // arr.push(onelegArray);
//           // setMarkersArray(arr);
//           return console.log("SIGNSEEING");
//         case "GASSTATION":
//           // waypoints.forEach((waypoint) => {
//           //   const marker = new window.google.maps.Marker(
//           //     {
//           //       position: waypoint.end_location,
//           //       clickable: true,
//           //       draggable: false,
//           //       map: directionsRenderer.getMap(),
//           //       title: `Step ${index + 1}`,
//           //       label: {
//           //         text: `${index + 1}`,
//           //         color: "white",
//           //       },
//           //     },
//           //     onMarkerClick
//           //   );
//           //   index = index + 1;
//           //   onelegArray.push(marker);
//           //   marker.addListener("click", () => {
//           //     setSelectedMarker(index);
//           //   });
//           // });

//           // arr.push(onelegArray);
//           // setMarkersArray(arr);
//           return console.log("GASSTATION");
//         default:
//           waypoints.forEach((waypoint) => {
//             const marker = new window.google.maps.Marker(
//               {
//                 position: waypoint.end_location,
//                 clickable: true,
//                 draggable: false,
//                 map: directionsRenderer.getMap(),
//                 title: `Step ${index + 1}`,
//                 label: {
//                   text: `${index + 1}`,
//                   color: "white",
//                 },
//               },
//               onMarkerClick
//             );
//             index = index + 1;
//             onelegArray.push(marker);
//             marker.addListener("click", () => {
//               setSelectedMarker(index);
//             });
//           });
//           setMarkersArray(onelegArray);
//           return console.log("++++DEFAULT----");
//       }
//     } else if (
//       rerenderStateForDifferentPath === null &&
//       rerenderStateForDifferentNeed === "NONE"
//     ) {
//       return false;
//     }
//   }
// };
