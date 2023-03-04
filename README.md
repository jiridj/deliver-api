#  DELIberately Vulnerable E-commeRce API

![build](https://img.shields.io/github/actions/workflow/status/jiridj/deliver-api/cicd.yml)
![coverage](https://img.shields.io/codecov/c/gh/jiridj/deliver-api?token=35GE4E56NO)
[![open issues](https://img.shields.io/github/issues-raw/jiridj/deliver-api)](https://github.com/jiridj/deliver-api/issues)

As suggested by the name, the DELIVER API is a sample application with deliberate API vulnerabilities. My intent is to provide a demo scenario for common API vulnerabilities and how they can be exploited. This sample application can also be used to demonstrate how certain tools can help detect, alert and mitigate these vulnerabilities at scale. The goal is to raise awareness around API security needs. 

> **Note:**
> While inspired by the [OWASP API Top 10](https://owasp.org/www-project-api-security/), it is not my intention to provide a comprehensive set of examples for all vulnerabilities in the top 10. If you are looking for such examples, I recommend you take a look at following awesome projects that are great learning resources:
> - [crAPI](https://github.com/OWASP/crAPI) by OWASP
> - [vAPI](https://github.com/roottusk/vapi) by [Tushar Kulkarni](http://roottusk.com/)
>
> If you want to learn more about API security, I can also highly recommend the free [APIsec University](https://www.apisecuniversity.com/) courses. 

## Demo Scenario

The DELIVER API provides the backend for an e-Commerce shop. The API comes pre-loaded with 20 products, 1000 users and over 2000 orders. 

Via the API you can create and manage a user account, query products, query and create orders. The API also provides administrator users the ability to manage user accounts.

The [OpenAPI specification](openapi.yml) provides complete documentation for the API. 

## Running the application

The application has been packaged to run in docker and be pre-loaded with sample data. First, clone this repository so you have a local working copy.

```bash
git clone git@github.com:jiridj/deliver-api.git
cd deliver-api
```

Make sure your Docker environment is good to go. This will depend on how you've installed Docker onto your machine (e.g. [Docker Desktop](https://www.docker.com/products/docker-desktop/), [Rancher Desktop](https://rancherdesktop.io/), [Colima](https://github.com/abiosoft/colima)) and start the docker-compose stack. 

```bash
docker-compose up -d
```

The stack will pull the mongodb, mongo-express and jiridj/deliver-api images from [Docker Hub](https://hub.docker.com) and seed the database with sample data. 

> **Note:**
>If instead you wish to build the deliver-api image locally, simply uncomment the build instructions in the [docker-compose.yml](docker-compose.yml) file.

Following services are accessible from your localhost with the default configuration provided:

- Mongo DB on port 27017
- [Mongo Express](https://github.com/mongo-express/mongo-express) on port 8081
- DELIVER API on port 3333


## Attack Plays

## Mentions

- APIsec University
- Fake Store API
- Acronymify
