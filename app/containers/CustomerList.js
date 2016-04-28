import React, {PropTypes} from 'react'
import store from '../store/Customers'

class CustomerList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {customers: []}
  }
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => this.updateStateWithCustomers())
    this.updateStateWithCustomers()
  }
  componentWillUnmount() {
    this.unsubscribe()
  }
  updateStateWithCustomers() {
    this.setState({customers: store.getCustomers()})
  }
  render() {
    const {customers} = this.state
    const {boss} = this.props
    const noCustomers = customers.length === 0
    return (
      <div>
        {noCustomers ? <NoCustomers /> : <ListOfCustomers customers={customers} />}
        {boss ? <BossNotice /> : <SalesPersonNotice />}
      </div>
    )
  }
}

CustomerList.propTypes = {
  boss: PropTypes.bool.isRequired,
}

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
  return <div>You are a sales person 🤓</div>
}

function BossNotice() {
  return <div>You are a boss 😎</div>
}

Customer.propTypes = {
  name: PropTypes.string,
}

export default CustomerList
