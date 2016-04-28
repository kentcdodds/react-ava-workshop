import test from 'ava'
import React from 'react'
import {render, unmountComponentAtNode} from 'react-dom'
import {spy} from 'sinon'

import CustomerList from './CustomerList'

test('Renders no customers with empty customer list', t => {
  const div = renderToDiv()
  hasNoCustomers(t, div)
})

test('Renders a list of customers with a filled customer list', t => {
  const customers = [{name: 'Matt'}, {name: 'Luke'}]
  const {store} = getStoreStub(customers)
  const div = renderToDiv({store})
  hasCustomers(t, div, customers)
})

test('Responds to store updates', t => {
  const {ref, store} = getStoreStub()
  const div = renderToDiv({store})

  ref.customers = [{name: 'Jamison'}, {name: 'Tyler'}]
  ref.subscriber()

  hasCustomers(t, div, ref.customers)
})

test('Unsubscribes on unmount', t => {
  const {ref, store} = getStoreStub()
  const div = renderToDiv({store})
  unmountComponentAtNode(div)
  t.true(ref.unsubscribe.calledOnce)
})

// util functions

function hasNoCustomers(t, {innerHTML}) {
  t.true(innerHTML.includes('no customers'))
  t.false(innerHTML.includes('list of customers'))
}

function hasCustomers(t, {innerHTML}, customers) {
  t.true(innerHTML.includes('list of customers'))
  customers.forEach(({name}) => t.true(innerHTML.includes(name)))
  t.false(innerHTML.includes('no customers'))
}

function getStoreStub(customers = []) {
  const ref = {customers, unsubscribe: spy()}
  const store = {
    getCustomers: () => ref.customers,
    subscribe(subscriber) {
      ref.subscriber = subscriber
      return ref.unsubscribe
    },
  }
  return {ref, store}
}

function renderToDiv(props) {
  const div = document.createElement('div')
  render(
    <CustomerListWithDefaults {...props} />,
    div
  )
  return div
}

function CustomerListWithDefaults(props) {
  const store = {
    getCustomers: () => [],
    subscribe() {},
  }
  return <CustomerList store={store} {...props} />
}
