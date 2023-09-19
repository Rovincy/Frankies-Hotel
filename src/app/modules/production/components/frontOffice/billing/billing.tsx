import {Tabs, TabsProps} from 'antd'
import { Payment } from './payment'
import { AllTransactions } from './allTransacton'


const Billing= () => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Payment`,
      children: <Payment/>,
    },
    {
      key: '2',
      label: `All Transactions`,
      children: <AllTransactions/>,
    },
    
  ]
  return (
    <div>
      <Tabs defaultActiveKey='1' items={items} />
    </div>
  )
}

export {Billing}
