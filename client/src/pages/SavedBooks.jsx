/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  // Jumbotron,
  // Card
} from 'react-bootstrap';
// import { Jumbotron } from 'react-bootstrap/Jumbotron'
import { Navigate } from "react-router-dom";

// import { getMe, deleteBook } from '../utils/API';
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_BOOK, QUERY_ME } from "../utils/gql";

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // QUERIES
  const { loading, data, error } = useQuery(QUERY_ME);
  const me = data?.me || {};

  // MUTATIONS 
  const [deleteBook, { bookError, bookData }] = useMutation(DELETE_BOOK);


  // METHODS


  // const [userData, setUserData] = useState({});

  // // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;

  // useEffect(() => {
  //   const getUserData = async () => {
  //     try {
  //       const token = Auth.loggedIn() ? Auth.getToken() : null;

  //       if (!token) {
  //         return false;
  //       }

  //       const response = await getMe(token);

  //       if (!response.ok) {
  //         throw new Error('something went wrong!');
  //       }

  //       const user = await response.json();
  //       setUserData(user);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   getUserData();
  // }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    // const token = Auth.loggedIn() ? Auth.getToken() : null;

    // if (!token) {
    //   return false;
    // }

    try {
      const { data } = await deleteBook({
        variables: { id: me._id, bookToDelete: bookId }
      });
      // if success, remove boook id from local storage
      removeBookId(bookId);
    } catch (err) {
      console.log(JSON.parse(JSON.stringify(err)));
    }
  };

  // conditionals


  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  if (!Auth.loggedIn()) {
    return <Navigate to="/" />
  }

  return (
    <>
      {/* <Jumbotron fluid className="text-light bg-dark p-5"> */}
      <Container>
        <h1>Viewing saved books!</h1>
      </Container>
      {/* </Jumbotron> */}
      <Container>
        <h2 className='pt-5'>
          {me.savedBooks.length
            ? `Viewing ${me.savedBooks.length} saved ${me.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        {/* <CardColumns> */}
        <div>
          {me.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </div>
        {/* </CardColumns> */}
      </Container>
    </>
  );
};

export default SavedBooks;