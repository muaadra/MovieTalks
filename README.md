# MovieTalks
Description: MovieTalks is a project for advanced web development course. MovieTalks allows users to search, rate, and discuss movies and TV shows. There are only 270 movies in the project, all movie data are from IMDB.com (using imdb-api.com). The data are stored locally in a MongoDB database, and are used as placeholder and for demonstration purposes only

## To view a sample of my work, please refer to the following files:
The project is divided into 2 main folders: client and server

**Client Files:**\
**Folder name: authentication**\
    Path to folder: client\src\components\authentication\

  - **Files:**
    - AuthForm.jsx
    - authHelperAndCommonFunctions.js
    - UserContext.jsx
    - validations.js


**Folder name: styles**\
Path to folder: \client\src\styles\
  - **Files:**
    - signIn.css

**Server Files:**\
**Folder name: routes**\
Path to folder: \server\routes\
  - **Files:**
    - auth.js

**Folder name: authControllers**\
Path to folder: \server\controllers\authControllers\
  - **Files:**
    - authController.js
    - validation.js


**Folder name: models**\
Path to folder: \server\models\
  - **Files:**
    - user.js


* *Date Created*: 10 June 2022
* *Last Modification Date*: 21 July 2022
* *Live demo URL*: <http://ec2-54-242-106-30.compute-1.amazonaws.com/>

> ## To test the features
> You could sign up for ***a new account*** or use the following credentials: \
>**Email:** Admin@testing.com \
>**Password:** Admin123 \
> \
> **Please note that all users are treated as admin, so you will see an admin**
> **button; this is not a security flaw, but it was left intentionally open so any user (e.g., TA) can test the feature from any account they creat.**\
> <br>


### Prerequisites
- install mongodb
- install node js

## Installing
1) install mongodb from https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/ and run the service 
(make sure you can connect to mongodb on mongodb://localhost:27017)
2) install Node js from https://nodejs.org/en/
4) clone the Git repo from the Git URL provided above
5) in the Command Prompt, navigate to "group-project/client" folder and
type "npm install" and hit enter in the Command Prompt to download all dependencies
7) in the Command Prompt, navigate to "group-project/server" folder and
type "npm install" and hit enter in the Command Prompt to download all dependencies

## Running the app locally
After following the installation instruction above, in the Command Prompt,
navigate to "group-project/server" folder and run "npm run dev" to start the project

## Deployment
- create an AWS EC2 instant following the AWS documintation:https://docs.aws.amazon.com/efs/latest/ug/gs-step-one-create-ec2-resources.html
- follwing the instructions under "Installing" above. 
- make sure you have port 80 open in your EC2 instance
- navigate to "group-project/client" and run the command "npm run build"
- navigate to "group-project/server" and start the server using "npm start" command
- your app should accessible through port 80

## Built With
* [React-js] (https://reactjs.org/) - A JS library to build component-based interactive UI 
* [Node-js] (https://nodejs.org/en/) - runtime environment 
* [MongoDb] (https://www.mongodb.com/) - a framework to create APIs
* [Express-js] (https://expressjs.com/) - a framework to create APIs
* [Passport-js] (https://www.passportjs.org/) - authentication middleware for Node.js
* [nodemailer] (https://nodemailer.com/) -  module for Node.js to allow email sending
* [bcrypt] (https://www.npmjs.com/package/bcrypt) - to hash passwords
* [concurrently] (https://www.npmjs.com/package/concurrently) - a library to Run multiple commands concurrently, for development only
* No css libraries (like bootstrap) were used in this assignment

## Sources Used

**Reference Title:** fetch()\
Author: MDN web doc, Mozilla Corporation \
Source URL: https://developer.mozilla.org/en-US/docs/Web/API/fetch \
Description: The team agreed to use the fetch API for all API requests (GET, POST, PUT, or DELETE). therefore, any file that required communicating with the backend were implemented using the Fetch API as documented in the "Mdb web doc" website

**Reference Title:** Mongoose\
Source URL: CSCI4177 tutorials and https://mongoosejs.com/docs/\ 
Description: Mongoose was used to interact with MongoDB databse and to provide clear data models for the team to follow
 
**Reference Title:** IMDb-API\
Source URL: https://imdb-api.com/ \
Description: our databse is setup with 270 movie details that were retrieved from IMDB using the API service mentioned above. Therefore, all movie data including posters, description, actors list, etc., are from IMDB.com. \
Author: IMDB.com \
Date Accessed: June 10, 2022

**Reference Title:** Bootstrap Icons \
Source URL:  https://icons.getbootstrap.com/ \
Description: all svg icons such as used as a placeholder in profile image are from 
Bootstrap  \
Author: Bootstrap \
Date Accessed: June 10, 2022

**Reference Title:** HOW TO CREATE AND SUBMIT A XML SITEMAP \
Source URL:  https://www.seerinteractive.com/blog/how-to-create-and-submit-a-xml-sitemap \
Description: The tutorial was followed to create a site map  \
Author: HOA CONG\
Date Accessed: June 6, 2022

**File Name:** sendEmails.js
  - folder path: group1_groupwork\Group1_MovieTalks\server\tools
Reference Title: SMTP TRANSPORT
Author: Nodemailer
Reference URL: https://nodemailer.com/smtp/
Description: Nodemailer library was used to send email to users, and hence their 
documentation (in the url above) was followed to implement the email functionality in the 
file sendEmails.js

**File Name:** authHelperAndCommonFunctions.js
  - folder path: group1_groupwork\Group1_MovieTalks\client\src\components\authentication\
Reference Title: Response.blob()
Author: MDN web doc, Mozilla Corporation
Reference URL: https://developer.mozilla.org/en-US/docs/Web/API/Response/blob
Description: this doc was read to understand how to get an image file using fetch()

**File Name:** all front-end files listed under "List of files created for assignment 3 feature"
Reference Title: Tutorial: Intro to React
Author: Meta Platforms, Inc. React js
Reference URL: https://reactjs.org/tutorial/tutorial.html
Description: This comprehensive tutorial was reread as a refresher to implement the front
end 

## Acknowledgments
The project is inspired by three popular websites, IMDB, Rotten Tomatoes, and Reddit. Our web app tries to combine the functionalities of Rating and Exploring movies found in IMDB and Rotten Tomatoes with the forum-like functionality found in Reddit.

