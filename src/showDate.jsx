import React, { useEffect, useState } from 'react';
import "./Entries.css";
import axios from 'axios';
import moment from 'moment';
import DateSelector from './DateSelector';
import UserList from './usersList';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { baseURL } from './config'; // Adjust the import path as necessary

function Showdate(props) {
  const [data1, setdata1] = useState([]);
  const [data2, setdata2] = useState([]);
  const [Mtotal, setMtotal] = useState([]);
  const [Etotal, setEtotal] = useState([]);
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
  const [userId, setUserId] = useState("");
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const response = await axios.get(`${baseURL}/adminAuth`);
        if (response.status === 200) {
          setAdmin(true);
        } else {
          setAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setAdmin(false);
      }
    };

    fetchAdminStatus();
  }, []);


  const updateDates = (start, end) => {
    // Convert dates to yyyy-mm-dd format using Moment.js
    const formattedStartDate = moment(start).format('YYYY-MM-DD');
    const formattedEndDate = moment(end).format('YYYY-MM-DD');

    // Set the formatted dates
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
  };

  const handleDelete = async (itemId, time) => {
    try {
      // Make an HTTP request to your backend to delete the entry with itemId
      const response = await axios.delete(`${baseURL}/deleteEntry`, { data: { itemId, time } });
      // Check the status code of the response
      console.log(itemId,time);
      if (response.status === 200) {
        // If the deletion was successful, update the state or perform any necessary actions
        fetchData(); // Refetch data after deletion
        console.log('Entry deleted successfully');
      } else {
        // If the server returns an error status code, log the error
        console.error('Error deleting entry:', response.data.error);
      }
    } catch (error) {
      // If an error occurs during the request, log the error
      console.error('Error deleting entry:', error);
    }
  };
  

  function ShowingEntries({ item, time }) {
    return (
      <tr className="MorningData" key={item.id}>
        <td>{moment(item.date).format('DD-MMM-YYYY')}</td>
        <td>{item.weight} kg</td>
        <td>{item.fat}</td>
        <td>{item.price}</td>
        <td>{item.total}</td>
        {!props.userId && <td>
          <FontAwesomeIcon
            className='deleteIcon'
            icon={faTrashAlt}
            onClick={() => handleDelete(item.id, time)}
          />
        </td>}
      </tr>
    );
  }

  function showdata(data, total, time) {
    return (
      <table className="morningEntries">
        <thead>
          <tr className="MorningHeading">
            <th>DATE</th>
            <th>WEIGHT</th>
            <th>FAT</th>
            <th>PRICE</th>
            <th>TOTAL PRICE</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <ShowingEntries key={item.id} item={item} time={time} />
          ))}
        </tbody>
        <tr className="MorningHeading" style={{ color: 'black' }}>
          <th>{total.totaldate} DAYS</th>
          <th>{total.totalweight} KG</th>
          <th>----</th>
          <th>----</th>
          <th>{total.totalmoney} RS</th>
          <th></th>
        </tr>
      </table>
    );
  }
  const fetchData = async () => {
    try {
      let response;
      if (userId) {
        console.log("here");
        // If userId is present, send request with userId
        response = await axios.post('https://dairy-backend-7sc5.onrender.com/admin/showEntries', { startDate, endDate, userId });
      } else if (props.userId) {
        // If props.userId is present, send request with props.userId
        response = await axios.post('https://dairy-backend-7sc5.onrender.com/admin/showEntries', { startDate, endDate, userId: props.userId });
      }else {
        // Otherwise, send request to '/showEntries' (default endpoint)
        response = await axios.post('https://dairy-backend-7sc5.onrender.com/showEntries', { startDate, endDate });
      }

      if (!response.data) {
        throw new Error('No data received');
      }
      const { morningEntries, eveningEntries, morningTotal, eveningTotal } = response.data;
      setdata1(morningEntries);
      setdata2(eveningEntries);
      setMtotal(morningTotal);
      setEtotal(eveningTotal);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };
  useEffect(() => { 
    fetchData();
  }, [userId, startDate, endDate]); // Include props.userId in the dependency array
  const handleUserSelect = (selectedUserId) => {
    setUserId(selectedUserId);
  };
  return (
    <div className='main1'>
       {admin && <UserList onSelectUser={handleUserSelect} />}
      <div className="DateSelector"><DateSelector updateDates={updateDates} /></div>
      <div className='EntriesTable'>
        <div>
          <h1>MORNING</h1>
          {showdata(data1, Mtotal, "morning")}
        </div>
        <div>
          <h1>EVENING</h1>
          {showdata(data2, Etotal, "evening")}
        </div>
      </div>
    </div>
  );
}

export default Showdate;
