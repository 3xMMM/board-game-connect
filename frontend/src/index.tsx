import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import ErrorPage from "./ErrorPage";
import AdminLoginPage from "./admin/AdminLoginPage";
import RequireAdminAuth from "./auth/RequireAdminAuth";
import { baseTheme, ChakraProvider, extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import AdminDashboard from "./admin/AdminDashboard";
import AdminTagsView from './admin/AdminTagsView';

const theme = extendTheme(
    {
        colors: {
            primary: baseTheme.colors.purple,
            red: baseTheme.colors.red,
        },
    }, 
    withDefaultColorScheme({
        colorScheme: 'primary',
    })
);

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        errorElement: <ErrorPage/>,
    },
    {
        path: '/admin',
        element: <RequireAdminAuth/>,
        children: [
            {
                path: 'login',
                element: <AdminLoginPage/>,
            },
            {
                path: 'dashboard',
                element: <AdminDashboard/>,
            },
            {
                path: 'tags',
                element: <AdminTagsView/>,
            },
        ],
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <ChakraProvider theme={theme}>
        <RouterProvider router={router}/>
    </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
