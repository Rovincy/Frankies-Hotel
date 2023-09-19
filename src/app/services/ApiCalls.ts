import axios from 'axios'

export  const Api_Endpoint ="https://app.sipconsult.net/frankiesHotelAPI/api";
// export const Api_Endpoint = 'https://localhost:5001/api'

export const fetchRoomsTypes = () => {
  return axios.get(`${Api_Endpoint}/roomsType`)
}
export const fetchRooms = () => {
  return axios.get(`${Api_Endpoint}/rooms`)
}
export const fetchServiceCategoryApi = () => {
  return axios.get(`${Api_Endpoint}/Service`)
}
export const fetchUsersApi = () => {
  return axios.get(`${Api_Endpoint}/users`)
}
export const fetchGuests = () => {
  return axios.get(`${Api_Endpoint}/guests`)
}
export const fetchNotes = () => {
  return axios.get(`${Api_Endpoint}/notes`)
}
export const fetchBookings = () => {
  return axios.get(`${Api_Endpoint}/Booking`)
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
export const addHouseItemApi = (values: any) => {
  return axios.post(`${Api_Endpoint}/HouseKeeping/`, values)
}

export const cancelBookingApi = (id: any) => {
  return axios.delete(`${Api_Endpoint}/Booking/${id}`, id)
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
export const updateGuestApi=(serviceId:any)=>{
 return  axios.put(`${Api_Endpoint}/GuestService/serviceId?serviceId=${serviceId}`, serviceId)

}