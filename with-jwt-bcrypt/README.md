# Hand to Hand

A web-based second-hand marketplace for KMITL students, staff, and lecturers.

## Features
- User registration & login
- Post, edit, delete second-hand items
- Browse, search, and filter items
- Buyer–seller messaging
- Offer, accept, reject, and hold mechanism
- Admin moderation tools

## Tech Stack
- Frontend: React
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: JWT

## Team Roles
- Project Manager
- Frontend Developer
- Backend Developer
- Chat & Integration #NOT SURE
- QA & Documentation #NOT SURE
- 
#what to start
- Setting up what app can do (Use case)
- Flow diagram + ER diagram (Database)
- Work Flow (To show where does data flow?)

## Installation
### Development
- Do `npm install` in `/backend` and `/frontend`
- Copy `databaseCredentials.js` to `/backend`
- Test backend-database by running `node server.js TESTDB` and `node test_server.js` in parallel in `/backend`,
  tests should pass
- Spin up React server of frontend with `npm start` in `/frontend`
- Run `node server.js` but without `TESTDB` to use actual database
- Test by logging in with `corn` being the username and password
- **To register a user, have the password to be the same as username
  since the database stores the irrecoverable hash of the password**
### Seeing the database
- Install mongoDB Compass
- Create a connection with `mongodb+srv://cookies:password@auctiondraftcluster.cmlfgox.mongodb.net/`,
  where `cookies` is the database access username and `password` is the password
