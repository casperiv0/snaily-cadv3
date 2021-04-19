# Changelog

**If you need help updating/installing or have found any bugs, please join [our Discord server](https://discord.gg/eGnrPqEH7U) or open a [GitHub issue here](https://github.com/Dev-CasperTheGhost/snaily-cadv3/issues/new/choose)**

## 2.0.3

- New: added new features to disable
- Minor: fixed minor bugs

## 2.0.2

- New: officer incidents
- Minor: fixed bug where you couldn't use the CAD within an `iframe`
- Minor: don't show navbar when not logged in to avoid confusion
- Minor: remove redundant console logs

**Allow the CAD to be used in an iframe**

1. Open your config.ts file
2. add the following to your config:

(Check the config.example.ts for reference)

```ts
allowIframes: true; // Make sure this is 'true' to allow iframes,
```

3. Save the config.
4. Restart the CAD
5. Should be working!

## 2.0.1

- Minor: fixed not being able to create tow & taxi calls
- Minor: updated [FiveM addons](https://github.com/Dev-CasperTheGhost/snaily-cadv3/tree/main/public/downloads)

## 2.0.0

- New 404 page
- New: See all the companies your citizens work at in one view (Citizen -> Manage employment status -> See it!)
- Major: Tons of bug fixes
- Major: Rewritten to [new framework](https://nextjs.org) to improve developer experience and performance
- Major: able to have custom Open graph tags

## 1.5.3

- New: able to edit bolos
- Minor: fixed a bug where it would not set the officer/ems-fd off-duty after the cookie expires.

## 1.5.2-patch1

- Fix: fixed a bug not being able to see BOLO's
- Fix: fixed a bug where `max_citizens` would not save to the DB
- Fix: fixed a bug where officers could not assign themself to a call without dispatch permissions
- Fix: fixed a bug where dispatchers could not update a status of an officer

## 1.5.2

- New: Owner can disable companies CAD wide (If you don't need/want it)
- New: Owner can set a limit of creatable citizens
- New: Officer is able to self-assign to a call
- New: Officer is able to delete warrants

## 1.5.1

- Minor: Fixed issues with live map
- New release of the [live_map resource](https://github.com/Dev-CasperTheGhost/live_map/releases/tag/1.1.0)
- Minor: Updated to [Bootstrap 5 beta3](https://getbootstrap.com)

## 1.5.0

- New: Selected admins can add temp passwords (if a user has lost their password)
- Major: Replaced several pages with modals (popups)
- Major: Improvements to modals
- Major: Tons of bug fixes and improvements to code
- Minor: slighty darker `btn-secondary` (gray) color

## 1.4.9

- New: able to remove tickets/arrest reports/written warnings
- New: LEO supervisors can manage 10 Codes & Penal Codes
- Minor: fixed a bug where supervisors could not see officer logs in manage officer
- Minor: Fixed few bugs
- Minor: updated dependencies

## 1.4.8

- New: LEO can suspend licenses
- New: CAD wide supervisor panel (EMS/FD + LEO)
- New: able to unlink Steam
- Minor: Auto redirect when user has successfully authenticated with Steam.
- Minor: fixed minor bugs

## 1.4.7-patch1

- Minor: Fixed a (app breaking) bug with 10 codes positioning

## 1.4.7

- New: Set a position for 10 codes
- New: Call types (EG: Citizen call, Traffic stop, ...)
- Minor: Bug fixes
- Major: Add missing translation keys
- Major: Improvements to Docker support, Thanks @bound2 & @henriots!

## 1.4.6

- New: [Docker support](https://github.com/Dev-CasperTheGhost/snaily-cadv3/wiki/Installation-Guide#using-docker) - for advanced users.
- New: Only notify an active officer to a call when they're not already assigned to a call.
- Minor: Bug fixes with the live-map

## 1.4.5

- Updated translations

  **Read:** Make sure to start your CAD after updating, this will update the translation file with the new values.
  The values you have translated to your likings are **not** being overwritten. It'll only add the new missing values.

- Fixed minor bugs

## 1.4.4-patch1

- Fixed error "Could not find that `status`"
- Fixed bug not being able to clear company when registering a vehicle

## 1.4.4

- Minor: lazy load lists
- Minor: start on implementing loading indicators for slow connections
- Minor: Removed random `;` on dispatch dashboard
- Minor: fixed small bugs
- Major: Socket authentication

## 1.4.3

- New: call events
- New: register weapon with custom serial number
- Major: All new error popup system
- Major: cleanup code
- Minor: Fixed small bug
- Minor: able to search vehicle via VIN number now
- Minor: several bug fixes

## 1.4.2

- New: Admins/supervisors can see officer logs in `Officer Management`
- New: Declare citizens dead or alive (EMS/FD only)
- Minor: LEO actions are disabled if there's no `activeOfficer`
- Minor: Fixed minor bug
- Minor: Don't use sockets to check version, will now return the version via `/api/v1/global/cad-info`
- Major: Fixed bugs with sounds playing several times over
- Major: Fixed bugs with requests getting spammed on a socket update

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
