import { getInput, setFailed, setOutput, InputOptions } from '@actions/core';
import { Day } from './types';

export function actionFactory(input: {
  getInput: (name: string, options?: InputOptions) => string;
  setFailed: (message: string | Error) => void;
  setOutput: (name: string, value: any) => void;
}) {
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

    if (day === Day.Friday) {
      setOutput('failed', true);
      setFailed('Today is Friday! Wait for the next week...');
      return;
    }

    setOutput('failed', false);
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

export default actionFactory({ getInput, setFailed, setOutput });
