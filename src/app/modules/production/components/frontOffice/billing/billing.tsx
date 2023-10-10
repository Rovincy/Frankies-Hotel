import {Button, Form, Input, InputNumber, Modal, Space, Table, message,Typography, Row,Col} from 'antd'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {KTCardBody, KTSVG} from '../../../../../../_metronic/helpers'
import {BASE_URL} from '../../../urls'
import {Link, useParams} from 'react-router-dom'
// import { employeedata } from '../../../../../data/DummyData'
import {useQuery, useQueryClient,useMutation} from 'react-query'
import {Api_Endpoint, addGuestBilling, fetchCurrencies, fetchGuestBilling, fetchRooms} from '../../../../../services/ApiCalls'
import Checkbox from 'antd/es/checkbox/Checkbox'

const Billing = () => {
  const [gridData, setGridData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const [img, setImg] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openPaymentModal, setopenPaymentModal] = useState(false)
  const [openDebitModal, setopenDebitModal] = useState(false)
  const [openCreditModal, setopenCreditModal] = useState(false)
  const {mutate: guestBilling} = useMutation((values: any) => addGuestBilling(values))
  const {data: currencydata, isLoading: currencyLoad} = useQuery('currency', fetchCurrencies)
const { data: billingData, isLoading: billingLoad } = useQuery(
    'AllGuestBillings',
    () => fetchGuestBilling(parms['*']), // Pass the id as an argument
    {
    //   enabled: yourIdHere !== undefined, // You can enable or disable the query based on whether id is defined
    }
  );
  const [paymentForm] = Form.useForm()
  const [debitForm] = Form.useForm()
  const [creditForm] = Form.useForm()
  const queryClient = useQueryClient()
  const { Text } = Typography;
  const parms: any = useParams()

  var totalDebit = 0;
  var totalCredit = 0;
  var totalBalance = 0;
  billingData?.data.map((e: any) => {
    totalDebit = totalDebit + e.debit;
    totalCredit = totalCredit + e.credit;
});
totalBalance = totalCredit - totalDebit
  var totalConvertedDebit = 0;
  var totalConvertedCredit = 0;
  var totalConvertedBalance = 0;
  var symbol;
  currencydata?.data.map((e: any) => {
    totalConvertedDebit = totalDebit * e.rate
    totalConvertedCredit = totalCredit * e.rate
    symbol = e.symbol
    totalConvertedBalance = totalBalance * e.rate
    if(totalConvertedBalance<0){
        totalConvertedBalance = totalConvertedBalance *(-1)
    }
  });
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
          const response = await axios.delete(`${BASE_URL}/Billing/id?id=`+element)
      // update the local state so that react can refecth and re-render the table with the new data
      // const newData = gridData.filter((item: any) => item.id !== element.id)
      // setGridData(newData)
      if (response.status==200) {
        message.success("Transaction deleted successfully")
        queryClient.invalidateQueries('AllGuestBillings')
      }else{
        message.success("Transaction deletion failed")
      }
      return response.status
      },
    })
  }
  const newPayment = (value:any) => {
    // console.log("Hello")
    value.customerId= parms['*']
    console.log(value)

    guestBilling(value, {
        onSuccess: () => {
          message.success('Transaction made successfully!');
          setopenPaymentModal(false)
          paymentForm.resetFields()
          queryClient.invalidateQueries('AllGuestBillings')
        },
        onError(error, variables, context) {
          message.destroy('Error occurred while submitting payment');
        },
      });
  }
  const newDebit = (value:any) => {
    // console.log("Hello")
    value.customerId= parms['*']
    console.log(value)

    guestBilling(value, {
        onSuccess: () => {
          message.success('Transaction made successfully!');
          setopenDebitModal(false)
          debitForm.resetFields()
          queryClient.invalidateQueries('AllGuestBillings')
        },
        onError(error, variables, context) {
          message.destroy('Error occurred while submitting payment');
        },
      });
  }
  const newCredit = (value:any) => {
    // console.log("Hello")
    value.customerId= parms['*']
    console.log(value)

    guestBilling(value, {
        onSuccess: () => {
          message.success('Transaction made successfully!');
          setopenCreditModal(false)
          creditForm.resetFields()
          queryClient.invalidateQueries('AllGuestBillings')
        },
        onError(error, variables, context) {
          message.destroy('Error occurred while submitting payment');
        },
      });
  }

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
      title: 'CustomerId',
      dataIndex: 'customerId',
      sorter: (a: any, b: any) => {
        if (a.customerId > b.customerId) {
          return 1
        }
        if (b.customerId > a.customerId) {
          return -1
        }
        return 0
      },
    },

    {
      title: 'RoomId',
      dataIndex: 'roomId',
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

    {
      title: 'Action',
      fixed: 'right',
      width: 20,
      render: (_: any, record: any) => (
        <Space size='middle'>
          {/* <Link to={`/employee-edit-form/${record.id}`}>
          <span className='btn btn-light-info btn-sm delete-button' style={{ backgroundColor: 'blue', color: 'white' }}>Rooms</span>
          </Link> */}
          {/* <Link to={`/rooms/${parms.id}`} state={record.id}> */}
          <Link to='#'>
          <a
            href='#'
            className='btn btn-light-danger btn-sm'
            onClick={() => deleteData(record.id)}
          >
            Delete
          </a>
            {/* <span
              className='btn btn-light-info btn-sm delete-button'
              style={{backgroundColor: 'red', color: 'white'}}
            >
              Delete
            </span> */}
          </Link>
        </Space>
      ),
    },
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

  gridData.forEach(function (row: any) {
    if (out_data[row.departmentId]) {
      out_data[row.departmentId].push(row)
    } else {
      out_data[row.departmentId] = [row]
    }
  })

  const dataWithIndex = gridData.map((item: any, index: any) => ({
    ...item,
    key: index,
  }))

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
        <div className='table-responsive'>
        {/* <Link to='/roomType'>
                <a
                  style={{fontSize: '16px', fontWeight: '500'}}
                  className='mb-7 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary'
                >
                  Back to room type
                </a>
              </Link> */}
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
            dataSource={billingData?.data}
            loading={billingLoad}
            className='table-responsive'
          />
        </div>
        <div style={{justifyContent: 'end',paddingInline:"20%"}}>
        <Row gutter={24} style={{justifyContent:"flex-end"}}>
  <Col span={12}>
   Col 1
  </Col>
  <Col span={12}>
     Col 2
  </Col>
</Row>
<Row gutter={24} style={{justifyContent:"flex-end"}}>
  <Col span={12}>
    Col 1
  </Col>
  <Col span={12}>
     Col 2
  </Col>
</Row>
        </div>
        <Space style={{marginBottom: 16}}>
        {/* <Link to={'#'} > */}
                <button type='button' className='btn btn-primary me-3'onClick={addPayment}>
                  <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                  Payment
                </button>
              {/* </Link> */}
            </Space>
        <Space style={{marginBottom: 16,}}>
        <Link to={`#`}>
                <button type='button' className='btn btn-primary me-3'onClick={addDebit}>
                  <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                  Debit Note
                </button>
              </Link>
            </Space>
        <Space style={{marginBottom: 16}}>
        <Link to={`#`}>
                <button type='button' className='btn btn-primary me-3'onClick={addCredit}>
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
              <div style={{display: 'flex', justifyContent: 'end'}}>
              <Button key="cancel" onClick={cancelBillModal}>
            Cancel
          </Button>
          <Button key="confirm" type="primary" htmlType="submit">
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
              <div style={{display: 'flex', justifyContent: 'end'}}>
              <Button key="cancel" onClick={cancelBillModal}>
            Cancel
          </Button>
          <Button key="confirm" type="primary" htmlType="submit">
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
              <div style={{display: 'flex', justifyContent: 'end'}}>
              <Button key="cancel" onClick={cancelBillModal}>
            Cancel
          </Button>
          <Button key="confirm" type="primary" htmlType="submit">
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
