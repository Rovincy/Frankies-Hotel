import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  message,
  Typography,
  Row,
  Col,
} from 'antd'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {KTCardBody, KTSVG} from '../../../../../../_metronic/helpers'
import {BASE_URL} from '../../../urls'
import {Link, useNavigate, useParams} from 'react-router-dom'
// import { employeedata } from '../../../../../data/DummyData'
import {useQuery, useQueryClient, useMutation} from 'react-query'
import {
  Api_Endpoint,
  addGuestBilling,
  fetchCurrencies,
  fetchGuestBilling,
  fetchGuests,
  fetchRooms,
  fetchTaxes,
} from '../../../../../services/ApiCalls'
import Checkbox from 'antd/es/checkbox/Checkbox'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'

const Billing = () => {
  const [gridData, setGridData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const [img, setImg] = useState()
  const [customData, setNewCustomData] = useState<any>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openPaymentModal, setopenPaymentModal] = useState(false)
  const [openDebitModal, setopenDebitModal] = useState(false)
  const [openCreditModal, setopenCreditModal] = useState(false)
  const {mutate: guestBilling} = useMutation((values: any) => addGuestBilling(values))
  const {data: currencydata, isLoading: currencyLoad} = useQuery('currency', fetchCurrencies)
  const {data: roomsdata, isLoading: roomsLoad} = useQuery('rooms', fetchRooms)
  const {data: guestdata, isLoading: guestLoad} = useQuery('guests', fetchGuests)
  const {data: taxdata, isLoading: taxLoad} = useQuery('tax', fetchTaxes)
  const {data: billingData, isLoading: billingLoad, refetch: refetchBillingData} = useQuery(
    'AllGuestBillings',
    () => fetchGuestBilling(parms['*']), // Pass the id as an argument
    {
      //   enabled: yourIdHere !== undefined, // You can enable or disable the query based on whether id is defined
    }
  )
  const [customerForm] = Form.useForm()
  const [paymentForm] = Form.useForm()
  const [debitForm] = Form.useForm()
  const [creditForm] = Form.useForm()
  const queryClient = useQueryClient()
  const {Text} = Typography
  const parms: any = useParams()
  const navigate = useNavigate();

  var totalDebit = 0
  var totalCredit = 0
  var totalBalance = 0
  var taxedBalance = 0

  totalBalance = totalCredit - totalDebit
  var totalConvertedDebit = 0
  var totalConvertedCredit = 0
  var totalConvertedBalance
  var convertedTaxedBalance = 0
  var symbol
  //LocalRate
  var localRate =0
  
  //
  // totalDebit = totalDebit + newDebit
  // totalCredit = totalCredit + newCredit
  // console.log(billingData?.data)
  var newBillingData = billingData?.data.map((b: any,index:any) => {
    var newCredit
    var newDebit
    var rate
    var amount
    var room
    var date = new Date(b.timestamp)
    // console.log(currencydata?.data)
    currencydata?.data.map((c: any) => {
      if (c.symbol?.trim()=="GHS") {
        localRate = c.rate
      }
      // console.log("b.currency: ",b.currency)
      // var trimmedSym= c.symbol?.trim()
      // var trimmedCur=b.currency
      console.log('c.symbol?.trim()===b.currency:',c.symbol?.trim()===b.currency)
      console.log('c.symbol?.trim():',c.symbol?.trim())
      console.log('b.currency:',b.currency)
      console.log('index:',index+1)
      if (c.symbol?.trim()===b.currency?.trim()) {
        newCredit = (b.credit/c.rate).toFixed(2)
        newDebit = (b.debit/c.rate).toFixed(2)
        rate = c.rate.toFixed(2)
        totalDebit = totalDebit + parseFloat(newDebit)
        totalCredit = totalCredit + parseFloat(newCredit)
        // totalConvertedDebit = totalConvertedDebit
        totalBalance = totalCredit - totalDebit

        // console.log('b.isPayment: ',b['isPayment'])
        if (b.isPayment===false||b.isPayment===null) {
          taxedBalance = taxedBalance + (parseFloat((b.credit/c.rate).toFixed(2)) - parseFloat((b.debit/c.rate).toFixed(2)))
          // console.log("taxedBalance: ",taxedBalance)
        }
  }
  totalConvertedCredit = parseFloat((parseFloat(totalCredit.toFixed(2)) * localRate).toFixed(2))
  totalConvertedDebit= parseFloat((parseFloat(totalDebit.toFixed(2)) * localRate).toFixed(2))
  totalConvertedBalance= parseFloat((parseFloat(totalBalance.toFixed(2)) * localRate).toFixed(2))<0?`(${parseFloat((parseFloat(totalBalance.toFixed(2)) * localRate).toFixed(2))*(-1)})`:parseFloat((parseFloat(totalBalance.toFixed(2)) * localRate).toFixed(2))
  convertedTaxedBalance = parseFloat((parseFloat(taxedBalance.toFixed(2)) * localRate).toFixed(2))
    })
    roomsdata?.data.map((r:any)=>{
      if (b.roomId===r.id) {
        room = r.name
      }
    })

    if (b.debit===0||b.debit===null) {
      amount = b.credit
    } else {
      amount = b.debit
    }

    //   totalDebit = totalDebit + parseFloat(e.debit)
  //   totalCredit = totalCredit + parseFloat(e.credit)
    return {
      index:index+1,
      customerId: b.customerId,
      roomId: b.roomId,
      room:room,
      date:date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      description: b.description,
      currency:b.currency,
      rate: rate,
      debit: newDebit,
      credit: newCredit,
      amount:amount
    }
  })
//   let vat : any
//   // console.log('taxdata?.data: ',taxdata?.data)
//  var test = taxdata?.data.map((e:any,index:any)=>{
//     if(e.isLevy===null||e.isLevy===false){
//       vat = (convertedBalance * e.rate)/(100 + e.rate)
//     }
//     return [{
//      text: `VAT: ${vat}`
//     }]
//   })
// var test = taxdata?.data.map((e: any, index: any) => {
  //   let nhil: any;
  //   let covid:any;
  //   let tourism:any;
  //   let getFund:any;
  //   convertedBalance<0?(convertedBalance*(-1)):convertedBalance
  //   if (e.isLevy === null || e.isLevy === false) {
    //     vat = (convertedBalance * e.rate) / (100 + e.rate);
    //   }else{
      
      //   }
      //   return (
        //     <div key={index}>
        //       <p>VAT: {vat}</p>
        //     </div>
        //   );
        // });
          let vat: any;
const Taxes = taxdata?.data.map((item: any, index: number) => {
  if(convertedTaxedBalance<0){
    convertedTaxedBalance = convertedTaxedBalance * (-1)
  }
  // Check the condition for each item
  if (item.isLevy === null || item.isLevy === false) {
    // Calculate VAT for the item with its individual rate
     vat = (convertedTaxedBalance * item.rate) / (100 + item.rate);

    return (
      <div key={index} style={{ textAlign: 'right', marginRight: '20px' }}>
        <p>
          {item.name}: {vat.toFixed(2)} GHS
        </p>
      </div>
    );
  } else {
    var salesAmount = ((convertedTaxedBalance-vat)/107)*100
    var subTotal = convertedTaxedBalance - vat
    // console.log('salesAmount: ',salesAmount.toFixed(2))
    // console.log('subTotal: ',subTotal.toFixed(2))
    const levy = (salesAmount * item.rate) / (100);
    return (
      <div key={index} style={{ textAlign: 'right', marginRight: '20px' }}>
        <p>
          {item.name}: {levy.toFixed(2)} GHS
        </p>
      </div>
    );
  }
});

  var guestListData = guestdata?.data.map((e:any)=>{
    return {
      id: e.id,
      name: `${e.firstname?.trim()} ${e.lastname?.trim()}`
    }
  })
  

  // console.log('totalBalance:',totalBalance);
  // console.log('newBillingData:',newBillingData);
  // currencydata?.data.map((c: any) =>{
  //   console.log('newBillingData[debit]:',newBillingData.debit);
  //   console.log('currency:',c.symbol);
  //   if (c.symbol?.trim()=="GHS") {
  //     totalConvertedDebit = newBillingData['debit']/c.rate
  //   }
  // })
  // console.log('totalConvertedDebit',totalConvertedDebit)
  // newBillingData.map((e:any)=>{
  //   totalDebit = totalDebit + parseFloat(e.debit)
  //   totalCredit = totalCredit + parseFloat(e.credit)
  // })
  // totalBalance = totalCredit - totalDebit
  // var totalConvertedDebit = 0
  // var totalConvertedCredit = 0
  // var totalConvertedBalance = 0
  // var symbol
  // currencydata?.data.map((e: any) => {
  //   if(e.isBase==true){
  //     totalConvertedDebit = totalDebit * e.rate
  //   totalConvertedCredit = totalCredit * e.rate
  //   symbol = e.symbol
  //   totalConvertedBalance = totalBalance * e.rate
  //   if (totalConvertedBalance < 0) {
  //     totalConvertedBalance = totalConvertedBalance * -1
  //   }
  //   }
  // })

  // var newBillingData = billingData?.data((e:any)=>{
  //   return {}
  // })

  //   console.log(parms)
  //   console.log(roomsdata?.data?.filter((rooms: any)=>rooms.typeId===parms.id))
  //   console.log(roomsdata?.data?.filter((rooms: any)=>rooms?.typeId===1))
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }
  //   const handlePayment = () => {
  //     Modal.confirm({
  //       title: 'Are you sure, you want to make payment for the selected items?',
  //       okText: 'Pay',
  //       onOk: () => {
  //         serviceBillData.map((item: any) => {
  //           if (servicePaymentData.some((selectedItem: { serviceId: any }) => selectedItem.serviceId === item.id)) {
  //             // If the item is selected for payment, proceed with the payment
  //             const serviceId = parseInt(item.id);
  //             updatePayment(serviceId, {
  //               onSuccess: () => {
  //                 message.success('Payment made successfully!');
  //                 setopenGenerateModal(false)
  //                 queryClient.invalidateQueries('Bookings')
  //                 queryClient.invalidateQueries('fetchGuestServiceQuery')
  //                 queryClient.invalidateQueries('Guests')
  //                 queryClient.invalidateQueries('rooms')
  //                 queryClient.invalidateQueries('fetchServicesDetails')
  //               },
  //               onError(error, variables, context) {
  //                 message.destroy('Error occurred while submitting payment');
  //               },
  //             });
  //           }
  //         });
  //       },
  //     });
  //   };

  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
  }
  // const {data: allRooms} = useQuery('roomsTypes', fetchRooms, {cacheTime: 5000})
  const deleteData = async (element: any) => {
    Modal.confirm({
      okText: 'Yes',
      okType: 'primary',
      title: 'Are you sure, you want to delete this transaction',
      onOk: async () => {
        const response = await axios.delete(`${BASE_URL}/Billing/id?id=` + element)
        // update the local state so that react can refecth and re-render the table with the new data
        // const newData = gridData.filter((item: any) => item.id !== element.id)
        // setGridData(newData)
        if (response.status == 200) {
          message.success('Transaction deleted successfully')
          queryClient.invalidateQueries('AllGuestBillings')
        } else {
          message.success('Transaction deletion failed')
        }
        return response.status
      },
    })
  }
  const newPayment = (value: any) => {
    // console.log("Hello")
    value.customerId = parms['*']
    value.isPayment = true
    console.log(value)

    guestBilling(value, {
      onSuccess: () => {
        message.success('Transaction made successfully!')
        setopenPaymentModal(false)
        paymentForm.resetFields()
        queryClient.invalidateQueries('AllGuestBillings')
      },
      onError(error, variables, context) {
        message.destroy('Error occurred while submitting payment')
      },
    })
  }
  const newDebit = (value: any) => {
    // console.log("Hello")
    value.customerId = parms['*']
    // console.log(value)

    guestBilling(value, {
      onSuccess: () => {
        message.success('Transaction made successfully!')
        setopenDebitModal(false)
        debitForm.resetFields()
        queryClient.invalidateQueries('AllGuestBillings')
      },
      onError(error, variables, context) {
        message.destroy('Error occurred while submitting payment')
      },
    })
  }
  const newCredit = (value: any) => {
    // console.log("Hello")
    value.customerId = parms['*']
    // console.log(value)

    guestBilling(value, {
      onSuccess: () => {
        message.success('Transaction made successfully!')
        setopenCreditModal(false)
        creditForm.resetFields()
        queryClient.invalidateQueries('AllGuestBillings')
      },
      onError(error, variables, context) {
        message.destroy('Error occurred while submitting payment')
      },
    })
  }

  const custForm = (value:any) => {
    // console.log("Hello")
    // console.log(value)
    // console.log(value['value'])
    // console.log(value.guestId)
    // console.log(value['guestId'])
    setNewCustomData(value['value'])
    // history.go(value['value']);
    queryClient.invalidateQueries('AllGuestBillings')
    navigate(`/Billing/${value['value']}`, {replace: true})
    // parms['*']=customData


    // customerForm.resetFields()
  }
  // useEffect(()=>{
  // },)
  useEffect(()=>{
    parms['*'] = customData
    // console.log(parms['*'])
    // console.log('newBillingData: ',newBillingData)
    refetchBillingData();
  },[newBillingData,billingData])

  // const deleteRoomType = (id: any) => {
  //   Modal.confirm({
  //     okText: 'Yes',
  //     okType: 'primary',
  //     title: 'Are you sure, you want to delete room type?',
  //     onOk: () => {
  //       roomTypeData(id, {
  //         onSuccess: () => {
  //           message.success('Room type  successfully deleted!')
  //           queryClient.invalidateQueries('rooms')
  //           // queryClient.invalidateQueries('Guests')
  //           // queryClient.invalidateQueries('rooms')
  //         },
  //       })
  //     },
  //   })
  // }

  // function handleDelete(element: any) {
  //   deleteData(element)
  // }
  const columns: any = [
    {
      title: '#',
      dataIndex: 'index',
      sorter: (a: any, b: any) => {
        if (a.index > b.index) {
          return 1
        }
        if (b.index > a.index) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: (a: any, b: any) => {
        if (a.date > b.date) {
          return 1
        }
        if (b.date > a.date) {
          return -1
        }
        return 0
      },
    },
    // {
    //   title: 'CustomerId',
    //   dataIndex: 'customerId',
    //   sorter: (a: any, b: any) => {
    //     if (a.customerId > b.customerId) {
    //       return 1
    //     }
    //     if (b.customerId > a.customerId) {
    //       return -1
    //     }
    //     return 0
    //   },
    // },

    {
      title: 'Room',
      dataIndex: 'room',
      //   render: (isActive: boolean) => <Checkbox checked={isActive} />,
      sorter: (a: any, b: any) => {
        if (a.roomId > b.roomId) {
          return 1
        }
        if (b.roomId > a.roomId) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      //   render: (isActive: boolean) => <Checkbox checked={isActive} />,
      sorter: (a: any, b: any) => {
        if (a.description > b.description) {
          return 1
        }
        if (b.description > a.description) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'FX Currency',
      dataIndex: 'currency',
      //   render: (isActive: boolean) => <Checkbox checked={isActive} />,
      sorter: (a: any, b: any) => {
        if (a.currency > b.currency) {
          return 1
        }
        if (b.currency > a.currency) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      //   render: (isActive: boolean) => <Checkbox checked={isActive} />,
      sorter: (a: any, b: any) => {
        if (a.credit > b.credit) {
          return 1
        }
        if (b.credit > a.credit) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'FX Amount',
      dataIndex: 'rate',
      //   render: (isActive: boolean) => <Checkbox checked={isActive} />,
      sorter: (a: any, b: any) => {
        if (a.rate > b.rate) {
          return 1
        }
        if (b.rate > a.rate) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Debit',
      dataIndex: 'debit',
      //   render: (isActive: boolean) => <Checkbox checked={isActive} />,
      sorter: (a: any, b: any) => {
        if (a.debit > b.debit) {
          return 1
        }
        if (b.debit > a.debit) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      //   render: (isActive: boolean) => <Checkbox checked={isActive} />,
      sorter: (a: any, b: any) => {
        if (a.credit > b.credit) {
          return 1
        }
        if (b.credit > a.credit) {
          return -1
        }
        return 0
      },
    },

    // {
    //   title: 'Action',
    //   fixed: 'right',
    //   width: 20,
    //   render: (_: any, record: any) => (
    //     <Space size='middle'>
    //       {/* <Link to={`/employee-edit-form/${record.id}`}>
    //       <span className='btn btn-light-info btn-sm delete-button' style={{ backgroundColor: 'blue', color: 'white' }}>Rooms</span>
    //       </Link> */}
    //       {/* <Link to={`/rooms/${parms.id}`} state={record.id}> */}
    //       <Link to='#'>
    //         <a
    //           href='#'
    //           className='btn btn-light-danger btn-sm'
    //           onClick={() => deleteData(record.id)}
    //         >
    //           Delete
    //         </a>
    //         {/* <span
    //           className='btn btn-light-info btn-sm delete-button'
    //           style={{backgroundColor: 'red', color: 'white'}}
    //         >
    //           Delete
    //         </span> */}
    //       </Link>
    //     </Space>
    //   ),
    // },
  ]
  // const {data: allRoomss} = useQuery('roomsTypes', fetchRooms, {cacheTime: 5000})

  //   const loadData = async () => {
  //     setLoading(true)
  //     try {
  //       const response = await axios.get(`${Api_Endpoint}/RoomsType`)
  //       setGridData(response.data)
  //       setLoading(false)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }

  //   useEffect(() => {
  //     loadData()
  //     // fetchImage()
  //   }, [])

  // const sortedEmployees = gridData.sort((a:any, b:any) => a?.departmentId.localeCompare(b?.departmentId));
  // const females = sortedEmployees.filter((employee:any) => employee.gender === 'female');

  var out_data: any = {}

  // gridData.forEach(function (row: any) {
  //   if (out_data[row.departmentId]) {
  //     out_data[row.departmentId].push(row)
  //   } else {
  //     out_data[row.departmentId] = [row]
  //   }
  // })

  // const dataWithIndex = gridData.map((item: any, index: any) => ({
  //   ...item,
  //   key: index,
  // }))

  //   const handleInputChange = (e: any) => {
  //     setSearchText(e.target.value)
  //     if (e.target.value === '') {
  //       loadData()
  //     }
  //   }

  const globalSearch = () => {
    // @ts-ignore
    filteredData = dataWithIndex.filter((value) => {
      return (
        value.name.toLowerCase().includes(searchText.toLowerCase()) ||
        value.description.toLowerCase().includes(searchText.toLowerCase()) ||
        value.price.toLowerCase().includes(searchText.toLowerCase())
      )
    })
    setGridData(filteredData)
  }

  const cancelBillModal = () => {
    setopenPaymentModal(false)
    setopenDebitModal(false)
    setopenCreditModal(false)
  }
  const addPayment = () => {
    setopenPaymentModal(true)
  }
  const addDebit = () => {
    setopenDebitModal(true)
  }
  const addCredit = () => {
    setopenCreditModal(true)
  }

  return (
    // <div
    //   style={{
    //     backgroundColor: 'white',
    //     padding: '20px',
    //     borderRadius: '5px',
    //     boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
    //   }}
    // >
    <div
      style={{
        width: '100%',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <KTCardBody className='py-4 '>
        <div className='e-field'>
          {/* <Link to='/roomType'>
                <a
                  style={{fontSize: '16px', fontWeight: '500'}}
                  className='mb-7 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary'
                >
                  Back to room type
                </a>
              </Link> */}
              
              <div style={{display:'flex', flex:'start'}}>
              <Form form={customerForm} onFinish={custForm} style={{width:'40%'}}>
              <Form.Item
                name={'guestId'}
                // label='Customer'
                rules={[{required: true, message: 'Please select a room'}]}
                hasFeedback
                style={{width: '100%'}}
                labelCol={{span: 5}}
              >
                <DropDownListComponent
                  id='guest'
                  placeholder='Guest'
                  data-name='guest'
                  className='e-field'
                  dataSource={guestListData}
                  fields={{text: 'name', value: 'id'}}
                  onChange={custForm}
                  style={{width: '100%'}}
                />
              </Form.Item>
            </Form>
              </div>
          <div className='d-flex justify-content-between'>
            {/* <Space style={{marginBottom: 16}}>
              
              {/* <Input
                placeholder='Enter Search Text'
                onChange={handleInputChange}
                type='text'
                allowClear
                value={searchText}
              /> 
              <Button type='primary' onClick={globalSearch}>
                Search
              </Button>
            </Space> */}
            {/* <Space style={{marginBottom: 16}}>
             
              <Link to={`/roomsForm/${parms.id}`}>
                <button type='button' className='btn btn-primary me-3'>
                  <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                  Add
                </button>
              </Link>

              <button type='button' className='btn btn-light-primary me-3'>
                <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
                Export
              </button>
            </Space> */}
          </div>
          <Table
            columns={columns}
            dataSource={newBillingData}
            loading={billingLoad}
            className='table-responsive'
          />
        </div>
        <div style={{ width:'100%'}}>
          {/* //Row 1 */}
          <Row gutter={24 } >
          <Col span={3} style={{background:"none"}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
            <Col span={3} style={{background:"none"}}>
              {/* <Text>{totalCredit}</Text> */}
            </Col>
            <Col span={6} style={{background:"none"}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
            <Col span={6} style={{background:"none"}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
            <Col span={2} style={{background:"none", textAlign:"end"}}>
              {/* <Text>{totalDebit}</Text> */}
              <Text>{totalDebit} USD</Text>
            </Col>
            <Col span={3} style={{background:"none", textAlign:"end"}}>
              {/* <Text>{totalDebit}</Text> */}
              <Text>{totalCredit} USD</Text>
            </Col>
            <Col span={1} style={{background:"none", textAlign:"end"}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
          </Row>
          {/* //Row 2 */}
          <Row gutter={24 } >
          <Col span={2} style={{background:"none"}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
            <Col span={3} style={{background:"none"}}>
              {/* <Text>{totalCredit}</Text> */}
            </Col>
            <Col span={7} style={{background:"none"}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
            <Col span={4} style={{background:"none"}}>
              {/* <Text>{totalCredit}</Text> */}
            </Col>
            <Col span={4} style={{background:"none", textAlign:"end"}}>
              {/* <Text>{totalDebit}</Text> */}
              <Text>{totalConvertedDebit} GHS</Text>
            </Col>
            <Col span={4} style={{background:"none", textAlign:"end"}}>
              {/* <Text>{totalDebit}</Text> */}
              <Text>{symbol}{totalConvertedCredit} GHS</Text>
            </Col>
          </Row>
          
          {/* //Row 3 */}
          <Row gutter={24 } >
            <Col span={2} style={{background:"none"}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
            <Col span={3} style={{background:"none"}}>
              {/* <Text>{totalCredit}</Text> */}
            </Col>
            <Col span={7} style={{background:"none"}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
            <Col span={4} style={{background:"none"}}>
              {/* <Text>{totalCredit}</Text> */}
            </Col>
            <Col span={4} style={{background:"none", textAlign:"end"}}>
              {/* <Text>{totalDebit}</Text> */}
              <Text style={{fontWeight:"bold"}}>Balance</Text>
            </Col>
            <Col span={4} style={{background:"none", textAlign:"end"}}>
              {/* <Text>{totalDebit}</Text> */}
              <Text style={{fontWeight:"bold"}}>{symbol}{totalConvertedBalance} GHS</Text>
            </Col>
          </Row>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Text>
            {Taxes}
            </Text>
          </div>
          {/* <Row gutter={24}>
            <Col span={12}>{symbol}{totalConvertedDebit}</Col>
            <Col span={12}>{symbol}{totalConvertedCredit}</Col>
          </Row> */}
        </div>
        <Space style={{marginBottom: 16}}>
          {/* <Link to={'#'} > */}
          <button type='button' className='btn btn-primary me-3' onClick={addPayment}>
            <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
            Payment
          </button>
          {/* </Link> */}
        </Space>
        <Space style={{marginBottom: 16}}>
          <Link to={`#`}>
            <button type='button' className='btn btn-primary me-3' onClick={addDebit}>
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
              Debit Note
            </button>
          </Link>
        </Space>
        <Space style={{marginBottom: 16}}>
          <Link to={`#`}>
            <button type='button' className='btn btn-primary me-3' onClick={addCredit}>
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
              Credit Note
            </button>
          </Link>
        </Space>
        <Space style={{marginBottom: 16}}>
          <Link to={`#`}>
            <button type='button' className='btn btn-primary me-3'>
              {/* <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' /> */}
              Close
            </button>
          </Link>
        </Space>
        <Modal
          open={openPaymentModal}
          okText='Confirm'
          title='Add Payment'
          closable={true}
          onCancel={cancelBillModal}
          // onOk={handleOk}
          footer={null}
        >
          <Form form={paymentForm} onFinish={newPayment}>
            <Form.Item
              name={'timestamp'}
              label='Date'
              rules={[{required: true, message: 'Please enter a date'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input
                type='date'
                style={{width: '100%'}}
                //   disabled={!priceValue}
                //   onChange={onChangeForPrice}
              />
            </Form.Item>
            <Form.Item
              name={'description'}
              label='Description'
              rules={[{required: true, message: 'Please enter description'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input
                type='text'
                style={{width: '100%'}}
                //   disabled={!priceValue}
                //   onChange={onChangeForPrice}
              />
            </Form.Item>
            <Form.Item
              name={'credit'}
              label='Payment'
              rules={[{required: true, message: 'Please enter amount'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input
                type='number'
                style={{width: '100%'}}
                //   disabled={!priceValue}
                //   onChange={onChangeForPrice}
              />
            </Form.Item>
            <Form.Item
              name={'currency'}
              label='Currency'
              rules={[{required: true, message: 'Please select a currency'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <DropDownListComponent
                  id='currency'
                  placeholder='Currency'
                  data-name='currency'
                  className='e-field'
                  dataSource={currencydata?.data}
                  fields={{text: 'symbol', value: 'symbol'}}
                  // value={props && props.gameTypeId ? props.gameTypeId : null}
                  style={{width: '100%'}}
                />
            </Form.Item>
            <div style={{display: 'flex', justifyContent: 'end'}}>
              <Button key='cancel' onClick={cancelBillModal} className='me-3'>
                Cancel
              </Button>
              <Button key='confirm' type='primary' htmlType='submit'>
                Confirm
              </Button>
            </div>
          </Form>
        </Modal>
        <Modal
          open={openDebitModal}
          okText='Confirm'
          title='Add Debit Note'
          closable={true}
          onCancel={cancelBillModal}
          // onOk={handleOk}
          footer={null}
        >
          <Form form={debitForm} onFinish={newDebit}>
          <Form.Item
              name={'timestamp'}
              label='Date'
              rules={[{required: true, message: 'Please enter a date'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input
                type='date'
                style={{width: '100%'}}
                //   disabled={!priceValue}
                //   onChange={onChangeForPrice}
              />
            </Form.Item>
            <Form.Item
              name={'description'}
              label='Description'
              rules={[{required: true, message: 'Please enter description'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input
                type='text'
                style={{width: '100%'}}
                //   disabled={!priceValue}
                //   onChange={onChangeForPrice}
              />
            </Form.Item>
            <Form.Item
              name={'debit'}
              label='Payment'
              rules={[{required: true, message: 'Please enter amount'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input
                type='number'
                style={{width: '100%'}}
                //   disabled={!priceValue}
                //   onChange={onChangeForPrice}
              />
            </Form.Item>
            <Form.Item
              name={'currency'}
              label='Currency'
              rules={[{required: true, message: 'Please select a currency'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <DropDownListComponent
                  id='currency'
                  placeholder='Currency'
                  data-name='currency'
                  className='e-field'
                  dataSource={currencydata?.data}
                  fields={{text: 'symbol', value: 'symbol'}}
                  // value={props && props.gameTypeId ? props.gameTypeId : null}
                  style={{width: '100%'}}
                />
            </Form.Item>
            <div style={{display: 'flex', justifyContent: 'end'}}>
              <Button key='cancel' onClick={cancelBillModal} className='me-3'>
                Cancel
              </Button>
              <Button key='confirm' type='primary' htmlType='submit'>
                Confirm
              </Button>
            </div>
          </Form>
        </Modal>
        <Modal
          open={openCreditModal}
          okText='Confirm'
          title='Add Credit Note'
          closable={true}
          onCancel={cancelBillModal}
          // onOk={handleOk}
          footer={null}
        >
          <Form form={creditForm} onFinish={newCredit}>
          <Form.Item
              name={'timestamp'}
              label='Date'
              rules={[{required: true, message: 'Please enter a date'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input
                type='date'
                style={{width: '100%'}}
                //   disabled={!priceValue}
                //   onChange={onChangeForPrice}
              />
            </Form.Item>
            <Form.Item
              name={'description'}
              label='Description'
              rules={[{required: true, message: 'Please enter description'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input
                type='text'
                style={{width: '100%'}}
                //   disabled={!priceValue}
                //   onChange={onChangeForPrice}
              />
            </Form.Item>
            <Form.Item
              name={'credit'}
              label='Payment'
              rules={[{required: true, message: 'Please enter amount'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input
                type='number'
                style={{width: '100%'}}
                //   disabled={!priceValue}
                //   onChange={onChangeForPrice}
              />
            </Form.Item>
            <Form.Item
              name={'currency'}
              label='Currency'
              rules={[{required: true, message: 'Please select a currency'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <DropDownListComponent
                  id='currency'
                  placeholder='Currency'
                  data-name='currency'
                  className='e-field'
                  dataSource={currencydata?.data}
                  fields={{text: 'symbol', value: 'symbol'}}
                  // value={props && props.gameTypeId ? props.gameTypeId : null}
                  style={{width: '100%'}}
                />
            </Form.Item>
            <div style={{display: 'flex', justifyContent: 'end'}}>
              <Button key='cancel' onClick={cancelBillModal} className='me-3'>
                Cancel
              </Button>
              <Button key='confirm' type='primary' htmlType='submit'>
                Confirm
              </Button>
            </div>
          </Form>
        </Modal>
      </KTCardBody>
    </div>
  )
}

export {Billing}
