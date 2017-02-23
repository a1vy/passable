'use strict'

import chai from 'chai';
import isLongerThan from './index';

const expect = chai.expect;

describe('Tests isLongerThan module', () => {

    it('Should return true for an array longer than 5', () => {
        expect(isLongerThan([1,2,3,4,5,6], {testAgainst: 5})).to.equal(true);
    });

    it('Should return false for an array shorter than 8', () => {
        expect(isLongerThan([1,2,3,4,5,6], {testAgainst: 8})).to.equal(false);
    });

    it('Should return true for a string longer than 3', () => {
        expect(isLongerThan("abcd", {testAgainst: 3})).to.equal(true);
    });
});