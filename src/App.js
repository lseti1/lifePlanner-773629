import React, { useState, useEffect, useRef } from "react";
import './App.css';

function App() {
  const months = ['January', 'Febuary', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth  = currentDate.getMonth();
  const nextDate = new Date();
  nextDate.setDate(currentDate.getDate() + 1);  
  const [currentMonthIndex, setCurrentMonthIndex] = useState(currentMonth);
  const [gridItems, setGridItems] = useState([]);
  const [plans, setPlans] = useState([]);

  // These are related to Search Bar and the Results
  const [search, setSearch] = useState(""); 
  const [results, setResults] = useState([]); 
  const [isVisible, setIsVisible] = useState(false); 
  const searchRef = useRef(null); 

  const getFirstDayOfMonth = (monthIndex) => {
    const year = 2025;
    const firstDay = new Date(year, monthIndex, 1).getDay();
    return firstDay - 1;
  };

  const numberOfDaysInMonth = (monthIndex) => {
    const year = 2025;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    return daysInMonth;
  };

  const firstDay = getFirstDayOfMonth(currentMonthIndex);
  const finalDate = getFirstDayOfMonth(currentMonthIndex) + numberOfDaysInMonth(currentMonthIndex);

  // To Set up the grid of an array of 35, initialising each to nothing and setting id up for each array with empty text for now
  const calculateGridItems = (firstDay, finalDate, currentMonthIndex) => {
    const gridItems = Array(35).fill("").map((_, index) => ({ id: index, text: " " })); 
    
    // To ensure that plans are still linked to their correct dates even after refreshes
    for (let i = 0; i < sessionStorage.length; i++) { 
      const key = sessionStorage.key(i);
      if (key.startsWith(`plan_${currentMonthIndex}_`)) {
        const savedPlan = JSON.parse(sessionStorage.getItem(key));
        const gridItem = gridItems.find((item) => item.id === savedPlan.index);
        if (gridItem) {
          gridItem.text = savedPlan.plan; 
        }
      }
    }
    return gridItems; 
  };

  useEffect(() => {
    const firstDay = getFirstDayOfMonth(currentMonthIndex);
    const finalDate = getFirstDayOfMonth(currentMonthIndex) + numberOfDaysInMonth(currentMonthIndex);

    const initialGridItems = calculateGridItems(firstDay, finalDate, currentMonthIndex);
    setGridItems(initialGridItems);
  }, [currentMonthIndex]); // To get called each time currentMonthIndex is changed

  const changePrevMonth = () => {
    setCurrentMonthIndex((prevIndex) => (prevIndex === 0 ? 11 : prevIndex - 1));
  }
  const changeNextMonth = () => {
    setCurrentMonthIndex((prevIndex) => (prevIndex === 11 ? 0 : prevIndex + 1));
  }

  const handlePrevMonthClick = () => {
    changePrevMonth();
    setGridItems(calculateGridItems(firstDay, finalDate));
  };
  
  const handleNextMonthClick = () => {
    changeNextMonth();
    setGridItems(calculateGridItems(firstDay, finalDate));
  };

  const savePlan = (plan, index, month) => {
    const planData = { plan, index, month };
    const key = `plan_${month}_${index}`;
    sessionStorage.setItem(key, JSON.stringify(planData));
  };

  const getPlan = (index, month) => {
    const key = `plan_${month}_${index}`;
    const storedPlan = sessionStorage.getItem(key);
    return storedPlan ? JSON.parse(storedPlan) : null;
  };

  
  // To allow search function for any plans
  const seePlans = () => { 
    const allPlans = []; 
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i); 
      if (key.startsWith("plan_")) {     
        const plan = JSON.parse(sessionStorage.getItem(key)); 
        allPlans.push(plan);             
      }
    }
    return allPlans; 
  }

  // To have all the plans in one place and casing to be ignored when searching
  const searchPlans = (search) => { 
    const allPlans = seePlans();
    return allPlans.filter((plan) => 
      plan.plan.toLowerCase().includes(search.toLowerCase())
    );
  };

  // To show results on search bar if active
  useEffect(() => {
    if (search) {
      const filteredResults = searchPlans(search);
      setResults(filteredResults);
      setIsVisible(true); 
    } 
    else {
      setResults ([]);
    }
  }, [search]);

  // To hide results when search bar is clicked off
  const handleMinimising = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsVisible(false); 
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleMinimising);
    return () => {
      document.removeEventListener("mousedown", handleMinimising);
    };
  }, []);

  const TodaysPlan = getPlan(currentDay + firstDay - 1, currentMonth);
  const TomorrowsPlan = getPlan(currentDay + firstDay, currentMonth);

  // TO allow each date to have editable text
  const handleEdit = (id) => { 
    if (id >= firstDay && id < finalDate) { 
      const newText = prompt("Add your plan for this day: ", gridItems[id].text);
      if (newText !== null) {
          setGridItems((prev) => {
              const updatedGrid = prev.map((item) => item.id === id ? { ...item, text: newText } : item);
              savePlan(newText, id, currentMonthIndex);

              const planForToday = getPlan(id, currentMonthIndex);
              console.log("New Plan '%s' Added at index '%d' of month '%d", newText, id, currentMonthIndex); 
              console.log("Updated Grid Items:", updatedGrid); // Note that React runs code twice in development mode
              console.log("Today's Plan: ", planForToday);
              
              const storedPlans = seePlans();
              console.log("All Stored Plans: ", storedPlans);

              return updatedGrid;
            });
        }
    }
  };


  return (
    <div> 
      <div className = "topNamePlate">
        <div>LifePlanner</div>
        <button className="accountButton">User</button>
      </div>
      <div className = "search" ref = {searchRef}>
        <input type ="search" className="searchBar" placeholder="Search for Plan... " value = {search} onChange = {(e) => setSearch(e.target.value)} onFocus={() => setIsVisible(true)}></input>
        {isVisible && (
        <div className = "results">
          {results.length > 0 ? (results.map((results, index) => (
            <div className="result-item" key = {index}>
              {results.plan} ({months[results.month]} {results.index - firstDay + 1})
            </div>
          ))) : search ? (<div className = "no-result">No plans found.</div> ) : null}
        </div> )}
      </div>
      <div className = "calendarTitle">
        <button className = "calendarButton bt1" onClick = {handlePrevMonthClick} >&lt;</button> {/* lt means less than symbol */}
        {months[currentMonthIndex]}
        <button className = "calendarButton bt2" onClick = {handleNextMonthClick}>&gt;</button> {/* gt means greater than symbol */}
      </div>
      <div className = "daysOfWeek">
        <p>Monday</p>
        <p>Tuesday</p>
        <p>Wednesday</p>
        <p>Thursday</p>
        <p>Friday</p>
        <p>Saturday</p>
        <p>Sunday</p>
      </div>
      <div className = "daysGrid">
        {gridItems.map((item) => (
          <div 
            key={item.id} 
            className={`daysGridArrays 
              ${item.id === currentDay + firstDay - 1 && currentMonth === currentMonthIndex ? "highlight" : ""}
              ${item.id < firstDay || item.id >= finalDate || (item.id <= currentDay && currentMonthIndex <= currentMonth) ? "no-hover" : ""}
              ${item.id < currentDay + firstDay - 1 && currentMonthIndex === currentMonth ? "past-day" : ""}
              `}
            onClick={() => handleEdit(item.id)} >
            {item.id >= firstDay && item.id < finalDate && <div className="daysGridDates">{item.id - firstDay + 1}. </div>} {/* This is so that the date doesn't move off */}
            {item.text}
          </div> ))}
      </div>
      <div className = "todayTitle">Today's Plans:</div>
      <div className="todayText">
          <p>{TodaysPlan ? TodaysPlan.plan : "No Plans for Today."}</p>
      </div>
      <div className = "tomorrowTitle">Tomorrow's Plans:</div>
      <div className="tomorrowText">
        <p>{TomorrowsPlan ? TomorrowsPlan.plan : "No Plans for Tomorrow."}</p>
      </div>
      <div className = "disclaimer">(Best viewed in Full Screen)</div>
    </div>
  );
}

export default App;
