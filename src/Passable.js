// @flow

import enforce from './enforce';
import testRunner from './test_runner';
import ResultObject from './result_object';
import { passableArgs, root, runtimeError, buildSpecificObject } from 'Helpers';
import { Errors } from 'Constants';

class Passable {

    specific: SpecificObject;
    custom: Rules;
    res: ResultObject;
    test: TestProvider;

    constructor(name: string, specific: Specific, tests: TestsWrapper, custom?: Rules) {
        if (typeof name !== 'string') {
            throw runtimeError(Errors.INVALID_FORM_NAME, typeof name);
        }
        const computedArgs: PassableRuntime = passableArgs(specific, tests, custom),
            globalRules: Rules = root.customPassableRules || {};

        this.specific = computedArgs.specific;
        this.custom = Object.assign({}, globalRules, computedArgs.custom);
        this.res = new ResultObject(name);

        computedArgs.tests(this.test, (value) => enforce(value, this.custom));

        return this.res;
    }

    test = (fieldName: string, statement: string, test: TestFn, severity: Severity) => {
        const { only, not }: { [filter: string]: Set<string>} = this.specific;
        const notInOnly: boolean = only.size > 0 && !only.has(fieldName);

        if (notInOnly || not.has(fieldName)) {
            this.res.addToSkipped(fieldName);
            return;
        }

        this.res.initFieldCounters(fieldName);

        if (typeof test !== 'function') {
            return;
        }

        const isValid: boolean = testRunner(test);

        if (!isValid) {
            this.res.fail(fieldName, statement, severity);
        }

        this.res.bumpTestCounter(fieldName);
    }
}

export default Passable;