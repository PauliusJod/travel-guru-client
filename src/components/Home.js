import React, { Component, useRef, useState, createRef } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import logo from "./images/pexels-quang-nguyen-vinh-2166711.jpg";
export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div style={{ width: "100%" }}>
        <div className="card w-75">
          <div className="card-body">
            <h3>Welcome, Travel-Guru svetainę!</h3>
            <hr />
            <p className="card-text">
              Please Sign Up for full website experience!
            </p>
            <a href="/register" className="btn btn-primary">
              Registration
            </a>
          </div>
        </div>
        <div
          style={{
            margin: "auto",
            display: "flex",
            width: "80%",
            backgroundColor: "rgba(255,255,255,0.3)",
            // justifyContent: "center",
          }}
        ></div>
      </div>
    );
  }
}
