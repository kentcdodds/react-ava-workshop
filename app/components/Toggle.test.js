import test from 'ava'
import React from 'react'

import {renderToStaticMarkup} from 'react-dom/server'
import {render} from 'react-dom'
import {Simulate} from 'react-addons-test-utils'
import {spy} from 'sinon'
import Toggle from './Toggle'

test('toggle--off class applied by default', t => {
  const output = renderToStaticMarkup(<Toggle />)
  t.true(output.includes('toggle--off'))
})

test('toggle--on class applied when initialToggledOn specified', t => {
  const output = renderToStaticMarkup(<Toggle initialToggledOn={true} />)
  t.true(output.includes('toggle--on'))
})

test('onToggle callback is called when the button is clicked', t => {
  const div = document.createElement('div')
  const onToggle = spy()
  render(<Toggle onToggle={onToggle} />, div)
  const button = div.getElementsByTagName('button')[0]
  Simulate.click(button)

  t.truthy(div.querySelector('.toggle--on'))
  t.true(onToggle.calledOnce)
  t.true(onToggle.calledWith(true))
})
