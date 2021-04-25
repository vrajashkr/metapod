# Metapod
### Accessible Hardening of Docker Containers for Enhanced Security
---
## Abstract
Containers have become a popular tool for developers to build scalable applications in today’s fast-growing world. They are a lightweight alternative to virtual machines. This benefit, however, can come at the cost of security. Security is an aspect often overlooked by programmers. Unfortunately, an astonishing number of security vulnerabilities have been linked to containers. These can arise from multiple sources including the container runtime, the image, and the host machine. Existing approaches to hardening containers often compel programmers to have prerequisite understanding of concepts and application procedures. Enforcing these concepts in practice demands tedious manual action on the part of the programmer. Our work aims to create an easy-to-use and accessible application that solves this problem thereby facilitating easier incorporation of recommended security practices in Docker containers. These may be practices such as restricting Linux Capabilities, resource allocation, etc. Developers may easily manage security controls using an intuitive interface, giving them more time to focus on building their application.

## Running the application
### Development Mode
In development mode, the backend server and the UI server are run separately.

#### Step 1: Installation of prerequisites
This application requires the following software to be installed for development mode:
1. Docker
2. Git
3. NodeJS
4. Yarn Package Manager
5. Python 3.8

#### Step 2: Clone repository
Clone this repository's master branch: `git clone https://github.com/DarkAEther/metapod.git`

#### Step 3: Start MongoDB database
Start MongoDB inside a docker container and expose the port: `docker run -d -p 27017:27017 mongo`

#### Step 4: Start the UI server
Start the React Dev Server using Yarn: `cd metapod; BROWSER=none yarn start`

#### Step 5: Add your Snyk API Key into the `settings.config` file
Access `backend/settings.config`.
Use your favourite text editor to add your API key:
```
[SNYK]
apiKey = <API key here>
```

#### Step 6: Start the backend server
Start the Python Flask Dev Server using Python: `cd metapod; python3 ./backend/server.py`

#### Step 7: View the webpage
Open a browser and the web application will be visible at `http://localhost:3000`

### Production Mode
In production mode, a complete image is built that contains the application.

#### Step 1: Installation of prerequisites
This application requires the following software to be installed for development mode:
1. Docker
2. Git

#### Step 2: Clone repository
Clone this repository's master branch: `git clone https://github.com/DarkAEther/metapod.git`

#### Step 3: Create a Docker network for the application
`docker network create metapod-internal`

#### Step 4: Start MongoDB database
Start MongoDB inside a docker container with name 'mongo-internal' connected to the 'metapod-internal' network: `docker run -d --net=metapod-internal --name=mongo-internal mongo`

#### Step 5: Add your Snyk API Key into the `settings.config` file
Access `backend/settings.config`.
Use your favourite text editor to add your API key:
```
[SNYK]
apiKey = <API key here>
```

#### Step 6: Build the Production Image
```bash
cd build;
sh ./build.sh -p
```

#### Step 7: Create the Metapod Container
Create a container using the built image:
`docker run -d --net=metapod-internal --name=CONTAINER_NAME -v "/var/run/docker.sock:/var/run/docker.sock:rw" -p 3000:3000 -p 5000:5000 metapod-production`

#### Step 8: Visit the web application
The web UI will be visible at `http://<host-ip>:3000`