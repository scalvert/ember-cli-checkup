import { IResultConsoleWriter, ITaskResult } from '../interfaces';
import ResultConsoleWriter from './result-console-writer';
import VerboseResultConsoleWriter from './verbose-result-console-writer';

export default function getConsoleWriter(
  result: ITaskResult[],
  verbose = false
): IResultConsoleWriter {
  return verbose ? new VerboseResultConsoleWriter(result) : new ResultConsoleWriter(result);
}
