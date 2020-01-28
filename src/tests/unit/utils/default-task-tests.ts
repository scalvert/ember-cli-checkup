import { getTaskByName, getTaskNames } from '../../../utils/default-tasks';

const test = QUnit.test;

QUnit.module('default-tasks', function() {
  test('getTaskByName', function(assert) {
    let task = getTaskByName('ProjectInfo');

    assert.equal(typeof task, 'function');
  });

  test('getTaskNames', function(assert) {
    let taskNames = getTaskNames();

    assert.deepEqual(taskNames, ['ProjectInfo', 'Dependencies', 'Types', 'Tests']);
  });
});
