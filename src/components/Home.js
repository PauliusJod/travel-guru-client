import React, { Component } from "react";
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
      </div>
    );
  }
}
