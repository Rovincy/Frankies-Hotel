import { Link } from 'react-router-dom'
import { useAuth } from '../../../auth'
const AllReportPage = () => {
  const {currentUser} = useAuth()

  return (
    <div 
    
    >
      <div className='row col-12 mb-10'>
        <div className='col-3'
          style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '5px',
              margin:'0px 10px 0px 10px',
              boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
            }}
        >
          {/* <h2>List</h2> */}
          <hr></hr>
          <br></br>
          {/* <h2><span className="bullet me-5"></span><Link to="/RoomHistoryReport">Room Service History</Link></h2> */}
          <h2><span className="bullet me-5"></span><Link to="/ArrivalDepartureStayOverReport">Arrival/Departure/StayOver</Link></h2>
          <h2><span className="bullet me-5"></span><Link to="/GuestLedgerReport">Guest Ledger</Link></h2>
          <h2><span className="bullet me-5"></span><Link to="/GuestOutstandingReport">Guest Outstanding</Link></h2>
          <h2><span className="bullet me-5"></span><Link to="/CurrencyReport">Currency</Link></h2>
          
          {/* {/* <h2><span className="bullet me-5"></span><Link to="/EmployeeDivisionReport">Division</Link></h2> */}
          {/* <h2><span className="bullet me-5"></span><Link to="/EmployeeDivisionReport">Division</Link></h2>
          <h2><span className="bullet me-5"></span><Link to="/EmployeeDivisionSummaryReport">Summary</Link></h2> */}
        </div>
        <div className='col-3'
          style={{
              backgroundColor: 'white',
              padding: '20px',
              margin:'0px 10px 0px 10px',
              borderRadius: '5px',
              boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
            }}
        >
          {/* <h2>Age Profile</h2> */}
          <hr></hr>
          <br></br>
          <h2><span className="bullet me-5"></span><Link to="/DailyRevenuSummaryReport">Daily Revenue</Link></h2>
          <h2><span className="bullet me-5"></span><Link to="/MonthlyCheckInReport">Monthly Check In</Link></h2>
          <h2><span className="bullet me-5"></span><Link to="/RoomHistoryReport">Room History</Link></h2>
          {currentUser?.role.toString().toLocaleLowerCase()==="Admin".toLowerCase()?
          <h2><span className="bullet me-5"></span><Link to="/AuditTrailReport">Audit Trail</Link></h2>
          :null
          }
         
        </div>
        {/* <div className='col-3'
          style={{
              backgroundColor: 'white',
              padding: '20px',
              margin:'0px 10px 0px 10px',
              borderRadius: '5px',
              boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
            }}
        >
          <h2>Family Profile</h2>
          <hr></hr>
          <br></br>
          <h2><span className="bullet me-5"></span><Link to="/EmployeeFamilyReport">Employee</Link></h2>
          <h2><span className="bullet me-5"></span><Link to="/EmployeeFamilySummaryReport">Summary</Link></h2>
          
        </div> */}
        
      </div>
    </div>
  )
}

export {AllReportPage}
