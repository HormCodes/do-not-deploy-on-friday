import { getInput, info, setFailed, setOutput } from '@actions/core';
import { ActionFactoryInput, Day } from './types';

export function actionFactory(input: ActionFactoryInput) {
  const { getInput, setFailed, setOutput, logInfo } = input;
  return () => {
    const timezone = getInput('timezone') || 'UTC';

    if (!isValidTimezone(timezone)) {
      setFailed(`Timezone ${timezone} is not valid.`);
      return;
    }

    const day = getCurrentDay(timezone);
    const dayName = getDayName(day);
    const isFriday = day === Day.Friday;

    setOutput('dayIndex', day);
    setOutput('dayName', dayName);
    setOutput('failed', isFriday);

    if (isFriday) {
      setFailed('Today is Friday! Wait for the next week...');
      return;
    }

    logInfo(`Today is ${dayName}, a good day for deployment. Good luck!`);
  };
}

export function getDayName(day: Day): keyof typeof Day {
  const deductedDay = day % 7;

  if (deductedDay === 0) {
    return 'Sunday';
  }

  return Day[deductedDay] as keyof typeof Day;
}

export function getCurrentDay(timezone: string): Day {
  const dateInTimezone = getLocaleDateString(timezone);
  return new Date(dateInTimezone).getDay();
}

export function isValidTimezone(timezone: string): boolean {
  try {
    getLocaleDateString(timezone);
    return true;
  } catch (error) {
    return false;
  }
}

function getLocaleDateString(timezone: string) {
  return new Date().toLocaleString('en-US', {
    timeZone: timezone,
  });
}

export default actionFactory({ getInput, setFailed, setOutput, logInfo: info });
