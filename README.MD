# Advanced React Native

## Common Authentication flows

- email/password
- OAuth
- 2FA (layer ontop of email/password or oAuth)
- OTP (one time password) phonenumber or email to receive code

## Steps

1. Cloud function #1 - receive phone number -> create user record
2. Cloud function #2 - login / send user OTP
3. Cloud function #3 - compare OTP with db(firebase) -> mark OTP as no longer valid -> return JWT

## Todo:

1. create firebase project (https://console.firebase.google.com/)
2. set up local firebase project
3. write function to create a user
4. sign up for twilio
5. write function to generate and text a user

## Installation

- to use firebase functions you need to be on the 'BLAZE' plan
- install firebase-tools globally. I usually installing global dependencies as project dependencies, this way when you installing project fresh, it wont complain of missing dependencies (as global dependencies arent listed in package.json).

```cmd
npm i -g firebase-tools
```

### create firebase project

- then go to google cloud console and select the project, click functions... you have to click 'get started' and install firebase globally

```cmd
firebase init
```

### deploy function /redeploy

- deploys functions to google cloud functions
- you can get project-id from https://console.firebase.google.com/ -> project settings
- firebase deploy --project <project-id>
- functions have direct access to the firebase db via service client (GOD MODE)
- these functions receive data and are 'POST' requests
- use postman to test

```cmd
firebase deploy --project sgrider-reactnative-advanced

```

```js
// example
module.exports = (req, res) => {
  // req.body js object containing all the data that was passed to this function when user called it
  // functions have direct access to the firebase db via service client (GOD MODE)

  res.send(req.body);
};
```

## service client

- its like GODMODE for functions to directly manipulate the database
- can put this code in index and import the service client into the functions that need GODMODE access to db.

- https://firebase.google.com/docs/functions/config-env

- sometimes you need to store API keys, You can choose between three options:

- Parameterized configuration (recommended for most scenarios). This provides strongly-typed environment configuration with parameters that are validated at deploy time, which prevents errors and simplifies debugging.

- File-based configuration of environment variables. With this approach, you manually create a dotenv file for loading environment variables.

- Runtime environment configuration with the Firebase CLI and functions.config.

---

- we use 'service_account.json' but you can equally do the same with '.env'
- using service_account.json loads the whole file
- service_account.json has been left omitted from git respository but an example file service_account.json.example to guide you.
- you can get the .json from google cloud project settings -> Service accounts -> Firebase Admin SDK
- it should be put in /functions folder

```js
const admin = require('firebase-admin'); //give access directly to db
const serviceAccount = require('./service_account.json');

const functions = require('firebase-functions');
const createUser = require('./create_user');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

## enable user authentication

- firebase authentication feature for projects is off by default -> need to set up sign-in method
- use anonymous - Enable anonymous guest accounts in your application, which lets you enforce user-specific security and Firebase rules without requiring credentials from your users.
- https://firebase.google.com/docs/auth?authuser=0&hl=en
