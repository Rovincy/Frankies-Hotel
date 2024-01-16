/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {useIntl} from 'react-intl'
import {KTSVG} from '../../../helpers'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'
import { useAuth } from '../../../../app/modules/auth'

export function AsideMenuMain() {
  const intl = useIntl()

  const {currentUser} = useAuth()
  // console.log('AsideMenuMain: ',currentUser)
  // console.log('AsideMenuMain Id: ',currentUser?.roleId)
  return (
    <>
      {/* <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      /> */}
      <AsideMenuItem
        to='/'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      />

      {/* <AsideMenuItem 
        to='#' 
        // hasBullet={true} 
        icon='/media/icons/duotune/communication/com013.svg'
        title='Employees' 
      /> */}
      <AsideMenuItemWithSub
        to='#'
        icon='/media/icons/duotune/communication/com013.svg'
        title={currentUser?.role.toLowerCase()==="Manager".toLocaleLowerCase()?'Back Office':'Front Office'}
      >
        <AsideMenuItem
          to='frontOffice/walkIn/'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Entries'
        />
        {/* <AsideMenuItem 
            to='frontOffice/reservation/' 
            hasBullet={false} 
            icon='/media/icons/duotune/general/gen028.svg'
            title='Reservation' 
          /> */}

        {/* <AsideMenuItem
          to='/front-office/service'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Services'
        /> */}

        <AsideMenuItem
          to='billing/*'
          // to='#'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Billing'
        />
        {/* <AsideMenuItem 
            to='frontOffice/reservationList' 
            hasBullet={false} 
            icon='/media/icons/duotune/general/gen028.svg'
            title='Reservation List' 
          />
          <AsideMenuItem 
            to='employee-report-page/' 
            hasBullet={false} 
            icon='/media/icons/duotune/general/gen028.svg'
            title='New Booking' 
          /> */}
        {/* <AsideMenuItem 
            to='employee-report-page/' 
            hasBullet={false} 
            icon='/media/icons/duotune/general/gen028.svg'
            title='Out of Order' 
          />
          <AsideMenuItem 
            to='employee-report-page/' 
            hasBullet={false} 
            icon='/media/icons/duotune/general/gen028.svg'
            title='Guest Ledger' 
          />
          <AsideMenuItem 
            to='employee-report-page/' 
            hasBullet={false} 
            icon='/media/icons/duotune/general/gen028.svg'
            title='Arrival List' 
          />
          <AsideMenuItem 
            to='employee-report-page/' 
            hasBullet={false} 
            icon='/media/icons/duotune/general/gen028.svg'
            title='Departure List' 
          />
          <AsideMenuItem 
            to='employee-report-page/' 
            hasBullet={false} 
            icon='/media/icons/duotune/general/gen028.svg'
            title='Guest Database' 
          />
          <AsideMenuItem 
            to='employee-report-page/' 
            hasBullet={false} 
            icon='/media/icons/duotune/general/gen028.svg'
            title='Guess Message' 
          /> */}

        {/* <AsideMenuItemWithSub to='#' title='Setups' icon='/media/icons/duotune/technology/teh004.svg' hasBullet={false}>
          <AsideMenuItem to='setup/#paygroups' hasBullet={true} title='Paygroups' />
          <AsideMenuItem to='setup/#divisions' hasBullet={true} title='Divisions' />
          <AsideMenuItem to='setup/#category' hasBullet={true} title='Categories' />
          <AsideMenuItem to='setup/#jobtitle' hasBullet={true} title='Job Titles' />
          <AsideMenuItem to='setup/#nationality' hasBullet={true} title='Nationalities' />
          <AsideMenuItem to='setup/#perks' hasBullet={true} title='Perks' />
          <AsideMenuItem to='setup/#skills' hasBullet={true} title='Skills' />
          <AsideMenuItem to='setup/#qualification' hasBullet={true} title='Qualifications' />  
          
        </AsideMenuItemWithSub> */}
      </AsideMenuItemWithSub>
      
      {/* {currentUser?.role.toLowerCase()==="Manager".toLocaleLowerCase()?null:( */}
      <AsideMenuItemWithSub to='#' icon='/media/icons/duotune/communication/com013.svg' title='GRM'>
        <AsideMenuItem
          to='grm/Guests/'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Guests'
        />
        <AsideMenuItem
          to='grm/Notes/'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen028.svg'
          title='Notes'
        />
        {/* <AsideMenuItem
          to='#'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen028.svg'
          title='Loyalty'
        /> */}
        {/* <AsideMenuItem 
            to='employee-report-page/' 
            hasBullet={false} 
            icon='/media/icons/duotune/general/gen028.svg'
            title='Guest Inquiry' 
          />
          <AsideMenuItem 
            to='employee-report-page/' 
            hasBullet={false} 
            icon='/media/icons/duotune/general/gen028.svg'
            title='Guest Followup' 
          />
          <AsideMenuItem 
            to='employee-report-page/' 
            hasBullet={false} 
            icon='/media/icons/duotune/general/gen028.svg'
            title='Guest Response' 
          />
          <AsideMenuItem 
            to='employee-report-page/' 
            hasBullet={false} 
            icon='/media/icons/duotune/general/gen028.svg'
            title='Guest History' 
          />
          <AsideMenuItem 
            to='employee-report-page/' 
            hasBullet={false} 
            icon='/media/icons/duotune/general/gen028.svg'
            title='Guest Feedback' 
          />
          <AsideMenuItem 
            to='employee-report-page/' 
            hasBullet={false} 
            icon='/media/icons/duotune/general/gen028.svg'
            title='Mailbox' 
          />
          <AsideMenuItem 
            to='employee-report-page/' 
            hasBullet={false} 
            icon='/media/icons/duotune/general/gen028.svg'
            title='Guest Database' 
          /> */}
      </AsideMenuItemWithSub>
      {/* )} */}
      

     {currentUser?.role.toLowerCase()==="Cashier".toLocaleLowerCase()?null:(<AsideMenuItem
        // to='#'
        // to='reports/reportComponent'
        to='report-page/'
        icon='/media/icons/duotune/communication/com013.svg'
        title='Reports'
      ></AsideMenuItem>)}

      <AsideMenuItemWithSub
        to='#'
        icon='/media/icons/duotune/communication/com013.svg'
        title='Setup'
      >
        {/* <AsideMenuItemWithSub
          to='#'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Rooms'
        > */}
        {/* {currentUser?.role.toLowerCase()==="Manager".toLocaleLowerCase()?null:( */}
        <AsideMenuItem
          to='paymentNotes/'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Payment Notes'
        />
        {/*  )} */}
        {/* { */}
        <AsideMenuItem
          to='paymentMethod/'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Payment Methods'
        />
        {currentUser?.role.toLowerCase()==="Cashier".toLocaleLowerCase()?null:(<AsideMenuItem
          to='currency/'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Currency'
        />)}
        {
        // currentUser?.role.toLowerCase()==="Manager".toLocaleLowerCase()||
        currentUser?.role.toLowerCase()==="Cashier".toLocaleLowerCase()?null:(<>
        <AsideMenuItem
          to='company/'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Company'
        />
        <AsideMenuItem
          to='tax/'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Tax'
        />
          <AsideMenuItem
            to='roomType/'
            hasBullet={false}
            icon='/media/icons/duotune/general/gen005.svg'
            title='Rooms'
          />
          <AsideMenuItem
            to='/services/category'
            hasBullet={false}
            icon='/media/icons/duotune/general/gen005.svg'
            title='Services'
          /></>)}

        {/* <AsideMenuItem
          to='#'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Source'
        /> */}
        {/* {currentUser?.role.toLowerCase()==="Manager".toLocaleLowerCase()||currentUser?.role.toLowerCase()==="Cashier".toLocaleLowerCase()?null:(<><AsideMenuItem
          to='/users'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Users' /><AsideMenuItem
            to='#'
            hasBullet={false}
            icon='/media/icons/duotune/general/gen005.svg'
            title='Roles' /></>)} */}
      </AsideMenuItemWithSub>
      
      {currentUser?.role.toLowerCase()==="Manager".toLocaleLowerCase()||currentUser?.role.toLowerCase()==="Cashier".toLocaleLowerCase()?null:(<AsideMenuItemWithSub
        to='#'
        icon='/media/icons/duotune/communication/com013.svg'
        title='User Management'
      >

        <AsideMenuItem
          to='/users'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Users'
        />
        <AsideMenuItem
          to='/roles'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Roles'
        />
      </AsideMenuItemWithSub>
)}
      {/* {currentUser?.role.toLowerCase()==="Manager".toLocaleLowerCase()||currentUser?.role.toLowerCase()==="Cashier".toLocaleLowerCase()?null:(<AsideMenuItemWithSub
        to='#'
        icon='/media/icons/duotune/communication/com013.svg'
        title='Administration'
      >
        <AsideMenuItem
          to='#'
          hasBullet={false}
          icon='/media/icons/duotune/general/gen005.svg'
          title='Audit'
        />
      </AsideMenuItemWithSub>
)} */}
      
    </>
  )
}
