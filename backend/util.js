const axios = require("axios");

function sendReservationRequest(parkingSpotId, endHr, endMin) {
    console.log("Sending reservation request", parkingSpotId, endHr, endMin)
    return axios.post(global.config.PARKING_API + '/api/ParkingSpot/reserve',
        {
            parkingSpotId,
            endH: parseInt(endHr),
            endM: parseInt(endMin)
        },
        {
            headers: {
                'Api-Key': global.config.API_KEY
            }
        });
}

//thanks gpt4
function Time(hours, minutes) {
    this.hours = hours;
    this.minutes = minutes;

    this.addMinutes = function (mins) {
        this.minutes += mins;
        while (this.minutes >= 60) {
            this.minutes -= 60;
            this.addHours(1);
        }
        // Normalize in case minutes become negative
        while (this.minutes < 0) {
            this.minutes += 60;
            this.addHours(-1);
        }
    };

    this.addHours = function (hrs) {
        this.hours += hrs;
        // Normalize hours to 24-hour format
        this.hours = (this.hours + 24) % 24;
    };

    // Optional: method to get time as a string
    this.getTime = function () {
        return `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}`;
    };
}

function parseTime(timeString) {
    if (timeString === undefined) {
        return undefined;
    }
    let hours = parseInt(timeString.split(":")[0])
    let minutes = parseInt(timeString.split(":")[1])
    return new Time(hours, minutes)
}

module.exports = {
    sendReservationRequest,
    Time,
    parseTime
}