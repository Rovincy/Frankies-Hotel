import {useState} from 'react'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {Link} from 'react-router-dom'
// import './formStyle.css'
import type {RcFile, UploadFile, UploadProps} from 'antd/es/upload/interface'
import {UploadOutlined} from '@ant-design/icons'
import {Button, Upload, message} from 'antd'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import {Api_Endpoint, fetchRolesApi} from '../../../../../services/ApiCalls'
import {useNavigate, Navigate,useLocation} from 'react-router-dom'
import { BASE_URL } from '../../../urls'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'

const UserEditForm = () => {
  const [formData, setFormData] = useState({})
  const [activeTab, setActiveTab] = useState('tab1')
  const {register, reset, handleSubmit} = useForm()
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const {data: userRoles, isLoading: userRolesLoad} = useQuery('roles', fetchRolesApi)
  const {mutate: addNewUser} = useMutation((values)=>axios.post(`${BASE_URL}/users`,values), {
    onSuccess:()=>{
      message.success("User updated successfully")
      // queryClient.invalidateQueries('bookings')
      // queryClient.invalidateQueries('rooms')
      // queryClient.invalidateQueries('guests')
      // scheduleObj.current.refreshTemplates()
      // scheduleObj.current.refreshLayout()
      navigate('/users')
    },
    onError:(error: any)=>{
      console.log(error)
      message.error("Update failed")
    }
  })
  const location = useLocation()
  let userData : any = location?.state
//   console.log('userData',userData)
  const handleTabClick = (tab: any) => {
    setActiveTab(tab)
  }

  const navigate = useNavigate()

  const handleTabChange = (newTab: any) => {
    setActiveTab(newTab)
  }

  const [fileList, setFileList] = useState<UploadFile[]>([])

  const onChange: UploadProps['onChange'] = (info) => {
    let fileList = [...info.fileList]

    // Limit the file list to only one file
    fileList = fileList.slice(-1)

    // Update the state with the new file list
    setFileList(fileList)
  }

  const onPreview = async (file: any) => {
    let src = file.url

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result)
      })
    }

    const image = new Image()
    image.src = src

    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  // const url = `${Api_Endpoint}/users`

  // const OnSUbmit = handleSubmit( async (values, event)=> {
  //   event?.preventDefault();
  //   setLoading(true)
  //   const data = {
  //     firstName: values.firstName,
  //     lastname: values.lastname,
  //     email: values.email,
  //     account: values.account,
  //     gender: values.gender,
  //     dob: values.dob,
  //     phoneNumber: values.phoneNumber,
  //     idType: values.idType,
  //     nationality: values.nationality,
  //     idNumber: values.idNumber,
  //     docUrl:'',
  //       }
  //       console.log(data)
  //   try {
  //     console.log(data)
  //     const response = await axios.post(url, data)
  //     setSubmitLoading(false)
  //     reset()
  //     navigate('/grm/Guests/', {replace: true})
  //     return response.statusText
  //   } catch (error: any) {
  //     setSubmitLoading(false)
  //     return error.statusText
  //   }
  // })

  const OnSubmit = handleSubmit(async (values, event) => {
    event?.preventDefault()
    setLoading(true)
    // console.log(values)
    // const formData = new FormData()
    // formData.append('firstName', values.firstName)
    // formData.append('lastname', values.lastname)
    // formData.append('email', values.email)
    // formData.append('role', values.email)
    // formData.append('gender', values.email)
    // formData.append('username', values.username)
    // formData.append('password', values.password)
    // if (fileList[0]?.originFileObj) {
    //   const file = fileList[0].originFileObj as File
    //   formData.append('file', file)
    // }

    // formData.append("file", fileList[0]?.originFileObj);

    try {
      // const response = await axios.post(url, formData, {
      //   headers: {'Content-Type': 'multipart/form-data'},
      // })

      // setSubmitLoading(false)
      // reset()
      // navigate('/users', {replace: true})
      // return response.statusText
      const dat =  userRoles?.data.find((e: { id: any })=>e.id===values.role)
      const userDetails:any = {
        // room: roomsdata?.data[args?.data?.Id-1]?.id,
        firstName:values.firstName,
        lastName: values.lastname,
        email:values.email,
        // role:values.email,
        // gender:values.email,
        roleId: dat['id'],
        username:values.username,
        password:values.password
        // gameTypeId: data.gameType,
      }

      // console.log('bookingSchedule', bookingSchedule)
      // mutateGameSchedule(gameSchedule)
      addNewUser(userDetails)
    } catch (error: any) {
      setSubmitLoading(false)
      return error.statusText
    }
  })

  return (
    <div
      className='col-12'
      style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '5px',

        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <Link to='/users'>
        <a
          style={{fontSize: '16px', fontWeight: '500'}}
          className='mb-7 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary'
        >
          Back to list
        </a>
      </Link>

      <div className='tabs'></div>
      <form onSubmit={OnSubmit}>
        {/* <form onSubmit={OnSUbmit}> */}
        <div className='tab-content'>
          {/* Details */}
          {activeTab === 'tab1' && (
            <div className='col-12'>
              <div className='row mb-0'>
                <div className='col-4 mb-7'>
                  <label htmlFor='exampleFormControlInput1' className='required form-label'>
                    First Name
                  </label>
                  <input
                    type='text'
                    defaultValue={userData.firstName}
                    {...register('firstName')}
                    className='form-control form-control-solid'
                  />
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor='exampleFormControlInput1' className='required form-label'>
                    Last Name
                  </label>
                  <input
                    type='text'
                    defaultValue={userData.lastName}
                    {...register('lastname')}
                    className='form-control form-control-solid'
                  />
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor='exampleFormControlInput1' className='required form-label'>
                    Email
                  </label>
                  <input
                    type='text'
                    defaultValue={userData.email}
                    {...register('email')}
                    className='form-control form-control-solid'
                  />
                </div>
              </div>
              <div className='row mb-0'>
              <div className='col-4 mb-7'>
                  <label htmlFor='exampleFormControlInput1' className='required form-label'>
                    Username
                  </label>
                  <input
                    type='text'
                    defaultValue={userData.username}
                    {...register('username')}
                    className='form-control form-control-solid'
                  />
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor='exampleFormControlInput1' className='required form-label'>
                    Password
                  </label>
                  <input
                    type='text'
                    {...register('password')}
                    className='form-control form-control-solid'
                  />
                </div>
                <div className='col-4 mb-7'>
                <label htmlFor='exampleFormControlInput1' className='required form-label'>
                    Role
                  </label>
                  <DropDownListComponent
                id='role'
                placeholder='User Role'
                {...register('role')}
                value={userData.role}
                className='form-control form-control-solid'
                dataSource={userRoles?.data}
                fields={{text: 'name', value: 'id'}}
                // value={props && props.gameTypeId ? props.gameTypeId : null}
                style={{width: '100%'}}
              />
                </div>
              </div>
              
            </div>
          )}
        </div>
        <button className='btn btn-primary' onClick={OnSubmit} type='submit'>
          Submit
        </button>
        {/* <button className='btn btn-primary' onClick={OnSUbmit} type="submit">Submit</button> */}
      </form>
    </div>
  )
}

export {UserEditForm}
