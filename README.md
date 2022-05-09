# Overview

Two simple microservices implemented in Node.JS, with Express. Run with `Docker`, using `docker-compose`.
Database used is MongoDB, in a `Docker` image.

URLs which needs to be used for calling both services are:

```
Auth:
http://localhost:3000/auth/(sign or verify)
Movies:
http://localhost:3001/movies

or
Auth:
http://0.0.0.0:3000/auth/(sign or verify)
Movies:
http://0.0.0.0:3001/movies
```

## Prerequisites

You need to have `docker` and `docker-compose` installed on your computer to run both services.
Running the tests requires to install `Node.JS` with `NPM`, running `npm install` in directories: ./movies and ./auth.

## Run locally

1. Clone this repository
1. Run from root dir

```
JWT_SECRET=secret OMDb_SECRET=b031a85a docker-compose up -d
```

Sometimes this command might come in handy:
```
sudo JWT_SECRET=secret OMDb_SECRET=b031a85a docker-compose up -d --build
```

To stop services from running

```
docker-compose down
```
## Testing

Small unit tests are written for both of the services.
You can start the test by simply running `npm test` command in the directory of the service you want to test.

# Movies service

Runs on Port 3001
Simple Movie API with two endpoints:

1. `POST /movies`
   1. Allows creating a movie object based on movie title passed in the request body
   2. Based on the title movie details are fetched from
      https://omdbapi.com/ and saved to the database. Data which is fetched from OMDb API:
   ```
     Title: string
     Released: date
     Genre: string
     Director: string
   ```
   3. Only authorized users can create a movie.
   4. `Basic` users are restricted to create 5 movies per month (calendar
      month). `Premium` users have no limits.
1. `GET /movies`
   1. Fetch a list of all movies created by an authorized user.

Authorization is possible thanks to JWT, at first the token must be retrieved from auth service.
For any API calls the token must be provided in a header, like so:
```
Authorization: Bearer <token>
```

# Authorization service

Runs on Port 3000
Simple Movie API with two endpoints:

1. `POST /auth/sign`
    1. Creates JWT token, with data provided in the body.
    You need to use one of the user's credential provided in section Users.
    The body needs to be in JSON format, for example:
    ```
    {
      "username": "basic-thomas",
      "password": "sR-_pcoow-27-6PAwCD8"
    }
    ```
2. `GET /auth/verify`
    1. Verifies JWT token, provided in the header(like in movies service), and returns decoded token with `isAuthorized` value.

## JWT Secret

To generate tokens in auth service you need to provide env variable
`JWT_SECRET`. It should be a string value.

## Users

The auth service defines two user accounts that can be used

1. `Basic` user

```
 username: 'basic-thomas'
 password: 'sR-_pcoow-27-6PAwCD8'
```

1. `Premium` user

```
username: 'premium-jim'
password: 'GBLtTyq3E_UNjFnpo9m6'
```

## Token payload

Decoding the auth token will give access to basic information about the
user, including its role.

```
{
  "userId": 123,
  "name": "Basic Thomas",
  "role": "basic",
  "iat": 1606221838,
  "exp": 1606223638,
  "iss": "https://www.netguru.com/",
  "sub": "123"
}
```

## Example request
To authorize user call the auth service using for example `curl`.

Request

```
curl --location --request POST '0.0.0.0:3000/auth/sign' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "basic-thomas",
    "password": "sR-_pcoow-27-6PAwCD8"
}'
```

Response

```
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywibmFtZSI6IkJhc2ljIFRob21hcyIsInJvbGUiOiJiYXNpYyIsImlhdCI6MTYwNjIyMTgzOCwiZXhwIjoxNjA2MjIzNjM4LCJpc3MiOiJodHRwczovL3d3dy5uZXRndXJ1LmNvbS8iLCJzdWIiOiIxMjMifQ.KjZ3zZM1lZa1SB8U-W65oQApSiC70ePdkQ7LbAhpUQg"
}
```
