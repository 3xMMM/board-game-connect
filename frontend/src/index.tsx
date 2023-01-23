import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import ErrorPage from "./ErrorPage";
import AdminLogin from "./admin/AdminLogin";
import { baseTheme, ChakraProvider, extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

const theme = extendTheme(
    {
        colors: {
            primary: baseTheme.colors.purple,
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
        path: '/admin/login',
        element: <AdminLogin/>,
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <RouterProvider router={router}/>
        </ChakraProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
