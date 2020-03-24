# Project setup

## Installation

```bash
# Install dependencies
$ npm install
```

## Build the app

```bash
# Output in the 'dist' folder
$ npm run build
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running with Docker

Before running docker to build the container it's necessary to have the _dist_ folder
containing the builded application, see the [Build the app](#build-the-app) section
of this documentation.

```bash
# Build and run the container
$ docker-compose up -d

# Rebuild the container
$ docker-compose up -d --build
```
