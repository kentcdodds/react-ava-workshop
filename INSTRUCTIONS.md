# Instructions

This file will be updated for each step, when you've finished each step, come back
to this file and see the instructions for the next step.

You'll notice that this repository is already (mostly) set up for a React project.
It's a bit contrived and doesn't actually amount to anything but a couple
disconnected components and a fairly worthless (non-flux) store.

You'll also notice that right next to each module, there's a `.test.js` file where
there's a single test that utilizes a module called `ava`.

We already have many of the same dependencies you would have in a normal react
project including `babel-core` and friends, `react` (and friends), and
`eslint`... and friends. However, to get our tests going, we're going to need
a few more dependencies:

## AVA

Let's get this installed and going first. Until recently, AVA used our own babel
configuration found in our `.babelrc` for transpiling the test files. However,
that was changed in [this pr](https://github.com/sindresorhus/ava/pull/398) and
now it no longer does this and instead has its own babel configuration.

Unfortunately, this means that we can't utilize `jsx` in our code test files!
A solution for has [been discussed](https://github.com/sindresorhus/ava/issues/448)
and will (hopefully) be implemented soon. However, in the mean time. You'll have
to install an old version of `ava` if you want to use `jsx` in your test files.

To install the `ava` module, go ahead with:

```
npm install --save-dev ava@0.9.2
```

This will install it and add it to your `package.json` `devDependencies`.

Now we can add a `test` script which will utilize AVA to run the tests in our
`app/` directory with the filename ending in `.test.js`. Add this to the
`scripts` object in your `package.json`.

```javascript
"test": "ava 'app/**/*.test.js' --verbose"
```

- `'app/**/*.test.js'` - a [glob](http://npm.im/glob) which matches our tests
- `--verbose` to get more information and preserve our `console.log`s

Now go ahead and run `npm run test`

> protip: `npm run test` `===` `npm test` `===` `npm t`

You should get output that looks like this:

```
  ✔ components › Toggle › empty test
  ✔ store › Customers › empty test
  ✔ containers › CustomerList › empty test

  3 tests passed
```

Great! Let's move on to our next dependency.

## nodemon

AVA [just landed](https://github.com/sindresorhus/ava/issues/70) support for a
`watch` mode (similar to what `mocha` already has). However, because we're using
an older version of AVA for the time being, we'll have to implement it ourselves
to get the really nice `watch` functionality that's useful when doing
Test-Driven-Development. **NOTE** check
[this issue](https://github.com/sindresorhus/ava/issues/448) issue to see if you
can use the latest version. If you can, you can skip this entire section and just
use the built-in `watch` functionality.

The `nodemon` module will work great for what we need. You can simply install the
latest version (`1.8.1` at the time of this writing):

```
npm install --save-dev nodemon
```

> protip: `npm install --save-dev` `===` `npm i -D`

Now, we'll add a new script which uses `nodemon` to watch the `app/` directory
and execute our `test` script whenever files change in that directory. Add this
to the `scripts` object in your `package.json`.

```javascript
"watch:test": "nodemon --quiet --watch app --exec npm run test -s"
```

- `--quiet` -> to reduce the output in our terminal from `nodemon`
- `--watch app` -> respond to changes in the `app/` directory
- `--exect` -> run the following command when a relevant file has changed
- `-s` -> to reduce the output in our terminal from `npm`

Now if you run `npm run watch:test`, you should see the same output as before, but
the process wont exit. Now try to change one of the files in the `app/` directory
(add a newline) and the tests should re-run.

> protip: Install [`npm-quick-run`](http://npm.im/npm-quick-run) to type less :-)
>
> protip: Install [`npm-run`](http://npm.im/npm-run) while working with local npm-installed binaries

Now stop the process with <kbd>CTL</kbd>+<kbd>c</kbd>

## nyc

The most popular and widely used tool for code coverage is `istanbul`.
Unfortunately `istanbul` doesn't support covering tests run in subprocesses. It
also doesn't support covering `ES6` code that's transpiled with `babel`. This is
the problem that `nyc` solves. It also has an incredibly slick API. Let's go ahead
and install the latest version (`5.6.0` at the time of this writing):

```
npm install --save-dev nyc
```

Now let's add a script in the `scripts` of our `package.json` to record code
coverage:

```javascript
"cover": "nyc --reporter=lcov --reporter=text --reporter=html npm run test"
```

- `--reporter=lcov` - Commonly used format for code coverage tracking tools
- `--reporter=text` - To get the coverage output in our terminal
- `--reporter=html` - To get output as a static HTML page viewing with our browser
- `npm run test` - The script to execute to run the tests we want to cover

Let's run `npm run cover` now to see our coverage. You should see this output:

```
----------|----------|----------|----------|----------|----------------|
File      |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
----------|----------|----------|----------|----------|----------------|
----------|----------|----------|----------|----------|----------------|
All files |      100 |      100 |      100 |      100 |                |
----------|----------|----------|----------|----------|----------------|
```

This is great! Just kidding. We aren't importing any files to actually record code
coverage on yet, so we have 100% of nothing covered. We'll get there!

You'll also notice that running this command added two directories to our repo:

- `coverage/` - coverage report information
- `.nyc_output/` - `nyc` specific output (no idea what it's for honestly)

You'll want to make sure that you add these to your `.gitignore` file as they're
generated files and have no place in a version control system. I've already done
this for you. Just don't forget to do this in your own projects.

While we're here, let's add a `watch` mode for coverage just for kicks:

```
"watch:cover": "nodemon --quiet --watch app --exec npm run cover -s"
```

This looks pretty much the same as our `watch:test` we did earlier.

Finally, one other thing that we'll add to our scripts that's kind of handy from
`nyc` is the ability to validate a level of code coverage percentages:

```
"check-coverage": "nyc check-coverage --statements 100 --branches 100 --functions 100 --lines 100"
```

Each of these options defines a different category of coverage that's been
recorded and the `100` signifies that we want this command to fail if the coverage
report indicates a percentage of less than `100%` for that category. This can be
useful in validation scripts to ensure that the project is maintaining your goal
of coverage percentage. In a small project like this `100%` is a reasonable goal.
However, in your project, something more like `%70` or so may be more reasonable.

> protip: You might consider adding this as an installable githook with
> [ghooks](http://npm.im/ghooks)

## babel-register

So far, we haven't actually tested anything. All of our tests are totally empty.
One thing that we're about to discover as we start importing our modules into our
tests is that AVA wont transpile them with `babel` for us. Let's see what I mean.
Go ahead and open the `Customers.test.js` file in the `app/store/` directory and
put this in it:

```javascript
import test from 'ava'
import store from './Customers'

test('empty test', t => t.pass())
```

Now try to run `npm run test` and you'll get output with this error message:

```
SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode
```

We have to transpile on the fly by ourselves. Having this control over what
happens to our source code is actually quite nice (even if it means a bit more
work for us).

So we need to transpile this code on the fly using `babel-register`, so let's go
ahead and install the latest version (`6.5.1` at the time of this writing) of
that now:

```
npm install --save-dev babel-register
```

With that, we now need to require that file in every one of our test files that
require code we want to transpile. Just kidding! That would be incredibly lame!
AVA has a flag (`--require`) that we can use to basically do this for us. However,
instead of just using `--require babel-register`, we're going to add a new file
to do this for us because we're going to add more environment setup code in there
soon.

So create a new file in the `other/` directory called `setup-ava-tests.js` and
place this in there:

```javascript
require('babel-register')
require('babel-polyfill') // this has already been installed. May as well :-)
```

Now, update the `test` script in the `scripts` object of your `package.json` to
use the `--require` flag like so:

```javascript
"test": "ava 'app/**/*.test.js' --verbose --require ./other/setup-ava-tests.js"
```

Now if you run the `npm run test` you should get this again:

```
  ✔ containers › CustomerList › empty test
  ✔ components › Toggle › empty test
  ✔ store › Customers › empty test

  3 tests passed
```

Awesome! 🎉 Unfortunately, there's one more thing we need to consider before we're
all set. Try to run `npm run cover`. You'll get this output:

```
---------------------|----------|----------|----------|----------|----------------|
File                 |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
---------------------|----------|----------|----------|----------|----------------|
 app/store/          |    46.15 |      100 |        0 |    46.15 |                |
  Customers.js       |    46.15 |      100 |        0 |    46.15 |... 20,21,22,27 |
 other/              |      100 |      100 |      100 |      100 |                |
  setup-ava-tests.js |      100 |      100 |      100 |      100 |                |
---------------------|----------|----------|----------|----------|----------------|
All files            |    53.33 |      100 |        0 |    53.33 |                |
---------------------|----------|----------|----------|----------|----------------|
```

I'm not talking about the low coverage on the `Customers.js` file. We'll deal with
that later. I'm talking about the coverage being recorded on our `setup-ava-tests`
file. It's skewing our results, so we need to tell `nyc` to exclude it from the
results.

There are two ways we can exclude code from coverage. We can either utilize the
many methods available for ignoring code with `istanbul`
([learn more](https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md)),
or we can configure `nyc` to exclude specific `glob`s. We'll do the later.

`nyc` configuration happens in the `package.json` file. Add an `nyc` property to
the root of your `package.json` object:

```javascript
"nyc": {
  "exclude": [
    "other"
  ]
}
```

- `exclude` - an array of globs that should be excluded from coverage instrumentation

Now run `npm run cover` again and you'll see that the report excludes `other/`

```
---------------|----------|----------|----------|----------|----------------|
File           |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
---------------|----------|----------|----------|----------|----------------|
 store/        |    46.15 |      100 |        0 |    46.15 |                |
  Customers.js |    46.15 |      100 |        0 |    46.15 |... 20,21,22,27 |
---------------|----------|----------|----------|----------|----------------|
All files      |    46.15 |      100 |        0 |    46.15 |                |
---------------|----------|----------|----------|----------|----------------|
```

Like I said, we'll deal with the coverage numbers later. Like... right now!!!

## Test Customers.js

Now we can finally start writing some tests! This module has absolutely nothing to
do with React. It's just regular, vanilla JavaScript! That's the way we like it.
The more we can do that, the better!

There are three APIs exposed from `Customer.js` that we'll be wanting to test:

- `getCustomers`
- `setCustomers`
- `subscribe`

Each is documented using JSDoc. Go ahead and copy this into the `Customer.test.js`
file and follow the instructions in the comments:

```javascript
import test from 'ava'
import sinon from 'sinon' // you'll need to install this with `npm install --save-dev sinon`
import store from './Customers'

test('customers should start with empty', t => {
  // call store.getCustomers and verify the result is empty
  t.fail() // remove this
})

test('setting customers and getting them', t => {
  // create two or more objects with a string property called `name`
  // call store.setCustomers with an array of these objects
  // call store.getCustomers
  // validate that what is returned has the proper length
  // validate that the contents are the same as the contents of the array you passed
  t.fail() // remove this
})

test('subscribing to the store', t => {
  // create a function spy with `sinon.spy()`
  // use that spy to subscribe to the store and assign the unsubscribe function
  // call store.setCustomers
  // validate that the spy was called once
  // reset the spy with `spy.reset()`
  // then call the unsubscribe function
  // validate that calling store.setCustomers again will not call the spy
  t.fail() // remove this
})

// add an afterEach here to reset the customers to an empty array
```

With that copied into the file, I recommend you run: `npm run watch:cover` to have
the tests run while you're updating the file. Now go ahead and implement! You
want to look at the comment by the [`sinon`](http://npm.im/sinon) import and the
comment at the bottom about adding an `afterEach`. Look up how to do that
[here](https://www.npmjs.com/package/ava#before--after-hooks).

Once you're all done, your output should look like this:

```
  ✔ components › Toggle › empty test
  ✔ containers › CustomerList › empty test
  ✔ store › Customers › customers should start with empty
  ✔ store › Customers › setting customers and getting them
  ✔ store › Customers › subscribing to the store

  5 tests passed

---------------|----------|----------|----------|----------|----------------|
File           |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
---------------|----------|----------|----------|----------|----------------|
 store/        |      100 |      100 |      100 |      100 |                |
  Customers.js |      100 |      100 |      100 |      100 |                |
---------------|----------|----------|----------|----------|----------------|
All files      |      100 |      100 |      100 |      100 |                |
---------------|----------|----------|----------|----------|----------------|
```

😎 stellar!

## Test Toggle.js

Alright! Now we can finally get to testing some React code! As
[my slides](http://kcd.im/react-ava#/2/2) illustrate, React components have three
inputs that need to be considered when writing tests:

1. Props
2. User
3. Data

In `Toggle.js` we'll be concerned about the `Props` and `User` inputs. We'll cover
the `Data` input with `CustomerList`.

When testing a React component, it's extremely tempting to go down the path of
reimplementing the component in the test. Essentially validating that this div
has a child button which has these attributes and this text. This makes for a
pretty finicky test suit because anytime you want to refactor the code (not
actually make any changes visible) you have to update the tests.

Instead we strive to simply test the output itself. So we're going to use the
function `renderToStaticMarkup` from `react-dom/server` to take a React component
and render it into its pure HTML form. We'll then make assertions that the output
contains the pieces that we're looking for. This approach definitely comes with
trade-offs, but its pros outweigh its cons.

Go ahead and open `Toggle.test.js` in `app/components/` and paste this in:

```javascript
import test from 'ava'
import sinon from 'sinon' // you should have installed this in the last step

import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'

import Toggle from './Toggle'

test('toggle--off class applied by default', t => {
  // render <Toggle /> with renderToStaticMarkup and get the output
  // assert the the output string includes the text for the classname
  t.fail() // remove this
})

test('toggle--on class applied when initialToggledOn specified to true', t => {
  // render <Toggle /> with renderToStaticMarkup and get the output
  // assert the the output string includes the text for the classname
  t.fail() // remove this
})
```

Simple enough right? Once you have this working, your `npm run cover` output
should look like:

```
  ✔ containers › CustomerList › empty test
  ✔ store › Customers › customers should start with empty
  ✔ store › Customers › setting customers and getting them
  ✔ store › Customers › subscribing to the store
  ✔ components › Toggle › toggle--off class applied by default
  ✔ components › Toggle › toggle--on class applied when initialToggledOn specified to true

  6 tests passed

---------------|----------|----------|----------|----------|----------------|
File           |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
---------------|----------|----------|----------|----------|----------------|
 components/   |    66.67 |      100 |    66.67 |    66.67 |                |
  Toggle.js    |    66.67 |      100 |    66.67 |    66.67 |       11,12,13 |
 store/        |      100 |      100 |      100 |      100 |                |
  Customers.js |      100 |      100 |      100 |      100 |                |
---------------|----------|----------|----------|----------|----------------|
All files      |    86.36 |      100 |    88.89 |    86.36 |                |
---------------|----------|----------|----------|----------|----------------|
```

We're missing coverage on the `handleToggleClick` lines. So far, we've only tested
changing the `Props` input to our component. Now we need to simulate the `User`
input.

To do this, we'll leverage React's Synthetic Event system by using the official
[test utils](https://facebook.github.io/react/docs/test-utils.html):
`react-addons-test-utils`. Go ahead and install the latest version of this now
(`0.14.7` is the latest at the time of this writing):

```
npm install --save-dev react-addons-test-utils
```

With that installed, go ahead and add this test to your `Toggle.test.js` file
(but don't implement it yet):

```javascript
test('invokes the onToggle prop when clicked', t => {
  // create a spy to pass in as the onToggle prop (you'll need to import sinon)
  // use document.createElement to create a div
  // render <Toggle /> with your onToggle prop into the div using `render` from `react-dom`
  // get a reference to the button using `div.querySelector`
  // Use `Simulate.click` from `react-addons-test-utils` to simulate a click event on the `button`
  // validate the div's `innerHTML` includes the right class
  // validate your onToggle spy was called (only once)
  // validate your onToggle spy was called with the right state (true/false)
})
```

You'll notice that the instructions require the use of `document.createElement`
which requires a DOM. That's because when you're simulating the User inputs, you
need a DOM. Unfortunately, AVA does not officially support running in the browser
([it's on the roadmap](https://github.com/sindresorhus/ava/issues/24), and
someone seemed to have success
[getting AVA to work with karma](https://github.com/angular/angular.js/issues/13971)).
Luckily we have [jsdom](http://npm.im/jsdom) which works great for our use-case.
It just takes installing and getting set up for each of our tests. Let's install
the latest version (`8.0.2` at the time of this writing).

```
npm install --save-dev jsdom@8.0.2
```

With that installed, now we need each one of our tests to have the global
environment set up with this (because most of our tests will need this). So go
ahead and open the `setup-ava-tests.js` file in the `other/` directory and just
paste this in:

```javascript
/**
 * This is used to set up the environment that's needed for most
 * of the unit tests for the project which includes babel transpilation
 * with babel-register, polyfilling, and initializing the DOM with jsdom
 */
require('babel-register')
require('babel-polyfill')

global.document = require('jsdom').jsdom('<body></body>')
global.window = document.defaultView
global.navigator = window.navigator
```

Now, because we've configured AVA to `--require` this file, next time our tests
run, they'll have this environment set up for them and have access to the global
`document` for creating elements. Which is what you need to do now. Go! 🏁

Once you have your tests implemented, your `npm run cover` output should look
like this:


```
  ✔ containers › CustomerList › empty test
  ✔ store › Customers › customers should start with empty
  ✔ store › Customers › setting customers and getting them
  ✔ store › Customers › subscribing to the store
  ✔ components › Toggle › toggle--off class applied by default
  ✔ components › Toggle › toggle--on class applied when initialToggledOn specified to true
  ✔ components › Toggle › invokes the onToggle prop when clicked

  7 tests passed

---------------|----------|----------|----------|----------|----------------|
File           |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
---------------|----------|----------|----------|----------|----------------|
 components/   |      100 |      100 |      100 |      100 |                |
  Toggle.js    |      100 |      100 |      100 |      100 |                |
 store/        |      100 |      100 |      100 |      100 |                |
  Customers.js |      100 |      100 |      100 |      100 |                |
---------------|----------|----------|----------|----------|----------------|
All files      |      100 |      100 |      100 |      100 |                |
---------------|----------|----------|----------|----------|----------------|
```

🔥🔥🔥 awesome!


