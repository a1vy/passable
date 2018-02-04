export default (passable) => {

    const response = passable('case_a', null, (pass, warn, enforce) => {
        pass('field_1', 'should be a string of 5 chars', () => {
            enforce('hello').allOf({
                sizeEquals: 5,
                isString: true
            });
        });

        pass('field_2', 'must be a number smaller than 90', () => {
            enforce(99).allOf({
                smallerThan: 90,
                isNumber: true
            });
        });

        pass('field_3', 'must be either "a" or "b"', () => {
            enforce('a').inside(['a', 'b']);
        });

        warn('field_4', 'should be either "a" or "b"', () => {
            enforce('c').allOf({
                inside: ['a', 'b']
            });
        });

        pass('field_5', 'Must either be a number or a string. Always smaller than 5', () => {
            enforce('log').anyOf({
                isNumber: true,
                isString: true
            }).smallerThan(5);
        });

        pass('field_5', 'Must not be larger than 3', () => {
            enforce('log').noneOf({
                largerThan: 3
            });
        });
    });

    const expect = {
        name: 'case_a',
        hasValidationErrors: true,
        hasValidationWarnings: true,
        errorCount: 1,
        warnCount: 1,
        testCount: 6,
        testsPerformed: {
            field_1: {
                testCount: 1,
                errorCount: 0,
                warnCount: 0
            },
            field_2: {
                testCount: 1,
                errorCount: 1,
                warnCount: 0
            },
            field_3: {
                testCount: 1,
                errorCount: 0,
                warnCount: 0
            },
            field_4: {
                testCount: 1,
                errorCount: 0,
                warnCount: 1
            },
            field_5: {
                testCount: 2,
                errorCount: 0,
                warnCount: 0
            }
        },
        validationErrors: {
            field_2: [
                'must be a number smaller than 90'
            ]
        },
        validationWarnings: {
            field_4: [
                'should be either "a" or "b"'
            ]
        },
        skipped: []
    };

    return {
        response,
        expect
    };
};