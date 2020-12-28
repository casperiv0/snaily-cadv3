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
- [NodeJS v12+](https://nodejs.org)
- [MySQL](https://www.apachefriends.org/download.html)

## Installation

[Quick Installation guide](https://youtu.be/av_rD_jOJN8)

[How to update the CAD](https://youtu.be/6THGMcHEX48)

1. Open Command Prompt
2. Run `git clone https://github.com/Dev-CasperTheGhost/snaily-cadv3`
3. Run `cd snaily-cadv3`
4. Run `npm install` and wait it to finish
5. Open the `server` folder
6. Make a copy of `config.example` and rename to `config`
7. Modify that where needed
8. Go back and open the `client` folder
9. Open the `src` folder
10. Open `config` and modify
11. Go back to your command prompt
12. Make sure your back in the main folder (snaily-cadv3)
13. Run `cd server`
14. Run `npm install` and wait for it to finish
15. Once finished, run `cd ../client`
16. Run `npm install --legacy-peer-deps` and wait for it to finish
17. Run `npm run build` and wait for it to finish
18. Once finished, create a new database in XAMPP phpmyadmin, call it `snaily-cad` or whatever you called it in the config file
19. Import `snaily-cad.sql` into that database
20. Go back to your command prompt and make sure you are in the main folder (snaily-cadv3)
21. Run `npm start`
22. The CAD should be running on <http://localhost> by default

**If you don't understand any of the steps, add me on Discord CasperTheGhost#4546 (Voice chat or text chat)**

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
