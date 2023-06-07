import React, { Component } from "react";

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div style={{ width: "100%" }}>
        <div className="card w-75">
          <div className="card-body">
            <h3>Welcome to Travel-Guru!</h3>
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
          }}
        ></div>
      </div>
    );
  }
}
