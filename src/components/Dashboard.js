import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { axiosWithAuth } from '../utils/axiosWithAuth';

const Dashboard = props => {
  const [user, setUser] = useState({
    id:'',
    username: '',
    phone_number: ''
  });
  const [plants, setPlants] = useState([]);
  const [addedPlant, setAddedPlant] = useState({
    nickname: '',
    species: '',
    frequency: ''
  });
  const id = localStorage.getItem('userID');

// USER DETAILS
  useEffect(() => {
    axiosWithAuth()
      .get(`/api/users/${id}`)
      .then(res => {
        console.log('Data from useEffect: ', res.data);
        setUser({
          id: res.data.id,
          username: res.data.username,
          phone_number: res.data.phone_number
        });
      })
      .catch(err => `Error of type: ${err} has been thrown`);
  }, [id]);

  const editUser = e => {
    e.preventDefault();
    axiosWithAuth()
      .put(`/api/users/${id}`, {
        username: user.username,
        phone_number: user.phone_number
      })
      .then(() => {
        console.log('Edit successfull');
      });
  }

  const changeHandler = e => {
    setUser({
        ...user,
        [e.target.name]: e.target.value
      });
  }

// PLANT DETAILS
  useEffect(() => {
    axiosWithAuth()
      .get('/api/plants')
      .then(res2 => {
        setPlants(res2.data);
        console.log('Data from plant: ', res2.data);
      })
      .catch(err => `Error of type: ${err} has been thrown`);
    }, [setPlants]);

  const addPlant = e => {
    e.preventDefault();
    axiosWithAuth()
      .post('/api/plants/', {
        nickname: addedPlant.nickname,
        species: addedPlant.species,
        frequency: addedPlant.frequency
      })
      .then(res => {
        console.log('Plant added');
        // props.history.push('/dashboard');
      })
  };

  const plantChangeHandler = e => {
    setAddedPlant({
      ...addedPlant,
      [e.target.name]: e.target.value
    });
  }



  return(
    <>
      <h2>Hello . . . I'm just a test page!</h2>
      <Link to="/login">Logout</Link>
      <h3>My Plants:</h3>
      {plants.map(plant => <p key={plant.nickname}>{plant.nickname}</p>)}
      <form onSubmit={addPlant}>
        <input
          type="text"
          placeholder="Nickname"
          name="nickname"
          value={addedPlant.nickname}
          onChange={plantChangeHandler}
        />
        <button type="submit">Add Plant</button>
      </form>
      <form onSubmit={editUser}>
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={user.username}
          onChange={changeHandler}
        />
        <input
          type="text"
          placeholder="New Number"
          name="phone_number"
          value={user.phone_number}
          onChange={changeHandler}
        />
        <button type="submit">Edit Username</button>
      </form>
    </>
  );
}

export default Dashboard;