import React, { Component } from "react";
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import "./NavMenu.css";

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    return (
      <header>
        <Navbar
          className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
          container
          light
        >
          {/*<NavbarBrand tag={Link} to="/">Travel_Guru</NavbarBrand>*/}
          <NavbarBrand tag={Link} to="/">
            <svg
              width="50"
              height="50"
              viewBox="0 0 1024 1024"
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M885.76 921.28H779.2l-.32-26.773c.107-.747-.107-68.267-7.467-171.52-8.96-125.654-21.76-243.414-167.573-334.827l24.533-26.027c78.72 46.934 146.24 112 178.88 167.36 42.347 72 56.854 110.294 69.547 176.854 21.653 112.64 9.493 211.306 8.96 214.933z"
                fill="#755E49"
              />
              <path
                d="M565.653 893.404c0 14.934-1.386 29.44-4.053 43.52H129.28c-2.667-14.08-4.053-28.693-4.053-43.52 0-25.813 4.266-50.666 11.946-73.813 29.76-88.64 111.787-152.32 208.214-152.32 96.426 0 178.453 63.68 208.213 152.32 7.893 23.147 12.053 48 12.053 73.813z"
                fill="#FF9D00"
              />
              <path
                d="M989.12 926.613c0 16.214-6.613 30.827-17.173 41.494-10.56 10.666-25.28 17.173-41.494 17.173h-838.4c-32.426 0-58.666-26.24-58.666-58.667 0-16.213 6.613-30.826 17.173-41.493 10.667-10.56 25.28-17.173 41.493-17.173h838.4c32.427 0 58.667 26.24 58.667 58.666z"
                fill="#00B7FF"
              />
              <path
                d="M981.867 399.573c10.453 0 14.506-17.173 5.866-24.426C956.587 348.907 896 310.933 806.72 310.4c-89.92-.64-150.293 38.507-180.907 65.28-8.533 7.467-4.373 24.32 5.974 24.32l350.08-.427z"
                fill="#02C652"
              />
              <path
                d="M882.773 158.613c7.36-7.36-1.813-22.4-13.12-21.44-40.64 3.52-110.293 19.52-173.76 82.24-64 63.147-79.04 133.44-81.813 174.08-.747 11.307 14.08 20.374 21.44 13.014l247.253-247.894z"
                fill="#02C652"
              />
              <path
                d="M648 391.893c7.36-7.36-1.813-22.4-13.12-21.44-40.64 3.52-110.293 19.52-173.76 82.24-64 63.147-79.04 133.44-81.813 174.08-.747 11.307 14.08 20.374 21.44 13.014L648 391.893z"
                fill="#02C652"
              />
              <path
                d="M657.92 44.693c0-10.453-17.173-14.506-24.427-5.866-26.24 31.146-64.213 91.733-64.746 181.013-.64 89.92 38.506 150.293 65.28 180.907 7.466 8.533 24.32 4.373 24.32-5.974l-.427-350.08z"
                fill="#02C652"
              />
              <path
                d="M657.92 372.587c0-10.454-17.173-14.507-24.427-5.867-26.24 31.147-64.213 91.733-64.746 181.013-.64 89.92 38.506 150.294 65.28 180.907 7.466 8.533 24.32 4.373 24.32-5.973l-.427-350.08z"
                fill="#02C652"
              />
              <path
                d="M642.667 402.24c10.453 0 14.506-17.173 5.866-24.427-31.146-26.24-91.733-64.213-181.013-64.746-89.92-.64-150.293 38.506-180.907 65.28-8.533 7.466-4.373 24.32 5.974 24.32l350.08-.427z"
                fill="#02C652"
              />
            </svg>
            <p className="testas">Travel Guru</p>
          </NavbarBrand>
          {user ? (
            //<NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/">
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/mapsGallery">
                  Maps Gallery
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/testMap">
                  testMap
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/profile">
                  Profile
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/" onClick={this.handleLogout}>
                  Logout
                </NavLink>
              </NavItem>
            </ul>
          ) : (
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/">
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/testMap">
                  testMap
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/login">
                  Prisijungimas
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/register">
                  Registracija
                </NavLink>
              </NavItem>
            </ul>
          )}
        </Navbar>
      </header>
    );
  }
  handleLogout = () => {
    localStorage.clear();
    window.location.reload(true);
    // handle logout logic here
  };
}
{
  /* <NavItem>
                <NavLink tag={Link} className="text-dark" to="/mapExplorer">
                  Map Explorer
                </NavLink>
              </NavItem> */
}
//export class NavMenu extends Component {
//  static displayName = NavMenu.name;

//  constructor (props) {
//      super(props);

//    this.toggleNavbar = this.toggleNavbar.bind(this);
//    this.state = {
//      collapsed: true
//    };
//  }

//  toggleNavbar () {
//    this.setState({
//        collapsed: !this.state.collapsed
//    });
//  }

//    render() {
//        const user = JSON.parse(localStorage.getItem('user'));
//        console.log(user);
//    return (
//      <header>
//        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
//                {/*<NavbarBrand tag={Link} to="/">Travel_Guru</NavbarBrand>*/}
//                <NavbarBrand tag={Link} to="/"><svg width="20px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17 5.95v10.351c0 .522-.452.771-1 1.16-.44.313-1-.075-1-.587V6.76c0-.211-.074-.412-.314-.535-.24-.123-7.738-4.065-7.738-4.065-.121-.045-.649-.378-1.353-.016-.669.344-1.033.718-1.126.894l8.18 4.482c.217.114.351.29.351.516v10.802a.67.67 0 0 1-.369.585.746.746 0 0 1-.333.077.736.736 0 0 1-.386-.104c-.215-.131-7.774-4.766-8.273-5.067-.24-.144-.521-.439-.527-.658L3 3.385c0-.198-.023-.547.289-1.032C3.986 1.269 6.418.036 7.649.675l8.999 4.555c.217.112.352.336.352.72z" /></svg>

//                    <p className="testas">Travel Guru</p>
//                </NavbarBrand>
//          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
//          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
//            <ul className="navbar-nav flex-grow">
//                <NavItem>
//                    <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
//                </NavItem>
//                {/*<NavItem>*/}
//                {/*    <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>*/}
//                {/*</NavItem>*/}
//                {/*<NavItem>*/}
//                {/*    <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink>*/}
//                {/*</NavItem>*/}
//                <NavItem>
//                    <NavLink tag={Link} className="text-dark" to="/login">Prisijungimas</NavLink>
//                </NavItem>
//            </ul>
//          </Collapse>
//        </Navbar>
//      </header>
//    );
//  }
//}
//export default SessionNavbar;

//export class NavMenu extends Component {
//    render() {
//        const user = JSON.parse(localStorage.getItem('user'));
//        console.log(user);
//        //if (user && user.accessToken) {
//        //    return { Authorization: 'Bearer ' + user.accessToken };
//        //} else {
//        //    return {};
//        //}
//        return (
//            <nav>
//                { user ? (
//                    <ul>
//                        <li><Link to="/">Home</Link></li>
//                        <li><Link to="/profile">Profile</Link></li>
//                        <li><button onClick={this.handleLogout}>Logout</button></li>
//                    </ul>
//                ) : (
//                    <ul>
//                        {/*<li><Link to="/">Home</Link></li>*/}
//                        <li><Link to="/login">Login</Link></li>
//                        <li><Link to="/register">Sign up</Link></li>
//                    </ul>
//                )}
//            </nav>
//        );
//    }

//    handleLogout = () => {

//        localStorage.clear();
//        window.location.reload(true);
//        // handle logout logic here
//    }
//}

//export default NavMenu;
