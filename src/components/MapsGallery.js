import React from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import myImage from "./images/gps.png";
import myImage2 from "./images/pexels-quang-nguyen-vinh-2166711.jpg";

import PreviewTripMap from "./PreviewTripMap";
import "./MapsGallery.css";

export default function MapsGallery() {
  //   return <Map />;
  const navigate = useNavigate();
  function handleClick() {
    navigate("/previewTripMap", { state: { message: "aaasssaaasssaaa" } });
  }
  return (
    <>
      {/* <div className="gallery-container"> */}
      <div className="grid-container">
        <div className="item1">
          <img
            src={myImage2}
            alt="Girl in a jacket"
            width="200"
            height="200"
            onClick={() => handleClick()}
          ></img>
        </div>
        <div className="item2">
          <img src={myImage} alt="Girl in a jacket" width="200" height="200"></img>
        </div>

        <div className="item3">
          <img src={myImage} alt="Girl in a jacket" width="200" height="200"></img>
        </div>

        <div className="item4">
          <img src={myImage2} alt="Girl in a jacket" width="200" height="200"></img>
        </div>

        <div className="item5">
          <img src={myImage} alt="Girl in a jacket" width="200" height="200"></img>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}

// function GalleryMaps() {}
