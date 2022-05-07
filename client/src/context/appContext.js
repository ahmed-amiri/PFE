import React from 'react'
import {io} from 'socket.io-client'
const socket_URL = 'http://localhost:4000'

export const socket = io(socket_URL)
export const AppContext = React.createContext()
