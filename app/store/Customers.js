let _customers = []
const callbacks = []

export default {
  getCustomers,
  setCustomers,
  subscribe,
}

function getCustomers() {
  return _customers
}

function setCustomers(customers) {
  _customers = customers
  _letSubscribersKnow()
}

function subscribe(callback) {
  callbacks.push(callback)
  return function removeCallback() {
    callbacks.splice(callbacks.indexOf(callback), 1)
  }
}

function _letSubscribersKnow() {
  callbacks.forEach(cb => cb())
}
