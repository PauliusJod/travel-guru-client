import React, { useEffect, useState } from "react";
import axios from "axios";
import Constants from "../utilities/Constants";

import { useNavigate } from "react-router-dom";
import myImage2 from "./images/pexels-quang-nguyen-vinh-2166711.jpg";
import "./Profile.css";
import jwt_decode from "jwt-decode";

export default function Profile() {
  const [allUserCreatedRoutes, setAllUserCreatedRoutes] = useState([]);
  const [enablePasswordChange, setEnablePasswordChange] = useState(false);
  const [enableEmailChange, setEnableEmailChange] = useState(false);
  const [passwordCurrentInputValue, setPasswordCurrentInputValue] =
    useState(false);
  const [passwordNewInputValue, setPasswordNewInputValue] = useState(false);
  const [newEmailInputValue, setNewEmailInputValue] = useState(false);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userInfo = jwt_decode(user.accessToken);

    setUserName(
      userInfo["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
    );
    async function GetRoutesFromDatabase() {
      axios
        .get("http://localhost:5113/api/troutes/usercreated/" + userInfo.sub)
        .then((resp) => {
          //store data loaded
          setAllUserCreatedRoutes(resp.data);
        });
    }
    GetRoutesFromDatabase();
  }, []);

  const togglePaswordChangeOption = () => {
    if (enablePasswordChange) {
      setEnablePasswordChange(false);
    } else {
      setEnablePasswordChange(true);
    }
  };
  const toggleEmailChangeOption = () => {
    if (enableEmailChange) {
      setEnableEmailChange(false);
    } else {
      setEnableEmailChange(true);
    }
  };

  function handlePasswordCurrentInputChange(event) {
    setPasswordCurrentInputValue(event.target.value);
  }
  function handlePasswordNewInputChange(event) {
    setPasswordNewInputValue(event.target.value);
  }
  function handleEmailNewInputChange(event) {
    setNewEmailInputValue(event.target.value);
  }

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
        }

        return response.data;
      });
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
        }

        return response.data;
      });
  };
  function handleClick(item) {
    navigate("/privateRoutePreview", { state: { message: item } });
  }
  return (
    <>
      <div className="profile-container">
        <div className="profile-container-main">
          <div className="left">
            <div className="grid-container">
              {allUserCreatedRoutes.map((oneUserCreatedRoute) => (
                <div key={oneUserCreatedRoute.routeId}>
                  {oneUserCreatedRoute.rImagesUrl != null &&
                  oneUserCreatedRoute.rImagesUrl != undefined ? (
                    <div>
                      <img
                        key={oneUserCreatedRoute.routeId}
                        src={oneUserCreatedRoute.rImagesUrl[0].rImagesUrlLink}
                        alt={oneUserCreatedRoute.routeId}
                        width="150"
                        height="150"
                        style={{ objectFit: "cover", cursor: "pointer" }}
                        onClick={() => handleClick(oneUserCreatedRoute)}
                      ></img>
                      <p style={{ fontSize: "20px", margin: "5px" }}>
                        {oneUserCreatedRoute.rName}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <img
                        key={oneUserCreatedRoute.routeId}
                        src={myImage2}
                        alt={oneUserCreatedRoute.routeId}
                        width="150"
                        height="150"
                        style={{ objectFit: "cover", cursor: "pointer" }}
                        onClick={() => handleClick(oneUserCreatedRoute)}
                      ></img>
                      <p style={{ fontSize: "20px", margin: "5px" }}>
                        {oneUserCreatedRoute.rName}
                      </p>
                    </div>
                  )}
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
                  type="password"
                  id="passwordInput1"
                  placeholder="Current Password"
                  onChange={handlePasswordCurrentInputChange}
                ></input>
                {passwordCurrentInputValue.length < 6 && (
                  <div className="validation-error-message">
                    <p> Too short </p>
                  </div>
                )}
                <input
                  className="right"
                  type="password"
                  id="passwordInput2"
                  placeholder="New Password"
                  onChange={handlePasswordNewInputChange}
                ></input>
                {passwordNewInputValue.length < 6 && (
                  <div className="validation-error-message">
                    <p> Too short </p>
                  </div>
                )}
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
