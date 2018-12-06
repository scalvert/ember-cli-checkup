const TYPE_PATTERNS = {
  controllers: ['**/controllers/**/*.js'],
  routes: ['**/routes/**/*.js'],
  services: ['**/services/**/*.js'],
  components: ['**/components/**/*.js'],
  mixins: ['**/mixins/**/*.js'],
  templates: ['**/templates/**/*.hbs'],
};
const IGNORE_PATTERNS = [
  '!tests/**',
  '!node_modules/**',
  '!bower_components/**',
  '!tests/dummy/**',
];
