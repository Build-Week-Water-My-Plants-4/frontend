import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosWithAuth } from '../utils/axiosWithAuth';
import { useRouteMatch, useParams } from 'react-router-dom';

import PlantCard from './PlantCard';

const Plant = props => {
  const [isEditing, setIsEditing] = useState(true);
  const [plant, setPlant] = useState({
    nickname: '',
    species: '',
    frequency: ''
  });

  const match = useRouteMatch();
  const { id } = useParams();

  const getData = id => {
    axiosWithAuth()
      .get(`/api/plants/${id}`)
      .then(res => {
        console.log('Data!!', res.data.plant);
        setPlant({
          nickname: res.data.plant.nickname,
          species: res.data.plant.species,
          frequency: res.data.plant.frequency
        });
      })
  }

  useEffect(() => {
    getData(match.params.id);
  }, [match.params.id]);

  console.log('Plants Comp: ', match);

  // EDITING PLANT DETAILS
  const editPlant = e => {
    e.preventDefault();
    axiosWithAuth()
      .put(`/api/plants/${id}`, {
        nickname: plant.nickname,
        species: plant.species,
        frequency: plant.frequency
      })
      .then(res => {
        console.log('This is put res:', res.data);
        props.history.push('/dashboard');
      });
  }

  const plantChangeHandler = e => {
    setPlant({
      ...plant,
      [e.target.name]: e.target.value
    });
  }

  const deletePlant = () => {
    axiosWithAuth()
      .delete(`/api/plants/${id}`)
      .then(res => {
        console.log("Deleted Plant");
        props.history.push('/dashboard');
      });
  }

  return(
    // CARD
    <div>
      <div style={{display:'flex', justifyContent:'flex-end', margin:'2rem 2rem'}}>
        <button onClick={deletePlant} className="delete-btn">Delete Plant</button>
      </div>
      <PlantCard plant={plant}/>
      <h2 style={{margin:'2rem 0 2rem'}}>Edit Plant</h2>
      <form onSubmit={editPlant} style={{display:'block', margin:'0 auto', padding:'0', display:'flex', flexWrap:'wrap', flexDirection:'column', alignItems:'center'}}>
        <label htmlFor="nickname">
          New Nickname:
        </label>
        <input
          type="text"
          placeholder="New Nickname"
          name="nickname"
          value={plant.nickname}
          onChange={plantChangeHandler}
        />
        <label htmlFor="species">
          Species Name:
        </label>
        <input
          type="text"
          placeholder="Species"
          name="species"
          value={plant.species}
          onChange={plantChangeHandler}
        />
        <label htmlFor="frequency">
          Watering Frequency:
        </label>
        <input
          type="text"
          placeholder="Watering Frequency"
          name="frequency"
          value={plant.frequency}
          onChange={plantChangeHandler}
        />
        <button type="submit">Save Edit</button>
      </form>
    </div>
  );
}

export default Plant;
