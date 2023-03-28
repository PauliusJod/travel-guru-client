import React, { useState, useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import "./MapStyle.css";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

/*
 * DELETE THESE npm
 * use-places-autocomplete, @reach/combobox
 * */

export default function MapExplorer() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, //"AIzaSyAiB_hv59Hb5MQol934V0jK-t9CVbc2JGY"//"AIzaSyCe0r5VqYv7QrnML2I-yiRM0S4sqUz3zKY"
    libraries: ["places"],
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }
  if (!isLoaded) {
    return <div>Loading maps</div>;
  }
  if (!isLoaded) return <div>Loading...</div>;
  return <Map />;
}

function Map() {
  const center = useMemo(() => ({ lat: 54.887575, lng: 23.967097 }), []);
  const [isCountryChoosen, setIsCountryChoosen] = useState(false);
  //const [autocompleteInput, setAutocompleteInput] = useState('');
  //const [autocompleteResults, setAutocompleteResults] = useState([]);

  //const {
  //    ready,
  //    value,
  //    suggestions: { status, data },
  //    setValue,
  //    clearSuggestions,
  //} = usePlacesAutocomplete({
  //    debounce: 300,
  //});

  //const handleInput = (e) => {
  //    setValue(e.target.value);
  //    setAutocompleteInput(e.target.value);
  //};

  //const handleSelect = (description) => () => {
  //    setValue(description, false);
  //    setAutocompleteInput(description);
  //    clearSuggestions();

  //    // Do something with the selected place
  //};
  const [isA, setA] = useState("---");
  //Užduotis
  //Ant handleChoosenCountry -> gauti tos šalies miestus iš GOOGLE Maps API į -> console.log();
  const handleChoosenCountry = (e) => {
    setA(e.target.value);
    setIsCountryChoosen(true);
  };
  console.log("isCountryChoosen", isCountryChoosen);
  console.log("isA", isA);
  //const returnObj = usePlacesAutocomplete().defaultValue("Kaunas");
  //console.log(returnObj);

  return (
    <div className="map-container">
      <GoogleMap
        zoom={7}
        center={{ lat: 54.887575, lng: 23.967097 }}
        mapContainerClassName="only-map-container"
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
}

//<div>
//    <input
//        value={autocompleteInput}
//        onChange={handleInput}
//        disabled={!ready}
//        placeholder="Enter an address"
//    />
//    {status === 'OK' && (
//        <ul>
//            {data.map((suggestion) => {
//                const {
//                    place_id,
//                    structured_formatting: { main_text, secondary_text },
//                } = suggestion;

//                return (
//                    <li key={place_id} onClick={handleSelect(main_text)}>
//                        <strong>{main_text}</strong> <small>{secondary_text}</small>
//                    </li>
//                );
//            })}
//        </ul>
//    )}
//</div>

//function AutocompleteInput() {
//    const [autocompleteInput, setAutocompleteInput] = useState('');
//    const [autocompleteResults, setAutocompleteResults] = useState([]);

//    const {
//        ready,
//        value,
//        suggestions: { status, data },
//        setValue,
//        clearSuggestions,
//    } = usePlacesAutocomplete({
//        debounce: 300,
//    });

//    const handleInput = (e) => {
//        setValue(e.target.value);
//        setAutocompleteInput(e.target.value);
//    };

//    const handleSelect = (description) => () => {
//        setValue(description, false);
//        setAutocompleteInput(description);
//        clearSuggestions();

//        // Do something with the selected place
//    };

//    return (
//        <div>
//            <input
//                value={autocompleteInput}
//                onChange={handleInput}
//                disabled={!ready}
//                placeholder="Enter an address"
//            />
//            {status === 'OK' && (
//                <ul>
//                    {data.map((suggestion) => {
//                        const {
//                            place_id,
//                            structured_formatting: { main_text, secondary_text },
//                        } = suggestion;

//                        return (
//                            <li key={place_id} onClick={handleSelect(main_text)}>
//                                <strong>{main_text}</strong> <small>{secondary_text}</small>
//                            </li>
//                        );
//                    })}
//                </ul>
//            )}
//        </div>
//    );
//}

//<div className="input-container">
//    <br />
//    <div className="chooseInput">
//        <h5>Choose your trip starting point country</h5>
//        <select style={{ width: "200px", textAlign: "center" }} onChange={handleChoosenCountry}>
//            <option value="selected">---</option>
//            <option value="Estija">Estija</option>
//            <option value="Lietuva">Lietuva</option>
//            <option value="Lenkija">Lenkija</option>
//            <option value="Latvija">Latvija</option>
//        </select>
//    </div>
//    <br />
//    <br />
//    {isCountryChoosen && (
//        <div className="chooseInput" id="chooseCountryCities">
//            <h5>Choose your destination country</h5>
//            <select style={{ width: "200px", textAlign: "center" }}>
//                <option value="data">Estija</option>
//                <option value="data">Lietuva</option>
//                <option value="data">Lenkija</option>
//                <option value="data">Latvija</option>
//            </select>
//        </div>
//    )}
//</div>

//import React, { useMemo } from "react";
//import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
//import './MapStyle.css';

//export default function MapExplorer() {
//    const { isLoaded, loadError } = useLoadScript({
//        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,//"AIzaSyAiB_hv59Hb5MQol934V0jK-t9CVbc2JGY"//"AIzaSyCe0r5VqYv7QrnML2I-yiRM0S4sqUz3zKY"
//    });
//    console.log(loadError);
//    if (!isLoaded) return <div>Loading...</div>;
//    return <Map />;
//}

//function Map() {
//    const center = useMemo(() => ({ lat: 44, lng: -80 }), []);

//    return (
//        <GoogleMap zoom={10} center={center} mapContainerClassName="map-container">
//            <Marker position={center} />
//        </GoogleMap>
//    );
//}
