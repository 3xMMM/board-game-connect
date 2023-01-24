import React from 'react';
import logo from './logo.svg';
import './App.css';
import AdminAuthProvider from "./auth/AdminAuthProvider";

function App() {
    return (
        <AdminAuthProvider>
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React and try things out. Oh snap. man
                    </a>
                </header>
            </div>
        </AdminAuthProvider>
    );
}

export default App;
