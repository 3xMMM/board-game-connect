# board-game-connect
A fun little project where the goal is to create a web application that allows people to rent and purchase board games. This is just for learning and not intended for real world usage.

## Prerequisites
- Docker (see https://docs.docker.com/get-docker/)
- Node 18+ (see https://nodejs.org/en/)
 
## Setup
- In the project root: `cd frontend && npm install && cd ../backend && npm install && cd ..`
- Create a `.env` file in the project root. Copy the contents of `.env.example` into your new `.env` file
- In the `backend` folder, create a `migration-config.json` file and copy the contents of `migration-config.example.json` into it
- `docker compose up --build`
- `docker exec -it backend sh` to shell into the backend container
- `npm run migrate up` to setup your database and run all migrations
- `npm run create:user:admin` to setup your own admin account in the app. Remember these credentials; you'll use them to login at http://localhost:3000/admin/login
- `CTRL + D` or `Command + D` to exit the interactive terminal
- Navigate to http://localhost:3000/ to view the frontend client. Also, try logging in with your admin user credentials at http://localhost:3000/admin/login

## Docs for Libraries and Frameworks

### Backend
Beyond Node and Express, the backend container uses the following:
- **Node Postgres** (a Node interface for PostgresQL) https://node-postgres.com/
- **node-pg-migrate** (a Node PostgresQL framework for writing database migrations) https://salsita.github.io/node-pg-migrate/#/

## Routine Checkout Checklist
If you pull from remote, it would be good idea to check the following:
- If a package.json/lock file changed, then run `npm install` in the frontend/backend locally and on the relevant docker container
- If the docker file/compose file changed, then run `docker compose up --build`
- If a database migration occurred, then run `docker exec -it npm run migrate up`

## Useful CLI Commands
## Run commands in a container in an interactive terminal
- `docker exec -it backend sh` (you can replace 'backend' with anything)
  - To exit the terminal, use CTRL+D or Command+D
- Alternatively, you can use Docker Desktop and use each container's Terminal

## Run `npm install` in a container (backend or frontend)
If there are updates to a container, you may need to run `npm install` in each container to ensure the container has the latest changes
- `docker exec -it [frontend | backend] sh npm install`

### Run database migrations
You'll want to run database migrations everytime you pull from remote to ensure that you have the latest changes. Here's a one-liner to do it:
`docker exec -it npm run migrate up`

### Query the database
You can open up an interactive terminal in the database container and run queries there. Here's a one-liner to do it:

`docker exec -it postgres-container psql -U postgres board_game_connect`

## Gotchas

### Don't use `docker run --rm [container name]` if you're trying to run a script/code that uses a database connection
The app uses docker network names to connect containers to one another, so you may experience issues when running a script or command that uses connections. To get around this issue, prefer using an interactive terminal like so:

`docker exec -it backend sh`
