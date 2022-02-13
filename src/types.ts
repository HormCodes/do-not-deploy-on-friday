import { InputOptions } from '@actions/core';

export enum Day {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export interface ActionFactoryInput {
  getInput: (name: string, options?: InputOptions) => string;
  setFailed: (message: string | Error) => void;
  setOutput: (name: string, value: any) => void;
  logInfo: (info: string) => void;
}
