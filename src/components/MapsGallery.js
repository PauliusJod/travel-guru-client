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
      axios.get("http://localhost:5113/api/troutes/").then((resp) => {
        //store data loaded
        setAllRoutes(resp.data);
        console.log(resp.data);
      });
    }
    GetRoutesFromDatabase();
  }, []);

  function handleClick(item) {
    navigate("/previewTripMap", { state: { message: item } });
  }
  return (
    <>
      <div className="grid-container">
        {allRoutes.map((oneRoute) => (
          <div>
            <div className="item3" id={oneRoute.id} alt={oneRoute.routeId}>
              <img
                src={myImage2}
                alt={oneRoute.routeId}
                width="200"
                height="200"
                onClick={() => handleClick(oneRoute)}
              ></img>
            </div>
          </div>
        ))}
        {/* <div className="item2">
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
            </div> */}
      </div>
      {/* </div> */}
    </>
  );
}

// function GalleryMaps() {}
