# Changelog

**If you need help updating/installing or have found any bugs, please join [our Discord server](https://discord.gg/eGnrPqEH7U) or open a [GitHub issue here](https://github.com/Dev-CasperTheGhost/snaily-cadv3/issues/new/choose)**

## 1.4.2

- Admins/supervisors can see officer logs in `Officer Management`

## 1.4.1

- Fixed small issue with installation

## 1.4.0

- New: Added a global search, use `CTRL+K` or `CMD+K` to open it. Use the `Escape` key to close
- New: Able to enable/disable features (Bleeter, taxi, tow and truck-logs)
- New: Able to update officer department in Manage Officers
- New: Able to track officer logs (Total time on-duty. LEO Dashboard -> my officers -> my officer logs)
- New: Send webhook when officer status was changed
- Minor: Only show navigation bar items where user has access too
- Minor: See author of expungement request ([#107](https://github.com/Dev-CasperTheGhost/snaily-cadv3/issues/107))
- Minor: Updated dependencies
- Minor: Updated page titles
- Major: Add Prettier & ESLint
- Major: Code improvements

## 1.3.9

- Minor: code improvements
- New: Added `rank` to officers, assignable by moderators, admins and owners
- New: Added `supervisor` rank to users, this rank can only manage officers

## 1.3.8

- Minor: Fixed small bug not being able to search for medical records
- Minor: improvements to live map
- Minor: Updated dependencies (Make sure to run `npm run auto-install` after updating! )

## 1.3.7

- New: Added phone-number field
- New: EMS-FD is able to update medical records for citizens
- Minor: Fixed small bug

## 1.3.6

- Minor: Fixed bug that broke registering a new account
- Minor: Fixed a few minor bugs

## 1.3.5

- Minor: Fixed flickering bug in map
- Minor: Added `steam_api_key` to database updater

## 1.3.4

- Major: Live map ([#83](https://github.com/Dev-CasperTheGhost/snaily-cadv3/pull/83))
- Minor: Minor bug fixes

## 1.3.3

- Minor: added sound for Signal 100
- Minor: Bug fixes
- Minor: minor fixes

## 1.3.2

- Fixed bug not letting users select ethnicities or genders

## 1.3.1

- New: Signal 100
- New: Able to change length of plate (Default: 8)
- New: Able to delete users from the CAD (At the bottom of manage member page)
- New: A bleet now shows the username of who created the bleet
- Minor: Fixed bug admins not able to delete a bleet
- Minor: Upgraded to [bootstrap v5 beta 2](https://getbootstrap.com/docs/5.0/getting-started/introduction/)
- Minor: Updated screenshots
- Minor: Fixed issue with creating a new citizen
- Minor: Fixed duplicate naming in NameSearchModal

## 1.3.0

- Minor: Add version check in client side
- Major: Server side rendering (No more CORS errors!)
- Major: Customize penal codes and 10 codes

## 1.2.4

- New notifications system (Beta)
- Automatically change unit status to `10-97` when assigned to a call
- Fixed length for assigning units to a call
- Added callsign to update 911 call "assign unit"

## 1.2.3

- Show accounts username for company and citizen management
- `calltaxi` in game command
- Fixed bug in address search
- Add `10-8` to updateStatus modal in dispatch
- Added `10-11` and `10-23` to LEO statuses
- Add callsign to dispatch active units
- Added `usePermission` hook for backend
- Fixed needing to reload page to update permissions/cad settings

## 1.2.2

- Added 10-42 status code
- Added auto-fill penal codes for creating a ticket, arrest report and written warning
- LEO and EMS-fd can now mark a call as code 4
- Panic button will now play a sound to alert active LEO/dispatch
- Auto complete name search
- Fixed bug with /call911 & /calltow not updating the CAD in realtime
- Fixed weapon search returning a blank screen

## 1.2.1

- Updated db checker to update tables in database
- Fixed typo in name search
- Removed `officer name` from few modals, replaced with current active officer

## 1.2.0

- New revamped select input for selecting assigned units in update 911 call
- Updated dependencies
- Upped cookie expire time to 2 hours (Prev: 1 hour)
- Added `Currently active as:` to LEO & EMS-FD dashboard
- Logging out will automatically set your active deputies to off-duty
- Able to add notes to citizens (NameSearch)
- Taxi jobs (Same as tow but for taxis)
- A sound will be played when your current active officer is assigned to a call
- Citizens are able to request an expungement
- Minor bug fixes
- Small improvements

## 1.1.0

- Officer callsign
- Admins can change callsign
- assign EMS-FD to 911 call
- fixed permissions bugs in LEO & admin

## 1.0.1

- Bug fixes

## 1.0.0

- Upgraded to bootstrap 5
- Fixed bug where searching for a weapon/plate it would result in a black screen
- Added a new message system, you can now dismiss most of the alert-messages
- A ton more bug fixes and improvements

## 0.2.3

- Fixed 2 minor bugs

## 0.2.2

- Fixed minor bugs

## 0.2.1

- Fixed issue with sockets not emitting

## 0.2.0

- Fixed installation issues with socket.io
- Fixed other minor issues

## 0.1.0

Initial Release
