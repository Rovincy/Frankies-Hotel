import {Button, Form, Input, InputNumber, Modal, Space, Table, message} from 'antd'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {KTCardBody, KTSVG} from '../../../../../../_metronic/helpers'
import {BASE_URL} from '../../../urls'
import {Link, useParams} from 'react-router-dom'
// import { employeedata } from '../../../../../data/DummyData'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {
  Api_Endpoint,
  addServiceApi,
  deleteServiceiceCategoryApi,
  deleteUserApi,
  fetchRolesApi,
  fetchRooms,
  fetchServiceCategoryApi,
  fetchCompanies,
  deleteCompany,
} from '../../../../../services/ApiCalls'
import Checkbox from 'antd/es/checkbox/Checkbox'
import TextArea from 'antd/es/input/TextArea'

const Company = () => {
  const [gridData, setGridData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const [img, setImg] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {data: CompanyData, isLoading: CompanyLoading} = useQuery('Company', fetchCompanies)
//   const {data: CompanyRoles, isLoading: CompanyRolesLoading} = useQuery('roles', fetchRolesApi)
  const {mutate: addCategoryData} = useMutation((values: any) => addServiceApi(values))
  const {mutate: deleteCompanyData} = useMutation((id: any) =>
  deleteCompany(id)
  )
  const [openNoteModal, setopenNoteModal] = useState(false)
  const parms: any = useParams()
  const queryClient = useQueryClient()
  const [categoryForm] = Form.useForm()
  const showModal = () => {
    setopenNoteModal(true)
  }

  const deleteUser = (id: any) => {
    console.log("id: ",id)
    Modal.confirm({
      okText: 'Ok',
      okType: 'primary',
      title: 'Are you sure, you want to delete this company?',
      onOk: () => {
        deleteCompanyData(id, {
          onSuccess: () => {
            message.info('Company deleted successfully!')
            queryClient.invalidateQueries('Company')
          },
        })
      },
    })
  }

//   const roles = CompanyRoles?.data

  // console.log(userAndRoles)

  const cancelNoteModal = () => {
    setopenNoteModal(false)
  }
  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
  }
  const submitServiceCategory = (values: any) => {
    Modal.confirm({
      okText: 'Ok',
      okType: 'primary',
      title: 'Are you sure, you want to add this service?',
      onOk: () => {
        addCategoryData(values, {
          onSuccess: () => {
            message.info('Category added successfully!')
            queryClient.invalidateQueries('Company')
            setopenNoteModal(false)
            categoryForm.resetFields()
          },
        })
      },
    })
  }
  const deleteData = async (element: any) => {
    try {
      const response = await axios.delete(`${BASE_URL}/RoomsType`)
      // update the local state so that react can refecth and re-render the table with the new data
      const newData = gridData.filter((item: any) => item.id !== element.id)
      setGridData(newData)
      return response.status
    } catch (e) {
      return e
    }
  }

  function handleDelete(element: any) {
    deleteData(element)
  }
  const columns: any = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a: any, b: any) => {
        if (a.name > b.name) {
          return 1
        }
        if (b.name > a.name) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Tin Number',
      dataIndex: 'tinNumber',
      sorter: (a: any, b: any) => {
        if (a.tinNumber > b.tinNumber) {
          return 1
        }
        if (b.tinNumber > a.tinNumber) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
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
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      sorter: (a: any, b: any) => {
        if (a.phoneNumber > b.phoneNumber) {
          return 1
        }
        if (b.phoneNumber > a.phoneNumber) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Non Taxable',
      dataIndex: 'nonTaxable',
      render: (nonTaxable: boolean) => <Checkbox checked={nonTaxable} />,
      sorter: (a: any, b: any) => {
        if (a.nonTaxable > b.nonTaxable) {
          return 1
        }
        if (b.nonTaxable > a.nonTaxable) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Fix Rate',
      dataIndex: 'fixRate',
      sorter: (a: any, b: any) => {
        if (a.fixRate > b.fixRate) {
          return 1
        }
        if (b.fixRate > a.fixRate) {
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
          <Link to={`/Company/companyEditForm/`} state={record}>
            <a href='#' className='btn btn-light-primary btn-sm'>
              Edit
            </a>
          </Link>
          <a
            href='#'
            className='btn btn-light-danger btn-sm'
            onClick={() => deleteUser(record.id)}
          >
            Delete
          </a>
        </Space>
      ),
    },
  ]

  // const sortedEmployees = gridData.sort((a:any, b:any) => a?.departmentId.localeCompare(b?.departmentId));
  // const females = sortedEmployees.filter((employee:any) => employee.gender === 'female');

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
          <div className='d-flex justify-content-between'>
            <Space style={{marginBottom: 16}}>
              {/* <Input placeholder='Enter Search Text' type='text' allowClear value={searchText} />
              <Button type='primary' onClick={globalSearch}>
                Search
              </Button> */}
            </Space>
            <Space style={{marginBottom: 16}}>
            <Link to='/Company/CompanyForm'>
                <button type='button' className='btn btn-primary me-3'>
                  <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                  Add
                </button>
              </Link>

              {/* <button type='button' className='btn btn-light-primary me-3'>
                <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
                Export
              </button> */}
            </Space>
          </div>
          <Table
            columns={columns}
            dataSource={CompanyData?.data}
            loading={CompanyLoading}
            className='table-responsive'
          />
        </div>
        {/* <Modal
          open={openNoteModal}
          okText='Ok'
          title='Add Service Category'
          closable={true}
          onCancel={cancelNoteModal}
          footer={null}
        >
          <Form onFinish={submitServiceCategory} form={categoryForm}>
            <Form.Item
              name={'name'}
              label='Service'
              rules={[{required: true, message: 'Please enter service name'}]}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <Input type='text' style={{width: '100%'}} />
            </Form.Item>
            <Form.Item
              label='Description'
              rules={[{required: true, message: 'Please enter description'}]}
              name={'description'}
              hasFeedback
              style={{width: '100%'}}
              labelCol={{span: 5}}
            >
              <TextArea rows={4} style={{width: '100%'}} />
            </Form.Item>
            <Form.Item wrapperCol={{offset: 2, span: 18}}>
              <Button type='primary' key='submit' htmlType='submit'>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal> */}
      </KTCardBody>
    </div>
  )
}

export {Company}
