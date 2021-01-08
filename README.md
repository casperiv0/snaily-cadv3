# SnailyCADv3

![license](https://img.shields.io/github/license/dev-caspertheghost/snaily-cadv3?color=gr&style=flat-square)
![contributors](https://img.shields.io/github/contributors/dev-caspertheghost/snaily-cadv3?color=gr&style=flat-square)
![stars](https://img.shields.io/github/stars/dev-caspertheghost/snaily-cadv3?style=flat-square&color=gr)
![issues](https://img.shields.io/github/issues/dev-caspertheghost/snaily-cadv3?style=flat-square)

SnailyCAD is a free, realtime, fast and secure CAD/MDT for your community!

## Table of contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Contributing](#contributing)
- [Bugs](#bugs)
- [Features](#features)
- [License](#license)

## Requirements

- [GIT](https://git-scm.com/downloads)
- [Docker Desktop](https://www.docker.com/get-started)

## Installation (Windows Machine)

[Quick Installation guide](https://youtu.be/av_rD_jOJN8)

[How to update the CAD](https://youtu.be/6THGMcHEX48)

1. Open Command Prompt
2. Run `git clone https://github.com/Dev-CasperTheGhost/snaily-cadv3`
3. Run `cd snaily-cadv3`
4. Copy, paste `.env.example` to `.env`
5. Modify where needed

   - `MYSQL_DATABASE`: The database that will be used for the CAD
   - `MYSQL_USER`: The user that will connect to the database
   - `MYSQL_PASSWORD`: The password for the `MYSQL_USER`
   - `MYSQL_ROOT_PASSWORD`: The root password for the database
   - `CLIENT_URL`: The URL where you want to run your CAD, this can be an IP or a domain name, EG: `my-cad.com`
   - `REACT_APP_SERVER_URL`: The URL where you want to run the server of the CAD, this can be an IP or a domain name EG: `server.my-cad.com`
   - `ENVIRONMENT`: The ENV, please don't change this if you aren't developing for SnailyCAD
   - `INNER_HOST_URL`: The ip of your windows machine (NOT router), `ipconfig` in command prompt to see ip
   - `JWT_SECRET`: The secret for authenticating users, this can be any long string of random characters

6. Run `docker network create web`
7. Run `docker-compose up -d`
8. CAD should be running after about 1-2minutes

## Installation (Ubuntu)

Soon™

**If you don't understand any step: [please join our support server](https://discord.com/invite/eGnrPqEH7U)**

## Contributing

[View CONTRIBUTING.md](./CONTRIBUTING.md)

## Bugs

You can report any bug [here](https://github.com/dev-caspertheghost/snaily-cadv3/issues)

## Features

- Administration Dashboard
- Citizen Dashboard
- EMS/FD Dashboard
- LEO Dashboard
- Dispatch Dashboard
- Tow Dashboard
- Trucker Logs
- Bleeter
- Translate with ease
- Realtime dashboards

- Administration

  - Manage user permissions
  - Manage all companies
  - Manage all citizens
  - Ban users
  - CAD Settings
  - Assign your own values for departments, ethnicities, genders and more

- Citizen

  - Create medical records
  - upload a picture of your citizen
  - Register vehicles and weapons
  - Call emergency services and tow truckers from the citizen dashboard
  - Drivers, pilot, firearms license and CCW
  - Report vehicles as stolen
  - Transfer a vehicle to a new owner
  - Companies
    - Company Blog posts
    - Create posts
    - Manage Employees
    - Join a company
    - Start your own company

- EMS/FD

  - Create EMS/FD Deputies
  - Search medical records
  - See active 911 calls

- LEO

  - Create unlimited officers per account
  - Name Search
  - Plate Search
  - Weapon Search
  - Create Written warnings
  - Create Tickets
  - Create Arrest reports
  - Create bolos
  - Penal Codes
  - Manage Status (10-8, 10-7, 10-6, 10-5, ...)
  - Create Warrants
  - See active 911 calls
  - See active bolos

- Dispatch

  - Name Search
  - Plate Search
  - Weapon Search
  - Address Search
  - Update officers status
  - Update emergency calls
  - Update AOP
  - See Active officers and EMS/FD deputies
  - See active 911 calls
  - See active bolos

- Tow

  - See all active tow calls
  - in game call tow truckers command

- Trucker Logs

  - See all truck logs you've made
  - Create unlimited truck logs
  - Delete a truck log

- Bleeter

  - Upload screenshots
  - Create Bleets
  - Edit Bleets

- And a lot more..

## Supporting SnailyCAD

All stars/forks are appreciated! ⚡

Feel free to open a pull request with a new feature.

Made with ❤️ and TypeScript!

## License

[MIT © Dev-CasperTheGhost](./LICENSE)
