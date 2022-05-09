import {createSlice} from '@reduxjs/toolkit'
import appApi from '../services/appApi'

export const userSlice = createSlice({
    name:'user',
    initialState: null, 
    reducers: {
        addNotification: (state, {payload}) => {
            if(state.newMessage[payload]){
                state.newMessage[payload] = state.newMessage[payload] + 1
            }else {
                state.newMessage[payload] = 1 
            }
        },
        resetNotification: (state, {payload}) => {
            delete state.newMessage[payload]
        },
    },

    extraReducers: (builder) => {
        builder.addMatcher(appApi.endpoints.signupUser.matchFulfilled, (state, {payload}) => payload)
        builder.addMatcher(appApi.endpoints.loginUser.matchFulfilled, (state, {payload}) => payload)
        builder.addMatcher(appApi.endpoints.logoutUser.matchFulfilled, () => null)
    }
})

export const { addNotification, resetNotification } = userSlice.actions
export default userSlice.reducer