import React, { useState, useEffect } from "react";
import DateSelector1 from './DateSelector1';
import TotalBalance from "./balance/totalbalance";
import BalanceSheet from "./balance/balancesheet";
import moment from "moment";
import UserList from "./usersList";
import axios from "axios";
import { baseURL } from './config'; // Adjust the import path as necessary
function Balance() {
    const [startDate, setStartDate] = useState(moment().startOf('year').format('YYYY-MM-DD'));
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
  
    const handleDateRangeSelection = (startDate, endDate) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };
      // Function to handle user selection from UserList
  const handleUserSelect = (selectedUserId) => {
    setUserId(selectedUserId);
  };
    return (
    <div className="balance-table-container">
    {admin && <UserList onSelectUser={handleUserSelect} />}
    <button onClick={()=>{window.print()}}>Print</button>
    <h3>From {startDate} to {endDate}</h3>
    <DateSelector1 onSelectDateRange={handleDateRangeSelection} />
    <TotalBalance startDate={startDate} endDate={endDate} userId={userId}/>
    <BalanceSheet startDate={startDate} endDate={endDate} userId={userId} />
    </div>
    );
}

export default Balance;
