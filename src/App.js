import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { Layout } from "./components/Layout";
import "./custom.css";
import "./App.css";
import logo from "./components/images/pexels-quang-nguyen-vinh-2166711.jpg";

export default class App extends Component {
  // static displayName = App.name;

  render() {
    return (
      <div>
        <Layout>
          <Routes>
            {AppRoutes.map((route, index) => {
              const { element, ...rest } = route;
              return <Route key={index} {...rest} element={element} />;
            })}
          </Routes>
        </Layout>
      </div>
    );
  }
}

// import { Component } from "react";

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css";
// import Home from "./components/Home";
// import TestMap from "./components/TestMap";
// import MapExplorer from "./components/MapExplorer";
// import Register from "./components/Register";

// import logo from "./components/images/pexels-quang-nguyen-vinh-2166711.jpg";
// function App() {
//   const style = {
//     backgroundImage: logo,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//     // height: "100vh", // set the height of the container to the viewport height
//   };
//   return (
//     <div style={style}>
//       <Router>
//         <Routes>
//           <Route exact path="/" element={<Component.Home />} />
//           <Route path="/login" element={<Component.Login />} />
//           <Route path="/register" element={<Component.Register />} />
//           <Route path="/mapExplorer" element={<MapExplorer />} />
//           <Route path="/testMap" element={<TestMap />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;
