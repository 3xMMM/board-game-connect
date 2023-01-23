# board-game-connect
A fun little project where the goal is to create a web application that allows people to rent and purchase board games. This is just for learning and not intended for real world usage.


## Prerequisites
- Docker (see https://docs.docker.com/get-docker/)
- Node 18+ (see https://nodejs.org/en/)

## Setup
- Create a `.env` file in the project root. Copy the contents of `.env.example` into your new `.env` file
- `docker compose up --build`
- `docker exec -it backend sh` (see if we can consolidate these)
- `npm run migrate up`
- Navigate to http://localhost:3000/ to view the frontend client (note: it takes a few minutes to get started)

## Run commands in a container
- `docker exec -it backend sh` (you can replace 'backend' with anything)

## eslint setup
- In the root project directory:
    - `cd frontend && npm install && cd ../backend && npm install && cd ..`