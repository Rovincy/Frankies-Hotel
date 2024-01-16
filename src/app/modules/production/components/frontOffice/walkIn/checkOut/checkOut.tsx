import {Button, Form, Input, InputNumber, Modal, Space, Table, message} from 'antd'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {KTCardBody, KTSVG} from '../../../../../../../_metronic/helpers'
import {BASE_URL} from '../../../../urls'
import {Link} from 'react-router-dom'
import {employeedata} from '../../../../../../data/DummyData'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import GuestCheckinApi, {
  Api_Endpoint,
  fetchGuests,
  fetchBookings,
  fetchRooms,
  GuestCheckoutApi,
  fetchCheckOutBookings,
} from '../../../../../../services/ApiCalls'
import {DropDownListComponent} from '@syncfusion/ej2-react-dropdowns/src/drop-down-list/dropdownlist.component'
// import { Api_Endpoint, fetchDepartments, fetchEmployees, fetchGrades, fetchNotches, fetchPaygroups } from '../../../../../../services/ApiCalls'
import moment from 'moment'
import { trimBrackets } from '@devexpress/analytics-core/analytics-widgets-internal'

const CheckOut = () => {
  const [gridData, setGridData] = useState<any>([])
  const [newSearchedData, setNewSearchedData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const [img, setImg] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const {data: getNotes, isLoading: NotesLoad} = useQuery('Notes', fetchNotes)
  const {data: getGuests, isLoading: GetGuestsLoad} = useQuery('Guests', fetchGuests)
  const {data: roomsdata, isLoading: GetRoomsLoad} = useQuery('rooms', fetchRooms)
  const {data: bookingData, isLoading: BookingsLoad} = useQuery('Bookings', fetchCheckOutBookings)
  const {mutate: checkGuestOutQuery} = useMutation((values: any) => GuestCheckoutApi(values))
  const [isOpen, setIsOpen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const queryClient = useQueryClient()
  // roomsTypedata?.data.find(roomTypedata => {
  //   if(roomTypedata.id==roo)
  //   return
  // })
  // const roomTypeData = roomsTypedata?.data;
  // // console.log('room', roomTypeData)
  // const testData = roomsdata?.data.map((e:any)=>{
  //   console.log('e', e)

  //  const dat = guestsData?.find((x:any)=>{
  //     // console.log("x", x)

  //     if(x.id===e.typeId){
  //       return x;
  //     }
  //   })

  //   // console.log('dat',dat)
  //   return {
  //     roomId: e?.id,
  //   room: e?.name,
  //   isActive:e?.isActive,
  //   lastname: dat?.name,
  //   Email:dat?.Email
  //   }

  // });

  // const guestList = getGuests?.data.map((e: any) => {
  //   // console.log('e',e?.firstname+' '+e?.lastname)
  //   return {
  //     id: e?.id,
  //     name: `${e?.firstname} ${e?.lastname}`,
  //   }
  // })
  const roomList = roomsdata?.data
  const guestsData = getGuests?.data
  // console.log('room', roomTypeData)
  const data = bookingData?.data.map((e: any) => {
    // console.log('e', e)

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

    // console.log('room',room?.name)
    // reservationData.push({
    //   id: e?.id,
    //   guest: guest?.firstname+" "+guest?.lastname,
    //   // room:'Room X',
    //   room:room?.name,
    //   bookEnd: e?.bookEnd,
    //   checkInTime: e?.checkInTime,
    //   })

    var checkinTimeData = new Date(e?.checkOutTime)
    var bookEndTime = new Date(e?.bookEnd)
    return {
      id: e?.id,
      guest: `${guest?.firstname?.trim()} ${guest?.lastname}`,
      room: room?.name,
      bookEnd: bookEndTime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      checkOutTime: e?.checkOutTime
        ? checkinTimeData.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        : e?.checkOutTime,
    }
  })

  // const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // const newFilteredData = data?.filter((item: any) => {
  //   const itemDate = new Date(item.checkOutTime).toISOString().split('T')[0]
  //   const today = new Date(Date.now()).toISOString().split('T')[0]
  //   return itemDate <= today && itemDate >= last30Days
  // })

  const today = new Date().toISOString().split('T')[0]
  
  const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const newFilteredData = data?.filter((item: any) => {
    if (item.checkOutTime !== null) {
      const newDate = moment(item.checkOutTime, 'dddd, MMMM D, YYYY [at] HH:mm').toISOString().split('T')[0]
      
      if(newDate>=last30Days && newDate<=today){
            return item
      }
      
    }
    return false;
  })
  

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
  }
  const closeModal = () => {
    setIsOpen(false)
  }
  const openModal = () => {
    setIsOpen(true)
  }
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
  // checking in guests
  const checkGuestOut = (guestData: any) => {
    // Modal.confirm({
    //   okText: 'Yes',
    //   okType: 'danger',
    //   title: 'Are you sure, you want to activate Member?',
    //   onOk: () => {
    //     axios.post(`${API_URL}/ActivateMember?id=${id}`).then((response) => {
    //       if (response.status == 200) {
    //         messageApi.success('Member was successfully activated!')
    //         queryClient.invalidateQueries('membersQuery')
    //       }
    //     })
    //   },
    // })
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

  // function handleDelete(element: any) {
  //   deleteData(element)
  // }
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
      title: 'End',
      dataIndex: 'bookEnd',
      sorter: (a: any, b: any) => {
        if (a.checkInTime > b.checkInTime) {
          return 1
        }
        if (b.checkInTime > a.checkInTime) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Check Out Time',
      dataIndex: 'checkOutTime',
      sorter: (a: any, b: any) => {
        if (a.checkInTime > b.checkInTime) {
          return 1
        }
        if (b.checkInTime > a.checkInTime) {
          return -1
        }
        return 0
      },
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

  useEffect(() => {
    loadData()
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

  const dataWithIndex = gridData.map((item: any, index: any) => ({
    ...item,
    key: index,
  }))

  const handleInputChange = (e: any) => {
    globalSearch(e.target.value)
    if (e.target.value === '') {
      loadData()
    }
  }

  const globalSearch = (searchedValue: any) => {
    // @ts-ignore
    filteredData = newFilteredData.filter((value) => {
      // console.log('Filtered Value: '+value.guest)
      // console.log('Filtered Value: '+value.room)
      return (
        value.guest?.toLowerCase().includes(searchedValue?.toLowerCase()) ||
        value.room?.toLowerCase().includes(searchedValue?.toLowerCase())
      )
    })
    // console.log('Filtered Data: '+filteredData)
    // setGridData(filteredData)
    setNewSearchedData(filteredData)
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
              <button type='button' className='btn btn-light-primary me-3'>
                <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
                Export
              </button>
            </Space>
          </div>
          <Table columns={columns} 
          // dataSource={newSearchedData} 
          dataSource={newFilteredData} 
          loading={BookingsLoad} />
        </div>
      </KTCardBody>
    </div>
  )
}

export {CheckOut}
