# `moments-backend API`

[Link to hosted API](https://0cu7huuz9g.execute-api.eu-west-2.amazonaws.com/latest/api)

This API sends a URL of an image in the S3 bucket to a users dynamoDB table. It performs CRUD operations through the endpoints outlined below.

## `Prerequisites`

You will need an Amazon Web Services to use your access_key_id and secret_key.

## `Getting started`

Clone this repo and cd into it

```
git clone https://github.com/keirbetts/moments-backend/
cd moments-backend
```

Install the dependencies

```
npm i
```

In the root directory, create a .env file

```
touch .env
```

Add the following code to the .env file

```
ACCESS_KEY_ID=youraccesskeyid
SECRET_KEY=yoursecretkey
```

### `Testing`

To run tests

```
npm t
```

---

## `API endpoints`

The following endpoints are available:

```
GET /api

GET /api/images/:usr

POST (actually a delete request) /api/images/:usr

POST /api/upload

POST /api/createuser

PATCH /api/activeuser

```

## `More specifically, each endpoint responds like this:`

GET /api

### `Responds with`

A JSON object with all of the available endpoints and what they respond with

---

GET /api/images/:usr

Gets all of the images belonging to that user from the DB.

### `Responds with`

An array of all of the images in the database belonging to that user

---

POST /api/images/:usr

Deletes the given image URL from the users table in the DB.

### `Request body accepts`

An object in the form { url: url}

### `Responds with`

A status code of 200

---

POST /api/upload

Adds the given image URL to the users table in the DB.

### `Request body accepts`

An object in the form { imageLocation: url, usr: username}

### `Responds with`

A status code of 201 and an object in the form { msg: "Succesfully updated DB"}

---

POST /api/createuser

Creates the user table in the DB.

### `Request body accepts`

An object in the form { usr: username }

### `Responds with`

A status code of 201 and an object in the form { msg: ":usr account created in DB"}

---

PATCH /api/activeuser

Sets the active user in the DB

### `Request body accepts`

An object in the form: { usr: username }

### `Responds with`

An object in the form { msg: "Active user changed"}

---

## `Built using`

- Express.js
- aws-sdk
- aws-serverless-express
- aws dynamodb document client
- Jest
- Supertest
- Bodyparser
- Cors
- claudia.js

## `Authors`

### `Main contributers`

[Humayraa Mulla](https://github.com/Hy-M) & [Andrew Falls](https://github.com/Afalls89)

### `Secondary contributers`

[Alexander Trout](https://github.com/alexandertrout), [Kier Betts](https://github.com/keirbetts), [Dominic Hui](https://github.com/DominicH247) and [Daniel Cruickshanks](https://github.com/smegbot1)
