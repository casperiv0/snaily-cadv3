-- CONFIG
-------------------------------------------
--- Url to the "server" of the CAD, default port is 3030
local URL_TO_CAD = 'http://localhost' -- No slash at the end 
local PORT = "3030"
-------------------------------------------

-- Register chatmessage
RegisterServerEvent("chatMessage")

RegisterCommand("call911", function(source, args)
    CancelEvent()
    local name = GetPlayerName(source)
    local description = args
    TriggerClientEvent("911Call", source, name, description)
end)

-- register the updater
RegisterServerEvent("911CallUpdate")

-- POST the call to the CAD
AddEventHandler("911CallUpdate", function(street, name, description, coords)
    print(name, street, description)
    print(name)
    print(coords)
    PerformHttpRequest(URL_TO_CAD .. ":" .. PORT .. '/api/v1/global/911-calls',
                       function(err, text, headers) end, 'POST', json.encode(
                           {
            caller = name,
            location = street,
            coords = coords,
            description = table.concat(description, ' ')
        }), {["Content-Type"] = 'application/json'})

    CancelEvent()
end)
