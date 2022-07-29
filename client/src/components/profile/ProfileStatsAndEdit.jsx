// Created by Muaad Alrawhani and Alex Jagot for Assignment 3

import React, { useContext, useState, useEffect } from "react";
import "../../styles/MovieComponent.css";
import person from "../../images/person-circle.svg"
import PostView from "../threadPage/PostView";
import MovieListItem from "../other-or-common/MovieListItem";

function ProfileEdit(props) {
    const [userProfileData, setUserProfileData] = useState({});
    const [movieSubmissions, setmovieSubmissions] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0)
        fetchProfileData()
        fetchMovieSubmission()
    }, [])

    //movie submission feature and and user profile 
    // Created by Jack Hipson for Assignment 3
    function fetchMovieSubmission() {
        fetch('/userMovieSubmissions/')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setmovieSubmissions(data.body)
                }
            });
    }

    //Fetches the profile data using fetch() and entering the route, on success updates the userProfileData with data that was gathered
    function fetchProfileData() {
        fetch('/userProfile/')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setUserProfileData(data.body)
                }
            });
    }

    //The following function is based off of the code written in the following tutorial: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#uploading_json_data
    function uploadProfileData(inputAboutMe) {
        const formData = new FormData()
        formData.append('userProfileImage', imageProfile)
        formData.append('aboutMe', inputAboutMe)

        const request = {
            method: 'PUT',
            body: formData
        };

        fetch("/updateUserProfile/", request)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    props.setUser(data.body)
                    alert("Data saved successfully!")
                } else {
                    console.log(data)
                }
            });
    }


    //function used to format the data of users account
    function getFormattedDate(dateVal) {
        const date = new Date(dateVal);
        const dateFormatted = date.getDate() + " " + date.toLocaleString('default', { month: 'long' }) + " " + date.getFullYear()
        return dateFormatted
    }

    let imageProfile = null
    function uploadImage(e) {
        imageProfile = e.target.files[0]
        document.getElementById("userprofile-img").src = window.URL.createObjectURL(e.target.files[0])
    }

    return (
        <div>
            <div className="userprofile-container">
                <div className="title"><h2>Edit Profile</h2></div>
                <div id="usrprofile-edit-top">
                    <div id="upload-image">
                        <img id="userprofile-img" src={(props.user && props.user.profileImage ? props.user.profileImage : person)}></img>
                        <div>
                            <label htmlFor="user-image-file" className="link-style" >upload/update image</label>
                            <input id="user-image-file" className="hide" type="file" accept="image/*" onChange={(e) => uploadImage(e)} />
                        </div>
                    </div>
                    <div className="userprofile-container">
                        <ol id="user-profile-stat">
                            <li><strong>User name: </strong> {userProfileData.username}</li>
                            <li><strong>Date Joined: </strong> {getFormattedDate(userProfileData.dateJoined)}</li>
                            <li><strong>Rank: </strong>{userProfileData.Rank}</li>
                            {/* <li><strong>Number of posts: </strong>{(userProfileData.posts ? userProfileData.posts.length : 0)}</li> */}
                        </ol>
                    </div>
                </div>
                <div id="userprogile-aboutme-cont">
                    <div>About me</div>
                    <textarea id="userprogile-aboutme" name="comment-input"
                        defaultValue={userProfileData.aboutMe} >
                    </textarea>

                    <div id="userprofile-aboutme-edit" className="link-style" onClick={() => uploadProfileData(document.getElementById('userprogile-aboutme').value)}>Save</div>
                </div>
            </div>

            {/* post history */}
            <div className="userprofile-container">
                <div className="title"><h2>Post History</h2></div>
                <div className="scrollabl">
                    {/* {console.log(userProfileData.posts)} */}
                    {userProfileData.posts && userProfileData.posts.map((item, idx) =>
                        <PostView key={idx} item={item} user={props.user} />
                    )}

                </div>

            </div>

            {/* submitted movies */}
            <div className="userprofile-container">
                <div className="title"><h2>Submitted movies</h2></div>
                <div className="scrollabl">
                    {movieSubmissions && movieSubmissions.map((item, idx) =>
                        <MovieListItem index={idx} key={idx} movieSubmission={true}
                            item={item} />
                    )}
                </div>
            </div>
        </div>

    )
}

export default ProfileEdit