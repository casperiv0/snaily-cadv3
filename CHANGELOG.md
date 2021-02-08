# Changelog

**If you need help updating/installing or have found any bugs, please join [our Discord server](https://discord.gg/eGnrPqEH7U) or open a [GitHub issue here](https://github.com/Dev-CasperTheGhost/snaily-cadv3/issues/new/choose)**

## 1.2.5

- Add version check in client side

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
