/**
 * Payload Decoder for The Reports
 * 
 * Copyright 2022 HKT SmartHard
 * 
 * @product undefine
 */
function Decoder(bytes, port) {

    if (checkReportSync(bytes.slice(0, 4)) == false)
        return;

    var field = bytes.split(",");

    if (field.length == 10) //gps data
    {
        var decoded = {
            deveui: "",
            soft_ver: 0,
            que_num: 0,
            event: 0,
            temperature: 0,
            lon: 0,         // E,W(-)
            lat: 0,          // N,S(-)
            time: "",
        };

        // Longitude of GPS
        decoded.lon = parseFloat(field[6].slice(1, field[6].length));
        if (field[6].slice(0, 1) == "W")  //E,W
            decoded.lon = -decoded.lon;

        // Latitude of GPS.
        decoded.lat = parseFloat(field[7].slice(1, field[7].length));
        if (field[7].slice(0, 1) == "S")  //N,S
            decoded.lat = -decoded.lat;

        // UTC time
        decoded.time = field[8];

        //This is the temperature of the unit in Celsius
        decoded.temperature = parseFloat(field[9]);
    }
    else if (field.length == 11)    //normal data
    {
        var decoded = {
            deveui: "",
            soft_ver: 0,
            que_num: 0,
            event: 0,
            state: 0,
            temperature: 0,
            humidity: 0,
            moved: 0,
            battery: 0,
        };

        //This is the state of any alarm sent. When an alarm threshold hasreached, the unit must send State 1. 
        //If the alarm continues when thenext send interval reaches, then the unit must send State 2. 
        // When the end of the alarm occurs then a state of 3 must be sent.
        /* 0 Normal Reading (Also be sent for low battery and movement)
        * 1 Alarm Started
        * 2 Alarm Still Active
        * 3 End of Alarm
        */
        decoded.state = parseInt(field[6]);

        //This is the temperature of the unit in Celsius
        decoded.temperature = parseFloat(field[7]);

        //This is the Relative Humidity measured in Percentage (%)
        decoded.humidity = parseFloat(field[8]);

        //This is a flag to indicate if the unit has moved
        decoded.moved = parseInt(field[9]);
        decoded.battery = parseFloat(field[10]);
    }

    // The Dev EUI is the number which uniquely identifies each unit
    decoded.deveui = field[2];

    // This field contains the current Software Version on the sensor
    decoded.soft_ver = parseInt(field[3]);

    // This is a number from 1 to 65535 to indicate the message number. Onceit reaches 65535 it will reset to 1.
    decoded.que_num = parseInt(field[4]);

    //The unit must send the reason for the data transfer and can be the following
    /* Event Code Reason
    *  1 Interval Reading
    *  2 Temperature Alarm – Low Threshold
    *  3 Temperature Alarm – Upper Threshold
    *  4 Relative Humidity – Low Threshold
    *  5 Relative Humidity – Upper Threshold
    *  6 Low unit Battery
    *  7 Unit movement
    *  8 Dismantle Alarm
    *  21 GPS positioning
    *  22 Cached Temperature
    */
    decoded.event = parseInt(field[5]);
    return decoded;
}


function checkReportSync(bytes) {
    if (bytes == "T,S1") {
        return true;
    }
    return false;
}

var th_info = "T,S1,0095690000015896,40,14,1,2,30.9,59.1,1,3.5";
var gps_info = "T,S1,0095690000015896,40,15,21,E112.851069,S28.246640,2022.07.22 02:12:09,30.9";

console.log(Decoder(th_info, 10))
console.log(Decoder(gps_info, 10))


