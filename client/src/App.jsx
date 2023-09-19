import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
// import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';


// FUNCTIONS
const httpLink = createHttpLink({ uri: "/graphql" });
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({})
});


function App() {
  return (
    <ApolloProvider client={client}>

      <>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<SearchBooks />} />
          <Route exact path='/saved' element={<SavedBooks />} />
          <Route exact render={() => <h1 className='display-2'>Wrong Page!</h1>} />
        </Routes>
      </>
    </ApolloProvider>
  );
}

export default App;