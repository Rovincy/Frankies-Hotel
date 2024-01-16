import {FC, Suspense} from 'react'
import {Route, Routes, Navigate, Outlet} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import {PageLink, PageTitle} from '../../_metronic/layout/core'
import {Approval} from '../modules/production/components/processes/payroll/Approval'
import {CheckTax} from '../modules/production/components/processes/payroll/CheckTax'
import {Journals} from '../modules/production/components/processes/payroll/Journal'
import {ProjectSheets} from '../modules/production/components/processes/payroll/ProjectSheet'
import {Payrun} from '../modules/production/components/processes/payroll/Payrun'

import {HRDashboardPage} from '../pages/dashboard/HumanResourceDashBoard'
import {HRDashboardWrapper} from '../pages/dashboard/HumanResourceDashBoard'
import {PayrollDashboardWrapper} from '../pages/dashboard/PayrollDashBoard'
import PayrollPAYEReport from '../modules/production/components/report/PayrollPAYEReport'
import BenefitTransactionInputReport from '../modules/production/components/report/DailyRevenuSummaryReport'
import DeductionTransactionInputReport from '../modules/production/components/report/DeductionTransactionInputReport'

import HumanRessourceReport from '../modules/production/components/report/HumanRessourceReport'
import PayrollLoansDetailsReport from '../modules/production/components/report/PayrollLoansDetailsReport'
import PayrollSSNITReport from '../modules/production/components/report/PayrollSSNITReport'
import SavSchemeTransactionInputReport from '../modules/production/components/report/SavSchemeTransactionInputReport'
import {PayrollReportPage} from '../modules/production/components/report/PayrollReportPage'
import {HrReportPage} from '../modules/production/components/report/HrReportPage'
import EmployeeAgeRangeReport from '../modules/production/components/report/AuditTrailReport'
import EmployeeAgeSummaryReport from '../modules/production/components/report/EmployeeAgeSummaryReport'
import EmployeeFamilyReport from '../modules/production/components/report/EmployeeFamilyReport'
import EmployeeFamilySummaryReport from '../modules/production/components/report/EmployeeFamilySummaryReport'
import EmployeeDivisionReport from '../modules/production/components/report/EmployeeDivisionReport'
import EmployeeDivisionSummaryReport from '../modules/production/components/report/EmployeeDivisionSummaryReport'
import LeaveEmployeeReport from '../modules/production/components/report/LeaveEmployeeReport'
import LeaveSummaryReport from '../modules/production/components/report/LeaveSummaryReport'
import NoteCategoryReport from '../modules/production/components/report/NoteCategoryReport'
import LeaveDepartmentReport from '../modules/production/components/report/LeaveDepartmentReport'
import NotesEmployeeReport from '../modules/production/components/report/NotesEmployeeReport'
import NotesSummaryReport from '../modules/production/components/report/NotesSummaryReport'
import RecruitmentSelectionReferenceReport from '../modules/production/components/report/RecruitmentSelectionReferenceReport'
import RecruitmentSelectJobTitleRepor from '../modules/production/components/report/RecruitmentSelectJobTitleRepor'
import AppraisalPerformanceByAppraisalTypeReport from '../modules/production/components/report/MonthlyCheckInReport'
import AppraisalPerformanceByEmployeeReport from '../modules/production/components/report/RoomHistoryReport'
import CompensationBenefitByEmployeeReport from '../modules/production/components/report/ReceiptReport'
import CompensationBenefitByJobTitleReport from '../modules/production/components/report/CompensationBenefitByJobTitleReport'
import TrainingDevelopmentByReferenceReport from '../modules/production/components/report/TrainingDevelopmentByReferenceReport'
import TrainingDevelopmentBySummaryReport from '../modules/production/components/report/TrainingDevelopmentBySummaryReport'
import TrainingDevelopmentByTrainingTypeReport from '../modules/production/components/report/TrainingDevelopmentByTrainingTypeReport'
import MedicalEmployeeReport from '../modules/production/components/report/MedicalEmployeeReport'
import MedicalTypeReport from '../modules/production/components/report/MedicalTypeReport'
import MedicalSummaryReport from '../modules/production/components/report/MedicalSummaryReport'
import {WalkIn} from '../modules/production/components/frontOffice/walkIn/WalkIn'
import {ReservationList} from '../modules/production/components/frontOffice/reservationList/reservationList'
import {Reservation} from '../modules/production/components/frontOffice/reservation/Reservation'
import {ReservationForm} from '../modules/production/components/frontOffice/reservation/ReservationForm'
import {ReservationDetails} from '../modules/production/components/frontOffice/reservation/ReservationDetails'
import {Guests} from '../modules/production/components/grm/Guests'
import {GuestMultiTabForm} from '../modules/production/components/guestsFormEntry/GuestFormEntry'
import {WalkInPlanning} from '../modules/production/components/frontOffice/walkIn/WalkInPlanning'
import {RoomType} from '../modules/production/components/setup/rooms/roomType'
import {RoomTypeForm} from '../modules/production/components/setup/rooms/roomTypeForm'
import {Rooms} from '../modules/production/components/setup/rooms/rooms'
import {RoomDetails} from '../modules/production/components/setup/rooms/roomDetails'
import {RoomForm} from '../modules/production/components/setup/rooms/roomForm'
import FileUploadForm from '../modules/production/components/guestsFormEntry/FileUploadForm'
import {NotesForm} from '../modules/production/components/grm/notesFormEntry'
import {Notes} from '../modules/production/components/grm/notes'
import {Category} from '../modules/production/components/setup/services/Category'
import {Details} from '../modules/production/components/setup/services/Details'
import {HouseKeeping} from '../modules/production/components/setup/housekeeping/housekeeping'
import {Housekeepingitems} from '../modules/production/components/setup/housekeeping/housekeepingitems'
import { Service } from '../modules/production/components/frontOffice/service/service'
import { Payment } from '../modules/production/components/frontOffice/billing/payment'
import { Billing } from '../modules/production/components/frontOffice/billing/billing'
import ReportComponent from '../modules/production/components/Reports/ReportComponent'
import { Users } from '../modules/production/components/setup/users/Users'
import { UsersForm } from '../modules/production/components/setup/users/UsersForm'
import { Roles } from '../modules/production/components/setup/roles/roles'
import { RolesForm } from '../modules/production/components/setup/roles/RolesForm'
import { Currency } from '../modules/production/components/setup/Currency/currency'
import { CurrencyForm } from '../modules/production/components/setup/Currency/currencyForm'
import { Taxes } from '../modules/production/components/setup/taxes/tax'
import { TaxesForm } from '../modules/production/components/setup/taxes/taxesForm'
import { TaxEditForm } from '../modules/production/components/setup/taxes/taxEditForm'
import { CurrencyEditForm } from '../modules/production/components/setup/Currency/currencyEditForm'
import { UserEditForm } from '../modules/production/components/setup/users/userEditForm'
import { PaymentMethod } from '../modules/production/components/setup/PaymentMethod/paymentMethod'
import { PaymentMethodForm } from '../modules/production/components/setup/PaymentMethod/paymentMethodForm'
import { PaymentMethodEditForm } from '../modules/production/components/setup/PaymentMethod/paymentMethodEditForm'
import ArrivalDepartureStayOverReport from '../modules/production/components/report/ArrivalDepartureStayOverReport'
import RoomHistoryReport from '../modules/production/components/report/EmployeeListReport'
import GuestLedgerReport from '../modules/production/components/report/GuestLedgerReport'
import GuestOutstandingReport from '../modules/production/components/report/GuestOutstandingReport'
import { Company } from '../modules/production/components/setup/Company/company'
import { CompanyForm } from '../modules/production/components/setup/Company/companyForm'
import { CompanyEditForm } from '../modules/production/components/setup/Company/companyEditForm'
import { PaymentNote } from '../modules/production/components/setup/PaymentNote/paymentNote'
import { PaymentNoteForm } from '../modules/production/components/setup/PaymentNote/paymentNoteForm'
import { PaymentNoteEditForm } from '../modules/production/components/setup/PaymentNote/paymentNoteEditForm'
import MonthlyCheckInReport from '../modules/production/components/report/MonthlyCheckInReport'
import DailyRevenuSummaryReport from '../modules/production/components/report/DailyRevenuSummaryReport'
import CurrencyReport from '../modules/production/components/report/CurrencyReport'
import AuditTrailReport from '../modules/production/components/report/AuditTrailReport'
import ReceiptReport from '../modules/production/components/report/ReceiptReport'
import { AllReportPage } from '../modules/production/components/report/AllReportPage'

const accountBreadCrumbs: Array<PageLink> = [
  {
    title: '',
    path: '/cycle_details/cycle-details',
    isSeparator: false,
    isActive: false,
  },
]

const PrivateRoutes = () => {
  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        {/* <Route path='dashboard' element={<DashboardWrapper />} /> */}
        {/* <Route path='dashboard' element={<DashboardWrapper />} /> */}
        {/* <Route path='payroll-dashboard' element={<PayrollDashboardWrapper />} /> */}
        <Route path='/dashboard' element={<HRDashboardWrapper />} />

        {/* Employee  */}

        {/* <Route
         path='employee/*'
         element={
           
           <SuspensedView>
            <PageTitle breadcrumbs={accountBreadCrumbs}>All Employees</PageTitle>
             <Employee />
           </SuspensedView>
         }
        /> */}
        {/* <Route path='reports/reportComponent' element={<ReportComponent />} /> */}
        <Route
          path='frontOffice/walkIn/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Front Office</PageTitle>
              <WalkInPlanning />
            </SuspensedView>
          }
        />
        <Route
          path='frontOffice/reservation/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Reservation</PageTitle>
              <Reservation />
            </SuspensedView>
          }
        />
        <Route
          path='frontOffice/reservation/reservationForm'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Reservation Form</PageTitle>
              <ReservationForm />
            </SuspensedView>
          }
        />
        <Route
          path='frontOffice/reservation/reservationDetails/:id'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Reservation Details</PageTitle>
              <ReservationDetails />
            </SuspensedView>
          }
        />
        <Route
          path='frontOffice/reservationList/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Reservation List</PageTitle>
              <ReservationList />
            </SuspensedView>
          }
        />

        <Route
          path='grm/guests/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Guests</PageTitle>
              <Guests />
            </SuspensedView>
          }
        />
        <Route
          path='currency/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Currency</PageTitle>
              <Currency />
            </SuspensedView>
          }
        />
        <Route
          path='currencyEditForm/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Edit</PageTitle>
              <CurrencyEditForm />
            </SuspensedView>
          }
        />
        <Route
          path='currencyForm/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Currency</PageTitle>
              <CurrencyForm />
            </SuspensedView>
          }
        />
        <Route
          path='paymentMethod/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Payment Method</PageTitle>
              <PaymentMethod />
            </SuspensedView>
          }
        />
        <Route
          path='/paymentMethodForm'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Form</PageTitle>
              <PaymentMethodForm />
            </SuspensedView>
          }
        />
        <Route
          path='/paymentMethodEditForm'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Edit Form</PageTitle>
              <PaymentMethodEditForm />
            </SuspensedView>
          }
        />
        <Route
          path='paymentNotes/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Payment Notes</PageTitle>
              <PaymentNote />
            </SuspensedView>
          }
        />
        <Route
          path='/paymentNotesForm'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Form</PageTitle>
              <PaymentNoteForm />
            </SuspensedView>
          }
        />
        <Route
          path='/paymentNotesEditForm'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Edit Form</PageTitle>
              <PaymentNoteEditForm />
            </SuspensedView>
          }
        />
        <Route
          path='guest-form/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Guest Form</PageTitle>
              {/* <FileUploadForm /> */}
              <GuestMultiTabForm />
            </SuspensedView>
          }
        />
        <Route
          path='/notes-form/:id'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Guest Note</PageTitle>
              {/* <FileUploadForm /> */}
              <NotesForm />
            </SuspensedView>
          }
        />
        <Route
          path='grm/Notes/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Guest Note</PageTitle>
              {/* <FileUploadForm /> */}
              <Notes />
            </SuspensedView>
          }
        />
         <Route
          path='billing/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Billing</PageTitle>
              {/* <FileUploadForm /> */}
              <Billing/>
            </SuspensedView>
          }
        />
         <Route
          path='tax/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Taxes</PageTitle>
              <Taxes/>
            </SuspensedView>
          }
        />
         <Route
          path='/taxesForm/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>New Tax</PageTitle>
              <TaxesForm/>
            </SuspensedView>
          }
        />
         <Route
          path='/taxEditForm/:id'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Edit</PageTitle>
              <TaxEditForm/>
            </SuspensedView>
          }
        />

        <Route
          path='roomType/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Room Type</PageTitle>
              <RoomType />
            </SuspensedView>
          }
        />
        {/* <Route
         path='/rooms'
         element={
          
           <SuspensedView>
            <PageTitle breadcrumbs={accountBreadCrumbs}>Rooms</PageTitle>
             <Rooms />
           </SuspensedView>
         }
        /> */}
        <Route
          path='/roomTypeForm'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>New Room Type</PageTitle>
              <RoomTypeForm />
            </SuspensedView>
          }
        />
        <Route
          path='/services/category'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Category</PageTitle>
              <Category />
            </SuspensedView>
          }
        />
        <Route
          path='/services/details/:id'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Details</PageTitle>
              <Details />
            </SuspensedView>
          }
        />
        <Route
          path='/roomsForm/:id'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>New Room Type</PageTitle>
              <RoomForm />
            </SuspensedView>
          }
        />
        <Route
          path='/rooms/:id'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Rooms</PageTitle>
              <Rooms />
            </SuspensedView>
          }
        />
        <Route
          path='/roomDetails'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Room Details</PageTitle>
              <RoomDetails />
            </SuspensedView>
          }
        />
        <Route
          path='/housekeeping'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>House Keeping</PageTitle>
              <HouseKeeping />
            </SuspensedView>
          }
        />
        
        <Route
          path='/housekeeping/:id'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>House Keeping Items</PageTitle>
              <Housekeepingitems />
            </SuspensedView>
          }
        />
         <Route
          path='/front-office/service'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Guest Service</PageTitle>
              <Service/>
            </SuspensedView>
          }
        />
         <Route
          path='/users'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Users</PageTitle>
              <Users/>
            </SuspensedView>
          }
        />
         <Route
          path='/users/userEditForm/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Edit</PageTitle>
              <UserEditForm/>
            </SuspensedView>
          }
        />
          <Route
           path='/usersForm'
           element={
             <SuspensedView>
               <PageTitle breadcrumbs={accountBreadCrumbs}>User Registration</PageTitle>
               <UsersForm/>
             </SuspensedView>
           }
         />
         <Route
          path='/roles'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Roles</PageTitle>
              <Roles/>
            </SuspensedView>
          }
        />
         <Route
          path='/rolesForm'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>New Role</PageTitle>
              <RolesForm/>
            </SuspensedView>
          }
        />
        {/* <Route
         path='employee-form/*'
         element={
          
           <SuspensedView>
            <PageTitle breadcrumbs={accountBreadCrumbs}>Employee Entries</PageTitle>
             <MultiTabForm />
           </SuspensedView>
         }
        /> */}
        {/* <Route
         path='employee-edit-form/:id'
         element={
          
           <SuspensedView>
            <PageTitle breadcrumbs={accountBreadCrumbs}>Employee Entries</PageTitle>
             <EmployeeEditForm />
           </SuspensedView>
         }
        /> */}
        {/* <Route
         path='employee-details/:id'
         element={
          
           <SuspensedView>
            <PageTitle breadcrumbs={accountBreadCrumbs}>Employee Details</PageTitle>
             <EmplyeeDetails />
           </SuspensedView>
         }
        /> */}
        {/* All Reports  */}

        
        <Route
          path='report-page/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>All Reports</PageTitle>
              <AllReportPage />
            </SuspensedView>
          }
        />
        {/* Transaction > HR Routes  */}

        {/* <Route
         path='transaction/hr/recruitment-selection*'
         element={
           <SuspensedView>
            <PageTitle breadcrumbs={accountBreadCrumbs}>Recruitment and Selections</PageTitle>
             <RecruitmentSelection />
           </SuspensedView>
         }
        /> */}
        {/* <Route
         path='transaction/hr/compensation-benefit*'
         element={
           <SuspensedView>
            <PageTitle breadcrumbs={accountBreadCrumbs}>Compensation and Benefits</PageTitle>
             <CompensationBenefit />
           </SuspensedView>
         }
        /> */}
        {/* <Route
         path='transaction/payroll/non-recurrent*'
         element={
          
           <SuspensedView>
            <PageTitle breadcrumbs={accountBreadCrumbs}>Non-Recurrents</PageTitle>
             <NonRecurrent />
           </SuspensedView>
         }
        /> */}
        {/* <Route
         path='transaction/payroll/saving-schemes*'
         element={
          
           <SuspensedView>
            <PageTitle breadcrumbs={accountBreadCrumbs}>Saving Schemes</PageTitle>
             <SavingSchemes />
           </SuspensedView>
         }
        /> */}
        {/* <Route
         path='transaction/payroll/salary-upgrade*'
         element={
           <SuspensedView>
            <PageTitle breadcrumbs={accountBreadCrumbs}>Salary Upgrade</PageTitle>
             <SalaryUploads />
           </SuspensedView>
         }
        /> */}
        {/* <Route
         path='transaction/payroll/relief-rebate*'
         element={
          
           <SuspensedView>
            <PageTitle breadcrumbs={accountBreadCrumbs}>Relief and Rebate Input</PageTitle>
             <ReliefRebate />
           </SuspensedView>
         }
        /> */}

        {/* Processes > HR Routes  */}
        {/* <Route
         path='transaction/payroll/relief-rebate*'
         element={
          
           <SuspensedView>
            <PageTitle breadcrumbs={accountBreadCrumbs}>Relief and Rebate Input</PageTitle>
             <ReliefRebate />
           </SuspensedView>
         }
        /> */}

        {/* Processes > Payroll Routes  */}
        <Route
          path='processes/payroll/approval*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Approvals</PageTitle>
              <Approval />
            </SuspensedView>
          }
        />
        <Route
          path='processes/payroll/check-tax*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Check Taxes</PageTitle>
              <CheckTax />
            </SuspensedView>
          }
        />

        <Route
          path='processes/payroll/journal*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Journals </PageTitle>
              <Journals />
            </SuspensedView>
          }
        />

        <Route
          path='processes/payroll/project-sheets-input*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Project Sheets and Inputs </PageTitle>
              <ProjectSheets />
            </SuspensedView>
          }
        />
        <Route
          path='processes/payroll/payrun*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Payruns </PageTitle>
              <Payrun />
            </SuspensedView>
          }
        />

        {/* All reports routes */}
        <Route
          path='report/payrollPAYEReport*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Payroll PAYE Reports</PageTitle>
              <PayrollPAYEReport />
            </SuspensedView>
          }
        />
        <Route
          path='report/BenefitTransactionInputReport*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>BenefitTransactionInputReport</PageTitle>
              <BenefitTransactionInputReport />
            </SuspensedView>
          }
        />
        <Route
          path='report/DeductionTransactionInputReport*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>
                DeductionTransactionInputReport
              </PageTitle>
              <DeductionTransactionInputReport />
            </SuspensedView>
          }
        />
        <Route
          path='EmployeeAgeRangeReport*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Employee Age Range Report</PageTitle>
              <EmployeeAgeRangeReport />
            </SuspensedView>
          }
        />
        <Route
          path='RoomHistoryReport/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Room History Report</PageTitle>
              <RoomHistoryReport />
            </SuspensedView>
          }
        />
        <Route
          path='ArrivalDepartureStayOverReport/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Arrival, Departure, Stay Over Report</PageTitle>
              <ArrivalDepartureStayOverReport />
            </SuspensedView>
          }
        />
        <Route
          path='MonthlyCheckInReport/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Monthly Check In Report</PageTitle>
              <MonthlyCheckInReport />
            </SuspensedView>
          }
        />
        <Route
          path='DailyRevenuSummaryReport/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Daily Revenu Summary Report</PageTitle>
              <DailyRevenuSummaryReport />
            </SuspensedView>
          }
        />
        <Route
          path='RoomHistoryReport/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Room History Report</PageTitle>
              <RoomHistoryReport />
            </SuspensedView>
          }
        />
        <Route
          path='CurrencyReport/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Currency Report</PageTitle>
              <CurrencyReport />
            </SuspensedView>
          }
        />
        <Route
          path='AuditTrailReport/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Audit Trail Report</PageTitle>
              <AuditTrailReport />
            </SuspensedView>
          }
        />
        <Route
          path='ReceiptReport/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Receipt</PageTitle>
              <ReceiptReport />
            </SuspensedView>
          }
        />
        <Route
          path='company/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Company Setup</PageTitle>
              <Company />
            </SuspensedView>
          }
        />
        <Route
          path='/Company/CompanyForm'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Form</PageTitle>
              <CompanyForm />
            </SuspensedView>
          }
        />
        <Route
          path='/Company/companyEditForm/'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Edit Form</PageTitle>
              <CompanyEditForm />
            </SuspensedView>
          }
        />
        <Route
          path='GuestOutstandingReport/*'
          element={
            <SuspensedView>
              <PageTitle breadcrumbs={accountBreadCrumbs}>Guest Outstanding Report</PageTitle>
              <GuestOutstandingReport />
            </SuspensedView>
          }
        />

        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--kt-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
