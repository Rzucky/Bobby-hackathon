const axios = require("axios");

async function sendReservationRequest(parkingSpotId, endHr, endMin) {
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

    this.addHours = function (hrs) {
        let newHours = (this.hours + hrs + 24) % 24
        // Normalize hours to 24-hour format
        return new Time(newHours, this.minutes);
    };

    this.diffHours = function (otherTime) {
        let thisMinutes = this.hours * 60 + this.minutes;
        let otherMinutes = otherTime.hours * 60 + otherTime.minutes;
        let diffMinutes = thisMinutes - otherMinutes;
        return diffMinutes / 60; // Difference in hours
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

function getCurrentTime() {
    const now = new Date();

    let mins = now.getMinutes()
    let secs = now.getSeconds();


    mins = (mins + 30) % 30
    if (mins > 24) {
        return new Time(24, 0)
    }

    return new Time(mins, secs)
}

async function persistReservationHistory(prisma, userId, parkingSpotId, endTime, occupied) {
    return prisma.reservationHistory.create({
        data: {
            userId,
            parkingSpotId,
            endTime,
            occupied
        }
    }).then(reservation => {
        console.log("Reservation history created successfully.")
    });

}

module.exports = {
    sendReservationRequest,
    Time,
    parseTime,
    persistReservationHistory,
    getCurrentTime
}