import React, {PropTypes} from 'react'

class Toggle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      toggledOn: props.initialToggledOn || false,
    }
  }
  handleToggleClick() {
    const toggledOn = !this.state.toggledOn
    this.props.onToggle(toggledOn)
    this.setState({toggledOn})
  }
  render() {
    const onOff = this.state.toggledOn ? 'on' : 'off'
    const toggledClassName = `toggle--${onOff}`
    return (
      <div className={`toggle ${toggledClassName}`}>
        <button
          onClick={() => this.handleToggleClick()}
        >
          {this.props.children}
        </button>
      </div>
    )
  }
}

Toggle.propTypes = {
  initialToggledOn: PropTypes.bool,
  onToggle: PropTypes.func,
  children: PropTypes.any,
}

export default Toggle
