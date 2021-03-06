import { ITask, IProject, SearchPatterns, ITaskResult } from './types';
import FileSearcher from './searchers/file-searcher';
import Task from './task';

/**
 * @class FileSearcherTask
 * @extends Task
 * @implements ITask
 *
 * A checkup task specific to file searcher used to encapsulate an operation that
 * checks certain characteristics of your Ember project.
 */
export default abstract class FileSearcherTask extends Task implements ITask {
  searcher: FileSearcher;

  /**
   *
   * @param project {IProject} the project model that is instantiated as part of ember-cli.
   * @param result {ITaskResult[]} the result object that aggregates data together for output.
   * @param searchPatterns {SearchPatterns} the search pattern that your filesearcher uses to return the results.
   */
  constructor(project: IProject, searchPatterns: SearchPatterns) {
    super(project);
    this.searcher = new FileSearcher(this.project.root, searchPatterns);
  }

  abstract run(): Promise<ITaskResult>;
}
