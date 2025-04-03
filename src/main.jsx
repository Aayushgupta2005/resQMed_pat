import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Settings from './pages/Settings.jsx'
import Appointments from './pages/Appointments.jsx'
import Reports from './pages/Reports.jsx'
import { AuthLayout, Login } from './components/index.js'

import Signup from './pages/Signup'
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: <LandingPage />,
        },
        {
            path: "/login",
            element: (
                <AuthLayout authentication={false}>
                    <Login />
                </AuthLayout>
            ),
        },
        {
            path: "/signup",
            element: (
                <AuthLayout authentication={false}>
                    <Signup />
                </AuthLayout>
            ),
        },
        {
            path: "/dashboard",
            element: (
                <AuthLayout authentication={true}>
                    <Dashboard />
                </AuthLayout>
            ),
        },
        {
            path: "/reports",
            element: (
                <AuthLayout authentication={true}>
                    <Reports />
                </AuthLayout>
            ),
        },
        {
            path: "/appointments",
            element: (
                <AuthLayout authentication={true}>
                    <Appointments />
                </AuthLayout>
            ),
        },
        {
            path: "/settings",
            element: (
                <AuthLayout authentication={true}>
                    <Settings />
                </AuthLayout>
            ),
        },
    ],
},
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>,
)
