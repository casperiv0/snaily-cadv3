# Changelog

**If you need help updating/installing or have found any bugs, please join [our Discord server](https://discord.gg/eGnrPqEH7U) or open a [GitHub issue here](https://github.com/Dev-CasperTheGhost/snaily-cadv3/issues/new/choose)**

## 2.1.1

- New: GSR option for LEO incidents
- New: add `Employee of the month` option for Manage employees
- New: specify custom port in config file
- New: Add `Employees list` to company page
- Minor: improvements to name search layout
- Minor: refactor SQL queries to use [`@casper124578/mysql.ts`](https://github.com/dev-caspertheghost/mysql.ts)

## 2.1.0

- New: see fine amount for CreateTicketModal
- New: see fine amount/jail time in NameSearch
- New: directly create an officer linked to citizen via CreateCitizen
- New: set a custom `assigned-to-call` status (default: `10-97`)
- New: set a custom `on-duty-code` status. (default: `10-8`)

## 2.0.11

- Minor: fixed bug where it would show all players on live map
- Minor: updated issue templates
- Minor: updated dependencies

## 2.0.10

- New: set a custom weight & height prefix (cm, kg, pounds, feet, inches, ..)
- Major: improve accessibility and performance
- Minor: load fonts locally, this should increase font loading performance
- Minor: minor code changes

## 2.0.9

- New: set a citizen as `Dangerous`
- New: able to specify time for `Jail time` (use `<amount> hours`, `<amount> minutes`, `<amount> seconds`, `<amount> milliseconds`)
- Minor: fixed a bug in `RegisterWeaponModal`
- Minor: Updated dependencies
- Minor: small code improvements
- Minor: added missing translation keys

## 2.0.8-patch1

- Fix: fixed bug where a citizen could not delete a registered vehicle

## 2.0.8

- New: able to suspend an officer
- New: able to upload mugshots
- New: added `Jail time` to penal codes
- New: added `Fine Amount` to penal codes
- Minor: minor code changes

## 2.0.7

- New: link officer with citizen
- Minor: finally move avatar icon in nav to the right
- Minor: improvements to GlobalSearch (`CTRL + K` to open)
- Minor: fixed small typos

## 2.0.6

- New: able to revoke licenses
- Major: fixed image uploads not showing/loading for citizen/bleeter
- Minor: fixed bug: `registration_code doesn't have a default value`
- Minor: fixed bug: `show_aop doesn't have a default value`

## 2.0.5

- New: split `Legal statuses` into: `Legal statuses` (citizen) & `CAD Licenses` (vehicles/weapons/..) - admins will need to add these values to `CAD licenses`!
- Minor: added notification when creating a call
- Minor: fixed 404 error with Call Events
- Minor: fixed minor bug in values management
- Minor: fixed a wrong title for CreateBleetModal
- Minor: fixed a bug with invalid permissions for creating LEO incidents
- Minor: fixed bug with permission errors
- Minor: fixed a bug with disabling/enabling features
- Minor: added missing status codes for several routes
- Minor: fixed bug not showing joined companies in `/citizen/manage-companies`

## 2.0.4

- New: able to remove citizen image
- New: able to see who created bolos/warrants
- Minor: redirect to `/citizen` instead of `/` on login
- Minor: fixed small bug in live map
- Minor: added timer to EMS-FD dashboard (wasn't added back for some reason)
- Minor: fixed bug with `Assign self to call`
- Minor: fixed a bug where the socket doesn't always update
- Minor: fixed a bug where you couldn't transfer a vehicle to another owner
- Minor: fixed a bug where 911 calls wouldn't update via the sockets
- Minor: fixed a bug where you could not `Report vehicle as stolen`
- Minor: fixed other minor bugs

## 2.0.3

- New: custom registration code (something like invite codes) ([#156](https://github.com/Dev-CasperTheGhost/snaily-cadv3/issues/156))
- New: admins can delete incidents
- New: added new features to disable
- New: added citizen images in /citizen page
- New: added search input for /citizen page
- Minor: fixed minor bugs
- Minor: removed database timeouts
- Minor: fixed small bug with status buttons

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
