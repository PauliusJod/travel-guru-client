import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import axios from "axios";
import Constants from "../utilities/Constants";

import { useNavigate } from "react-router-dom";
import myImage from "./images/gps.png";
import myImage2 from "./images/pexels-quang-nguyen-vinh-2166711.jpg";
import PreviewTripMap from "./PreviewTripMap";
import "./Profile.css";
import jwt_decode from "jwt-decode";

export default function Profile() {
  const [allUserCreatedRoutes, setAllUserCreatedRoutes] = useState([]);
  const [enablePasswordChange, setEnablePasswordChange] = useState(false);
  const [enableEmailChange, setEnableEmailChange] = useState(false);
  const [passwordCurrentInputValue, setPasswordCurrentInputValue] = useState(false);
  const [passwordNewInputValue, setPasswordNewInputValue] = useState(false);
  const [newEmailInputValue, setNewEmailInputValue] = useState(false);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userInfo = jwt_decode(user.accessToken);

    setUserName(userInfo["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
    async function GetRoutesFromDatabase() {
      axios
        .get("http://localhost:5113/api/troutesprivate/usercreated/" + userInfo.sub)
        .then((resp) => {
          //store data loaded
          setAllUserCreatedRoutes(resp.data);
        });
    }
    GetRoutesFromDatabase();
  }, []);

  //   function handleClick(item) {
  //     navigate("/previewTripMap", { state: { message: item } });
  //   }
  // --------------- FRONT VALIDATIONS -----------------
  const vpassword = (value) => {
    if (value.length < 6 || value.length > 40) {
      return (
        <div className="alert alert-danger" role="alert">
          The password must be between 6 and 40 characters.
        </div>
      );
    }
  };

  // --------------- --------------- -----------------
  const togglePaswordChangeOption = () => {
    if (enablePasswordChange) {
      setEnablePasswordChange(false);
    } else {
      setEnablePasswordChange(true);
    }
    // console.log("handleChangePassword");
  };
  const toggleEmailChangeOption = () => {
    if (enableEmailChange) {
      setEnableEmailChange(false);
    } else {
      setEnableEmailChange(true);
    }
    // console.log("handleChangeEmail");
  };
  // INPUT CHANGE HANDLERS------------------------------------------
  function handlePasswordCurrentInputChange(event) {
    setPasswordCurrentInputValue(event.target.value);
  }
  function handlePasswordNewInputChange(event) {
    setPasswordNewInputValue(event.target.value);
  }
  function handleEmailNewInputChange(event) {
    // console.log("EMAIL: ", event.target.value);
    setNewEmailInputValue(event.target.value);
  }
  //------- START CHANGE PASS/EMAIL ------------------------------------------------
  const handleChangePassword = (e) => {
    axios
      .put(Constants.API_URL_UPDATE_PASSWORD, {
        UserName: userName,
        CurrentPassword: passwordCurrentInputValue,
        NewPassword: passwordNewInputValue,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
          // console.log("----", localStorage);
        }

        return response.data;
      });
    // console.log("handleChangeEmail");
  };
  const handleChangeEmail = (e) => {
    axios
      .put(Constants.API_URL_UPDATE_EMAIL, {
        UserName: userName,
        NewEmail: newEmailInputValue,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
          // console.log("----", localStorage);
        }

        return response.data;
      });

    // console.log("handleChangeEmail");
  };
  //-------------------------------------
  function handleClick(item) {
    navigate("/privateRoutePreview", { state: { message: item } });
    console.log("handleClick", item);
  }
  return (
    <>
      <div className="profile-container">
        <div className="profile-container-main">
          <div className="left">
            <div className="grid-container">
              {allUserCreatedRoutes.map((oneUserCreatedRoute) => (
                <div key={oneUserCreatedRoute.routeId}>
                  {console.log(oneUserCreatedRoute)}
                  <div
                    key={oneUserCreatedRoute.routeId}
                    className="item3"
                    id={oneUserCreatedRoute.routeId}
                    alt={oneUserCreatedRoute.routeId}
                  >
                    <img
                      key={oneUserCreatedRoute.routeId}
                      src={myImage2}
                      alt={oneUserCreatedRoute.routeId}
                      width="200"
                      height="200"
                      onClick={() => handleClick(oneUserCreatedRoute)}
                    ></img>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="right">
            <p>Profile control</p>
            <button onClick={togglePaswordChangeOption}>Password</button>
            {enablePasswordChange && (
              <>
                <input
                  className="right"
                  type="text"
                  id="passwordInput1"
                  placeholder="Current Password"
                  onChange={handlePasswordCurrentInputChange}
                ></input>
                {passwordCurrentInputValue.length < 6 && (
                  <div className="validation-error-message">
                    <p> Too short </p>
                  </div>
                )}
                {/* type="password" */}
                <input
                  className="right"
                  type="text"
                  id="passwordInput2"
                  placeholder="New Password"
                  onChange={handlePasswordNewInputChange}
                ></input>
                {passwordNewInputValue.length < 6 && (
                  <div className="validation-error-message">
                    <p> Too short </p>
                  </div>
                )}
                {/* type="password" */}
                <button style={{ width: "50%" }} onClick={handleChangePassword}>
                  ChangePassword
                </button>
              </>
            )}
            <button onClick={toggleEmailChangeOption}>Email</button>
            {enableEmailChange && (
              <>
                <input
                  className="right"
                  type="text"
                  placeholder="New Email"
                  onChange={handleEmailNewInputChange}
                ></input>
                <button style={{ width: "50%" }} onClick={handleChangeEmail}>
                  Change Email
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
