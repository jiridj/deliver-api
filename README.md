#  DELIberately Vulnerable E-commeRce API

![build](https://img.shields.io/github/actions/workflow/status/jiridj/deliver-api/cicd.yml)
![coverage](https://img.shields.io/codecov/c/gh/jiridj/deliver-api?token=35GE4E56NO)
[![open issues](https://img.shields.io/github/issues-raw/jiridj/deliver-api)](https://github.com/jiridj/deliver-api/issues)

A DELIberately Vulnerable E-commeRce API. The DELIVER API is a sample
API application with deliberate API vulnerabilities. It was created
with the intent to provide a somewhat realistic demo scenario to 
illustrate how API vulnerabilities can be exploited.

The DELIVER project includes following assets, each available in its 
own GitHub repository:
- [DELIVER API](https://github.com/jiridj/deliver-api): An e-Commerce
  store backend as an API implemented with Express and MongoDB. 
- [DELIVER WEB](https://github.com/jiridj/deliver-web): A simple 
  e-Commerce web application implemented as a VueJS-based single-page 
  app.
- [DELIVER ATTACKS](https://github.com/jiridj/deliver-attacks): 
  NodeJS-based examples of how an attacker could exploit the API's
  vulnerabilities.

Feel free to log issues or contribute to the demo assets via pull 
requests. 

> **Note:**
> While inspired by the [OWASP API Top 10](https://owasp.org/www-project-api-security/), it is not my intention to provide a comprehensive set of examples for all vulnerabilities in the top 10. If you are looking for such examples, I recommend you take a look at following awesome projects that are great learning resources:
> - [crAPI](https://github.com/OWASP/crAPI) by OWASP
> - [vAPI](https://github.com/roottusk/vapi) by [Tushar Kulkarni](http://roottusk.com/)
>
> If you want to learn more about API security, I can also highly recommend the free [APIsec University](https://www.apisecuniversity.com/) courses. 

## Demo Scenario

The DELIVER API provides the backend for an e-Commerce shop. The API comes pre-loaded with 20 products, 1000 users and over 2000 orders. 

Via the API you can create and manage a user account, query products, query and create orders. The API also provides administrator users the ability to manage user accounts.

The [OpenAPI specification](openapi.yml) details all available operations for the API. We also have [beautiful API documentation](https://bump.sh/jiridj/doc/deliver-api) hosted on [bump.sh](https://bump.sh/jiridj/doc/deliver-api).

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

## Attack Scenarios

The DELIVER API is vulnerable to the following attack scenarios. This should give you pointers as to how you could try and exploit the vulnerabilities in the application. 

If you are looking for example code that executes these attack plays, please check out the [deliver-attacks](https://github.com/jiridj/deliver-attacks) repository.

### 1. Excessive data exposure in JWT token

If an attacker can obtain a valid token (e.g. via Cross-Site Scripting), they can get lots of user info from the token payload (including the hashed password). The scale at which this can scenario is small and would enable an attacker to compromise a single account. It would have to be combined with e.g. phishing attempts to enable the execution of malicious code while accessing the API. 

### 2. Security misconfiguration (verbose error messages) in login

A failed login attempt returns verbose error messages (user unknown vs wrong password). This makes it easy for attackers to cross-reference email lists to build a list of user accounts. This scenario enables the attacker to target a larger scale as lists of email addresses from other leaks are available on the Dark Web. A great tool for raising awareness around leaked account info is [Have I Been Pwned?](https://haveibeenpwned.com/).

### 3. Broken Object-level Authorization in order controller

An attacker can sign up for their own account. The BOLA vulnerability in the order endpoint of the API enables the attacker to fetch all orders by simply enumerating the order number. The order info contains account information which enables the attacker to build a complete list of user accounts to attack.

### 4. Lack of rate limiting enables brute forcing password reset

Once the email address for a user account is known, an attacker can brute force the four digit one-time password and reset the password. From that point onwards the user account is compromised and any user data is accessible to the attacker.

### 5. Mass assignment enables you to sign up as an administrator

The admin role is assigned to user accounts via a hidden property on the user object. An attacker can sign up as admin and access any and all user account information via the admin API. 

## Mentions

- A few months ago [APIsec](https://apisec.ai) launched the free [APIsec University](https://www.apisecuniversity.com/) in collaboration with Corey Ball. The penetration testing course here is one of the most comprehensive and well constructed courses I have ever come across on this topic. It served as inspiration for this demo project. 

- I have reused the product data from [Fake Store API](https://fakestoreapi.com/), which is a great mock backend to use when creating new e-commerce website prototypes. 

- I have used the awesome mock data generator by [Mockaroo](https://www.mockaroo.com/) for generating user account data. If you need to generate for tests or demos, check it out!

- [Acronymify](https://acronymify.com/) helped me come up with the name for the demo project.
