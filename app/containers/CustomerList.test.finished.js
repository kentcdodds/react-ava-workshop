import test from 'ava'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {render, unmountComponentAtNode} from 'react-dom'
import {Simulate} from 'react-addons-test-utils'
import {spy} from 'sinon'
import CustomerList from './CustomerList'

test('notice: defaults to sales person', t => {
  const output = renderToString()
  t.true(hasSalesPersonNotice(output))
})

test('notice: has boss notice when initialBoss is specified', t => {
  const output = renderToString({initialBoss: true})
  t.true(hasBossNotice(output))
})

test('onToggleBoss invoked when the button is clicked', t => {
  const onToggleBoss = spy()
  const div = renderToDiv({onToggleBoss})
  const button = div.getElementsByTagName('button')[0]
  Simulate.click(button)
  t.true(onToggleBoss.calledOnce)
  t.true(hasBossNotice(div.innerHTML))
})

test('defaults to no customers', t => {
  const output = renderToString()
  t.true(hasNoCustomers(output))
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


function hasSalesPersonNotice(string) {
  return string.includes('🤓')
}

function hasBossNotice(string) {
  return string.includes('😎')
}

function hasNoCustomers(string) {
  return string.includes('no customers')
}

function hasCustomers(string, customers) {
  return string.includes('list of customers') && customers.every(c => string.includes(c.name))
}

function renderToString(props) {
  return renderToStaticMarkup(<CustomerList {...props} />)
}

function renderToDiv(props) {
  const div = document.createElement('div')
  render(<CustomerList {...props} />, div)
  return div
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
