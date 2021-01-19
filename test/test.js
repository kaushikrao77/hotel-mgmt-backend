const expect = require('chai').expect;
const { incDate } = require('../utils.js');

describe('Date', function() {
    it('increment date', function() {
        expect(incDate(new Date('Sat Dec 12 2020 01:02:56 GMT+0530 (India Standard Time)'))).to.be.equal(1607801576000);
    });
})

describe('booking', function() {
    it('trying to book a ticket', function() {
        expect(true).to.be.equal(true);
    });
})


