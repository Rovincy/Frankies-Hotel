import {DateTimePickerComponent} from '@syncfusion/ej2-react-calendars'
import {DropDownListComponent} from '@syncfusion/ej2-react-dropdowns'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useEffect, useState,useRef} from 'react'
import {ButtonComponent} from "@syncfusion/ej2-react-buttons";
import '@syncfusion/ej2-base/styles/material.css'
import '@syncfusion/ej2-calendars/styles/material.css'
import '@syncfusion/ej2-dropdowns/styles/material.css'
import '@syncfusion/ej2-inputs/styles/material.css'
import '@syncfusion/ej2-lists/styles/material.css'
import '@syncfusion/ej2-navigations/styles/material.css'
import '@syncfusion/ej2-popups/styles/material.css'
import '@syncfusion/ej2-splitbuttons/styles/material.css'
import '@syncfusion/ej2-react-schedule/styles/material.css'
import '@syncfusion/ej2-buttons/styles/material.css'
import {Alert, message, Space, Spin, Modal} from 'antd'
import axios from 'axios'
import {L10n,createElement} from '@syncfusion/ej2-base'
import { ScheduleComponent,Month,Day,Week, ViewsDirective, ViewDirective, TimelineViews,TimelineMonth, Inject, ResourcesDirective, ResourceDirective, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
// import {Input, message} from 'antd'
import { Api_Endpoint, fetchRooms,fetchGuests,fetchBookings, fetchRoomsTypes} from '../../../../../../services/ApiCalls'
import { BASE_URL } from '../../../../urls'
import "./index.css"
import "./cellColor.css"
import { useNavigate } from 'react-router-dom'
import dayjs from "dayjs";
// var time = '2023-09-28';
//Editing editor buttons
L10n.load({
  'en-US': {
    schedule: {
      saveButton: 'Book',
      cancelButton: 'Close',
      deleteButton: 'Cancel booking',
      newEvent: 'Book Room',
    },
  },
})

const Calendar = () => {
  let navigate = useNavigate()
  const scheduleObj = useRef(null)
  let queryClient = useQueryClient()
  const {data: roomsdata, isLoading: roomsLoad} = useQuery('rooms', fetchRooms)
  const {data: guestsdata, isLoading: guestsLoad} = useQuery('guests', fetchGuests)
  const {data: bookingdata, isLoading: bookingsLoad} = useQuery('bookings', fetchBookings)
  const {data: roomsTypes} = useQuery('roomType', fetchRoomsTypes)
  const {mutate: addNewBooking} = useMutation((values)=>axios.post(`${BASE_URL}/Booking`,values))
  const {mutate: CancelBooking} = useMutation((values)=>axios.delete(`${BASE_URL}/Booking/${values}`))
  const {mutate: addNewGuestBooking} = useMutation((values)=>axios.post(`${BASE_URL}/Booking/NewGuestBooking`,values))
  const [calendFinalData,setCalendFinalData]=useState([])

  // console.log('Guests ',guestsdata)
  // console.log('Guests ',guestsdata?.data[0])
  // console.log('Rooms ',roomsdata?.data[0])
  // console.log('Booking ',bookingdata?.data)
  const listData = guestsdata?.data.map((e)=>{

    // console.log('e',e?.firstname+' '+e?.lastname)
    return {
      id: e?.id,
    name: e?.firstname+' '+e?.lastname,
  }
  
});
// let filteredBookings = []
  // const allBookings = bookingdata?.data.map((item) => {
  //   const allGuests = guestsdata?.data?.filter((data) => {
  //     return data.id === item.guestId
  //   })

  //   // filteredBookings.push({
  //   //   Id: item.id,
  //   //   Subject: allGuests ? allGuests[0]?.firstname : null,
  //   //   StartTime: item.bookStart,
  //   //   EndTime: item.bookEnd,
  //   //   RoomId: item.roomId,
  //   //   checkInTime: item.checkInTime,
  //   // })
  //   return {
  //     Id: item.id,
  //     Subject: allGuests ? allGuests[0]?.firstname : null,
  //     StartTime: item.bookStart,
  //     EndTime: item.bookEnd,
  //     RoomId: item.roomId,
  //     checkInTime: item.checkInTime,
  //   }
  //   // return item
  // })
// useEffect(()=>{
//   setCalendFinalData(allBookings)
// },[allBookings])


  const onActionBegin = (args) => {
    // console.log('first args', args)
    // args.cancel = true
    // console.log('args', args)
    if (args.data !== undefined) {
      const data = args.data[0] ? args.data[0] : args.data
      // console.log(args?.data[0].Room)
        // console.log(roomsdata?.data.filter(e=>e.name===args?.data[0].Room))
      const dat =  roomsdata?.data.find(e=>e.name===args?.data[0].Room)
        // console.log('dat ',dat);
        // console.log('dat.id ',dat['id']);
      // for (let index = 0; index < roomsdata?.data.length; index++) {
      //   // const element = array[index];
        
      // }
      //Save
      if (args.requestType === 'eventCreate') {
        // console.log("This one here")
        // console.log("data: ",data)
        if(data.guests===null){
          // console.log('No guest selected')
          const bookingSchedule = {
            // room: roomsdata?.data[args?.data?.Id-1]?.id,
            roomId: dat['id'],
            bookStart: data.StartTime,
            bookEnd: data.EndTime,
            timestamp: new Date(),
            firstname: data.FirstName,
            lastname:data.LastName,
            email:data.Email,
            dob:data.DOB,
            gender:data.Gender,
            idType:data.IDType,
            idNumber:data.IDNumber,
            nationality:data.Nationality,
            phoneNumber:data.PhoneNumber
          }

          addNewGuestBooking(bookingSchedule,{
            onSuccess:()=>{
              message.success("Booking made successfully")
              queryClient.invalidateQueries('bookings')
              queryClient.invalidateQueries('rooms')
              queryClient.invalidateQueries('guests')
              scheduleObj.current.refreshTemplates()
              scheduleObj.current.refreshLayout()
              navigate('/frontOffice/walkIn/')
            },
            onError:(error)=>{
              console.log(error)
              message.error("Booking failed, please check booking period.")
            }
          })
        }else{
          // console.log('Guest selected')
        const bookingSchedule = {
          // room: roomsdata?.data[args?.data?.Id-1]?.id,
          roomId: dat['id'],
          bookStart: data.StartTime,
          bookEnd: data.EndTime,
          guestId: data.guests,
          timestamp: new Date()
          // gameTypeId: data.gameType,
        }

        // console.log('bookingSchedule', bookingSchedule)
        // mutateGameSchedule(gameSchedule)
        addNewBooking(bookingSchedule,{
          onSuccess:()=>{
            message.success("Booking made successfully")
            queryClient.invalidateQueries('bookings')
            queryClient.invalidateQueries('rooms')
            queryClient.invalidateQueries('guests')
            scheduleObj.current.refreshTemplates()
            scheduleObj.current.refreshLayout()
            navigate('/frontOffice/walkIn/')
          },
          onError:(error)=>{
            console.log(error)
            message.error("Booking failed, please check booking period.")
          }
        })
      }
      }

      //Edit
      if (args.requestType === 'eventChange') {
        // console.log('gameSchedule Edit', args)
        const gameSchedule = {
          id: data.id,
          subject: data.Subject,
          startTime: data.StartTime,
          endTime: data.EndTime,
          description: data.guest,
          gameTypeId: data.gameType,
        }
        // updateGameSchedule(gameSchedule)
      }
      //Cancel
      // if (args.requestType === '') {
      //   console.log('Close popup', args)
      //   Modal.confirm({
      //     okText: 'Checkin',
      //     okType: 'primary',
      //     title: 'Do you want to check in',
      //     onOk: () => {
      //     },
      //   })
      //   // const gameSchedule = {
      //   //   id: data.id,
      //   //   subject: data.Subject,
      //   //   startTime: data.StartTime,
      //   //   endTime: data.EndTime,
      //   //   description: data.guest,
      //   //   gameTypeId: data.gameType,
      //   // }
      //   // updateGameSchedule(gameSchedule)
      // }
      
      if (args.requestType === 'eventRemove') {
        // deleteGameSchedule(data)
        // console.log('Event Remove', args)
        // console.log('Removing item with id=', args.data[0].Id)
        CancelBooking(args.data[0].Id,{
          onSuccess:()=>{
            message.success("Booking cancelled successfully")
            // queryClient.invalidateQueries('bookings')
            // queryClient.invalidateQueries('rooms')
            // queryClient.invalidateQueries('guests')
            // scheduleObj.current.refreshTemplates()
            // scheduleObj.current.refreshLayout()
            // navigate('/frontOffice/walkIn/')
          },
          onError:(error)=>{
            message.error("Booking cancellation failed.")
          }
        })
      }
    }
  }
  // console.log('gameType', gameType)
  let dropDownListObject //to access the dropdownlist component
  function editorTemplate(props) {
    // const roomName = roomsdata?.data.find(item => item.id === props.RoomId)
    // console.log('props: ',props)
    // console.log('props: ',props['Subject'])
    var roomName;
    roomsdata?.data.find((item)=>{
      if(item['id']==props.RoomId){
        roomName = item.name
        return item.name;
      }
    })
    // console.log('props: ',props)
    var startT = props['StartTime'];
    var Room = props['Name'];
    return props !== undefined ? (
      <table className='custom-event-editor' style={{width: '100%'}} cellPadding={5}>
        <tbody>
         <td className='e-textlabel'>New Guest</td>
        <tr>
            <td className='required e-textlabel'>FirstName</td>
            <td colSpan={4}>
                <input
                    type='text'
                    // {...register('idNumber')}
                    // className='form-control form-control-solid'
                    className='e-field e-input'
                    id='FirstName'
                    data-name='FirstName'
                />
            </td>
          </tr>
          <tr>
            <td className='required e-textlabel'>LastName</td>
            <td colSpan={4}>
                <input
                    type='text'
                    // {...register('idNumber')}
                    // className='form-control form-control-solid'
                    className='e-field e-input'
                    id='LastName'
                    data-name='LastName'
                />
            </td>
          </tr>
          <tr>
            <td className='required e-textlabel'>Email</td>
            <td colSpan={4}>
                <input
                    type='text'
                    // {...register('idNumber')}
                    id='Email'
                    data-name='Email'
                    className='e-field e-input'
                />
            </td>
          </tr>
          <tr>
            <td className='required e-textlabel'>DOB</td>
            <td colSpan={4}>
                <input
                    type='date'
                    // {...register('idNumber')}
                    className='e-field e-input'
                    id='DOB'
                    data-name='DOB'
                />
            </td>
          </tr>
          <tr>
            <td className='required e-textlabel'>Phone Number</td>
            <td colSpan={4}>
                <input
                    type='text'
                    // {...register('idNumber')}
                    id='PhoneNumber'
                    data-name='PhoneNumber'
                    className='e-field e-input'
                />
            </td>
          </tr>
          <tr>
            <td className='required e-textlabel'>Gender</td>
            <td colSpan={4}>
              <DropDownListComponent
                id='Gender'
                placeholder='Gender'
                data-name='Gender'
                className='e-field'
                dataSource={[{name: 'MALE', id: 'MALE'},{name: 'FEMALE', id: 'FEMALE'}]}
                fields={{text: 'name', value: 'id'}}
                // value={props && props.gameTypeId ? props.gameTypeId : null}
                style={{width: '100%'}}
              />
            </td>
          </tr>
          D'accord<tr>
            <td className='required e-textlabel'>ID Type</td>
            <td colSpan={4}>
              <DropDownListComponent
                id='guests'
                placeholder='ID Type'
                data-name='IDType'
                className='e-field'
                dataSource={[{name: 'PASSPORT', id: 'PASSPORT'},{name: 'LICENCE', id: 'LICENCE'},{name: 'NATIONAL ID', id: 'NATIONAL ID'}]}
                fields={{text: 'name', value: 'id'}}
                // value={props && props.gameTypeId ? props.gameTypeId : null}
                style={{width: '100%'}}
              />
            </td>
          </tr>
          <tr>
            <td className='required e-textlabel'>ID Number</td>
            <td colSpan={4}>
                <input
                    type='text'
                    id='IDNumber'
                    data-name='IDNumber'
                    // {...register('idNumber')}
                    className='e-field e-input'
                />
            </td>
          </tr>
          <tr>
            <td className='required e-textlabel'>Nationality</td>
            <td colSpan={4}>
                <input
                    type='text'
                    id='Nationality'
                    // {...register('idNumber')}
                    // className='form-control form-control-solid'
                    className='e-field e-input'
                    data-name='Nationality'
                />
            </td>
          </tr>
        <td className='e-textlabel'>Registered Guest</td>
              <tr>
        <td className='e-textlabel'>Room</td>
        <td colSpan={4}>
          <input
            id='title'
            placeholder='Room'
            data-name='Room'
            name='Room'
            className='e-field e-input'
            type='text'
            style={{width: '100%'}}
            defaultValue={roomName}
            // defaultValue={roomsdata?.data[props.RoomId-1]?.name}
            disabled
          />
        </td>
      </tr>

          <tr>
            <td className='e-textlabel'>Guest</td>
            <td colSpan={4}>
              <DropDownListComponent
                id='guests'
                placeholder='Guest Name'
                data-name='guests'
                className='e-field'
                dataSource={listData}
                fields={{text: 'name', value: 'id'}}
                // value={props && props.gameTypeId ? props.gameTypeId : null}
                style={{width: '100%'}}
              />
            </td>
          </tr>
          <tr>
            <td className='e-textlabel'>From</td>
            <td colSpan={4}>
              <DateTimePickerComponent
                id='StartTime'
                format='dd/MM/yy hh:mm a'
                data-name='StartTime'
                name={'StartTime'}
                // defaultValue={startT}
                value={props['StartTime'] ? props['StartTime'] : props['StartTime']}
                // disabled
                className='e-field'
              ></DateTimePickerComponent>
            </td>
          </tr>
          <tr>
            <td className='e-textlabel'>To</td>
            <td colSpan={4}>
              <DateTimePickerComponent
                id='EndTime'
                format='dd/MM/yy hh:mm a'
                data-name='EndTime'
                name={'EndTime'}
                value={props && props['EndTime'] ? new Date(props['EndTime']) : props['EndTime']}
                className='e-field'
              ></DateTimePickerComponent>
            </td>
          </tr>
        </tbody>
      </table>
    ) : (
      message.error('Please select an event')
    )
  }

  let onCellClick = (args) => {
    // console.log('args ',args)
    const today = new Date(Date.now())
    const startTime=new Date(args.startTime)
    // console.log('today ',today)
    // console.log('startTime ',startTime)
    // if (today<=startTime) {
      args.cancel = true
      // scheduleObj?.openEditor(args, 'Add', false)

    // }
    // else{
    //   args.cancel = true
    //  message.info('Cannot set events for past days!')

     
    // }
    
   
  }

  function onEventRendered (args) {
    // console.log('ARGS ', args)
        args.element.style.backgroundColor = args.data.color;
  }
  const book = bookingdata?.data;
  // console.log(book)
  function test(e){
    book?.find((x)=>{
      // console.log("x", x)
      
      if(x.bookStart==='2023-06-03T00:00:00'){
        return x;
      }
    })
  }
  
  function onRenderCell(args) {
    // console.log('ARGS ',args)
    // if (args.date) {
    //     if(args.elementType==="monthCells"){
    //       const formattedDate = new Date(args.date).toISOString().split('T')[0];
    //       bookingdata?.data.find((e)=>{
    //         // console.log("E: ",e)
    //         if(new Date(e['checkInTime'])===null){
    //          return args.element.classList.add("e-public-holiday");

    //         }
    //       })
    //     }
    // }
  }
//   function onRenderCell(args) {
//     console.log('ARGS ', args)
//     if (args.date) {
//         if (args.elementType === "monthCells") {
//             const formattedDate = new Date(args.date).toISOString().split('T')[0];
//             const foundBooking = bookingdata?.data.find((e) => {
//                 console.log("E: ", e)
                
//                 return new Date(e['checkInTime']) === args.date;
//             });

//             if (foundBooking) {
//                 args.element.classList.add("red-cell"); // Add the CSS class for red color
//             }
//         }
//     }
// }

  const footerTemplate = (props) => {
    console.log("props", props);
    return (
        <div className="quick-info-footer">

            {props.elementType === "event" ?
                <div className="cell-footer">
                    <ButtonComponent id="more-details" cssClass='e-flat' content="More Details" />
                    <ButtonComponent id="add" cssClass='e-flat' content="Add" isPrimary={true} />
                </div>
                :
                <div className="event-footer">
                    <ButtonComponent id="delete" cssClass='e-flat' content="Delete" />
                    <ButtonComponent id="more-details" cssClass='e-flat' content="More Details" isPrimary={true} />
                </div>
            }
        </div>
    );
}

  const roomsArr = []
  const joinedData = roomsdata?.data.filter((room) => {
    const matchingType = roomsTypes?.data.find((type) => type.id === room.typeId)

    if (matchingType) {
      var roomObj = {roomId: room.id, roomName: room.name, roomType: matchingType.name}
      roomsArr.push(roomObj)
      return roomObj
    } else {
      return false
    }
  })
  const getRoomName = (value) => {
    return value.resourceData[value.resource.textField]
  }
  const getRoomType = (value) => {
    return value.resourceData.roomType
  }
  const resourceHeaderTemplate = (props) => {
    return (
      <div className='template-wrap'>
        <div className='room-name'>{getRoomName(props)}</div>
        <div className='room-type'>{getRoomType(props)}</div>
      </div>
    )
  }
  // const OnDestroyed= (args) =>{
  //       //Here you can customize your code
  //       console.log('Close popup', args)
  //       Modal.confirm({
  //         okText: 'Checkin',
  //         okType: 'primary',
  //         title: 'Do you want to check in',
  //         onOk: () => {
  //         },
  //       })
  //   }
  const OnPopupClose=(args)=>{
    // console.log('Close popup', args)
        // if (args.Type == PopupType.Editor || args.Type == PopupType.QuickInfo)
        // {
        //     args.Data.Subject = (args.Data.Subject == "Add title") ? "New event" : args.Data.Subject;   //The default subject is changed from Add Title to New event
        // }
    }

  return roomsdata !== undefined ? (
    <div className='schedule-control-section'>
      <div className='col-lg-12 control-section'>
        <div className='control-wrapper'>
        <ScheduleComponent 
          cssClass='timeline-resource' 
          // dateFormat='dd MM yyyy'
          currentView='TimelineMonth'
          //default date and interval
            
          selectedDate={new Date(dayjs().format('YYYY-MM-DD'))}
          // minDate={dayjs().subtract(1, 'day')}
            maxDate={new Date(dayjs().add(4, 'month'))}
          ref={scheduleObj}
          actionBegin={onActionBegin}
            editorTemplate={editorTemplate}
            eventRendered={onEventRendered}
            OnPopupClose={OnPopupClose}
            resourceHeaderTemplate={resourceHeaderTemplate}
            cellClick={onCellClick}
            renderCell={onRenderCell.bind(this)}
            loading={true}
          width='100%' 
          height='650px' 
          // colorField='#f8a398'
           group={{ enableCompactView: false, resources: ['MeetingRoom'] }}
          eventSettings={{
            dataSource: bookingdata?.data?.map((item) => {
              const allGuests = guestsdata?.data?.filter((data) => {
                return data.id === item.guestId
              })
              if(item.checkInTime===null){
                return {
                  Id: item.id,
                  Subject: allGuests ? `${allGuests[0]?.firstname.trim()} ${allGuests[0]?.lastname}` : null,
                  StartTime: item.bookStart,
                  EndTime: item.bookEnd,
                  RoomId: item.roomId,
                  checkInTime: item.checkInTime,
                  color:"#f57f17"
                }
              }else{
                return {
                  Id: item.id,
                  Subject: allGuests ? `${allGuests[0]?.firstname.trim()} ${allGuests[0]?.lastname}` : null,
                  StartTime: item.bookStart,
                  EndTime: item.bookEnd,
                  RoomId: item.roomId,
                  checkInTime: item.checkInTime,
                  // color:"#357cd2"
                }
              }
              // return item
            }),
            fields: {
              id: 'Id',
              subject: {title: 'Guest', name: 'Subject'},
              //   description: {title: 'Comments', name: 'Description'},
              startTime: {title: 'From', name: 'StartTime'},
              endTime: {title: 'To', name: 'EndTime'},
            },
          }}
          >
                        <ResourcesDirective>
                            <ResourceDirective 
                            field='RoomId'
                            title='Room Type'
                            name='MeetingRoom'
                            allowMultiple={true}
                            dataSource={roomsArr}
                            textField='roomName'
                            idField='roomId'
                            >
                            </ResourceDirective>
                        </ResourcesDirective>
                        <ViewsDirective>
                            <ViewDirective option='TimelineMonth'
                                           interval={4}
                                           selectedDate={new Date(dayjs())}
                                              // showWeekend={true}
                            />
                        </ViewsDirective>
                        <Inject services={[TimelineViews,TimelineMonth,Week, Month, Resize, DragAndDrop]}/>
                    </ScheduleComponent>
        </div>
      </div>
    </div>
  ) : (
    <Space size='middle'>
      <Spin size='large' />
    </Space>
  )
}
export {Calendar}

