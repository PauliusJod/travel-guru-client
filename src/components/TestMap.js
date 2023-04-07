import React, { useRef, /*useEffect,*/ useState, createRef } from "react";
import iconGPS from "../destination.png";
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
import { RiRestaurantLine, RiGasStationLine } from "react-icons/ri";
import { GiBinoculars } from "react-icons/gi";

//TODO:
//
// Paspaudimas ant žemėlapio pasirinkti tašką
//
//
//
//
//
//
//
//
//
//
//
// const divStyle = {
//   background: `black`,
//   border: `1px solid #ccc`,
//   padding: 15,
// };
export default function TestMap() {
  const centerPoint = { lat: 54.8985, lng: 23.9036 };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAiB_hv59Hb5MQol934V0jK-t9CVbc2JGY", //process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const google = window.google;
  // console.log(isLoaded.libraries);
  // console.log(libraries);
  const [map, setMap] = React.useState(null);

  const [markersArray, setMarkersArray] = useState([]);
  const [marker, setMarker] = React.useState(null);
  const [infoWindow, setInfoWindow] = React.useState(null);
  const [places, setPlaces] = React.useState([]);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  // const [curretMarkersOnTheMap, setCurretMarkersOnTheMap] = useState(null);
  //-------- Directions, paths, needs..

  const [rerenderStateForDifferentPath, setRerenderStateForDifferentPath] =
    useState(null);

  const [rerenderStateForDifferentNeed, setRerenderStateForDifferentNeed] =
    useState("NONE");

  //--------

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [originLatLng, setOriginLatLng] = useState(centerPoint);
  const [travelStyle, setTravelStyle] = useState("DRIVING");
  // const [distance, setDistance] = useState("");
  // const [duration, setDuration] = useState("");

  const [distancesBetweenPoints, setDistancesBetweenPoints] = useState([]);
  const [isOpen, setIsOpen] = useState([false, false]);
  // console.log("aa", isOpen);
  function handleClick(id) {
    setIsOpen((prevState) => {
      const newState = [...prevState];
      newState[id] = !newState[id];
      return newState;
    });
  }
  // const onLoad = (data) => {
  //   console.log("data: ", data);
  // };
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

  const directionsRendererRef = useRef(null);
  const [directionsRendererKey, setDirectionsRendererKey] = useState(1);

  const originRef = useRef();
  const destiantionRef = useRef();
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
  // .
  // .
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

  // .
  // .
  // .
  // console.log(waypoints);

  function testPrint() {
    const waypts = [];
    waypoints.map((item) => {
      if (item.current === null) {
        return item;
      } else {
        waypts.push({
          location: item.current.value,
          stopover: true,
        });
        // console.log(item.current.value);
        return item;
      }
    });
    setfixedWaypoints(waypts);
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
      return [
        ...allExtras,
        <div className="box">
          {/* <Autocomplete>
            <input
              type="text"
              placeholder="Middle point"
              // ref={originRef}
              onBlur={emptyInput(1)} // , "done"
            />
          </Autocomplete> */}
        </div>,
      ];
    });
    // console.log(extraInputs[0]);
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

  const directionsRendererCallback = (directionsRenderer) => {
    console.log("directionsRenderer", directionsRenderer);
    directionsRendererRef.current = directionsRenderer;
    if (directionsRenderer !== null) {
      // clean up map direction points
      if (markersArray !== null) {
        console.log("markersArray", markersArray);
        for (let i = 0; i < markersArray.length; i++) {
          for (let j = 0; j < markersArray[i].length; j++) {
            const element = markersArray[i][j];
            // console.log(element);
            element.setMap(null);
          }
        }
      }
      // const markerIcon = {
      //   url: "travel-guru-client/src/gps.png", // URL of the icon image
      //   scaledSize: new window.google.maps.Size(30, 30), // size of the icon
      //   origin: new window.google.maps.Point(0, 0), // origin of the icon (usually 0,0)
      //   anchor: new window.google.maps.Point(15, 15), // anchor point of the icon (where it will be placed on the map)
      // };
      if (
        rerenderStateForDifferentPath !== null &&
        rerenderStateForDifferentNeed !== "NONE"
      ) {
        const pathIndex = rerenderStateForDifferentPath;
        const arr = [];
        var index = 0;
        const onelegArray = [];
        const waypoints =
          directionsRenderer.getDirections().routes[0].legs[pathIndex].steps;
        switch (rerenderStateForDifferentNeed) {
          case "RESTAURANT":
            waypoints.forEach((waypoint) => {
              const marker = new window.google.maps.Marker(
                {
                  position: waypoint.end_location,
                  clickable: true,
                  draggable: false,
                  map: directionsRenderer.getMap(),
                  title: `Step ${index + 1}`,
                  label: {
                    text: `${index + 1}`,
                    color: "black",
                  },
                  // icon: markerIcon,
                },
                onMarkerClick
              );
              index = index + 1;
              onelegArray.push(marker);
              marker.addListener("click", () => {
                setSelectedMarker(index);
              });
            });

            arr.push(onelegArray);
            setMarkersArray(arr);

            return console.log("RESTAURANT");
          case "SIGNSEEING":
            waypoints.forEach((waypoint) => {
              const marker = new window.google.maps.Marker(
                {
                  position: waypoint.end_location,
                  clickable: true,
                  draggable: false,
                  map: directionsRenderer.getMap(),
                  title: `Step ${index + 1}`,
                  label: {
                    text: `${index + 1}`,
                    color: "white",
                  },
                },
                onMarkerClick
              );
              index = index + 1;
              onelegArray.push(marker);
              marker.addListener("click", () => {
                setSelectedMarker(index);
              });
            });

            arr.push(onelegArray);
            setMarkersArray(arr);
            return console.log("SIGNSEEING");
          case "GASSTATION":
            waypoints.forEach((waypoint) => {
              const marker = new window.google.maps.Marker(
                {
                  position: waypoint.end_location,
                  clickable: true,
                  draggable: false,
                  map: directionsRenderer.getMap(),
                  title: `Step ${index + 1}`,
                  label: {
                    text: `${index + 1}`,
                    color: "white",
                  },
                },
                onMarkerClick
              );
              index = index + 1;
              onelegArray.push(marker);
              marker.addListener("click", () => {
                setSelectedMarker(index);
              });
            });

            arr.push(onelegArray);
            setMarkersArray(arr);
            return console.log("GASSTATION");
          default:
            waypoints.forEach((waypoint) => {
              const marker = new window.google.maps.Marker(
                {
                  position: waypoint.end_location,
                  clickable: true,
                  draggable: false,
                  map: directionsRenderer.getMap(),
                  title: `Step ${index + 1}`,
                  label: {
                    text: `${index + 1}`,
                    color: "white",
                  },
                },
                onMarkerClick
              );
              index = index + 1;
              onelegArray.push(marker);
              marker.addListener("click", () => {
                setSelectedMarker(index);
              });
            });

            arr.push(onelegArray);
            setMarkersArray(arr);
            return console.log("++++DEFAULT----");
        }
        console.log("if");
      } else if (
        rerenderStateForDifferentPath === null &&
        rerenderStateForDifferentNeed === "NONE"
      ) {
        console.log("else if");
        const arr = [];
        var index = 0;
        // var arrayIndex = 0;
        console.log("directionsRenderer", directionsRenderer);
        for (
          let i = 0;
          i < directionsRenderer.getDirections().routes[0].legs.length;
          i++
        ) {
          const onelegArray = [];
          const waypoints =
            directionsRenderer.getDirections().routes[0].legs[i].steps;
          waypoints.forEach((waypoint) => {
            const marker = new window.google.maps.Marker(
              {
                position: waypoint.end_location,
                clickable: true,
                draggable: false,
                // key: { index },
                map: directionsRenderer.getMap(),
                title: `Step ${index + 1}`,
                label: {
                  text: `${index + 1}`,
                  color: "white",
                },
              },
              onMarkerClick
            );
            index = index + 1;
            onelegArray.push(marker);
            // console.log("arr[i].push(marker): ", arrayIndex);
            marker.addListener("click", () => {
              // console.log("aaaaaa", index, marker);
              setSelectedMarker(index);
            });
          });

          arr.push(onelegArray);
        }
        setMarkersArray(arr);
        console.log("Arr: ", arr);
        // setCurretMarkersOnTheMap(waypoints);
      }
    }
  };

  const reloadDirectionsBetweenChoosenPoints = () => {};

  const reloadDirectionsRenderer = () => {
    // increment the key to force a re-render of the DirectionsRenderer component
    setDirectionsRendererKey((prevKey) => prevKey + 1);
  };
  async function calculateRoute() {
    const fixedWaypoints2 = testPrint();
    setRerenderStateForDifferentPath(null);
    setRerenderStateForDifferentNeed("NONE");
    // if (directionsRendererRef.current !== null) {
    //   directionsRendererRef.current.setMap(null);
    // }
    // console.log("originRef.current.value:", originRef.current.value);
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // const center = { lat: 54.8985, lng: 23.9036 };

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      waypoints: fixedWaypoints2,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: travelStyle,
    });
    // console.log("fixedWaypoints", fixedWaypoints);

    setDirectionsResponse(results); // UPDATE TIK IS 2 KARTO! REIK TVARKYT
    // console.log("directionsResponse", directionsResponse);

    const dataOriginLatLng = {
      lat: results.routes[0].legs[0].start_location.lat(),
      lng: results.routes[0].legs[0].start_location.lng(),
    };

    // console.log("dataOriginLatLng", dataOriginLatLng);
    // console.log("results.routes[0]", results.routes[0]);
    setOriginLatLng(dataOriginLatLng);

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

    setDistancesBetweenPoints(distancesBetween);
    // console.log(distancesBetween);
    reloadDirectionsRenderer();
    // setDistance(results.routes[0].legs[0].distance.text);
    // setDuration(results.routes[0].legs[0].duration.text);
  }

  // console.log(distancesBetweenPoints);
  function clearRoute() {
    setDirectionsResponse(null);
    // setDistance("");
    // setDuration("");
    setDistancesBetweenPoints([]);
    setExtraInputs([]);
    setData(initialState);
    setOriginLatLng(centerPoint);
    // console.log("data", data);
    originRef.current.value = "";
    destiantionRef.current.value = "";
    // directionsRendererRef.current.value = "";
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
                  onBlur={emptyInput(1)} // , "done"
                />
              </Autocomplete>
            </div>

            {/* ++++ */}
            {/* {console.log(extraInputs)} */}
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
        <ul
          className="dropdown-content"
          style={{ color: "white", padding: "0px 0px 0px 0px" }}
        >
          {distancesBetweenPoints.map((item, i) => {
            // console.log(item);
            // console.log(isOpen);
            return (
              <div
                className="pointInfoOpened"
                key={i}
                onClick={() => handleClick(i)}
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
                {isOpen[i] && (
                  <div key={i}>
                    <p>1 - {item.start_address}</p>
                    <p>2 - {item.end_address}</p>
                    <p>Distance: {item.distance}</p>
                    <p>Duration : {item.duration}</p>
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
                          reloadDirectionsRenderer();
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
                    {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        reloadDirectionsRenderer();
                      }}
                    >
                      Reload DirectionsRenderer
                    </button> */}
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
        <Marker
          position={originLatLng}
          onLoad={onMarkerLoad}
          onClick={onMarkerClick}
        />
        {infoWindow !== null && (
          <InfoWindow
            position={originLatLng}
            onCloseClick={onInfoWindowClose}
            onLoad={() => infoWindow.open(map, marker)}
          >
            <div onClick={onInfoWindowClick}>
              Click here to find Restaurants
            </div>
          </InfoWindow>
        )}{" "}
        {infoWindow === null && <p>cdscd</p>}
        {places.map((place) => (
          <Marker key={place.place_id} position={place.geometry.location} />
        ))}
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
