-- CONFIG
-------------------------------------------
--- Url to the "server" of the CAD, default port is 3030
local URL_TO_CAD = 'http://ip-to-your-cad' -- No slash at the end 
local PORT = "3030"
-------------------------------------------

-- Register chatmessage
RegisterServerEvent("chatMessage")

RegisterCommand("calltow", function(source, args)
    CancelEvent()
    local name = GetPlayerName(source)
    local description = args
    TriggerClientEvent("towCall", source, name, description)
end)

-- register the updater
RegisterServerEvent("towCallUpdate")

-- POST the call to the CAD
AddEventHandler("towCallUpdate", function(street, name, description)
    PerformHttpRequest(URL_TO_CAD .. ":" .. PORT .. '/api/v1/tow-calls',
                       function(err, text, headers) end, 'POST', json.encode(
                           {
            caller = name,
            location = street,
            description = table.concat(description, ' ')
        }), {["Content-Type"] = 'application/json'})

    CancelEvent()
end)
