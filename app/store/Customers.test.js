import test from 'ava'
import {spy} from 'sinon'

import store from './Customers'

test('initial state of customers is empty', t => {
  const customers = store.getCustomers()
  t.is(customers.length, 0)
})

test('setting and getting customers', t => {
  const customer1 = {name: 'Matt'}
  const customer2 = {name: 'Luke'}
  store.setCustomers([customer1, customer2])
  const [retrieved1, retrieved2] = store.getCustomers()
  t.is(customer1, retrieved1)
  t.is(customer2, retrieved2)
})

test('subscribing calls the given callback when customers are set', t => {
  const subscriber = spy()
  const unsubscribe = store.subscribe(subscriber)
  store.setCustomers()
  t.true(subscriber.calledOnce)
  subscriber.reset()
  unsubscribe()
  store.setCustomers()
  t.false(subscriber.called)
})
