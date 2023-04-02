import React, { useRef, useEffect, useState, createRef } from "react";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import {
  // Box,
  Button,
  ButtonGroup,
  // Flex,
  // HStack,
  IconButton,
  // Input,
  SkeletonText,
  // Text,
} from "@chakra-ui/react";
import {
  FaLocationArrow,
  FaTimes,
  FaCircle,
  FaDotCircle,
  FaRegCircle,
  FaRegCheckCircle,
  FaPlusCircle,
  FaArrowRight,
} from "react-icons/fa";

export default function TestMap() {
  const center = { lat: 54.8985, lng: 23.9036 };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAiB_hv59Hb5MQol934V0jK-t9CVbc2JGY", //process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
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

  // console.log(waypoints);

  function testPrint() {
    const waypts = [];
    waypoints.map((item) => {
      if (item.current === null) {
        return;
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
    // console.log("waypts", waypts);
  }
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
  const ShowInputsState = (data) => {
    return Object.keys(data).map((key) => {
      // eslint-disable-next-line
      return Array.isArray(data) && data[key].inputValue === "Done" ? (
        <div className="container-small left icons">
          <FaRegCheckCircle
            color="#177a23" //"#1f4b56"
            className={data[key].id}
            value={data[key].inputValue}
          />
        </div>
      ) : data[key].inputValue === "empty" ? (
        <div className="container-small left icons">
          <FaRegCircle
            color="#550a0f"
            className={data[key].id}
            value={data[key].inputValue}
          />
        </div>
      ) : data[key].inputValue === "extra" ? (
        <div className="container-small left icons">
          <FaArrowRight
            color="#177a23" //"#873e23"
            className={data[key].id}
            value={data[key].inputValue}
          />
        </div>
      ) : (
        <></>
      );
    });
  };
  if (!isLoaded) {
    return <SkeletonText />;
  }

  async function calculateRoute() {
    testPrint();
    // console.log("originRef.current.value:", originRef.current.value);
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      waypoints: fixedWaypoints,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    //results.routes[0].legs[0] - legs[0] legs[1] legs[2] ..
    setDirectionsResponse(results);
    // console.log(results.routes[0].legs);
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
    // console.log(distancesBetweenPoints);
    // if (item.current === null) {
    //   return;
    // } else {
    //   distancesBetweenPoints.push({
    //     start_address: item.routes.legs,
    //     end_address: item.routes.legs,
    //     distance: item.routes.legs.distance.text,
    //     duration: true,
    //   });
    //   console.log(item.current.value);
    //   return item;
    // }

    // setfixedWaypoints(waypts);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  // console.log(distancesBetweenPoints);
  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    setDistancesBetweenPoints([]);
    originRef.current.value = "";
    destiantionRef.current.value = "";
  }

  return (
    <>
      <div
        className="input-container"
        // spacing={2}
        // justifyContent="space-between"
      >
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
            <div className="box">
              <FaPlusCircle
                className="plusButton"
                color="#177a23"
                alt="logo"
                onClick={AddNewInputField}
              ></FaPlusCircle>
            </div>
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
              />
            </ButtonGroup>
          </div>
          {/* </div> */}
        </div>
        {/* <div class="dropdown">
  <button class="dropbtn">Dropdown</button>
  <div class="dropdown-content">
    <a href="#">Link 1</a>
    <a href="#">Link 2</a>
    <a href="#">Link 3</a>
  </div>
</div> */}

        {/* <div onClick={handleClick}>
          <p>Click me to {isOpen ? "hide" : "show"} the content!</p>
          {isOpen && <div>Content goes here.</div>}
        </div> */}

        <p></p>
        <ul
          class="dropdown-content"
          style={{ color: "white", padding: "0px 0px 0px 0px" }}
        >
          {distancesBetweenPoints.map((item, i) => {
            // console.log(item);
            console.log(isOpen);
            return (
              <div key={i} onClick={() => handleClick(i)}>
                <p style={{ backgroundColor: "black" }}>
                  Click me to {isOpen[i] ? "hide" : "show"} the content!
                </p>
                {isOpen[i] && (
                  <div>
                    <p>
                      Distance between : {item.start_address} and{" "}
                      {item.end_address}
                    </p>
                    <p>Distance: {item.distance}</p>
                    <p>Duration : {item.duration}</p>
                  </div>
                )}
              </div>
            );
            // return (
            //   <li className="result-box" style={{ padding: "0px 0px 0px 0px" }}>
            //     <p>
            //       Distance between : {item.start_address} and {item.end_address}{" "}
            //     </p>
            //     <p>Distance: {item.distance}</p>
            //     <p>Duration : {item.duration}</p>
            //   </li>
            // );
          })}
        </ul>
        <div className="box">
          {/* <p>Travel Duration : {duration} </p> */}
          <IconButton
            aria-label="center back"
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center);
              map.setZoom(15);
            }}
          />
        </div>
      </div>

      <GoogleMap
        center={center}
        zoom={7}
        mapContainerClassName="only-map-container"
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
        onLoad={(map) => setMap(map)}
      >
        <Marker position={center} />
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
    </>
  );
}
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
// .
// .
// .
// .
// .
// .
{
  /* <Flex
          position="relative"
          flexDirection="column"
          alignItems="center"
          h="100vh"
          w="50vw"
          right={0}
        >
          // position="absolute" left={0} top={0} h="100%" w="100%" 
          <Box
            // className="only-map-container"
            position="absolute"
            left={0}
            top={0}
            h="50%"
            w="50%"
          >
            <GoogleMap
              center={center}
              zoom={7}
              mapContainerClassName="only-map-container"
              options={{
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
              onLoad={(map) => setMap(map)}
            >
              <Marker position={center} />
              {directionsResponse && (
                <DirectionsRenderer directions={directionsResponse} />
              )}
            </GoogleMap>
          </Box>
          <Box
            p={4}
            borderRadius="lg"
            m={4}
            bgColor="white"
            shadow="base"
            minh="100px"
            minW="200px" //minW="container.md"
            zIndex="1"
          >
            <HStack spacing={2} justifyContent="space-between">
              <Box flexGrow={1}>
                <Autocomplete>
                  <input type="text" placeholder="Origin" ref={originRef} />
                </Autocomplete>
              </Box>
              <Box flexGrow={1}>
                <Autocomplete>
                  <input
                    type="text"
                    placeholder="Destination"
                    ref={destiantionRef}
                  />
                </Autocomplete>
              </Box> */
}

{
  /* <ButtonGroup>
                <Button
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
                />
              </ButtonGroup> */
}
{
  /* </HStack>
            <HStack spacing={4} mt={4} justifyContent="space-between">
              <Text>Distance: {distance} </Text>
              <Text>Duration: {duration} </Text>
              <IconButton
                aria-label="center back"
                icon={<FaLocationArrow />}
                isRound
                onClick={() => {
                  map.panTo(center);
                  map.setZoom(15);
                }}
              />*/
}
{
  /* </HStack>
          </Box>
        </Flex> */
}
{
  /* </div> */
}
