import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import myImage2 from "./images/pexels-quang-nguyen-vinh-2166711.jpg";
import "./MapsGallery.css";

export default function MapsGallery() {
  const [allRoutes, setAllRoutes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function GetRoutesFromDatabase() {
      axios.get("http://localhost:5113/api/troutes/public/").then((resp) => {
        setAllRoutes(resp.data);
      });
    }
    GetRoutesFromDatabase();
  }, []);

  function handleClick(item) {
    navigate("/previewTripMap", { state: { message: item } });
  }
  return (
    <div className="grid-container-gallery">
      {allRoutes.map((oneRoute) => (
        <div key={oneRoute.routeId}>
          <div
            className="item3"
            key={oneRoute.routeId}
            id={oneRoute.routeId}
            alt={oneRoute.routeId}
          >
            {oneRoute.rImagesUrl != null &&
            Array.isArray(oneRoute.rImagesUrl) &&
            oneRoute.rImagesUrl.length > 0 &&
            oneRoute.rImagesUrl[0].rImagesUrlLink != null &&
            oneRoute.rImagesUrl[0].rImagesUrlLink != undefined ? (
              <>
                <img
                  key={oneRoute.routeId}
                  src={oneRoute.rImagesUrl[0].rImagesUrlLink}
                  alt={oneRoute.routeId}
                  width="200"
                  height="200"
                  style={{ objectFit: "cover", cursor: "pointer" }}
                  onClick={() => handleClick(oneRoute)}
                ></img>
                <p style={{ fontSize: "24px", margin: "5px" }}>
                  {oneRoute.rName}
                </p>
              </>
            ) : (
              <>
                <img
                  key={oneRoute.routeId}
                  src={myImage2}
                  alt={oneRoute.routeId}
                  width="200"
                  height="200"
                  style={{ objectFit: "cover", cursor: "pointer" }}
                  onClick={() => handleClick(oneRoute)}
                ></img>
                <p style={{ fontSize: "24px", margin: "5px" }}>
                  {oneRoute.rName}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
