import {
  Button,
  Form,
  Input,
  Select,
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
import {KTCardBody, KTSVG, toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {BASE_URL} from '../../../urls'
import {Link, useLocation, useNavigate,useParams} from 'react-router-dom'
// import { employeedata } from '../../../../../data/DummyData'
import {useQuery, useQueryClient, useMutation} from 'react-query'
import {
  Api_Endpoint,
  GuestCheckoutApi,
  addGuestBilling,
  fetchActivePaymentMethods,
  fetchCompanies,
  fetchCurrencies,
  fetchGuestBilling,
  fetchGuests,
  fetchNationalities,
  fetchPaymentMethods,
  fetchPaymentNotes,
  fetchRooms,
  fetchTaxes,
  makeGuestBillingTransfer,
} from '../../../../../services/ApiCalls'
import Checkbox from 'antd/es/checkbox/Checkbox'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'
import { useAuth } from '../../../../auth'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment'
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
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false)
  const [isCompaniesDropdownOpen, setIsCompaniesDropdownOpen] = useState(false)
  const [openPaymentModal, setopenPaymentModal] = useState(false)
  const [openReceiptModal, setopenReceiptModal] = useState(false)
  const [openDebitModal, setopenDebitModal] = useState(false)
  const [openCreditModal, setopenCreditModal] = useState(false)
  const [openTransferModal, setopenTransferModal] = useState(false)
  const [serviceType, setServiceType] = useState("ALL_CHARGES")
  const {mutate: guestBilling} = useMutation((values: any) => addGuestBilling(values))
  const {mutate: guestBillingTransfer} = useMutation((values: any) => makeGuestBillingTransfer(values))
  const {data: currencydata, isLoading: currencyLoad} = useQuery('currency', fetchCurrencies)
  const {data: paymentNotedata, isLoading: paymentNoteLoad} = useQuery('paymentNote', fetchPaymentNotes)
  const {data: companiesdata, isLoading: companiesLoad} = useQuery('companies', fetchCompanies)
  const {data: activePaymentMethoddata, isLoading: activePaymentMethodLoad} = useQuery('paymentMethod', fetchActivePaymentMethods)
  const {data: roomsdata, isLoading: roomsLoad} = useQuery('rooms', fetchRooms)
  const {data: guestdata, isLoading: guestLoad} = useQuery('guests', fetchGuests)
  const {data: taxdata, isLoading: taxLoad} = useQuery('tax', fetchTaxes)
  const {data: nationalityData, isLoading: nationalityLoad} = useQuery('nationalities', fetchNationalities)
  const {mutate: checkGuestOutQuery} = useMutation((values: any) => GuestCheckoutApi(values))
  const parms: any = useParams()
  const {data: billingData, isLoading: billingLoad, refetch: refetchBillingData} = useQuery(
    ['AllGuestBillings', parms['*']],
    () => fetchGuestBilling(parms['*'],isCompaniesDropdownOpen,serviceType),
  )
  const {currentUser} = useAuth()
  const [customerForm] = Form.useForm()
  const [paymentForm] = Form.useForm()
  const [debitForm] = Form.useForm()
  const [creditForm] = Form.useForm()
  const queryClient = useQueryClient()
  const {Text} = Typography
  const parms2: any = useParams()
  const navigate = useNavigate();
  const location = useLocation()

  const [isNonTaxable, checkIfTaxable] = useState(false)
  
  // let userData : any = location?.state
  let userData: any = location?.state || {};
  // var serviceType = "ALL_CHARGES";
  // console.log('userData: ',userData)
  // console.log('userData: ',userData.guest)
//   const guest = guestdata?.data.find((e:any)=>{
//     return e?.id===parseInt(parms['*'])
//   })
  
  // console.log("guest:", guest)
  // console.log("defaultSelect:", defaultSelect)
//   const[defaultSelect, setDefaultSelect] = useState<any>({
//     value: parms['*'],
//     label:`${guest?.firstname?.trim()} ${guest?.lastname?.trim()}`
//   })

//   const handleChangeId = (selectedOption:any ) => {
//     setDefaultSelect(selectedOption)
//     setNewCustomData(selectedOption['id'])
//     queryClient.invalidateQueries('AllGuestBillings')
//     navigate(`/Billing/${selectedOption['id']}`, {replace: true})
//     // setLineManagerId(selectedOption?.value)
//   };
  var totalDebit = 0
  var totalCredit = 0
  var totalBalance = 0
  var taxedBalance = 0

  totalBalance = totalCredit - totalDebit
  var totalConvertedDebit = 0
  var totalConvertedCredit = 0
  var totalConvertedBalance
  var convertedTaxedBalance = 0
  // var totalWithholdingTax = totalConvertedDebit - totalConvertedDebit * 7/100
  var symbol
  var salesAmount : any
  var subTotal =0
  var finalSubTotal =0

  //LocalRate
  var localRate =0
  
  //
  // totalDebit = totalDebit + newDebit
  // totalCredit = totalCredit + newCredit
  currencydata?.data.map((cc: any) => {
    // console.log(cc.symbol?.trim()==="GHS".trim())
    // console.log(cc.symbol?.trim())
    if (cc.symbol?.trim()==="GHS") {
      localRate = cc.rate
    }})

    companiesdata?.data.map((a:any)=>{
      if(a.id===parms['*']){
        // console.log("a:",a['nonTaxable'])
        // console.log("a:",a)
      }
    })

  var newBillingData = billingData?.data.map((b: any,index:any) => {
    var newCredit
    var newDebit
    var rate
    var amount
    var room
    var date = new Date(b.timestamp)
    // console.log(currencydata?.data)
    // console.log(companiesdata?.data)
    currencydata?.data.map((c: any) => {
      
      // console.log('localRate: ',localRate)
      // console.log('c.symbol?.trim():',c.symbol?.trim())
      // console.log("b.currency: ",b.currency)
      // var trimmedSym= c.symbol?.trim()
      // var trimmedCur=b.currency
      // console.log('c.symbol?.trim()===b.currency:',c.symbol?.trim()===b.currency)
      // console.log('b.currency:',b.currency)
      // console.log('index:',index+1)
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
  totalConvertedBalance= parseFloat((parseFloat(totalBalance.toFixed(2)) * localRate).toFixed(2))<0?`(${Intl.NumberFormat('en-US', {
    currency: 'USD', // Change to your desired currency code
  }).format(parseFloat((parseFloat(totalBalance.toFixed(2)) * localRate).toFixed(2))*(-1))})`:Intl.NumberFormat('en-US', {
    currency: 'USD', // Change to your desired currency code
  }).format(parseFloat((parseFloat(totalBalance.toFixed(2)) * localRate).toFixed(2)))
  // totalConvertedBalance= parseFloat((parseFloat(totalBalance.toFixed(2)) * localRate).toFixed(2))<0?`(${parseFloat((parseFloat(totalBalance.toFixed(2)) * localRate).toFixed(2))*(-1)})`:parseFloat((parseFloat(totalBalance.toFixed(2)) * localRate).toFixed(2))
  convertedTaxedBalance = parseFloat((parseFloat(taxedBalance.toFixed(2)) * localRate).toFixed(2))
  // console.log('convertedTaxedBalance1: ',convertedTaxedBalance)
  // console.log('localRate',localRate)
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
  // console.log('taxdata?.data: ',taxdata?.data)
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
const VAT_Taxes = taxdata?.data.map((item: any, index: number) => {
  if(convertedTaxedBalance<0){
    convertedTaxedBalance = convertedTaxedBalance * (-1)
  }
  // // Check the condition for each item
   if(item.isLevy === null || item.isLevy === false){
    // Calculate VAT for the item with its individual rate
     vat = (convertedTaxedBalance * item.rate) / (100 + item.rate);

    return (
      <div key={index} style={{ textAlign: 'right', marginRight: '65px' }}>
        <p>
          {item.name}: GHS {Intl.NumberFormat('en-US', {
            currency: 'USD', // Change to your desired currency code
          }).format(vat)}
        </p>
      </div>
    );
  }
});
const LEVY_Taxes = taxdata?.data.map((item: any, index: number) => {
  if(convertedTaxedBalance<0){
    convertedTaxedBalance = convertedTaxedBalance * (-1)
  }
  // Check the condition for each item
   if (item.isLevy === true){
    salesAmount = ((convertedTaxedBalance-vat)/107)*100
    const levy = (salesAmount * item.rate) / (100);
    subTotal = subTotal + levy
    finalSubTotal = salesAmount + subTotal
    return (
      <div key={index} style={{ textAlign: 'right', marginRight: '65px' }}>
        <p>
          {item.name}: GHS {Intl.NumberFormat('en-US', {
            currency: 'USD', // Change to your desired currency code
          }).format(levy)}
        </p>
      </div>
    );
  }
});

  var guestListData = guestdata?.data.map((e:any)=>{
    return {
      // value: e.id,
      // label: `${e.firstname?.trim()} ${e.lastname?.trim()}`,
      id: e.id,
      name: `${e.firstname?.trim()} ${e.lastname?.trim()}`
    }
  })

//   const customOptions = guestListData?.map((item: any) => ({
//     value: item.id,
//     label: item.firstName + ' ' + item.lastName
//   }))
  

  // console.log('totalBalance:',totalBalance);
  // console.log('newBillingData:',newBillingData);
  // currencydata?.data.map((c: any) =>{
    // console.log('newBillingData[debit]:',newBillingData.debit);
    // console.log('currency:',c.symbol);
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

    // console.log(parms)
    // console.log(roomsdata?.data?.filter((rooms: any)=>rooms.typeId===parms.id))
    // console.log(roomsdata?.data?.filter((rooms: any)=>rooms?.typeId===1))
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handlePrint = () => {
    console.log('Print called')
    // Open the browser's print dialog
    window.print();
  };
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
  const newBillTransfer = (value: any) => {
    // console.log("Hello")
    value.customerId = parms['*']
    // value.isPayment = true
    // console.log(value)

    guestBillingTransfer(value, {
      onSuccess: () => {
        message.success('Transfermade successfully!')
        setopenTransferModal(false)
        paymentForm.resetFields()
        queryClient.invalidateQueries('AllGuestBillings')
        queryClient.invalidateQueries('paymentMethod')
      },
      onError(error, variables, context) {
        message.destroy('Error occurred while submitting payment')
      },
    })
  }
  const newPayment = (value: any) => {
    // console.log("Hello")
    value.customerId = parms['*']
    value.isPayment = true
    // console.log(value)

    guestBilling(value, {
      onSuccess: () => {
        message.success('Transaction made successfully!')
        setopenPaymentModal(false)
        paymentForm.resetFields()
        queryClient.invalidateQueries('AllGuestBillings')
        queryClient.invalidateQueries('paymentMethod')
      },
      onError(error, variables, context) {
        message.destroy('Error occurred while submitting payment')
      },
    })
  }
  const newDebit = (value: any) => {
    // console.log("Hello")
    value.customerId = parms['*']
    console.log(value)

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
    setNewCustomData(value['value'])
    queryClient.invalidateQueries('AllGuestBillings')
    navigate(`/Billing/${value['value']}`, {replace: true})
  }
  // useEffect(()=>{
  // },)
  useEffect(()=>{
    // parms['*'] = customData

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
        // console.log(error)
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
  const settleRemainingBalance = ()=>{
    message.warning("Please settle remaining amount before proceeding")
  }
  const checkGuestOut = (value:any) => {
    // if (guestData.checkInTime === null) {
    //   message.info('Please, check In before you check out!')
    //   return
    // }
    var guestData = {
      'id':parms2['*'],
      'isCorporate':isCompaniesDropdownOpen
    }
    // console.log(value)
    // console.log("Hello World")
    // console.log(guestData)
    // console.log(parms['*'])
    // console.log(customData)
    // console.log(parms2)

    // Modal.confirm({
    //   okText: 'Confirm',
    //   okType: 'primary',
    //   title: 'Kindly confirm check-out!',
    //   onOk: () => {
        checkGuestOutQuery(guestData, {
          onSuccess: () => {
            message.success('Guest successfully ckecked out!')
            // window.print()
            queryClient.invalidateQueries('currency')
            queryClient.invalidateQueries('rooms')
            queryClient.invalidateQueries('guests')
            queryClient.invalidateQueries('tax')
          },
        })
    //   },
    // })
  }
  const printOut = (value:any) => {
            window.print()
  }
  const goBack = (value:any) => {
    // console.log("This")
    // history.goBack();
    navigate(-1);
  }

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
    setopenReceiptModal(false)
    setopenPaymentModal(false)
    setopenDebitModal(false)
    setopenCreditModal(false)
    setopenTransferModal(false)
  }
  const showReceipt = () => {
    setopenReceiptModal(true)
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
  const billTransfer = () => {
    setopenTransferModal(true)
  }

  const handleLedgerTypeChange = (e:any) => {
    // const selectedValue = e;
    const selectedValue = e.target.value;
    // console.log('Selected value:', selectedValue);
    if(selectedValue==="GUEST"){
      setIsGuestDropdownOpen(true)
      setIsCompaniesDropdownOpen(false)
    }else{
      setIsCompaniesDropdownOpen(true)
      setIsGuestDropdownOpen(false)
    }
    // Add any other logic you want to perform on change
  };
  const handleServiceTypeChange = (e:any) => {
    // console.log('Selected value:', e);
    const selectedValue = e;
    // console.log('Selected value:', selectedValue);
    // if(selectedValue==="ALL_CHARGES"){
      // serviceType = "ALL_CHARGES"
      setServiceType(selectedValue)
      // setIsGuestDropdownOpen(true)
      // setIsCompaniesDropdownOpen(false)
    // }else if(selectedValue==="ROOMS_ONLY"){
    //   // serviceType = "ROOMS_ONLY"
    //   setServiceType(selectedValue)
    //   // setIsCompaniesDropdownOpen(true)
    //   // setIsGuestDropdownOpen(false)
    //   // newBillingData = newBillingData.filter((e:any) => e.description === 'Test Payment');
      // console.log("Filtered Data:", filteredData);
    // }else{
    //   // serviceType = "SERVICES_ONLY"
    //   setServiceType(selectedValue)
    // }
    // console.log("new newBillingData: ",newBillingData)
    // Add any other logic you want to perform on change
  };

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
              
        <div>
              <Form form={customerForm}>
              <Form.Item
                name={'ledgerType'}
                // label='Customer'
                rules={[{required: true, message: 'Please select a ledger type'}]}
                hasFeedback
                style={{width: '10%'}}
                labelCol={{span: 2}}
              >
                <select
                    // {...register('account')}
                    className='form-select form-select-solid'
                    aria-label='Select example'
                    onChange={(e) => handleLedgerTypeChange(e)}
                    >
                    <Select.Option>select </Select.Option>
                    <option value='GUEST'>GUEST</option>
                    <option value='CORPORATE'>CORPORATE</option>
                 </select>
              </Form.Item>
            </Form>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {isCompaniesDropdownOpen===true?<div>
              {Object.keys(userData).length > 0?<p style={{fontWeight:"bold"}}>{userData?.guest}</p>:(<Form form={customerForm}>
              <Form.Item
                name={'guestId'}
                // label='Customer'
                rules={[{required: true, message: 'Please select a company'}]}
                hasFeedback
                style={{width: '100%'}}
                labelCol={{span: 5}}
              >
                <DropDownListComponent
                  id='company'
                  placeholder='Company'
                  data-name='company'
                  className='e-field'
                  dataSource={companiesdata?.data}
                  allowFiltering={true}
                  // value={9}
                  fields={{text: 'name', value: 'id'}}
                  onChange={custForm}
                  style={{width: '100%'}}
                />
              </Form.Item>
            </Form>)}
              </div>:<div>
              {Object.keys(userData).length > 0?<p style={{fontWeight:"bold"}}>{userData?.guest}</p>:(<Form form={customerForm}>
              <Form.Item
                name={'guestId'}
                // label='Customer'
                rules={[{required: true, message: 'Please select a guest'}]}
                hasFeedback
                style={{width: '250%'}}
                labelCol={{span: 5}}
              >
                <DropDownListComponent
                  id='guest'
                  placeholder='Guest'
                  data-name='guest'
                  className='e-field'
                  dataSource={guestListData}
                  allowFiltering={true}
                  fields={{text: 'name', value: 'id'}}
                  onChange={custForm}
                />
              </Form.Item>
            </Form>)}
              </div>}
              <div>
              <Form form={customerForm}>
              <Form.Item
                name={'serviceType'}
                // label='Customer'
                rules={[{required: true, message: 'Please select a service type'}]}
                hasFeedback
                style={{width: '100%'}}
                labelCol={{span: 5}}
              >
                <Select
                    // {...register('account')}
                    mode="multiple"
                    className='form-select form-select-solid'
                    aria-label='Select example'
                    onChange={(e) => handleServiceTypeChange(e)}>
                    <Select.Option>select </Select.Option>
                    <option value='ALL_CHARGES'>ALL CHARGES</option>
                    <option value='ROOMS_ONLY'>ROOM ONLY</option>
                    <option value='SERVICES_ONLY'>SERVICES ONLY</option>
                    <option value='DEBIT_NOTES'>DEBIT NOTES</option>
                    <option value='CREDIT_NOTES'>CREDIT NOTES</option>
                </Select>
              </Form.Item>
            </Form>
              </div>
          
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
            // dataSource={newBillingData?.filter((e:any) => e.description.includes("Accommodation for Room"))}
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
              <Text>USD {Intl.NumberFormat('en-US', {
    currency: 'USD', // Change to your desired currency code
  }).format(totalDebit)}</Text>
            </Col>
            <Col span={3} style={{background:"none", textAlign:"end"}}>
              {/* <Text>{totalDebit}</Text> */}
              <Text>USD {Intl.NumberFormat('en-US', {
    currency: 'USD', // Change to your desired currency code
  }).format(totalCredit)}</Text>
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
              <Text>GHS {Intl.NumberFormat('en-US', {
    currency: 'USD', // Change to your desired currency code
  }).format(totalConvertedDebit)}</Text>
            </Col>
            <Col span={3} style={{background:"none", textAlign:"end"}}>
              {/* <Text>{totalDebit}</Text> */}
              <Text>GHS {Intl.NumberFormat('en-US', {
    currency: 'USD', // Change to your desired currency code
  }).format(totalConvertedCredit)}</Text>
            </Col>
            <Col span={1} style={{background:"none", textAlign:"end"}}>
              {/* <Text>{totalDebit}</Text> */}
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
            <Col span={3} style={{background:"none", textAlign:"end"}}>
              {/* <Text>{totalDebit}</Text> */}
              <Text style={{fontWeight:"bold"}}>GHS {totalConvertedBalance}</Text>
            </Col>
            <Col span={1} style={{background:"none", textAlign:"end"}}>
              {/* <Text>{totalDebit}</Text> */}
            </Col>
          </Row>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Text style={{ textAlign: 'right', marginRight: '65px', marginTop:'10px' }}>
            SALES AMOUNT: GHS {Intl.NumberFormat('en-US', {
    currency: 'USD', // Change to your desired currency code
  }).format(salesAmount)}
            </Text>
            <Text>
            {LEVY_Taxes}
            </Text>
            <Text style={{ textAlign: 'right', marginRight: '65px' }}>
            SUB-TOTAL: GHS {Intl.NumberFormat('en-US', {
    currency: 'USD', // Change to your desired currency code
  }).format(salesAmount+subTotal)}
            </Text>
            <Text>
            {VAT_Taxes}
            </Text>
            <Text style={{ textAlign: 'right', marginRight: '65px', fontWeight:'bold' }}>
            GRAND TOTAL: GHS {Intl.NumberFormat('en-US', {
            currency: 'USD', // Change to your desired currency code
          }).format(totalConvertedDebit)}
            </Text>
            {isCompaniesDropdownOpen===true?<Text style={{ textAlign: 'right', marginRight: '65px', fontWeight:'bold' }}>
            WITHHOLDING TAX: GHS {Intl.NumberFormat('en-US', {
            currency: 'USD', // Change to your desired currency code
          }).format(totalConvertedDebit - totalConvertedDebit * 7/100)}
            </Text>:null}
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
            <button type='button' className='btn btn-primary me-3' onClick={billTransfer}>
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
              Transfer
            </button>
          </Link>
        </Space>
        <Space style={{marginBottom: 16}}>
        <Link to={`/ReceiptReport`}>
            <button type='button' className='btn btn-primary me-3'>
              Receipt
            </button>
            {/* <h2><span className="bullet me-5"></span><Link to="/ReceiptReport">Receipt</Link></h2> */}
          </Link>
        </Space>
        <Space style={{marginBottom: 16}}>
        <Link to={`#`}>
            <button type='button' className='btn btn-primary me-3' onClick={goBack}>
              {/* <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' /> */}
              Close
            </button>
          </Link>
        </Space>
        <Space style={{marginBottom: 16, paddingInlineStart:'40%'}}>
        {currentUser?.role.toString().toLocaleLowerCase()==="Manager".toLowerCase()?null:(<Link to={`#`}>
            <button type='button' className='btn btn-danger me-3' onClick={(totalConvertedCredit-totalConvertedDebit)<0?settleRemainingBalance:checkGuestOut}>
              {/* <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' /> */}
              Check Out
            </button>
          </Link>)}
          {/* <a
            href='#'
            className='btn btn-primary me-3'
            onClick={() =>
              checkGuestOut()
            }
          >
            Close
          </a> */}
          {/* <Link to={`#`}>
            <button type='button' className='btn btn-primary me-3'>
              Close
            </button>
          </Link> */}
        </Space>
        {/* Receipt */}
        {/* <Modal
  open={openReceiptModal}
  okText="Confirm"
  title="Receipt"
  closable={true}
  width={'80%'}
  bodyStyle={{ height: '100%' }}
  onCancel={cancelBillModal}
  footer={null}
>
  <style>
    {`
      @media print {
        body * {
          visibility: hidden;
        }

        .row-printable,
        .row-printable * {
          visibility: visible;
          overflow: hidden;
          page-break-inside: avoid;
        }

        .modal-dialog {
          max-width: 100%;
          width: 100%;
          page-break-inside: avoid;
        }

        body {
          overflow: hidden;
        }
      }
    `}
  </style>

  <div>
    <div className="container bootdey">
      <div className="row invoice row-printable">
        <div className="col-md-12">
          <div className="panel panel-default plain" id="dash_0">
            <div className="panel-body p30">
              <div className="row">
                <div className="col-lg-6">
                  <div className="invoice-logo">
                    <img width="100" src={toAbsoluteUrl('/media/logos/frankiesHotel.png')} alt="Invoice logo" />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="invoice-from">
                    <ul className="list-unstyled text-right" style={{ textAlign: 'end' }}>
                      <li>Oxford Street, Osu-Accra</li>
                      <li>Box CT 4499, Cantoments - Accra, Ghana</li>
                      <li>+233 302 773567 / +233 24 968 0000</li>
                      <li>info@frankieshotel.com | reserve@frankieshotel.com</li>
                      <li>www.frankieshotel.com</li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="invoice-details mt25">
                    <div className="well">
                      <ul className="list-unstyled mb0">
                        <li>
                          <strong>Invoice Date:</strong> {new Date().toDateString()}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="invoice-to mt25">
                    <ul className="list-unstyled">
                      <li>
                        <strong>Invoiced To</strong>
                      </li>
                      
                      <li>
                      {guestdata?.data.map((item:any)=>{
                        if(item.id===parseInt(parms['*'])){
                        return (<div  style={{ textAlign: 'left', marginRight: '50px' }} className="printable-content">
                          <li>{`${item.firstname} ${item.lastname}`}</li>
                      <li>{item.email}</li>
                      <li>{item.phoneNumber}</li>
                      <li>{nationalityData?.data.map((nationality:any)=>{
                        // console.log(nationality);
                        if(nationality.id===item.nationalityId){
                        return (<div  style={{ textAlign: 'left', marginRight: '50px' }} className="printable-content">
                      <li>{nationality.name}</li>
                        </div>);
                          }else{
                            return (<div></div>);
                          }})}</li>
                        </div>);
                          }else{
                            return (<div></div>);
                          }})}
                      </li>
                    </ul>
                  </div>
                  <div className="invoice-items">
                    <div className="table-responsive" tabIndex={0}>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th className="per3 text-left">Date</th>
                            <th className="per72 text-left">Description</th>
                            <th className="per25 text-center">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="printable-content">
                              {newBillingData?.map((item: any, index: number) => {
                                const originalDate = moment(item.date, 'dddd, MMMM D, YYYY [at] HH:mm');
                                const formattedDate = `${originalDate.date()}/${originalDate.month() + 1}/${originalDate.year()}`;
                                return (
                                  <div key={index} style={{ textAlign: 'left', marginRight: '50px' }} className="printable-content">
                                    {formattedDate}
                                  </div>
                                );
                              })}
                            </td>
                            <td className="printable-content">
                              {newBillingData?.map((item: any, index: number) => {
                                return (
                                  <div key={index} style={{ textAlign: 'left', marginRight: '50px' }} className="printable-content">
                                    {item.description}
                                  </div>
                                );
                              })}
                            </td>
                            <td className="printable-content">
                              {newBillingData?.map((item: any, index: number) => {
                                return (
                                  <div key={index} style={{ textAlign: 'right', marginRight: '50px' }} className="printable-content">
                                    USD {Intl.NumberFormat('en-US', {
                                      currency: 'USD',
                                    }).format((parseFloat(item.debit) || 0) + (parseFloat(item.credit) || 0))}
                                  </div>
                                );
                              })}
                            </td>
                          </tr>
                        </tbody>
                        <tfoot  style={{textAlign:'end'}}>
                                        <tr>
                                            <th colSpan={2} style={{fontWeight:'bold'}} className="text-right"></th>
                                            <th colSpan={2} style={{fontWeight:'bold'}} className="text-center">
                                            USD {Intl.NumberFormat('en-US', {
                                              currency: 'USD', // Change to your desired currency code
                                            }).format(totalDebit+totalCredit)}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th colSpan={2} style={{fontWeight:'bold'}} className="text-right"></th>
                                            <th colSpan={2} style={{fontWeight:'bold'}} className="text-center">
                                            GHS {Intl.NumberFormat('en-US', {
                                              currency: 'USD', // Change to your desired currency code
                                            }).format(totalConvertedDebit+totalConvertedCredit)}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th colSpan={2} style={{fontWeight:'bold'}} className="text-right">BALANCE:</th>
                                            <th style={{fontWeight:'bold'}} className="text-center">
                                            GHS {totalConvertedBalance}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th colSpan={2} className="text-right">SALES AMOUNT: </th>
                                            <th className="text-center">
                                              GHS {Intl.NumberFormat('en-US', {
                                              currency: 'USD', // Change to your desired currency code
                                            }).format(salesAmount)}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th colSpan={2} className="text-right">
                                              </th>
                                            <th className="text-center">
                                            </th>
                                        </tr>
                                        <tr>
                                            <th colSpan={2} className="text-right">
                                              {taxdata?.data.map((item: any, index: number) => {
                                                // Check the condition for each item
                                                if (item.isLevy === true) {
                                                  return (
                                                    <div >
                                                        {item.name}:
                                                    </div>
                                                  );
                                                }
                                              })}
                                            </th>
                                            <th colSpan={2} className="text-right">
                                              {taxdata?.data.map((item: any, index: number) => {
                                                if (convertedTaxedBalance < 0) {
                                                  convertedTaxedBalance = convertedTaxedBalance * (-1);
                                                }
                                                // Check the condition for each item
                                                if (item.isLevy === true) {
                                                  salesAmount = ((convertedTaxedBalance - vat) / 107) * 100;
                                                  const levy = (salesAmount * item.rate) / 100;
                                                  subTotal = subTotal + levy;
                                                  return (
                                                    <div key={index} style={{ textAlign: 'right', marginRight: '50px'}}>
                                                      
                                                        GHS {Intl.NumberFormat('en-US', {
                                                          currency: 'USD',
                                                        }).format(levy)}
                                                    </div>
                                                  );
                                                }
                                              })}
                                              </th>
                                          </tr>

                                        <tr>
                                            <th colSpan={2} className="text-right">SUB-TOTAL:</th>
                                            <th className="text-center">GHS {Intl.NumberFormat('en-US', {
                                          currency: 'USD', // Change to your desired currency code
                                        }).format(finalSubTotal)}
                                        </th>
                                        </tr>
                                        <tr>
                                            <th colSpan={2} className="text-right">
                                              {taxdata?.data.map((item: any, index: number) => {
                                                if(item.isLevy === null || item.isLevy === false){
                                                  return (
                                                    <div >
                                                        {item.name}:
                                                    </div>
                                                  );
                                                }
                                              })}
                                            </th>
                                            <th colSpan={2} className="text-right">
                                              {taxdata?.data.map((item: any, index: number) => {
                                                if (convertedTaxedBalance < 0) {
                                                  convertedTaxedBalance = convertedTaxedBalance * (-1);
                                                }
                                                // Check the condition for each item
                                                if(item.isLevy === null || item.isLevy === false){
                                                  // Calculate VAT for the item with its individual rate
                                                   vat = (convertedTaxedBalance * item.rate) / (100 + item.rate);
                                                  return (
                                                    <div key={index} style={{ textAlign: 'right', marginRight: '50px'}}>
                                                      
                                                        GHS {Intl.NumberFormat('en-US', {
                                                          currency: 'USD',
                                                        }).format(vat)}
                                                    </div>
                                                  );
                                                }
                                              
                                              </th>
                                          </tr>

                                        <tr style={{fontWeight:'bold'}}>
                                            <th colSpan={2} className="text-right">GRAND TOTAL:</th>
                                            <th className="text-center">GHS {Intl.NumberFormat('en-US', {
                                          currency: 'USD', // Change to your desired currency code
                                        }).format(totalConvertedDebit)}
                                        </th>
                                        </tr>
                                    </tfoot>
                      </table>
                    </div>
                  </div>
                  <div className="invoice-footer">
                    <p className="text-center" style={{ fontWeight: 'bold', marginBottom: '1px', fontSize:'13px' }}>
                      Thank you for your stay with us. Please visit us again.
                    </p>
                    <p className="text-left" style={{ marginBottom: '1px', fontSize:'13px' }}>
                      NOTICE TO GUESTS: This property is privately owned, and the management reserves the right to refuse service to anyone.
                    </p>
                    <p className="text-left" style={{ marginBottom: '1px', fontSize:'13px' }}>
                      Management will not be responsible for any items left in the room.
                    </p>
                  </div>
                  <div className="invoice-footer">
                    <p className="text-left" style={{ fontWeight: 'bold', marginBottom: '1px',marginTop:'20px', fontSize:'13px' }}>
                    BANK DETAILS
                    </p>
                    <p className="text-left" style={{ marginBottom: '1px', fontSize:'13px' }}>
                    Frankies Foods and Rooms Limited
                    </p>
                    <p className="text-left" style={{ marginBottom: '1px', fontSize:'13px' }}>
                    Bank Name: Cal Bank Ghana Limited
                    </p>
                    <p className="text-left" style={{ marginBottom: '1px', fontSize:'13px' }}>
                    Branch: Oxford Street Osu-Accra
                    </p>
                    <p className="text-left" style={{ marginBottom: '1px', fontSize:'13px' }}>
                    Account Number: 1400001614306
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div style={{ display: 'flex', justifyContent: 'end' }}>
    <Button key="cancel" onClick={cancelBillModal} className="me-3">
      Cancel
    </Button>
    <Button key="confirm" type="primary" onClick={handlePrint}>
      Print
    </Button>
  </div>
</Modal>; */}

        {/* Transfer */}
        <Modal
          open={openTransferModal}
          okText='Confirm'
          title='Transfer'
          closable={true}
          onCancel={cancelBillModal}
          // onOk={handleOk}
          footer={null}
        >
          <Form form={paymentForm} onFinish={newBillTransfer}
          layout='vertical'
          >
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
              name={'amount'}
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
              <Select
              id='currency'
              // name='currency'
              className='e-field'
              style={{ width: '100%' }}
              placeholder='Currency'
            >
              {currencydata?.data.map((item:any) => (
                <Select.Option key={item.symbol} value={item.symbol}>
                  {item.symbol}
                </Select.Option>
              ))}
            </Select>
              {/* <DropDownListComponent
                  id='currency'
                  placeholder='Currency'
                  data-name='currency'
                  className='e-field'
                  dataSource={currencydata?.data}
                  fields={{text: 'symbol', value: 'symbol'}}
                  // value={props && props.gameTypeId ? props.gameTypeId : null}
                  style={{width: '100%'}}
                /> */}
            </Form.Item>
            <Form.Item
              name={'receiverId'}
              label='Guest to transfer bill to'
              rules={[{required: true, message: 'Please select a guest'}]}
              hasFeedback
              // style={{width: '100%'}}
              // labelCol={{span: 5}}
            >
              {/* <Select
                  id='paymentMethod'
                  name='paymentMethod'
                  className='e-field'
                  style={{ width: '100%' }}
                >
                  <option value='' disabled selected>
                    paymentMethod
                  </option>
                  {activePaymentMethoddata?.data.map((item:any) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </Select> */}
                <Select
                  id='receiverId'
                  // name='paymentMethod'
                  className='e-field'
                  style={{ width: '100%' }}
                  placeholder='Guests'
                >
                  {guestdata?.data.map((item:any) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.firstname} {item.lastname}
                  </Select.Option>
                ))}
                              </Select>

              {/* <DropDownListComponent
                  id='paymentMethod'
                  placeholder='paymentMethod'
                  data-name='paymentMethod'
                  className='e-field'
                  dataSource={activePaymentMethoddata?.data}
                  fields={{text: 'name', value: 'name'}}
                  // value={props && props.gameTypeId ? props.gameTypeId : null}
                  style={{width: '100%'}}
                /> */}
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
        {/* Payment */}
        <Modal
          open={openPaymentModal}
          okText='Confirm'
          title='Add Payment'
          closable={true}
          onCancel={cancelBillModal}
          // onOk={handleOk}
          footer={null}
        >
          <Form form={paymentForm} onFinish={newPayment}
          layout='vertical'
          >
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
              name={'Note'}
              label='Note'
              rules={[{required: true, message: 'Please select a note'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Select
              id='currency'
              // name='currency'
              mode="multiple"
              className='e-field'
              style={{ width: '100%' }}
              placeholder='Notes'
            >
              {paymentNotedata?.data.map((item:any) => (
               item.isPayment?<Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>:''
              ))}
            </Select>
            </Form.Item>
            <Form.Item
              name={'credit'}
              label='Amount'
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
              <Select
              id='currency'
              // name='currency'
              className='e-field'
              style={{ width: '100%' }}
              placeholder='Currency'
            >
              {currencydata?.data.map((item:any) => (
                <Select.Option key={item.symbol} value={item.symbol}>
                  {item.symbol}
                </Select.Option>
              ))}
            </Select>
            </Form.Item>
            <Form.Item
              name={'paymentMethod'}
              label='Payment Method'
              rules={[{required: true, message: 'Please select a payment method'}]}
              hasFeedback
              // style={{width: '100%'}}
              // labelCol={{span: 5}}
            >
              {/* <Select
                  id='paymentMethod'
                  name='paymentMethod'
                  className='e-field'
                  style={{ width: '100%' }}
                >
                  <option value='' disabled selected>
                    paymentMethod
                  </option>
                  {activePaymentMethoddata?.data.map((item:any) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </Select> */}
                <Select
                  id='paymentMethod'
                  // name='paymentMethod'
                  className='e-field'
                  style={{ width: '100%' }}
                  placeholder='paymentMethod'
                >
                  {activePaymentMethoddata?.data.map((item:any) => (
                  <Select.Option key={item.name} value={item.name}>
                    {item.name}
                  </Select.Option>
                ))}
                              </Select>

              {/* <DropDownListComponent
                  id='paymentMethod'
                  placeholder='paymentMethod'
                  data-name='paymentMethod'
                  className='e-field'
                  dataSource={activePaymentMethoddata?.data}
                  fields={{text: 'name', value: 'name'}}
                  // value={props && props.gameTypeId ? props.gameTypeId : null}
                  style={{width: '100%'}}
                /> */}
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
        {/* Debit Note */}
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
              name={'receiptNumber'}
              label='receipt#'
              rules={[{required: true, message: 'Please enter receipt number (Optional)'}]}
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
              name={'Note'}
              label='Note'
              rules={[{required: true, message: 'Please select a note'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Select
              id='note'
              // name='currency'
              mode="multiple"
              className='e-field'
              style={{ width: '100%' }}
              placeholder='Notes'
            >
              {paymentNotedata?.data.map((item:any) => (
               item.isDebit?<Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>:''
              ))}
            </Select>
            </Form.Item>
            <Form.Item
              name={'debit'}
              label='Amount'
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
        {/* Credit Note */}
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
              name={'Note'}
              label='Note'
              rules={[{required: true, message: 'Please select a note'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Select
              id='currency'
              // name='currency'
              mode="multiple"
              className='e-field'
              style={{ width: '100%' }}
              placeholder='Notes'
            >
              {paymentNotedata?.data.map((item:any) => (
               item.isCredit?<Select.Option key={item.name} value={item.name}>
                  {item.name}
                </Select.Option>:''
              ))}
            </Select>
            </Form.Item>
            <Form.Item
              name={'credit'}
              label='Amount'
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
