# ember-cli-checkup

:warning: This repository is a work in progress. It is not currently usable.

> Provides the ability to check up on your Ember application or addon, so you can
> get a high-level view of its current status.

Often, when building large (and ambitious) applications, the state of the code is
almost in constant flux. This is a good thing, and is indicative of a healthy, maintained
application. The dark side to this can be the app feeling like it's constantly in a half
state - migrations from old APIs to new are taking place, patterns are being reinvented
and rolled out, and tests are being created and maintained (and sometimes 😱 skipped).
Keeping track of all these ongoing changes in your codebase can be dizzying.

Ember checkup aims to provide you with insights into your codebase. You can see things like
dependencies, Ember types used, test types used, etc. allowing you to have a more full,
high level view of your codebase at any one point in time. This will help you with making
maintenance decisions, charting progress of migrations, and keeping up with the general
health of your codebase.

## Compatibility

- Ember.js v3.4 or above
- Ember CLI v2.13 or above
- Node.js v8 or above

## Installation

```bash
 ember install ember-cli-checkup
```

## Usage

Ember checkup is an ember-cli command. Run it by typing the following command:

```bash
ember checkup
```

Ember checkup will inspect your codebase, providing information about your Ember application or
addon.

```
<add example of output in the terminal>
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
