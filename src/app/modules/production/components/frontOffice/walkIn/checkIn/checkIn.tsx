import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  Tabs,
  message,
  DatePicker,
} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {KTCardBody, KTSVG} from '../../../../../../../_metronic/helpers'
import {BASE_URL} from '../../../../urls'
import {Link, Navigate, useNavigate} from 'react-router-dom'
import {employeedata} from '../../../../../../data/DummyData'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import moment from 'moment';
import GuestCheckinApi, {
  Api_Endpoint,
  fetchGuests,
  fetchBookings,
  fetchRooms,
  GuestCheckoutApi,
  addBookingApi,
  fetchServiceDetailsApi,
  addGuestServiceApi,
  fetchGuestServiceApi,
  currencyConverterApi,
  updateGuestApi,
  checkRoomAvailability,
  saveTransfer,
  nightAudit,
  auditTrail,
} from '../../../../../../services/ApiCalls'
import {DropDownListComponent} from '@syncfusion/ej2-react-dropdowns/src/drop-down-list/dropdownlist.component'
import TextArea from 'antd/es/input/TextArea'
import {useForm} from 'react-hook-form'
import {Console} from 'console'
import {DateTimePickerComponent} from '@syncfusion/ej2-react-calendars'
import { useAuth } from '../../../../../auth'

// import { Api_Endpoint, fetchDepartments, fetchEmployees, fetchGrades, fetchNotches, fetchPaygroups } from '../../../../../../services/ApiCalls'

const CheckIn = () => {
  const Option: any = Select.Option
  const [gridData, setGridData] = useState<any>([])
  const [newSearchedData, setNewSearchedData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const [formCurrency] = Form.useForm()
  const [img, setImg] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const {data: getNotes, isLoading: NotesLoad} = useQuery('Notes', fetchNotes)
  const {data: getGuests, isLoading: GetGuestsLoad} = useQuery('Guests', fetchGuests)
  const {data: roomsdata, isLoading: GetRoomsLoad} = useQuery('rooms', fetchRooms)
  const {data: bookingData, isLoading: BookingsLoad} = useQuery('Bookings', fetchBookings)
  const {data: servicesDetails} = useQuery('fetchServicesDetails', fetchServiceDetailsApi)
  const {mutate: checkGuestInQuery} = useMutation((values: any) => GuestCheckinApi(values))
  const {mutate: updatePayment} = useMutation((serviceId: any) => updateGuestApi(serviceId))
  const [isOpen, setIsOpen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const {mutate: addReservation} = useMutation((values: any) => addBookingApi(values))
  const queryClient = useQueryClient()
  const {mutate: checkGuestOutQuery} = useMutation((values: any) => GuestCheckoutApi(values))
  const {mutate: runNightAudit} = useMutation((values: any) => nightAudit(values))
  // const {mutate: checkGuestInQuery} = useMutation((values: any) => GuestCheckinApi(values))
  const [openAddServiceModal, setopenAddServiceModal] = useState(false)
  const [openTransferModal, setopenTransferModal] = useState(false)
  const [openGenerateModal, setopenGenerateModal] = useState(false)
  const {mutate: addGuestService} = useMutation((values: any) => addGuestServiceApi(values))
  const {mutate: addAuditTrail} = useMutation((values: any) => auditTrail(values))
  const {mutate: checkIfAvailability} = useMutation((values: any) => checkRoomAvailability(values))
  const {mutate: submitRoomTransfer} = useMutation((values: any) => saveTransfer(values))
  const {data: fetchGuestServiceData, isLoading: fetchGuestServiceLoading} = useQuery(
    'fetchGuestServiceQuery',
    fetchGuestServiceApi
  )
  const [priceValue, setpriceValue] = useState<any>()
  const [quantityValue, setQuantityValue] = useState<any>()
  const [addBookingForm] = Form.useForm()
  const [totalprice, setTotalPrice] = useState(0)
  const [serviceData, setServiceData] = useState<any>({})
  const [allServiceData, setAllServiceData] = useState<any>([])
  const roomsOptions: any = []
  const servicesOptions: any = []
  const [allServicesArr, setallServicesArr] = useState<any>([])
  const [bookingId, setBookingId] = useState(0)
  const [guestroomId, setRoomId] = useState()
  const [guestId, setGuestId] = useState()
  const [spinner, setSpinner] = useState(true)
  const [serviceBillData, setServiceBillData] = useState<any>([])
  const [paidServiceData, getPaidServiceData] = useState<any>([])
  const [servicePaymentData, setServicePaymentData] = useState<any>([])
  const [totalGuestBill, setTotalBill] = useState(0)
  const {currentUser, logout} = useAuth()
  let totalBill = 0
  const navigate = useNavigate();
  roomsdata?.data.map((item: any) => {
    roomsOptions.push({value: item.id, label: item.name})
  })
  servicesDetails?.data.map((item: any) => {
    servicesOptions.push({value: item.id, label: item.name})
  })
  const [serviceForm] = Form.useForm()
  const [transferForm] = Form.useForm()
  const [isUnAvailable, setCheckUnAvailability] = useState(true)
  const [formData, setFormData] = useState({
    roomId: null, // Initialize with default values or null as needed
    bookEnd: null,
    prv_roomId: null,
    customerId:null,
    // bookStart:null,
    // prv_bookEnd:null,
    id:null
  });
  const [auditTrailData, setAuditTrailData] = useState({
    userId:null,
    description:null
  });
  var tableValue: any
  const convertFromCedis = (e: any) => {
    let amount = 0
    currencyConverterApi('GHS', 'USD').then((res) =>
      formCurrency.setFieldValue('To', res.data.rates.USD * e.target.value)
    )
  }
  // convert form Us dollar
  const convertFromDollar = (e: any) => {
    currencyConverterApi('USD', 'GHS').then((res) =>
      formCurrency.setFieldValue('From', res.data.rates.GHS * e.target.value)
    )
  }

  const guestList = getGuests?.data.map((e: any) => {
    // console.log('e',e?.firstname+' '+e?.lastname)
    return {
      id: e?.id,
      name: e?.firstname + ' ' + e?.lastname,
    }
  })
  const roomList = roomsdata?.data
  // console.log('room list', roomList)

  const guestsData = getGuests?.data
  // console.log('room', roomTypeData)
  // console.log('bookingData?.data: ', bookingData?.data)
  // let formattedDate :any
  // console.log('currentUser: ',currentUser)
  const data = bookingData?.data.map((e: any) => {
    const guest = guestsData?.find((x: any) => {
      // console.log("x", x)

      if (x.id === e.guestId) {
        return x
      }
    })
    const room = roomList?.find((x: any) => {
      // console.log("x", x)
      // console.log("e", e)

      if (x.id === e.roomId) {
        return x
      }
    })

    var checkinTimeData = new Date(e?.checkInTime)

    var bookStartTime = new Date(e?.bookStart)
    var bookEndTime = new Date(e?.bookEnd)
    // formattedDate = moment(bookEndTime).format('YYYY-MM-DD HH:mm:ss');
    return {
      id: e?.id,
      guest: `${guest?.firstname?.trim()} ${guest?.lastname}`,
      room: room?.name,
      roomId: room?.id,
      guestId: guest?.id,
      bookStart: bookStartTime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      bookEnd: bookEndTime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        // year: 'numeric',
        // month: '2-digit',
        // day: '2-digit',
        // hour: '2-digit',
        // minute: '2-digit',
        // second: '2-digit',
      }),
      checkInTime: e?.checkInTime
        ? checkinTimeData.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        : e?.checkInTime,
      checkOutTime: e?.checkOutTime,
    }
  })
  // console.log('data: '+data)
  const newFilteredData = data?.filter((e: any) => {
    // console.log('newFilteredData data: '+e)
    return e.checkOutTime == null && e.checkInTime != null
  })

  const newReservationData = data?.filter((e: any) => {
    // console.log('newFilteredData: '+e)
    return e.checkOutTime == null && e.checkInTime == null
  })

  const cancelBillModal = () => {
    setopenGenerateModal(false)
  }
  const cancelTransferModal = () => {
    setopenTransferModal(false)
    setCheckUnAvailability(true)
    transferForm.resetFields()
  }
  var selectedItemBookEnd:any
  var customerId
  var prv_roomId
  var id
  const displayTransferModal = (value: any) => {
    // const { roomId, bookEnd } = formData;
    tableValue = value
    // console.log(tableValue)
    // console.log('tableValue: ', tableValue['bookStart'])
    // console.log('tableValue: ', tableValue['bookEnd'])
    selectedItemBookEnd = tableValue['bookEnd']
    // formData.bookStart = tableValue['bookStart']
    formData.customerId = tableValue['guestId']
    formData.prv_roomId = tableValue['roomId']
    formData.id = tableValue['id']
    // console.log('selectedItemBookEnd: ', selectedItemBookEnd)
    setopenTransferModal(true)
  }
  // const handlePayment = () => {
  //   Modal.confirm({
  //     title: 'Are you sure, you want to make payment for the selected items?',
  //     okText: 'Pay',
  //     onOk: () => {
  //       serviceBillData.map((item: any) => {
  //         console.log("item.id: "+item.id)
  //         var serviceId=parseInt(item.id )
  //          updatePayment(serviceId, {
  //           onSuccess: () => {
  //             message.success('Payment made successfully!')
  //           },
  //           onError(error, variables, context) {
  //             message.destroy('Error occured while submitting payment')
  //           },
  //         })
  //       })
  //     },
  //   })
  // }
  const handlePayment = () => {
    Modal.confirm({
      title: 'Are you sure, you want to make payment for the selected items?',
      okText: 'Pay',
      onOk: () => {
        serviceBillData.map((item: any) => {
          if (
            servicePaymentData.some(
              (selectedItem: {serviceId: any}) => selectedItem.serviceId === item.id
            )
          ) {
            // If the item is selected for payment, proceed with the payment
            const serviceId = parseInt(item.id)
            updatePayment(serviceId, {
              onSuccess: () => {
                message.success('Payment made successfully!')
                setopenGenerateModal(false)
                queryClient.invalidateQueries('Bookings')
                queryClient.invalidateQueries('fetchGuestServiceQuery')
                queryClient.invalidateQueries('Guests')
                queryClient.invalidateQueries('rooms')
                queryClient.invalidateQueries('fetchServicesDetails')
              },
              onError(error, variables, context) {
                message.destroy('Error occurred while submitting payment')
              },
            })
          }
        })
      },
    })
  }

  const handleOk = () => {
    Modal.confirm({
      okText: 'Add',
      okType: 'primary',
      title: 'Are you sure, you want to add this service?',
      onOk: () => {
        allServiceData.map((item: any) => {
          console.log(item)
          // item.quantity = 0
          item.totalPrice = item.price*item.quantity
          const { userId,description } = auditTrailData;
          // console.log('item', item)
          
          addGuestService(item, {
              onSuccess: () => {
              var data ={
                userId:currentUser?.id,
                description:'Added new service'
              }
              // console.log(currentUser)
              addAuditTrail(data,{
                onSuccess:()=>{
                  message.success('Service added successfully!')
                  setopenAddServiceModal(false)
                  queryClient.invalidateQueries('Bookings')
                  queryClient.invalidateQueries('fetchGuestServiceQuery')
                  queryClient.invalidateQueries('Guests')
                  queryClient.invalidateQueries('rooms')
                  queryClient.invalidateQueries('fetchServicesDetails')
                  setAllServiceData([])
                }
              })
            },
          })
        })
      },
    })
  }

  const closeModal = () => {
    setIsOpen(false)
    addBookingForm.resetFields()
  }
  const handleCheckboxOnchange = (values: any) => {
    let updatedServicePaymentData = [...servicePaymentData]

    const matchingIndex = updatedServicePaymentData.findIndex(
      (item) => item.serviceId === values.id
    )

    if (matchingIndex !== -1) {
      // If a matching item is found, remove it from the array
      updatedServicePaymentData.splice(matchingIndex, 1)
    } else {
      // If no matching item is found, add a new object to the array
      updatedServicePaymentData.push({serviceId: values.id})
    }
    setServicePaymentData(updatedServicePaymentData)
  }
  // console.log('values', servicePaymentData)

  // const deleteData = async (element: any) => {
  //   try {
  //     const response = await axios.delete(`${BASE_URL}/Notes`)
  //     // update the local state so that react can refecth and re-render the table with the new data
  //     const newData = gridData.filter((item: any) => item.id !== element.id)
  //     setGridData(newData)
  //     return response.status
  //   } catch (e) {
  //     return e
  //   }
  // }

  const serviceColumns: any = [
    {
      title: 'Service',
      dataIndex: 'service',
      sorter: (a: any, b: any) => {
        if (a.guest > b.guest) {
          return 1
        }
        if (b.guest > a.guest) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Price',
      dataIndex: 'unitPrice',
      sorter: (a: any, b: any) => {
        if (a.room > b.room) {
          return 1
        }
        if (b.room > a.room) {
          return -1
        }
        return 0
      },
    },

    // {
    //   title: 'Check In Time',
    //   dataIndex: 'checkInTime',
    //   sorter: (a: any, b: any) => {
    //     if (a.checkInTime > b.checkInTime) {
    //       return 1
    //     }
    //     if (b.checkInTime > a.checkInTime) {
    //       return -1
    //     }
    //     return 0
    //   },
    // },

    {
      title: 'Action',
      fixed: 'right',
      // width: 20,
      render: (_: any, record: any) => (
        <Space size='middle'>
          {/* <Link to={`/notes-form/${record.id}`}>
        <span className='btn btn-light-info btn-sm delete-button' style={{ backgroundColor: 'blue', color: 'white' }}>Note</span>
        </Link> */}
          <Checkbox onChange={() => handleCheckboxOnchange(record)} />
          {/* <span className='btn btn-light-info btn-sm delete-button' style={{ backgroundColor: 'red', color: 'white' }} >Delete</span> */}
        </Space>
      ),
    },
  ]
  const columns: any = [
    {
      title: 'Name',
      dataIndex: 'guest',
      sorter: (a: any, b: any) => {
        if (a.guest > b.guest) {
          return 1
        }
        if (b.guest > a.guest) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Room',
      dataIndex: 'room',
      sorter: (a: any, b: any) => {
        if (a.room > b.room) {
          return 1
        }
        if (b.room > a.room) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Start',
      dataIndex: 'bookStart',
      sorter: (a: any, b: any) => {
        if (a.bookStart > b.bookStart) {
          return 1
        }
        if (b.bookStart > a.bookStart) {
          return -1
        }
        return 0
      },
    },
    
    {
      title: 'End',
      dataIndex: 'bookEnd',
      sorter: (a: any, b: any) => {
        if (a.bookEnd > b.bookEnd) {
          return 1
        }
        if (b.bookEnd > a.bookEnd) {
          return -1
        }
        return 0
      },
    },
    // {
    //   title: 'Check In Time',
    //   dataIndex: 'checkInTime',
    //   sorter: (a: any, b: any) => {
    //     if (a.checkInTime > b.checkInTime) {
    //       return 1
    //     }
    //     if (b.checkInTime > a.checkInTime) {
    //       return -1
    //     }
    //     return 0
    //   },
    // },

    {
      title: 'Action',
      fixed: 'right',
      // width: 20,
      render: (_: any, record: any) => (
        <Space size='middle'>
          <a href='#' className='btn btn-light-success btn-sm' onClick={() => addService(record)}>
            Services
          </a>
          <a
            href='#'
            className='btn btn-light-dark btn-sm'
            onClick={() => displayTransferModal(record)}
          >
            {/* <a href='#' className='btn btn-light-dark btn-sm' onClick={() => generateBill(record)}> */}
            Transfer
            {/* {spinner?"Generate Bill":<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin rev={undefined} />} />} */}
          </a>
          {/* <Link to={`/Billing/${record.guestId}`} className='btn btn-light-primary btn-sm'>
            Check Out
          </Link> */}
          <Link
          to={`/Billing/${record.guestId}`}
          state={record}
          className='btn btn-light-primary btn-sm'
          onClick={() =>
            // runNightAudit(record.guestId, {
            //   onSuccess: () => {
                navigate(`/Billing/${record.guestId}`, { replace: true })
            //   },
            // })
          }
        >
          Check Out
        </Link>
          {/* <a
            href='#'
            className='btn btn-light-primary btn-sm'
            onClick={() =>
              runNightAudit(record.guestId, {
                onSuccess: () => {
                  navigate(`/Billing/${record.guestId}`,{replace: true})
                },
              })
            }
          >
            Check Out
          </a> */}

          {/* <a
            href='#'
            className='btn btn-light-primary btn-sm'
            onClick={() =>
              checkGuestOut({
                id: record.id,
                checkInTime: record.checkInTime,
                checkInOutTime: new Date(),
              })
            }
          >
            Check Out
          </a> */}
          {/*      
        <Space size='middle'>
          {/* <Link to={`/notes-form/${record.id}`}>
          <span className='btn btn-light-info btn-sm delete-button' style={{ backgroundColor: 'blue', color: 'white' }}>Note</span>
          </Link> 
           <Link to={`/employee-edit-form/${record.id}`}>
          <span className='btn btn-light-info btn-sm delete-button' style={{ backgroundColor: 'Green', color: 'white' }}>Check In</span>
          </Link> */}
        </Space>
      ),
    },
  ]

  const reservationColumn: any = [
    {
      title: 'Name',
      dataIndex: 'guest',
      sorter: (a: any, b: any) => {
        if (a.guest > b.guest) {
          return 1
        }
        if (b.guest > a.guest) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Room',
      dataIndex: 'room',
      sorter: (a: any, b: any) => {
        if (a.room > b.room) {
          return 1
        }
        if (b.room > a.room) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Start',
      dataIndex: 'bookStart',
      sorter: (a: any, b: any) => {
        if (a.bookStart > b.bookStart) {
          return 1
        }
        if (b.bookStart > a.bookStart) {
          return -1
        }
        return 0
      },
    },
    // {
    //   title: 'Check In Time',
    //   dataIndex: 'checkInTime',
    //   sorter: (a: any, b: any) => {
    //     if (a.checkInTime > b.checkInTime) {
    //       return 1
    //     }
    //     if (b.checkInTime > a.checkInTime) {
    //       return -1
    //     }
    //     return 0
    //   },
    // },

    {
      title: 'Action',
      fixed: 'right',
      // width: 20,
      render: (_: any, record: any) => (
        <Space size='middle'>
          <a
            href='#'
            className='btn btn-light-primary btn-sm'
            onClick={() =>
              checkGuestIn({
                id: record.id,
                CheckInOutTime: new Date(),
                // checkInOutTime: new Date(),
              })
            }
          >
            Check In
          </a>
          {/*      
        <Space size='middle'>
          {/* <Link to={`/notes-form/${record.id}`}>
          <span className='btn btn-light-info btn-sm delete-button' style={{ backgroundColor: 'blue', color: 'white' }}>Note</span>
          </Link> 
           <Link to={`/employee-edit-form/${record.id}`}>
          <span className='btn btn-light-info btn-sm delete-button' style={{ backgroundColor: 'Green', color: 'white' }}>Check In</span>
          </Link> */}
        </Space>
      ),
    },
  ]

  // const {data:allNotes} = useQuery('Notes', fetchNotes, {cacheTime:5000})

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${Api_Endpoint}/RoomsType`)
      setGridData(response.data)
      setLoading(false)
    } catch (error) {
      // console.log(error)
    }
  }
  const checkGuestOut = (guestData: any) => {
    if (guestData.checkInTime === null) {
      message.info('Please, check In before you check out!')
      return
    }

    Modal.confirm({
      okText: 'Confirm',
      okType: 'primary',
      title: 'Kindly confirm check-out!',
      onOk: () => {
        checkGuestOutQuery(guestData, {
          onSuccess: () => {
            message.success('Guest successfully ckecked out!')
            queryClient.invalidateQueries('Bookings')
            queryClient.invalidateQueries('Guests')
            queryClient.invalidateQueries('rooms')
          },
        })
      },
    })
  }
  const checkGuestIn = (guestData: any) => {
    // if (guestData.checkInTime === null) {
    //   message.info('Please, check In before you check out!')
    //   return
    // }
    console.log('guestData: ', guestData)

    Modal.confirm({
      okText: 'Confirm',
      okType: 'primary',
      title: 'Kindly confirm check-In!',
      onOk: () => {
        checkGuestInQuery(guestData, {
          onSuccess: () => {
            message.success('Guest successfully ckecked in!')
            queryClient.invalidateQueries('Bookings')
            queryClient.invalidateQueries('Guests')
            queryClient.invalidateQueries('rooms')
          },
        })
      },
    })
  }
  const addService = (record: any) => {
    setopenAddServiceModal(true)
    setBookingId(record.id)
    setRoomId(record.roomId)
    setGuestId(record.guestId)

    // if (guestData.checkInTime === null) {
    //   message.info('Please, check In before you check out!')
    //   return
    // }
    // Modal.confirm({
    //   okText: 'Confirm',
    //   okType: 'primary',
    //   title: 'Kindly confirm check-out!',
    //   onOk: () => {
    //     checkGuestOutQuery(guestData, {
    //       onSuccess: () => {
    //         message.success('Guest successfully ckecked out!')
    //         queryClient.invalidateQueries('Bookings')
    //         queryClient.invalidateQueries('Guests')
    //         queryClient.invalidateQueries('rooms')
    //       },
    //     })
    //   },
    // })
  }
  const generateBill = (record: any) => {
    //document.getElementById('generateBillButton')?.innerHTML=<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin rev={undefined} />
    setServiceBillData([])
    setTotalBill(0)
    let guestServices = fetchGuestServiceData?.data.filter((item: any) => {
      return item.bookingId == record.id && item.isPaid == false
    })
    getPaidServiceData([])
    let guestPaidServices = fetchGuestServiceData?.data.filter((item: any) => {
      return item.bookingId == record.id && item.isPaid == true
    })
    // console.log("guestPaidServices " +guestPaidServices);

    guestServices?.forEach((item: any) => {
      totalBill += item.unitPrice

      setTotalBill(totalBill)
      setServiceBillData((prevServiceBillData: any) => [...prevServiceBillData, item])
    })
    guestPaidServices?.forEach((item: any) => {
      totalBill += item.unitPrice

      setTotalBill(totalBill)
      getPaidServiceData((prevServiceBillData: any) => [...prevServiceBillData, item])
      // console.log("guestPaidServices " +item);
    })

    if (totalBill !== 0) {
      setopenGenerateModal(true)
    } else {
      setopenGenerateModal(false)
      message.warning('No bill to generate')
    }
  }
  // const displayPaidBill = (record: any) => {
  //   //document.getElementById('generateBillButton')?.innerHTML=<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin rev={undefined} />
  //   setServiceBillData([])
  //   setTotalBill(0)
  //   let guestServices = fetchGuestServiceData?.data.filter((item: any) => {
  //     return item.bookingId === record.id && item.isPaid === false;
  //   })
  //   guestServices?.forEach((item: any) => {
  //     totalBill += item.unitPrice

  //     setTotalBill(totalBill)
  //     setServiceBillData((prevServiceBillData: any) => [...prevServiceBillData, item])
  //   })
  //   console.log("setServiceBillData " +guestServices);
  //   let guestPaidServices = fetchGuestServiceData?.data.filter((item: any) => {
  //     return item.bookingId === record.id && item.isPaid === true;
  //   })

  //   getPaidServiceData([])
  //   guestPaidServices?.forEach((paidItems: any) => {
  //     // totalBill += item.unitPrice

  //     // setTotalBill(totalBill)
  //     // getPaidServiceData((prevServiceBillData: any) => [...prevServiceBillData, paidItems])
  //     console.log("guestPaidServices " +guestPaidServices);
  //   })

  //   if (totalBill != 0) {
  //     setopenGenerateModal(true)
  //   } else {
  //     setopenGenerateModal(false)
  //     message.warning('No bill to generate')
  //   }
  // }

  useEffect(() => {
    loadData()
    // console.log('newFilteredData: ',newFilteredData)
    setNewSearchedData(newFilteredData)
    // fetchImage()
  }, [])

  useEffect(() => {
    // loadData()
    setNewSearchedData(newFilteredData)
    // fetchImage()
  }, [newFilteredData])

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
  const cancelNoteModal = () => {
    setopenAddServiceModal(false)
    serviceForm.resetFields()
    setAllServiceData([])
    setTotalPrice(0)
  }

  const dataWithIndex = gridData.map((item: any, index: any) => ({
    ...item,
    key: index,
  }))

  const handleInputChange = (e: any) => {
    globalSearch(e.target.value)
    if (e.target.value === '') {
      loadData()
    } /*else{
      newFilteredData.filter(
        (item: { room: string })=> item.room?.toLowerCase().includes(e.target.value?.toLowerCase())
      );
    }*/
  }

  const handleChangeForService = (e: any) => {
    let data = servicesDetails?.data.filter((item: any) => {
      return item.id == parseInt(e)
    })
    // setting the value of the price
    serviceForm.setFieldsValue({price: data[0].price})
    setpriceValue(data[0].price)
    setTotalPrice(data[0].price)
    const service = servicesOptions.filter((item: any) => {
      return item.value === e
    })

    setServiceData({...serviceData, service: service[0].label})
  }
  const onChangeForPrice = (e: any) => {
    // console.log('value', e.target.value)
    if (e.target.value < 1) {
      serviceForm.setFieldsValue({price: 0})
    }

    setTotalPrice(e.target.value)
  }
  const onChangeForQuantity = (e: any) => {
    // console.log('value', e.target.value)
    if (e.target.value <= 1) {
      serviceForm.setFieldsValue({quantity: 1})
    }

    // setTotalPrice(e.target.value)
    setQuantityValue(e.target.value)
  }
  let arr: any = []
  const newService = () => {
    serviceData.totalPrice = 0
    serviceData.isPaid = 0
    serviceData.bookingId = bookingId
    serviceData.unitPrice = priceValue * quantityValue
    // serviceData.quantity = quantityValue
    serviceData.roomId = guestroomId
    serviceData.guestId = guestId
    setAllServiceData((prevAllServicesArr: any) => [...prevAllServicesArr, serviceData])

    arr.push(serviceData)
    // setAllServiceData(allServicesArr)
    setpriceValue(false)
    setTotalPrice(0)

    serviceForm.resetFields()
  }

  const submitTransfer = (value:any)=>{
    // console.log('Test Called')
    // console.log(value)
    const { roomId, bookEnd,prv_roomId,customerId,id } = formData;

    // Do something with the form data, e.g., submit it to your server
    // console.log('Form Data:', formData);
    // console.log('roomId:', formData.roomId);

    runNightAudit(formData.customerId, {
      onSuccess: () => {
        // message.success('Audit run successfully')
        // navigate(`/Billing/${record.guestId}`, {replace: true})
        // queryClient.invalidateQueries('Bookings')
        // queryClient.invalidateQueries('Guests')
        // queryClient.invalidateQueries('rooms')
        
        submitRoomTransfer(formData, {
      onSuccess: () => {
        var data ={
          userId:currentUser?.id,
          description:'Made a room transfer'
        }
        // console.log(currentUser)
        addAuditTrail(data,{
          onSuccess:()=>{
            message.success('Transfer successful')
            setCheckUnAvailability(false)
            setopenTransferModal(false)
            // setopenPaymentModal(false)
            // paymentForm.resetFields()
            queryClient.invalidateQueries('Guests')
            queryClient.invalidateQueries('rooms')
            queryClient.invalidateQueries('Bookings')
            queryClient.invalidateQueries('fetchServicesDetails')
            transferForm.resetFields()
          }
        })
      },
      onError(error, variables, context) {
        message.destroy('Room not available')
      },
    })
      },
    })
  }
  const newTransfer = (value: any) => {
    // console.log('Hello')
    // console.log(value)
    // console.log('///')
    // setFormData(value)
    formData.roomId = value.roomId
    formData.bookEnd = value.bookEnd?.toISOString()
    // console.log(tableValue)
    checkIfAvailability(value, {
      onSuccess: () => {
        message.success('Room available')
        setCheckUnAvailability(false)
      },
      onError(error, variables, context) {
        message.destroy('Room not available')
      },
    })
  }
  const checkAvailability = () => {
    // console.log('Check Availability')
  }

  const addCheckIn = () => {
    setIsOpen(true)
    addBookingForm.resetFields()
  }
  const globalSearch = (searchedValue: any) => {
    // console.log('searchedValue: '+searchedValue)
    // @ts-ignore
    filteredData = newFilteredData.filter((Filteredvalue) => {
      return (
        Filteredvalue.guest?.toLowerCase().includes(searchedValue?.toLowerCase()) ||
        Filteredvalue.room?.toLowerCase().includes(searchedValue?.toLowerCase())
      )
    })
    // console.log('Filtered Data: '+filteredData)
    // setGridData(filteredData)
    setNewSearchedData(filteredData)
  }
  // const columns: any = [
  //   {
  //     title: 'Name',
  //     dataIndex: 'firstname',
  //     sorter: (a: any, b: any) => {
  //       if (a.firstname > b.firstname) {
  //         return 1
  //       }
  //       if (b.firstname > a.firstname) {
  //         return -1
  //       }
  //       return 0
  //     },
  //   },
  //   {
  //     title: 'Lastname',
  //     dataIndex: 'lastname',
  //     sorter: (a: any, b: any) => {
  //       if (a.lastname > b.lastname) {
  //         return 1
  //       }
  //       if (b.lastname > a.lastname) {
  //         return -1
  //       }
  //       return 0
  //     },
  //   },
  //   {
  //     title: 'Email',
  //     dataIndex: 'email',
  //     sorter: (a: any, b: any) => {
  //       if (a.email > b.email) {
  //         return 1
  //       }
  //       if (b.email > a.email) {
  //         return -1
  //       }
  //       return 0
  //     },
  //   },
  //   {
  //     title: 'Gender',
  //     dataIndex: 'gender',
  //     sorter: (a: any, b: any) => {
  //       if (a.gender > b.gender) {
  //         return 1
  //       }
  //       if (b.gender > a.gender) {
  //         return -1
  //       }
  //       return 0
  //     },
  //   },
  //   {
  //     title: 'Account',
  //     dataIndex: 'account',
  //     sorter: (a: any, b: any) => {
  //       if (a.account > b.account) {
  //         return 1
  //       }
  //       if (b.account > a.account) {
  //         return -1
  //       }
  //       return 0
  //     },
  //   },
  //   {
  //     title: 'Nationality',
  //     dataIndex: 'nationality',
  //     sorter: (a: any, b: any) => {
  //       if (a.nationality > b.nationality) {
  //         return 1
  //       }
  //       if (b.nationality > a.nationality) {
  //         return -1
  //       }
  //       return 0
  //     },
  //   },

  //   {
  //     title: 'Action',
  //     fixed: 'right',
  //     // width: 20,
  //     render: (_: any, record: any) => (
  //       <Space size='middle'>
  //         <a
  //           href='#'
  //           className='btn btn-light-danger btn-sm'
  //           // onClick={() => deleteGuest(record.id)}
  //         >
  //           Delete
  //         </a>
  //       </Space>
  //       // <Space size='middle'>
  //       //   <Link to={`/notes-form/${record.id}`}>
  //       //   <span className='btn btn-light-info btn-sm delete-button' style={{ backgroundColor: 'blue', color: 'white' }}>Note</span>
  //       //   </Link>
  //       //    <Link to={`/employee-edit-form/${record.id}`}>
  //       //   <span className='btn btn-light-info btn-sm delete-button' style={{ backgroundColor: 'red', color: 'white' }}>Delete</span>
  //       //   </Link>
  //       // </Space>
  //     ),
  //   },
  // ]
  const submitBooking = (values: any) => {
    values.timestamp = new Date()
    values.CheckInTime = new Date()
    const checkData = bookingData?.data.filter((item: any) => {
      return (
        item.guestId === values.guestId &&
        item.roomId === values.roomId &&
        item.bookStart.split('T')[0] === values.bookStart &&
        item.bookEnd.split('T')[0] >= values.bookEnd
      )
    })

    if (checkData.length > 0) {
      message.success('Room already occupied!')
      return
    }
    Modal.confirm({
      okText: 'Ok',
      okType: 'primary',
      title: 'Are you sure, you want to add this booking?',
      onOk: () => {
        addReservation(values, {
          onSuccess: () => {
            message.success('Booking successfully done!')
            queryClient.invalidateQueries('Bookings')
            queryClient.invalidateQueries('Guests')
            queryClient.invalidateQueries('rooms')
            setIsOpen(false)
            addBookingForm.resetFields()
          },
        })
      },
    })
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
        // width:'50%',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <KTCardBody className='py-4 '>
        <div className='table-responsive'>
          <div className='d-flex justify-content-between'>
            <Space style={{marginBottom: 16}}>
              <Input
                placeholder='Enter Search Text'
                onChange={handleInputChange}
                type='text'
                allowClear
                // value={searchText}
              />
              {/* <Button type='primary' onClick={globalSearch}>
                Search
              </Button> */}
            </Space>
            <Space style={{marginBottom: 16}}>
              <button
                type='button'
                className='btn btn-light-primary me-3'
                onClick={() => addCheckIn()}
              >
                Add
              </button>
              {/* <button type='button' className='btn btn-light-primary me-3'>
                <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
                Export
              </button> */}
            </Space>
          </div>
          <Table
            columns={columns}
            dataSource={newSearchedData}
            // dataSource={newFilteredData}
            loading={BookingsLoad}
            className='table-responsive'
          />
          {/* <Table columns={columns} dataSource={reservationData}  loading={BookingsLoad}/> */}
          {/* <Table columns={columns} dataSource={testData}  loading={GetGuestsLoad}/> */}
          <Modal
            open={isOpen}
            onCancel={closeModal}
            footer={null}
            title='New checkin'
            width={'50%'}
          >
            <Table
              columns={reservationColumn}
              dataSource={newReservationData}
              loading={BookingsLoad}
            />
            {/* <Form
              name='basic'
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              style={{maxWidth: 600}}
              initialValues={{remember: true}}
              autoComplete='off'
              onFinish={submitBooking}
              form={addBookingForm}
            >
              <Form.Item name='timestamp' label='Guest' hidden={true}>
                <Input type='text' />
              </Form.Item>

              <div className='form-group row mb-7'>
                <div className='col-6'>
                  <Form.Item name='guestId' label='Guest' rules={[{required: true}]}>
                    <Select>
                      {getGuests?.data.map((item: any) => (
                        <Select.Option value={item.id} key={item.id}>
                          {item.firstname} {item.lastname}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-6 '>
                  <Form.Item name='roomId' label='Room' rules={[{required: true}]}>
                    <Select>
                      {roomsdata?.data.map((item: any) => (
                        <Select.Option value={item.id} key={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div className='form-group row mb-7'>
                <div className='col-6'>
                  <Form.Item name='bookStart' label='From' rules={[{required: true}]}>
                    <Input type='date' />
                  </Form.Item>
                </div>
                <div className='col-6 '>
                  <Form.Item name='bookEnd' label='To' rules={[{required: true}]}>
                    <Input type='date' />
                  </Form.Item>
                </div>
              </div>
              <Form.Item wrapperCol={{offset: 4, span: 16}}>
                <Button type='primary' htmlType='submit'>
                  Submit
                </Button>
              </Form.Item>
            </Form>
           */}
          </Modal>

          {/* <Modal
            open={isOpen}
            onCancel={closeModal}
            footer={null}
            title='Add Booking'
            width={'50%'}
          >
            <Form
              name='basic'
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              style={{maxWidth: 600}}
              initialValues={{remember: true}}
              autoComplete='off'
              onFinish={submitBooking}
              form={addBookingForm}
            >
              <Form.Item name='timestamp' label='Guest' hidden={true}>
                <Input type='text' />
              </Form.Item>

              <div className='form-group row mb-7'>
                <div className='col-6'>
                  <Form.Item name='guestId' label='Guest' rules={[{required: true}]}>
                    <Select>
                      {getGuests?.data.map((item: any) => (
                        <Select.Option value={item.id} key={item.id}>
                          {item.firstname} {item.lastname}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className='col-6 '>
                  <Form.Item name='roomId' label='Room' rules={[{required: true}]}>
                    <Select>
                      {roomsdata?.data.map((item: any) => (
                        <Select.Option value={item.id} key={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div className='form-group row mb-7'>
                <div className='col-6'>
                  <Form.Item name='bookStart' label='From' rules={[{required: true}]}>
                    <Input type='date' />
                  </Form.Item>
                </div>
                <div className='col-6 '>
                  <Form.Item name='bookEnd' label='To' rules={[{required: true}]}>
                    <Input type='date' />
                  </Form.Item>
                </div>
              </div>
              <Form.Item wrapperCol={{offset: 4, span: 16}}>
                <Button type='primary' htmlType='submit'>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
           */}
          <Modal
            open={openAddServiceModal}
            okText='Confirm'
            title='Add Service'
            closable={true}
            onCancel={cancelNoteModal}
            onOk={handleOk}
          >
            <Form form={serviceForm} onFinish={newService}>
              <Space>
                <button type='submit' className='btn btn-light-primary me-3'>
                  Add
                </button>
                <div>
                  <span className='btn text-primary mr-0'>Total:{totalprice}</span>
                </div>
              </Space>
              <Form.Item
                name={'name'}
                label='Service'
                rules={[{required: true, message: 'Please enter item'}]}
                hasFeedback
                style={{width: '100%'}}
                labelCol={{span: 5}}
              >
                <Select onChange={handleChangeForService} options={servicesOptions} />
              </Form.Item>
              <Form.Item
                name={'price'}
                label='price'
                rules={[{required: true, message: 'Please enter price'}]}
                hasFeedback
                style={{width: '100%'}}
                labelCol={{span: 5}}
              >
                <Input
                  type='number'
                  style={{width: '100%'}}
                  disabled={!priceValue}
                  onChange={onChangeForPrice}
                />
              </Form.Item>
              <Form.Item
                name={'quantity'}
                label='quantity'
                rules={[{required: true, message: 'Please enter quantity'}]}
                hasFeedback
                style={{width: '100%'}}
                labelCol={{span: 5}}
              >
                <Input
                  type='number'
                  style={{width: '100%'}}
                  // disabled={!quantityValue}
                  onChange={onChangeForQuantity}
                />
              </Form.Item>
            </Form>
            <Table
              columns={serviceColumns}
              dataSource={allServiceData}
              // loading={BookingsLoad}
              className='table-responsive'
            />
          </Modal>
          <Modal
            open={openGenerateModal}
            okText='Pay'
            title='Bill'
            closable={true}
            onCancel={cancelBillModal}
            onOk={handlePayment}
          >
            <Space style={{marginBottom: 16, display: 'flex', justifyContent: 'center'}}>
              <Form className='d-flex' form={formCurrency}>
                <Form.Item name='To' style={{marginRight: '5px'}}>
                  <Input placeholder='USD' onChange={convertFromDollar} type='number' />
                </Form.Item>
                <Form.Item name='From'>
                  <Input placeholder='GHS' onChange={convertFromCedis} type='number' />
                </Form.Item>
              </Form>
            </Space>
            <Tabs
              defaultActiveKey='1'
              items={[
                {
                  label: 'Non-Paid Items',
                  key: '1',
                  children: (
                    <Table
                      columns={serviceColumns}
                      dataSource={serviceBillData}
                      // loading={BookingsLoad}
                      className='table-responsive'
                    />
                  ),
                },
                {
                  label: 'Paid-Items',
                  key: '2',
                  children: (
                    <Table
                      columns={serviceColumns}
                      dataSource={paidServiceData}
                      // loading={BookingsLoad}
                      className='table-responsive'
                    />
                  ),
                  // children: 'Empty',
                },
              ]}
            />

            <Divider style={{background: 'black'}} />
            <span className='fs-bold' style={{fontSize: 'bold'}}>
              Total Bill: {totalGuestBill}
            </span>
          </Modal>

          <Modal
            open={openTransferModal}
            okText='Confirm'
            title='Select new Room'
            closable={true}
            footer={null}
          >
            <Form form={transferForm} onFinish={newTransfer}>
              <Form.Item
                name={'roomId'}
                label='Room'
                rules={[{required: true, message: 'Please select a room'}]}
                hasFeedback
                style={{width: '100%'}}
                labelCol={{span: 5}}
              >
                <DropDownListComponent
                  id='room'
                  placeholder='Room'
                  data-name='room'
                  className='e-field'
                  // onChange={setCheckUnAvailability(true)}
                  dataSource={roomsdata?.data}
                  fields={{text: 'name', value: 'id'}}
                  style={{width: '100%'}}
                />
              </Form.Item>
              <Form.Item
                name={'bookEnd'}
                label='End Date'
                rules={[{required: true, message: 'Please select a date'}]}
                hasFeedback
                style={{width: '100%'}}
                labelCol={{span: 5}}
              >
                <DatePicker 
                showTime format="dddd, MMMM D, YYYY HH:mm"
                className='e-field'
                value={selectedItemBookEnd}
                defaultOpen={selectedItemBookEnd}
                defaultValue={selectedItemBookEnd}
                defaultPickerValue={selectedItemBookEnd}
                style={{width: '100%'}} />
              </Form.Item>
              <div style={{display: 'flex', justifyContent: 'end'}}>
                <Button key='cancel' onClick={cancelTransferModal} className='me-3'>
                  Cancel
                </Button>
                <Button key='checkAvailability' type='primary' htmlType='submit' className='me-3'>
                  Check Availability
                </Button>
                <Button
                  key='submit'
                  type='primary'
                  // htmlType='submit'
                  className='btn btn-danger text-center'
                  disabled={isUnAvailable}
                  onClick={submitTransfer}
                  style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                >
                  Confirm
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      </KTCardBody>
    </div>
  )
}

export {CheckIn}

