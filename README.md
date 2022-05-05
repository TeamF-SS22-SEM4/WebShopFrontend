# Readme

A ReactJs Application for a fictional Musicshop "Tomify", created for course Enterprise Applications at FHV.


## Run the application
### For Development

Recommended to start via ``npm start``, for Hot-Reloading.

***
### For Deployment

Run via ``runWin.ps1/runLinux.ps1``-scripts.

NOTE: This starts the application in a container and therefore requires Docker to be installed, also requires docker-compose


### Open-Api Client

When running the application for the first time or after making changes to [opanapi-def.yml](src/resources/openapi-def.yml)
You need to run ``npm run generate-client``, this automatically generates the client from the spec.