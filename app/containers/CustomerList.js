import React, {PropTypes} from 'react'
import store from '../store/Customers'

class CustomerList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {customers: [], boss: props.initialBoss || false}
  }
  componentDidMount() {
    this.unsubscribe = this.props.store.subscribe(() => this.updateStateWithCustomers())
    this.updateStateWithCustomers()
  }
  componentWillUnmount() {
    this.unsubscribe()
  }
  updateStateWithCustomers() {
    this.setState({customers: this.props.store.getCustomers()})
  }
  toggleBoss() {
    const boss = !this.state.boss
    this.props.onToggleBoss(boss)
    this.setState({boss})
  }
  render() {
    const {customers, boss} = this.state
    const noCustomers = customers.length === 0
    return (
      <div>
        {noCustomers ? <NoCustomers /> : <ListOfCustomers customers={customers} />}
        <button onClick={() => this.toggleBoss()}>Toggle Boss State</button>
        {boss ? <BossNotice /> : <SalesPersonNotice />}
      </div>
    )
  }
}

CustomerList.propTypes = {
  initialBoss: PropTypes.bool.isRequired,
  onToggleBoss: PropTypes.func.isRequired,
  store: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    getCustomers: PropTypes.func.isRequired,
  }).isRequired,
}

CustomerList.defaultProps = {store}

function ListOfCustomers({customers}) {
  return (
    <div>
      Here is your list of customers!
      <ul>
        {customers.map((c, i) => <Customer key={i} {...c} />)}
      </ul>
    </div>
  )
}

ListOfCustomers.propTypes = {
  customers: PropTypes.array,
}

function NoCustomers() {
  return (
    <div>
      You have no customers. Better get to work!
    </div>
  )
}

function Customer({name}) {
  return <li key={name}>{name}</li>
}

function SalesPersonNotice() {
  return <span>You are a sales person 🤓</span>
}

function BossNotice() {
  return <span>You are a boss 😎</span>
}

Customer.propTypes = {
  name: PropTypes.string,
}

export default CustomerList
