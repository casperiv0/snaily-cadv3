TriggerEvent('chat:addSuggestion', '/calltow', 'Call available tow truckers', {
    { name="description", help="Description of your call" },
})

RegisterNetEvent("towCall")
AddEventHandler("towCall", function(name, description)
    -- player coords
    x, y, z = table.unpack(GetEntityCoords(GetPlayerPed(-1), true))
    -- get street name
    lastStreet = GetStreetNameAtCoord(x, y, z)
    lastStreetName = GetStreetNameFromHashKey(lastStreet)
    TriggerServerEvent("towCallUpdate", lastStreetName, name, description)
    -- send confirm message
    sendNotification("CHAR_PROPERTY_TOWING_IMPOUND", 0,
                     "Your Call has been reported to any available towers!",
                     "Tow Truck Service")
end)

-- message function
function sendNotification(picture, icon, message, title)
    SetNotificationTextEntry("STRING")
    AddTextComponentString(message)
    SetNotificationMessage(picture, picture, true, icon, title)
end