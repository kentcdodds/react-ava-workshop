import test from 'ava'
import sinon from 'sinon'

import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {render, unmountComponentAtNode} from 'react-dom'

import CustomerList from './CustomerList'

test('Renders no customers and add button', t => {
  const output = renderStatic()
  t.true(output.includes('no customers'))
  t.false(output.includes('list of customers'))
})

test('Renders customers and add button', t => {
  const store = {
    getCustomers: sinon.spy(() => [{name: 'Bob'}, {name: 'Joanna'}]),
  }
  const output = renderStatic({store})
  t.true(output.includes('list of customers'))
  t.true(output.includes('Bob'))
  t.true(output.includes('Joanna'))
  t.false(output.includes('no customers'))
})

test('Responds to store updates', t => {
  const {ref, store} = getStoreStub()
  const div = renderToDiv({store})
  ref.customers = [{name: 'Jill'}, {name: 'Fred'}]
  ref.callback()
  const {innerHTML} = div
  t.true(innerHTML.includes('list of customers'))
  t.true(innerHTML.includes('Jill'))
  t.true(innerHTML.includes('Fred'))
  t.false(innerHTML.includes('no customers'))
})

test('unsubscribes when unmounted', t => {
  const {ref, store} = getStoreStub()
  const div = renderToDiv({store})
  unmountComponentAtNode(div)
  t.true(ref.unsubscribe.calledOnce)
})


/**
 * Create a stub for the store which can be used for assertions
 * @returns {Object} - ref property has customers and will haf ref.callback when
 *   store.callback is invoked. store.getCustomers will return ref.customers
 */
function getStoreStub() {
  const unsubscribe = sinon.spy()
  const ref = {customers: [], unsubscribe}
  const store = {
    getCustomers: () => ref.customers,
    subscribe: cb => {
      ref.callback = cb
      return ref.unsubscribe
    },
  }
  return {ref, store}
}


/**
 * Render the <CustomerList /> component to a string with the given props
 * @param {Object} props - the props to apply to the <CustomerList /> element
 * @returns {Object} - the rendered string, store, and actions stubs
 */
function renderStatic(props) {
  const output = renderToStaticMarkup(
    <CustomerListWithDefaults {...props} />
  )
  return output
}

/**
 * Render the <CustomerList /> component to a div with the given props
 * @param {Object} props - the props to apply to the <CustomerList /> element
 * @returns {Element} - the div that contains the element
 */
function renderToDiv(props) {
  const div = document.createElement('div')
  render(
    <CustomerListWithDefaults {...props} />,
    div,
  )
  return div
}

function CustomerListWithDefaults(props) {
  const store = {
    getCustomers: () => [],
  }
  const actions = {
    addCustomer() {},
  }
  return (
    <CustomerList
      store={store}
      actions={actions}
      {...props}
    />
  )
}
