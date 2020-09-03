# auth server middleware

this is developed to validate the request and get the user data from the jwt token with express.js

getting the accessToken from the cookie.
used the cookie-parser and JWT for the validation and user Data.

# Install

```bash
$ npm install auth-server-jwt
```

## API

<!-- eslint-disable no-unused-vars -->

```js
var express = require('express')
var authServer = require('auth-server-jwt')
var secret_access = process.env.SECRET_ACCESS
 
var app = express()
app.use(authServer(secret_access))
```

### authServer(secret)

Create a new cookie parser middleware function.

- `secret` a string used for validating the JWT token. This is required and if
  not specified, will raise an error.

The middleware will parse the `Cookie` header on the request and expose the
cookie data as the property `req.cookies`.

make sure that you are storing the cookie in the client side or passing it in the cookie header and the token in the `accessToken`.

## router middleware

<!-- eslint-disable no-unused-vars -->

```js
var { Router } = require("express");
var UsersController = require("../controllers/UsersController");
var authServer = require('auth-server-jwt')

const router = Router();

router.get("/users", authServer.check, UsersController.index);

export default router;
```

### authServer.check

This is the router middleware to validate user request with jwt token and get the user data by parsing the jwt token.

The middleware will parse the accessToken from the cookie and validate it by using the JWT and the provided secret.
also it will parse data from the token and populate the data to the request. then we can access it in the controller.
like, `request.userID` and `request.userData`.

## package use

cookie parse with [cookie-parser](https://www.npmjs.com/package/cookie-parser).

token parse and verification with JWT [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
