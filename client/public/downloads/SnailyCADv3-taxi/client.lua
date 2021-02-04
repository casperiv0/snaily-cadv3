TriggerEvent('chat:addSuggestion', '/calltaxi', 'Call available taxi drivers', {
    { name="description", help="Description of your call" },
})

RegisterNetEvent("taxiCall")
AddEventHandler("taxiCall", function(name, description)
    -- player coords
    x, y, z = table.unpack(GetEntityCoords(GetPlayerPed(-1), true))
    -- get street name
    lastStreet = GetStreetNameAtCoord(x, y, z)
    lastStreetName = GetStreetNameFromHashKey(lastStreet)
    TriggerServerEvent("taxiCallUpdate", lastStreetName, name, description)
    -- send confirm message
    sendNotification("CHAR_TAXI", 0,
                     "Your Call has been reported to any available taxi drivers!",
                     "Taxi Service")
end)

-- message function
function sendNotification(picture, icon, message, title)
    SetNotificationTextEntry("STRING")
    AddTextComponentString(message)
    SetNotificationMessage(picture, picture, true, icon, title)
end