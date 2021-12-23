import { actionFactory, getCurrentDay, getDayName } from '../action';
import { Day } from '../types';
import SpyInstance = jest.SpyInstance;

describe('action functions', () => {
  const dateTestUtils = getDateTestUtils(
    new Date('Fri Dec 24 2021 00:30:00 GMT+0100 (CET)'),
  );

  beforeEach(dateTestUtils.setup);
  afterEach(dateTestUtils.teardown);

  describe('actionFactory', () => {
    const setFailed = jest.fn();
    const getInput = jest.fn();
    const setOutput = jest.fn();

    it('should return function', () => {
      expect(actionFactory({ setFailed, getInput, setOutput })).toBeInstanceOf(
        Function,
      );
    });

    describe('implementation', () => {
      beforeEach(() => {
        setFailed.mockClear();
        getInput.mockClear();
        setOutput.mockClear();
      });

      const action = actionFactory({ setFailed, getInput, setOutput });

      const mockGetInputImplementation = (timezone: string) => {
        return getInput.mockImplementationOnce((inputName) =>
          inputName === 'timezone' ? timezone : '',
        );
      };

      it('should set day name and index outputs', () => {});

      it('should call setFailed for all executions where is Friday', () => {
        mockGetInputImplementation('Europe/Prague');
        action();
        mockGetInputImplementation('Europe/Oslo');
        action();

        expect(setFailed).toBeCalledTimes(2);

        expect(setOutput).toBeCalledWith('dayName', 'Friday');
        expect(setOutput).toBeCalledWith('dayIndex', 5);
        expect(setOutput).toBeCalledWith('failed', true);
      });

      it('should not call setFailed for executions where is different day', () => {
        mockGetInputImplementation('Europe/London');
        action();
        mockGetInputImplementation('UTC');
        action();

        expect(setFailed).toBeCalledTimes(0);

        expect(setOutput).toBeCalledWith('dayName', 'Thursday');
        expect(setOutput).toBeCalledWith('dayIndex', 4);
        expect(setOutput).toBeCalledWith('failed', false);
      });

      it('should call setFailed when timezone is not valid', () => {
        mockGetInputImplementation('Foo');
        action();

        expect(setFailed).toBeCalledTimes(1);

        expect(setOutput).not.toBeCalled();
      });
    });
  });

  describe('getDayName', () => {
    it('should return day name by day value', () => {
      expect(getDayName(Day.Monday)).toEqual('Monday');
      expect(getDayName(Day.Friday)).toEqual('Friday');
    });

    it('should return day name by day index', () => {
      expect(getDayName(1)).toEqual('Monday');
      expect(getDayName(5)).toEqual('Friday');
    });

    it('should go in circle for invalid indexes', () => {
      expect(getDayName(0)).toEqual('Sunday');
      expect(getDayName(8)).toEqual('Monday');
    });
  });

  describe('getCurrentDay', () => {
    it('should return day for specified timezone', () => {
      expect(getCurrentDay('Europe/London')).toEqual(Day.Thursday);
      expect(getCurrentDay('Europe/Lisbon')).toEqual(Day.Thursday);

      expect(getCurrentDay('Europe/Oslo')).toEqual(Day.Friday);
      expect(getCurrentDay('Europe/Prague')).toEqual(Day.Friday);
    });
  });
});

function getDateTestUtils(now: Date) {
  let dateMock: SpyInstance;

  return {
    setup: () => {
      const workingDate = global.Date;
      const mockImplementation = (...args: [] | [string]) => {
        // Return date for specified time
        if (args.length !== 0) {
          return new workingDate(...args);
        }

        // Return same moment always
        return new workingDate(now);
      };
      dateMock = jest
        .spyOn(global, 'Date')
        .mockImplementation(mockImplementation as unknown as () => string);

      // Keep Date object initializers
      Date.now = workingDate.now;
      Date.UTC = workingDate.UTC;
    },
    teardown: () => {
      dateMock.mockRestore();
    },
  };
}
