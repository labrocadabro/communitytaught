# CommunityTaught.org

A comprehensive tracker for 100Devs classes and homework.

**Live website:** [CommunityTaught.org](https://communitytaught.org/)

![Preview of CommunityTaught.org](https://communitytaught.org/img/resources/communitytaught-preview.png)

## How It's Made

**Tech used:** Node.js, Express, MongoDB, Pug, Tailwind CSS

This app was built from scratch using my [authentication boilerplate](https://github.com/labrocadabro/node-mongo-boilerplate/) as the base for the code, and [my previous homework tracker](https://labrocadabro.github.io/100devs-hw-tracker/) as the base for the application design.

## How to Contribute

I build the website without really taking collaboration into account and the project needs some work in terms of both documentation and processes. I am in the process of getting that built out, but in the meantime, here are the basic steps to get the project up and running locally:

- fork the repository
- create a MongoDB database on your account to store the data
- import the class and homework data into your database (see the /data folder)
- rename example.env to .env and add your credentials (.gitignore will ignore the .env so your credentials won't get pushed to Github)
- Set up mailhog if you are using email and password login

### Setup Local MongoDB using Docker

#### Pre-requisites

1. Install Docker Desktop - https://www.docker.com/products/docker-desktop/

#### Run Docker Image of Mongo

Run this command to create new Docker container for MongoDB.

`docker run --name mongodb -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=user -e MONGO_INITDB_ROOT_PASSWORD=pass mongodb/mongodb-community-server:6.0-ubi8`

- `-p 27017:27017` is used to expose the MongoDB port to your host machine - allowing the app to connect to it directly.
- `-e MONGO_INITDB_ROOT_USERNAME=user` is used to set the root username when creating the MongoDB container
- `-e MONGO_INITDB_ROOT_PASSWORD=pass` is used to set the root password when creating the MongoDB container.

> [Reference](https://www.mongodb.com/compatibility/docker)

### Summary

After doing this, you will have a local MongoDB running on your computer which is assessible throught this URI - `mongodb://user:pass@localhost:27017/admin?retryWrites=true&w=majority`

> This connects to the default `admin` database. I was not able to figure out how to get a new DB working locally for some reason. Issues with the Authentication outside of `admin`.

## Optimizations and Improvements

- Tests & refactoring to make unit tests easier.
- Possibly switching the front end to React + Typescript.
- Progress bars to show how much of the course has been completed.
- API integrations to automatically check if certain tasks (like Twitter check-in) have been completed.
- Video timestamps.
- Note-taking alongside the videos.

## Lessons Learned:

- This is the largest project I've built so far, and certain parts of it were new to me. First, second, and even third attempts sometimes felt wrong - too complex, difficult to read, or slow to execute. I learned that this gut feeling is usually right, but it's also ok to move on temporarily rather than dwelling on a single problem.
