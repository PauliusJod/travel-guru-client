import React, { useRef, useState } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";

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

  const [isCountryChoosen, setIsCountryChoosen] = useState(false);
  const originRef = useRef();
  const destiantionRef = useRef();

  const [isA, setA] = useState("---");
  //Užduotis
  //Ant handleChoosenCountry -> gauti tos šalies miestus iš GOOGLE Maps API į -> console.log();
  const handleChoosenCountry = (e) => {
    setA(e.target.value);
    setIsCountryChoosen(true);
  };
  console.log("isCountryChoosen", isCountryChoosen);
  console.log("isA", isA);

  if (!isLoaded) {
    return <SkeletonText />;
  }

  async function calculateRoute() {
    if (originRef.current.value === "" || destiantionRef.current.value === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
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
        <div className="box" style={{ margin: "10px 10px 10px 10px" }}>
          <div className="box" style={{ margin: "10px 10px 10px 10px" }}>
            <Autocomplete>
              <input type="text" placeholder="Origin" ref={originRef} />
            </Autocomplete>
          </div>

          <div className="box" style={{ margin: "10px 10px 10px 10px" }}>
            <Autocomplete>
              <input
                type="text"
                placeholder="Destination"
                ref={destiantionRef}
              />
            </Autocomplete>
          </div>
          <ButtonGroup>
            <Button colorScheme="pink" type="submit" onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label="center back"
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </div>
        <div className="box" style={{ margin: "10px 10px 10px 10px" }}>
          <text>Distance : {distance} </text>
        </div>
        <div className="box" style={{ margin: "10px 10px 10px 10px" }}>
          <text>Travel Duration : {duration} </text>
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
