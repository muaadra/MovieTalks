import AuthForm from "./components/authentication/AuthForm";
import Header from "./components/other-or-common/Header";
import Profile from "./components/profile/Profile";
import React, { useState, useEffect } from 'react';
import { isSignedIn } from "./components/authentication/authHelperAndCommonFunctions.js"
import Main from "./components/mainpage/Main";
import Footer from "./components/other-or-common/Footer";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import MoviePage from "./components/moviepage/MoviePage";
import ThreadPage from "./components/threadPage/ThreadPage";
import WatchList from "./components/watchlist/WatchList";
import { UserContext } from "./components/authentication/UserContext";
import SearchDemoPage from "./components/search/SearchPage";
import Admin from "./components/admin/Admin";
import MovieSubmission from "./components/movieSubmission/MovieSubmission";
import MoviePage_AdminApprovalView from "./components/moviepage/MovieComponenet_AdminView";


function App() {
  const [signInForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null)
  const [navSearchBar, showNavSearchBar] = useState(false)
  const [welcomeMessage, setWelcomeMessage] = useState(true)


  useEffect(() => {
    if (window.location.pathname == "/auth/resetByEmail/") {
      setShowForm(true);
    }
    //moviesIMDB()
    //getMoviesFromListOfIds(nowPlayingIMDBIds)
    isSignedIn(setUser)
  }, []);


  return (

    <Router>
      <UserContext.Provider value={{ user, setUser }}>
        <div id="body-content">
          <Header showForm={setShowForm} showNavSearchBar={showNavSearchBar} navSearchBar={navSearchBar} user={user} setUser={setUser} />
          {signInForm ? <AuthForm showForm={setShowForm} setUser={setUser} user={user} /> : null}
          <Routes>
            <Route path="/searchResults/:searchQuery" element={<SearchDemoPage />} />
            <Route path="/searchResults/" element={<SearchDemoPage />} />
            <Route path="/watchlist" element={<WatchList />} />
            <Route path="/submitMovie" element={<MovieSubmission />} />
            <Route path="/searchAllByFilters" element={<SearchDemoPage />} />
            <Route path="/thread/*" element={<ThreadPage />} />
            <Route path="/moviePage/*" element={<MoviePage />} />
            <Route path="/adminMoviePage/*" element={<MoviePage_AdminApprovalView />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
            <Route path="/profile/admin" element={<Admin />} />
            <Route path="/*" element={<Main welcomeMessage={welcomeMessage} setWelcomeMessage={setWelcomeMessage} showNavSearchBar={showNavSearchBar} />} />
          </Routes>

          <Footer />
        </div>
      </UserContext.Provider>
    </Router>

  );
}

let featuredMovies = []
function setFeaturedMovies(movies) {
  featuredMovies = movies
}
export { featuredMovies, setFeaturedMovies }
export default App;
