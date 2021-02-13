# SnailyCADv3

![license](https://img.shields.io/github/license/dev-caspertheghost/snaily-cadv3?color=gr&style=flat-square)
![contributors](https://img.shields.io/github/contributors/dev-caspertheghost/snaily-cadv3?color=gr&style=flat-square)
![stars](https://img.shields.io/github/stars/dev-caspertheghost/snaily-cadv3?style=flat-square&color=gr)
![issues](https://img.shields.io/github/issues/dev-caspertheghost/snaily-cadv3?style=flat-square)

SnailyCAD is a free, realtime, fast and secure CAD/MDT for your community!

## Table of contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Bugs](#bugs)
- [Features](#features)
- [License](#license)

## Requirements

- [GIT](https://git-scm.com/downloads)
- [NodeJS v14](https://nodejs.org) (**Must be v14 or you'll run into problems!**)
- [MySQL](https://www.apachefriends.org/download.html)

## Installation

[Quick Installation guide](https://youtu.be/dO8qXSDDUag)

[How to update the CAD](https://youtu.be/RV6KeeN4AA4)

1. Open Command Prompt
2. Run `git clone https://github.com/Dev-CasperTheGhost/snaily-cadv3`
3. Run `cd snaily-cadv3`
4. Run `npm run auto-install` and wait it to finish
5. Open the `server` folder
6. Make a copy of `config.example.ts` and rename to `config.ts`
7. Modify that where needed
8. Go back to your command prompt
9. Once done modifying, create a new database in XAMPP phpmyadmin, call it `snaily-cad` or whatever you called it in the config file
10. Import `snaily-cad.sql` into that database
11. Go back to your command prompt and make sure you are in the main folder (snaily-cadv3/)
12. Run `npm start`, this will start both client and server
13. Wait a few seconds until it logs "CAD IS RUNNING ON \<port\>"
14. The CAD should be running on <http://localhost:3030> by default

**If you don't understand any step: [please join our support server](https://discord.com/invite/eGnrPqEH7U)**

## Troubleshooting

- I get an error saying that `ts-node is not found/not a command`

  - run `npm install -g ts-node`

- I get an error saying `cannot find module dotenv/config`

  - run `cd server && npm install dotenv`

- I try to run `/callxxx` but it won't show up in the CAD/MDT

  - Make sure that you've configured the config in `server.lua` in the download

- I followed the steps for updating the CAD, but still says it's outdated!
  - 1: Run: `git stash` in the root folder of the CAD/MDT
  - 2: Follow the rest of the update steps
  - 3: Should be updated

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
- Taxi Dashboard
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
  - Manage penal codes and 10 codes

- Citizen

  - Create medical records
  - upload a picture of your citizen
  - Register vehicles and weapons
  - Call emergency services and tow truckers from the citizen dashboard
  - Drivers, pilot, firearms license and CCW
  - Report vehicles as stolen
  - Transfer a vehicle to a new owner
  - Request expungement
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
  - Panic button

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
  - Signal 100

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
