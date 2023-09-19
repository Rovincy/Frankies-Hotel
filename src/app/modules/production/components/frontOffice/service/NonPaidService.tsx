import {Button, Form, Input, InputNumber, Modal, Space, Table, message} from 'antd'
import {useEffect, useState} from 'react'
import axios from 'axios'

import {BASE_URL} from '../../../urls'
import {Link} from 'react-router-dom'
// import { employeedata } from '../../../../../data/DummyData'
import {useMutation, useQuery, useQueryClient} from 'react-query'

import Checkbox from 'antd/es/checkbox/Checkbox'
import { Api_Endpoint, deleteNotesApi, fetchBookings, fetchGuestServiceApi, fetchGuests, fetchNotes, fetchRooms } from '../../../../../services/ApiCalls'
import { KTCardBody, KTSVG } from '../../../../../../_metronic/helpers'

const UnpaidService = () => {
  const [gridData, setGridData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const [img, setImg] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {data: roomsdata, isLoading: GetRoomsLoad} = useQuery('rooms', fetchRooms)
  const {data: getGuests, isLoading: GetGuestsLoad} = useQuery('Guests', fetchGuests)

  const {data: getGuestServiceData} = useQuery('guestservice', fetchGuestServiceApi)
  const {data: allBookingsData} = useQuery('allBooking', fetchBookings)
  const queryClient = useQueryClient()

  const filteredAllServiceData: any = []

  getGuestServiceData?.data.map((item: any) => {
    if (item.isPaid !=1) {
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
    }
    else{
      return false
    }
  })

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
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
      title: 'Room',
      dataIndex: 'roomId',
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
      title: 'Guest',
      dataIndex: 'guest',
      sorter: (a: any, b: any) => {
        if (a.timestamp > b.timestamp) {
          return 1
        }
        if (b.timestamp > a.timestamp) {
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
          <a href='#' className='btn btn-light-danger btn-sm'>
            Delete
          </a>
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
              <Input placeholder='Enter Search Text' type='text' allowClear value={searchText} />
              <Button type='primary' onClick={globalSearch}>
                Search
              </Button>
            </Space>
            <Space style={{marginBottom: 16}}>
              {/* <Link to='/guest-form'>
              <button type='button' className='btn btn-primary me-3'>
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                Add
              </button>
              </Link> */}

              <button type='button' className='btn btn-light-primary me-3'>
                <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
                Export
              </button>
            </Space>
          </div>
          <Table columns={columns} dataSource={filteredAllServiceData} />
        </div>
      </KTCardBody>
    </div>
  )
 }

export {UnpaidService}
