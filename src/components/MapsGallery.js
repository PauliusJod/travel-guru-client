import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import myImage from "./images/gps.png";
import myImage2 from "./images/pexels-quang-nguyen-vinh-2166711.jpg";
import PreviewTripMap from "./PreviewTripMap";
import "./MapsGallery.css";

export default function MapsGallery() {
  //   return <Map />;

  const [allRoutes, setAllRoutes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function GetRoutesFromDatabase() {
      axios.get("http://localhost:5113/api/troutesprivate/").then((resp) => {
        //store data loaded
        setAllRoutes(resp.data);
        console.log("resp.data", resp.data);
      });
    }
    GetRoutesFromDatabase();
  }, []);

  function handleClick(item) {
    navigate("/previewTripMap", { state: { message: item } });
  }
  return (
    <div className="grid-container">
      {allRoutes.map((oneRoute) => (
        <div key={oneRoute.routeId}>
          <div
            className="item3"
            key={oneRoute.routeId}
            id={oneRoute.routeId}
            alt={oneRoute.routeId}
          >
            <img
              key={oneRoute.routeId}
              src={myImage2}
              alt={oneRoute.routeId}
              width="200"
              height="200"
              onClick={() => handleClick(oneRoute)}
            ></img>
          </div>
        </div>
      ))}
    </div>
  );
}

// function GalleryMaps() {}
