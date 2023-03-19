# React + Firebase
This template should help get you started developing with React and Firebase.

## Getting started
Clone this repository: git clone https://github.com/CoinKarunaratne/Conversate.git.
Navigate to the project directory: cd Conversate.
Install dependencies: npm install.
Create a new Firebase project on the Firebase console and add a new web app to the project.
Copy the Firebase configuration values for your app and paste them into the firebase.js file in the src directory.
Start the development server: npm run start.
Recommended IDE Setup
VSCode + ESLint extension for VSCode.

### Firebase Authentication
This template includes Firebase Authentication. To enable authentication, go to the Authentication section in the Firebase console and enable the sign-in method(s) you want to use.

To use Firebase Authentication in your React components, you can use the useAuth hook provided by the react-firebase-hooks/auth package. See the Login and Profile components for an example.

### Firebase Realtime Database
This template also includes Firebase Realtime Database. To use the database, create a new database in the Firebase console and set the rules to allow read/write access to the authenticated user.

To use Firebase Realtime Database in your React components, you can use the useDatabase hook provided by the react-firebase-hooks/database package. See the Profile component for an example.

### Building for Production
To build the project for production, run npm run build. This will create a production-ready build of the project in the build directory. You can then deploy the project to Firebase Hosting using the Firebase CLI.





