import axios from 'axios'
import {AuthModel, UserModel} from './_models'
import { BASE_URL } from '../../production/urls'
import jwtDecode from 'jwt-decode'

// const API_URL = process.env.REACT_APP_API_URL
const API_URL = BASE_URL+`/users`

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`
export const LOGIN_URL = `${API_URL}/login`
export const REGISTER_URL = `${API_URL}/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`

// Server should return AuthModel
export function login(username: string, password: string) {
  return axios.post<AuthModel>(LOGIN_URL, {
    username,
    password,
  })
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{result: boolean}>(REQUEST_PASSWORD_URL, {
    email,
  })
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  })
}

// export function getUserByToken(token:string) {
//   // Simulating the API call by providing sample user data
//   // const userData = {
//   //   id: 1,
//   //   username: 'example_user',
//   //   email: 'user@example.com',
//   // };
//   const decodedToken = jwtDecode(token)
//   // Create a new instance of UserModel and populate it with the data
//   // const user = new UserModel(decodedToken.id, decodedToken.username, userData.email,decodedToken.lastName,decodedToken.firstName);
//   let user: UserModel = {
//     id: decodedToken.id,
//     username: decodedToken.username,
//     email: userData.email,
//     lastName: decodedToken.lastName,
//     firstName: decodedToken.firstName,
//     password: decodedToken.password
//     // fill in the rest of the fields as necessary
// };

//   // Now, 'user' contains the user data without making an actual API call
//   return user;
// }

// Create a function to create a mock user
// function createUser(id: number, username: string, email: string,firstName:string,lastName:string,password:string): UserModel {
//   return {
//     id,
//     username,
//     email,
//     firstName,
//     lastName,
//     password
//   };
// }

// // Usage
// export function getUserByToken(token: string): UserModel {
//   // Simulate getting user data without making an API call
//   const decodedToken = jwtDecode(token)
//   console.log(decodedToken)
//   // const user = createUser(decodedToken.id, decodedToken.username, decodedToken.email,decodedToken.firstName,decodedToken.lastName,decodedToken.password);
//   const user = createUser(1, 'example_user', 'user@example.com','','','');
//   return user;
// }
