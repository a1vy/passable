'use strict';

import ResultObject from './index';
import { expect } from 'chai';

describe('Test PassableResponse class', () => {
    it('Should return correct initial object from constructor', () => {
        expect(new ResultObject('FormName')).to.deep.equal({
            name: 'FormName',
            hasValidationErrors: false,
            hasValidationWarnings: false,
            errorCount: 0,
            warnCount: 0,
            testCount: 0,
            testsPerformed: {},
            validationErrors: {},
            validationWarnings: {},
            skipped: []
        });
    });

    describe('Test initFieldCounters method', () => {
        let testObject;
        beforeEach(() => testObject = new ResultObject('FormName').initFieldCounters('example'));
        it('Should add new fields and its counters to `testsPerformed`', () => {

            expect(testObject.testsPerformed).to.deep.equal({
                example: {
                    errorCount: 0,
                    testCount: 0,
                    warnCount: 0
                }
            });
        });

        it('Should keep field counters untouched if they already exist', () => {
            Object.assign(testObject.testsPerformed.example, {
                errorCount: 5,
                testCount: 5
            });

            expect(testObject.testsPerformed).to.deep.equal({
                example: {
                    errorCount: 5,
                    testCount: 5,
                    warnCount: 0
                }
            });
        });
    });

    describe('Test bumpTestCounters method', () => {
        let testObject;
        beforeEach(() => testObject = new ResultObject('FormName').initFieldCounters('example'));

        it('Should bump test counters in `testsPerformed`', () => {
            testObject.bumpTestCounter('example');
            expect(testObject.testsPerformed).to.deep.equal({
                example: {
                    errorCount: 0,
                    testCount: 1,
                    warnCount: 0
                }
            });
        });

        it('Should bump test counters in `testCount` from `0` to `1`', () => {
            expect(testObject.testCount).to.equal(0);
            testObject.bumpTestCounter('example');
            expect(testObject.testCount).to.equal(1);
        });
    });

    describe('Test addToSkipped method', () => {
        let testObject;
        beforeEach(() => testObject = new ResultObject('FormName'));

        it('Should have added field in skipped list', () => {
            testObject.addToSkipped('field_1');
            expect(testObject.skipped).to.include('field_1');
        });

        it('Should have added fields in skipped list', () => {
            testObject.addToSkipped('field_1').addToSkipped('field_2');
            expect(testObject.skipped).to.include('field_1');
            expect(testObject.skipped).to.include('field_2');
        });

        it('Should uniquely add each field', () => {
            testObject
                .addToSkipped('field_1')
                .addToSkipped('field_2')
                .addToSkipped('field_1')
                .addToSkipped('field_2');
            expect(testObject.skipped).to.have.lengthOf(2);
        });
    });

    describe('Test getErrors method', () => {
        let testObject;
        beforeEach(() => {
            testObject = new ResultObject('FormName')
                .initFieldCounters('example')
                .initFieldCounters('example_2')
                .fail('example', 'Error string', 'error');
        });

        it('Should return errors array for a field with errors', () => {
            expect(testObject.getErrors('example')).to.deep.equal(['Error string']);
        });

        it('Should return empty array for a field with no errors', () => {
            expect(testObject.getErrors('example_2')).to.deep.equal([]);
        });

        it('Should return all errors object when no field specified', () => {
            expect(testObject.getErrors()).to.deep.equal({
                example: ['Error string']
            });
        });
    });

    describe('Test getErrors method', () => {
        let testObject;
        beforeEach(() => {
            testObject = new ResultObject('FormName')
                .initFieldCounters('example')
                .initFieldCounters('example_2')
                .fail('example', 'Error string', 'warn');
        });

        it('Should return errors array for a field with errors', () => {
            expect(testObject.getWarnings('example')).to.deep.equal(['Error string']);
        });

        it('Should return empty array for a field with no errors', () => {
            expect(testObject.getWarnings('example_2')).to.deep.equal([]);
        });

        it('Should return all errors object when no field specified', () => {
            expect(testObject.getWarnings()).to.deep.equal({
                example: ['Error string']
            });
        });
    });
});