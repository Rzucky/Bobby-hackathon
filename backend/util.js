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
function getCurrentDay(){
    const now = new Date();
    let hours = now.getHours()
    let gameDays = hours * 2 + now.getMinutes() / 30
    gameDays += now.getDay() * 48
    return gameDays
}

async function persistReservationHistory(prisma, userId, parkingSpotId, endTime, occupied) {
    console.log(parkingSpotId)
    let parkingSpotZone = global.parkingSpots[parkingSpotId].parkingSpotZone

    return prisma.reservationHistory.create({
        data: {
            userId,
            parkingSpotId,
            endTime,
            occupied,
            day: getCurrentDay(),
            price: global.zoneStats[parkingSpotZone].price,
        }
    }).then(reservation => {
        console.log("Reservation history created successfully.")
    });
}
function calculateTimeDifferenceWithPrice(times) {
    function parseTime(timeString) {
        const parts = timeString.split(':');
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);

        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
      }
      
      function findTimeDifference(timesArray) {
        if (timesArray.length === 0) return null;
      
        // Parse all times and sort them
        const parsedTimes = timesArray.map(t => ({
            time: parseTime(t.time),
            price: t.price
          }));
        parsedTimes.sort((a, b) => a.time - b.time);

        // Get the smallest and largest times
        const minTime = parsedTimes[0].time;
        const startPrice = parsedTimes[0].price;
        const maxTime = parsedTimes[parsedTimes.length - 1].time;
      
        // Calculate the difference in minutes
        const difference = (maxTime - minTime) / (1000 * 60); // difference in minutes
        const hours = Math.floor(difference / 60);
        const minutes = difference % 60;

        let price = (difference * startPrice) / 60 
      
        return { hours, minutes, price };
      }
      
      const timeDifference = findTimeDifference(times);
      console.log(`Time difference: ${timeDifference.hours} hours and ${timeDifference.minutes} minutes for price: ${timeDifference.price}`);

}

module.exports = {
    sendReservationRequest,
    Time,
    parseTime,
    persistReservationHistory,
    getCurrentTime,
    getCurrentDay,
    calculateTimeDifferenceWithPrice
}