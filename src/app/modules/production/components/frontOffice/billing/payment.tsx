import {Button, Divider, Form, Input, InputNumber, Modal, Select, Space, Table, message} from 'antd'
import {useEffect, useState} from 'react'
import axios from 'axios'

import {BASE_URL} from '../../../urls'
import {Link} from 'react-router-dom'
// import { employeedata } from '../../../../../data/DummyData'
import {useMutation, useQuery, useQueryClient} from 'react-query'

import Checkbox from 'antd/es/checkbox/Checkbox'
import {
  Api_Endpoint,
  currencyConverterApi,
  deleteNotesApi,
  fetchBookings,
  fetchGuestServiceApi,
  fetchGuests,
  fetchNotes,
  fetchRooms,
  fetchServiceDetailsApi,
} from '../../../../../services/ApiCalls'
import {KTCardBody, KTSVG} from '../../../../../../_metronic/helpers'
import {dataBinding} from '@syncfusion/ej2-react-schedule'

const Payment = () => {
  const [gridData, setGridData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const [formCurrency] = Form.useForm()
  const [img, setImg] = useState()

  const {data: getGuests, isLoading: GetGuestsLoad} = useQuery('Guests', fetchGuests)
  const {data: roomsdata, isLoading: GetRoomsLoad} = useQuery('rooms', fetchRooms)
  const {data: getGuestServiceData} = useQuery('guestservice', fetchGuestServiceApi)
  const {data: allBookingsData} = useQuery('allBooking', fetchBookings)
  const {data: servicesDetails} = useQuery('fetchServicesDetails', fetchServiceDetailsApi)
  const filteredAllServiceData: any = []
  const servicesOptions: any = []
  const roomsOptions: any = []
  const [totalBill, setTotalbill] = useState(0)
  const [paymentService, setpaymentService] = useState<any>([])
  getGuestServiceData?.data.map((item: any) => {
    const data = allBookingsData?.data.filter((e: any) => {
      return e.id == item.bookingId
    })
    if (data) {
      const filteredGuestData = getGuests?.data.find((x: any) => {
        // console.log("x", x)

        if (x.id === data[0].guestId) {
          return x
        }
      })
      const room = roomsdata?.data.find((x: any) => {
        // console.log("x", x)
        // console.log("e", e)

        if (x.id === item.roomId) {
          return x
        }
      })

      if (filteredGuestData && room) {
        filteredAllServiceData.push({
          service: item.service,
          guest: filteredGuestData.firstname,
          roomId: room.name,
        })
      }
    }
  })
  const [Guest, setGuest] = useState(null)
  const [Room, setRoom] = useState(null)
  // converting form Ghana cedis
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
  const columns: any = [
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
        if (a.notes > b.notes) {
          return 1
        }
        if (b.notes > a.notes) {
          return -1
        }
        return 0
      },
    },

    {
      title: 'Action',
      fixed: 'right',
      // width: 20,
      render: (_: any, record: any) => (
        <Space size='middle'>
          {/* <Link to={`/notes-form/${record.id}`}>
          <span className='btn btn-light-info btn-sm delete-button' style={{ backgroundColor: 'blue', color: 'white' }}>Note</span>
          </Link> */}
          <Checkbox />
          {/* <span className='btn btn-light-info btn-sm delete-button' style={{ backgroundColor: 'red', color: 'white' }} >Delete</span> */}
        </Space>
      ),
    },
  ]

  const globalSearch = () => {
    // @ts-ignore
    filteredData = dataWithIndex.filter((value) => {
      return (
        value.name.toLowerCase().includes(searchText.toLowerCase()) ||
        value.description.toLowerCase().includes(searchText.toLowerCase()) ||
        value.Email.toLowerCase().includes(searchText.toLowerCase())
      )
    })
    setGridData(filteredData)
  }
  getGuests?.data.map((item: any) => {
    servicesOptions.push({value: item.id, label: item.firstname})
  })
  roomsdata?.data.map((item: any) => {
    roomsOptions.push({value: item.id, label: item.name})
  })
  // handle guests on field change
  const handleGuestChange = (e: any) => {
    setGuest(e)
  }
  // handle guests on field change
  const handleRoomChange = (e: any) => {
    setRoom(e)
  }
  // fetch data

  useEffect(() => {
    if (Guest && Room && Room != null && Guest != null) {
      let data = getGuestServiceData?.data.filter((item: any) => {
        return item.guestId == Guest && item.roomId == Room
      })
      setpaymentService(data)
      var bill = 0
      data.map((item: any) => {
        console.log(item.unitPrice)

        bill += item.unitPrice
      })
      setTotalbill(bill)
    }
  }, [Guest, Room])
  console.log(totalBill)

  return (
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
              <Form className='d-flex' form={formCurrency}>
                <Form.Item name='To' style={{marginRight: '5px'}}>
                  <Input placeholder='USD' onChange={convertFromDollar} type='number' />
                </Form.Item>
                <Form.Item name='From'>
                  <Input placeholder='GHS' onChange={convertFromCedis} type='number' />
                </Form.Item>
              </Form>
            </Space>
            <Space style={{marginBottom: 16}}>
              {/* <Link to='/guest-form'>
              <button type='button' className='btn btn-primary me-3'>
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                Add
              </button>
              </Link> */}

              <button type='button' className='btn btn-primary me-3' style={{color: 'white'}}>
                <span>Total bill:</span>
                <span style={{fontSize: '1.2rem'}}>{totalBill}</span>
              </button>
            </Space>
          </div>
          <Divider />

          <div>
            <Form>
              <div className='row'>
                <div className='col-4'>
                  <Form.Item
                    name={'name'}
                    label='Guest'
                    rules={[{required: true, message: 'Please enter item'}]}
                    hasFeedback
                    style={{width: '100%'}}
                    labelCol={{span: 5}}
                  >
                    <Select options={servicesOptions} onChange={handleGuestChange} />
                  </Form.Item>
                </div>
                <div className='col-4'>
                  <Form.Item
                    name={'room'}
                    label='Room'
                    rules={[{required: true, message: 'Please enter item'}]}
                    hasFeedback
                    style={{width: '100%'}}
                    labelCol={{span: 5}}
                  >
                    <Select options={roomsOptions} onChange={handleRoomChange} />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
          <Table columns={columns} dataSource={paymentService} />
        </div>
      </KTCardBody>
    </div>
  )
}

export {Payment}
