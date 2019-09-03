import { ITask, IProject, ICheckupResult, SearchPatterns } from './interfaces';
import FileSearcher from './utils/file-searcher';
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
   * @param result {ICheckupResult} the result object that aggregates data together for output.
   * @param searchPatterns {SearchPatterns} the search pattern that your filesearcher uses to return the results.
   */
  constructor(project: IProject, result: ICheckupResult, searchPatterns: SearchPatterns) {
    super(project, result);
    this.searcher = new FileSearcher(this.project.root, searchPatterns);
  }

  run() {}
}
