
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
// import "./formStyle.css"
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import { BANKS, CATEGORY, DEPARTMENTS, DIVISION, GRADES, NOTCHES, NOTES, PAYGROUP, UNITS } from '../../../../../data/DummyData';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Api_Endpoint, fetchSingleTax, fetchTaxes} from '../../../../../services/ApiCalls';
// import { Api_Endpoint, fetchCategories, fetchDepartments, fetchDivisions, fetchGrades, fetchJobTitles, fetchNationalities, fetchNotches, fetchPaygroups, fetchUnits } from '../../../../services/ApiCalls';
import { useQuery } from 'react-query';
import {useNavigate, Navigate } from 'react-router-dom';
import Checkbox from 'antd/es/checkbox/Checkbox';

const TaxEditForm= () =>{

// const {data: taxData, isLoading: taxLoad} = useQuery('taxes',() => fetchSingleTax(parms['id']))
  const [formData, setFormData] = useState({});
//   const [activeTab, setActiveTab] = useState('tab1');
  const {register, reset, handleSubmit} = useForm();
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);
  const location = useLocation()
  let taxData : any = location?.state
//   console.log('Location:', location)
//   console.log('data:', data?.name)
//   const handleTabClick = (tab:any) => {
//     setActiveTab(tab);
//   }

  const navigate = useNavigate();

  const parms: any = useParams();
  // console.log(parms);
  // console.log(parms['id']);
//   console.log('taxData: ',taxData?.data);
//   console.log('taxData: ',taxData?.data[0].id);
  const [isLevy, setIsLevy] = useState(false);

  const [fileList, setFileList] = useState<UploadFile[]>([
    
  ]);

  // useEffect(() => {
  //   // loadData()
  //   // setNewSearchedData(filteredAllServiceData)
  //   // fetchImage()
  // }, [])

  // const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
  //   setFileList(newFileList);
  // };

    // to preview the uploaded file
    // const onPreview = async (file: UploadFile) => {
    //   let src = file.url as string;
    //   if (!src) {
    //     src = await new Promise((resolve) => {
    //       const reader = new FileReader();
    //       reader.readAsDataURL(file.originFileObj as RcFile);
    //       reader.onload = () => resolve(reader.result as string);
    //     });
    //   }
    //   const image = new Image();
    //   image.src = src;
    //   const imgWindow = window.open(src);
    //   imgWindow?.document.write(image.outerHTML);
    // };

    const url = `${Api_Endpoint}/tax`
    const OnSUbmit = handleSubmit( async (values, event)=> {
      event?.preventDefault();
      setLoading(true)
      setSubmitLoading(true)
      const data = {
        id: taxData.id,
        name: values.name,
        isLevy: isLevy,
        rate:values.rate
          }
          // console.log(data)
      try {
        const response = await axios.put(url, data)
        setLoading(false)
        reset()
        // console.log(response)
        navigate(`/tax/`, {replace: true})
        if (response.status===200) {
          message.success("Tax updated successfully")
        }
        // loadData()
        // console.log(response.status) response.status===201? <Navigate to="/employee"/>: 
        
        return response.statusText
      } catch (error: any) {
        // setSubmitLoading(false)
        setLoading(false)
        return error.statusText
      }
    })
  

  return (
    <div
    className="col-12"
      style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '5px',
     
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >


      
      <Link to="/tax/">
        <a style={{fontSize:"16px", fontWeight: "500"}} className='mb-7 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary'>
          Back to list
        </a>
      </Link>
        <form onSubmit={OnSUbmit}>
        <div className="tab-content">
        
          {/* Details */}
          {<div className='col-8'>
            {/* <div className='row mb-0'>
              <div className='col-6 mb-7'>
                <Upload
                      
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                > 
                  <UploadOutlined />
                </Upload>
              </div>
              
            </div> */}
            <div className='row mb-0'>
              <div className='col-6 mb-7'>
              <label htmlFor="exampleFormControlInput1" className="required form-label">Name</label>
              <input type="text"  {...register("name")} disabled={false} defaultValue={taxData.name}  className="form-control form-control-solid" />
              </div>
              <div className='col-6 mb-7'>
              <label htmlFor="exampleFormControlInput1" className="required form-label">Rate</label>
              <input type="number"  {...register("rate")} disabled={false} defaultValue={taxData.rate}  className="form-control form-control-solid" />
              </div>
              <div className='col-6 mb-7'>
                <label htmlFor="exampleFormControlInput1" className="required form-label">isLevy</label>
                <Checkbox{...register("isLevy")} defaultChecked={taxData.isLevy==true?true:false}  className="form-control form-control-solid" onChange={(e) => setIsLevy(e.target.checked)}/>
              </div>
            </div>
          </div>
          }
          
        </div>
        <Button onClick={OnSUbmit} type='primary' loading={loading}>Submit</Button>
      </form>
    </div>
  );
}


export  {TaxEditForm} 
