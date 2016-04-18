import test from 'ava'
// import sinon from 'sinon'

// import React from 'react'
// import {renderToStaticMarkup} from 'react-dom/server'
// import {render, unmountComponentAtNode} from 'react-dom'

// import CustomerList from './CustomerList'

// change this from `test.skip(` to simply `test(`
test.skip('Renders no customers and add button', t => {
  // normal props test. Use renderToStaticMarkup and test the output when you pass no props
  // verify that it includes 'no customers' and doesn't include 'list of customers'
})

// change this from `test.skip(` to simply `test(`
test.skip('Renders customers and add button', t => {
  // Here's where we need to provide our stubbed store
  // create an object that has a getCustomers function
  // which is a spy that wraps a function that returns
  // an array of at least 2 customers (objects with a name string property)
  // then use renderToStaticMarkup to get the output
  // then assert that the output includes 'list of customers'
  // assert your output includes the names of each of your customers
  // assert that your output doesn't include 'no customers'
})

// change this from `test.skip(` to simply `test(`
test.skip('Responds to store updates', t => {
  // this is where we're actually testing the callback to the subscription
  // the other two tests were pretty much just testing Props
  // this test covers the Data input

  // declare an uninitialized callback variable
  // declare a customers variable assigned to an empty array []
  // create a store with a getCustomers that's a function which returns customers
  // also add a subscribe function that accepts a cb that simply assigns your callback variable to the given cb
  // Create a div with document.createElement (as before)
  // render the CustomerList with your store stub prop into the div
  // reassign the customers to an array of at least two new customers (objects with a name property)
  // invoke the callback (which should be assigned by now)
  // get the innerHTML of the div and assert:
  // it includes 'list of customers'
  // it includes the names of each of your customers
  // it does not include 'no customers'
})

// change this from `test.skip(` to simply `test(`
test.skip('unsubscribes when unmounted', t => {
  // do many of the same things as above by stubbing the store
  // this one needs to create a spy that will be returned by the stubbed subscribe method
  // You don't need to worry about changing customers or invoking the callback
  // still render it into a div
  // But then you can immediately unmount it by calling unmountComponentAtNode (from 'react-dom')
  // then assert that your unsubscribe spy was called
})
