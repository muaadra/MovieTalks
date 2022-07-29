import React from "react";
import "../../styles/header.css";
import { useNavigate } from "react-router-dom";
import SearchBar from "../search/SearchBar";
import { useEffect } from 'react';
import list from "../../images/list.svg"
import { useState } from "react";
import { fetchProfileImage } from "../authentication/authHelperAndCommonFunctions.js";
import { useLocation } from "react-router-dom";
import personWhite from "../../images/person-circle-color.svg"
import personBlack from "../../images/person-circle.svg"

/**
 * This component represents header of the web app. It contains the profile,
 * "sign in/up", and the watchList buttons
 */


function Header(props) {

  const navigate = useNavigate(); //to navigate to other routes when buttons are clicked

  //to compact the view to burger menu
  const [burgerMenu, showBurgerMenu] = useState(false)

  //get the path of this page. used to display the search bar if not on main page
  const searchQuery = useLocation().pathname.split("/");


  useEffect(() => {
    if (window.location.pathname != "/") {
      props.showNavSearchBar(true)
    }
  }, []);

  useEffect(() => {
    if (props.user && !props.user.profileImage) {
      fetchProfileImage(props.user, props.setUser)
    }
  }, [props.user]);


  function goToWatchlistMobile() {
    navigate("/watchlist")
    showBurgerMenu(false)
  }


  return (<div >
    <div id="header-container">
      {/* the website logo */}
      <div id="header-left">
        {/* <img id="logo" src={logo} onClick={() => navigate("/")}></img> */}
        <h1 id="website-logo-text" className="pointer" onClick={() => navigate("/")}>MovieTalks</h1>
      </div>

      {
        props.navSearchBar ?
          <div id="header-mid">
            <SearchBar inHeader={true} searchQuery={searchQuery.length > 2 ? searchQuery[2].replace("%20", " ") : null} />
          </div> : <div id="header-mid"></div>
      }

      {/* the right side of the header */}
      <div id="header-right">
        <button id="watchlist-button" className="button shade" onClick={() => navigate("/watchlist")}>WatchList</button>
        {!props.user ?
          // the sign in/up button
          <button className="button shade" onClick={() => props.showForm(true)}>Sign In/Up</button> :
          // <div id="greeting" className="link-style" onClick={() => navigate("/profile")}>  {props.user.username} Profile </div>

          //profile button
          <img id="profile-header-img" onMouseEnter={(e) => { e.target.src = (props.user && props.user.profileImage ? props.user.profileImage : personBlack) }}
            onMouseLeave={(e) => { e.target.src = (props.user && props.user.profileImage ? props.user.profileImage : personWhite) }}
            className="button shade"
            src={(props.user && props.user.profileImage ? props.user.profileImage : personWhite)}
            onClick={() => navigate("/profile")}></img>
        }
        <img id="burger-button-mobile" className="button shade" src={list} onClick={() => showBurgerMenu(prev => !prev)}></img>
      </div>
    </div>
    {burgerMenu ?
      <div id="burger-menu" className="light-blue">
        <div id="search-bar-mobile">
          <SearchBar mobile={true} />
        </div>
        <div id="watchlist-mobile-button-cont">
          <button id="watchlist-button-mobile" className="button yellow" onClick={() => goToWatchlistMobile()}>watchList</button>
        </div>
      </div>
      : null}

  </div>);
}


export default Header;
