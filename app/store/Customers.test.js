import test from 'ava'
// import sinon from 'sinon' // you'll need to install this with `npm install --save-dev sinon`
// import store from './Customers'

// change this from `test.skip(` to simply `test(`
test.skip('customers should start with empty', t => {
  // call store.getCustomers and verify the result is empty
})

// change this from `test.skip(` to simply `test(`
test.skip('setting customers and getting them', t => {
  // create two or more objects with a string property called `name`
  // call store.setCustomers with an array of these objects
  // call store.getCustomers
  // validate that what is returned has the proper length
  // validate that the contents are the same as the contents of the array you passed
})

// change this from `test.skip(` to simply `test(`
test.skip('subscribing to the store', t => {
  // create a function spy with `sinon.spy()`
  // use that spy to subscribe to the store and assign the unsubscribe function
  // call store.setCustomers
  // validate that the spy was called once
  // reset the spy with `spy.reset()`
  // then call the unsubscribe function
  // validate that calling store.setCustomers again will not call the spy
})

// add an afterEach here to reset the customers to an empty array
