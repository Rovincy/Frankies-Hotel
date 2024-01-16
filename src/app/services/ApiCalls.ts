import axios from 'axios'

// export  const Api_Endpoint ="http://3.74.54.13//frankiesHotelAPI/api";
export  const Api_Endpoint ="https://app.sipconsult.net/frankiesHotelAPI/api";
// export const Api_Endpoint = 'https://localhost:5001/api';

export const fetchRoomsTypes = () => {
  return axios.get(`${Api_Endpoint}/roomsType`)
}
export const fetchRooms = () => {
  return axios.get(`${Api_Endpoint}/rooms`)
}
export const fetchTaxes = () => {
  return axios.get(`${Api_Endpoint}/tax`)
}
export const fetchSingleTax = (id:any) => {
  return axios.get(`${Api_Endpoint}/tax/id?id=${id}`)
}
export const fetchCurrencies = () => {
  return axios.get(`${Api_Endpoint}/Currency`)
}
export const fetchPaymentMethods = () => {
  return axios.get(`${Api_Endpoint}/PaymentMethod`)
}
export const fetchPaymentNotes = () => {
  return axios.get(`${Api_Endpoint}/PaymentNote`)
}
export const fetchActivePaymentMethods = () => {
  return axios.get(`${Api_Endpoint}/PaymentMethod/ActivePaymentMethod`)
}
export const fetchServiceCategoryApi = () => {
  return axios.get(`${Api_Endpoint}/Service`)
}
export const fetchUsersApi = () => {
  return axios.get(`${Api_Endpoint}/users`)
}
export const fetchRolesApi = () => {
  return axios.get(`${Api_Endpoint}/users/role`)
}
export const fetchGuests = () => {
  return axios.get(`${Api_Endpoint}/guests`)
}
export const fetchCompanies = () => {
  return axios.get(`${Api_Endpoint}/company`)
}
export const fetchNationalities = () => {
  return axios.get(`${Api_Endpoint}/nationality`)
}
export const fetchNotes = () => {
  return axios.get(`${Api_Endpoint}/notes`)
}
export const fetchBookings = () => {
  return axios.get(`${Api_Endpoint}/Booking`)
}
export const fetchCheckOutBookings = () => {
  return axios.get(`${Api_Endpoint}/Booking/CheckedOut`)
}
export const CheckOccupancy = () => {
  return axios.get(`${Api_Endpoint}/Booking/CheckOccupancy`)
}
export const fetchGuestBilling = (id: any,isCorporate:any,serviceType:any) => {
  // console.log(serviceType)
  // console.log(`${Api_Endpoint}/Billing/id?id=${id}&isCorporate=${isCorporate}&serviceType=[${serviceType}]`)
  return axios.get(`${Api_Endpoint}/Billing/id?id=${id}&isCorporate=${isCorporate}&serviceType=[${serviceType}]`)
}
export const currencyConverterApi = (From: string, To: string) => {
  const headers = {
    apikey: 'pqEEc9ttAP4ezLGMD40lUeKwTb12OGPD',
  }

  const baseCurrency = From
  const symbols = To

  const url = `https://api.apilayer.com/exchangerates_data/latest?symbols=${symbols}&base=${baseCurrency}`

  return axios.get(url, {headers})
}
export const fetchServiceDetailsApi = () => {
  return axios.get(`${Api_Endpoint}/ServiceDetails`)
}
export const fetchHouseKeepingApi = () => {
  return axios.get(`${Api_Endpoint}/HouseKeeping`)
}
export const fetchGuestServiceApi = () => {
  return axios.get(`${Api_Endpoint}/GuestService`)
}
export default (values: any) => {
  return axios.put(`${Api_Endpoint}/Booking/CheckIn`, values)
}
export const GuestCheckoutApi = (values: any) => {
  return axios.put(`${Api_Endpoint}/Booking/CheckOut`, values)
}
export const addNoteApi = (values: any) => {
  return axios.post(`${Api_Endpoint}/Notes`, values)
}
export const deleteGuestApi = (id: any) => {
  return axios.delete(`${Api_Endpoint}/Guests/${id}`, id)
}
export const addBookingApi = (values: any) => {
  return axios.post(`${Api_Endpoint}/Booking`, values)
}
export const addCategoryServiceApi = (values: any) => {
  return axios.post(`${Api_Endpoint}/ServiceDetails`, values)
}
export const deleteNotesApi = (id: any) => {
  return axios.delete(`${Api_Endpoint}/Notes/${id}`, id)
}
export const addServiceApi = (values: any) => {
  return axios.post(`${Api_Endpoint}/Service/`, values)
}
export const addGuestServiceApi = (values: any) => {
  return axios.post(`${Api_Endpoint}/GuestService/`, values)
}
export const auditTrail = (values: any) => {
  return axios.post(`${Api_Endpoint}/AuditTrail/`, values)
}
export const addGuestBilling = (values: any) => {
  return axios.post(`${Api_Endpoint}/Billing/`, values)
}
export const makeGuestBillingTransfer = (values: any) => {
  return axios.post(`${Api_Endpoint}/Billing/BillingTransfer`, values)
}
export const nightAudit = (id: any) => {
  return axios.post(`${Api_Endpoint}/NightAudit?guestId=${id}`)
}
export const addHouseItemApi = (values: any) => {
  return axios.post(`${Api_Endpoint}/HouseKeeping/`, values)
}

export const cancelBookingApi = (id: any) => {
  return axios.delete(`${Api_Endpoint}/Booking/${id}`, id)
}
export const saveTransfer = (value: any) => {
  // value.bookEnd = value.bookEnd.toISOString()
  // value.bookStart = value.bookStart.toISOString()
//   const originalDate = new Date(value.bookEnd);

// // Extract year, month, and day components
// const year = originalDate.getFullYear();
// const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
// const day = originalDate.getDate().toString().padStart(2, '0');

// const hours = originalDate.getHours().toString().padStart(2, '0');
// const minutes = originalDate.getMinutes().toString().padStart(2, '0');

// // Create the formatted date and time string in the format "YYYY-MM-DD HH:mm"
// const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
// value.bookEnd = formattedDateTime
// value.bookStart = formattedDateTime
// console.log("api: ",value.bookEnd)
// console.log("api: ",value)

  return axios.put(`${Api_Endpoint}/Booking/RoomTransfer/`, value)
}
export const checkRoomAvailability = (value:any) => {
  // console.log('From API: ',value)
  // Assuming value.bookEnd is a valid date string
const originalDate = new Date(value.bookEnd);

// Extract year, month, and day components
const year = originalDate.getFullYear();
const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
const day = originalDate.getDate().toString().padStart(2, '0');

const hours = originalDate.getHours().toString().padStart(2, '0');
const minutes = originalDate.getMinutes().toString().padStart(2, '0');

// Create the formatted date and time string in the format "YYYY-MM-DD HH:mm"
const formattedDateTime = `${year}-${month}-${day}`;

// console.log('Formatted Date and Time: ', formattedDateTime);
  return axios.get(`${Api_Endpoint}/Booking/CheckRoomAvailability?roomId=${value.roomId}&bookEnd=${formattedDateTime}`)
}
export const deleteRoomTypeApi = (id: any) => {
  return axios.delete(`${Api_Endpoint}/RoomsType/${id}`, id)
}

export const deleteServiceiceCategoryApi = (id: any) => {
  return axios.delete(`${Api_Endpoint}/Service/${id}`, id)
}
export const deleteUserApi = (id: any) => {
  return axios.delete(`${Api_Endpoint}/users/${id}`, id)
}
export const deleteCompany = (id: any) => {
  return axios.delete(`${Api_Endpoint}/company/id?id=${id}`, id)
}

export const deleteRoleApi = (id: any) => {
  return axios.delete(`${Api_Endpoint}/users/deleteRole?id=${id}`, id)
}

export const updateGuestApi=(serviceId:any)=>{
 return  axios.put(`${Api_Endpoint}/GuestService/serviceId?serviceId=${serviceId}`, serviceId)
}