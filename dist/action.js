"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidTimezone = exports.getCurrentDay = exports.getDayName = exports.actionFactory = void 0;
const core_1 = require("@actions/core");
const types_1 = require("./types");
function actionFactory(input) {
    const { getInput, setFailed, setOutput } = input;
    return () => {
        const timezone = getInput('timezone');
        if (!isValidTimezone(timezone)) {
            setFailed(`Timezone ${timezone} is not valid.`);
            return;
        }
        const day = getCurrentDay(timezone);
        const dayName = getDayName(day);
        setOutput('dayIndex', day);
        setOutput('dayName', dayName);
        if (day === types_1.Day.Friday) {
            setOutput('failed', true);
            setFailed('Today is Friday! Wait for the next week...');
            return;
        }
        setOutput('failed', false);
    };
}
exports.actionFactory = actionFactory;
function getDayName(day) {
    const deductedDay = day % 7;
    if (deductedDay === 0) {
        return 'Sunday';
    }
    return types_1.Day[deductedDay];
}
exports.getDayName = getDayName;
function getCurrentDay(timezone) {
    const dateInTimezone = getLocaleDateString(timezone);
    return new Date(dateInTimezone).getDay();
}
exports.getCurrentDay = getCurrentDay;
function isValidTimezone(timezone) {
    try {
        getLocaleDateString(timezone);
        return true;
    }
    catch (error) {
        return false;
    }
}
exports.isValidTimezone = isValidTimezone;
function getLocaleDateString(timezone) {
    return new Date().toLocaleString('en-US', {
        timeZone: timezone,
    });
}
exports.default = actionFactory({ getInput: core_1.getInput, setFailed: core_1.setFailed, setOutput: core_1.setOutput });
