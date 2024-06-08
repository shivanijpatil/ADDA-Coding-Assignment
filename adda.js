class Facility {
    constructor(name, rates) {
        this.name = name;
        this.rates = rates;
        this.bookings = [];
    }

    isAvailable(start, end) {
        return this.bookings.every(booking => end <= booking.start || start >= booking.end);
    }

    addBooking(start, end) {
        this.bookings.push({ start, end });
    }

    calculateCost(start, end) {
        let totalCost = 0;
        let currentTime = new Date(start);

        while (currentTime < end) {
            for (const rate of this.rates) {
                const rateStart = this.getDateWithTime(currentTime, rate.start);
                const rateEnd = this.getDateWithTime(currentTime, rate.end);
                if (rateEnd < rateStart) rateEnd.setDate(rateEnd.getDate() + 1);

                if (rateStart <= currentTime && currentTime < rateEnd) {
                    const nextTime = new Date(Math.min(rateEnd, end));
                    const hours = (nextTime - currentTime) / 3600000;
                    totalCost += hours * rate.rate;
                    currentTime = nextTime;
                    break;
                }
            }
        }
        return totalCost;
    }

    getDateWithTime(date, time) {
        const [hours, minutes] = time.split(':').map(Number);
        const result = new Date(date);
        result.setHours(hours, minutes, 0, 0);
        return result;
    }

    book(date, startTime, endTime) {
        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);

        if (!this.isAvailable(start, end)) {
            return "Booking Failed, Already Booked";
        }

        const cost = this.calculateCost(start, end);
        this.addBooking(start, end);
        return `Booked, Rs. ${cost}`;
    }
}

const facilities = {
    "Clubhouse": new Facility("Clubhouse", [
        { start: '10:00', end: '16:00', rate: 100 },
        { start: '16:00', end: '22:00', rate: 500 }
    ]),
    "Tennis Court": new Facility("Tennis Court", [
        { start: '00:00', end: '23:59', rate: 50 }
    ])
};

function bookFacility(name, date, startTime, endTime) {
    const facility = facilities[name];
    if (!facility) return "Booking Failed, Facility Not Found";
    return facility.book(date, startTime, endTime);
}

// Sample Input
console.log(bookFacility("Clubhouse", "2020-10-26", "16:00", "22:00"));
console.log(bookFacility("Tennis Court", "2020-10-26", "16:00", "20:00"));
console.log(bookFacility("Clubhouse", "2020-10-26", "16:00", "22:00"));
console.log(bookFacility("Tennis Court", "2020-10-26", "17:00", "21:00"));

// run command line - node fileName.js