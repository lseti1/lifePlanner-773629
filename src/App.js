import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const months = ['January', 'Febuary', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth  = currentDate.getMonth();
  const nextDate = new Date();


  nextDate.setDate(currentDate.getDate() + 1);  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB');
  }

  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [gridItems, setGridItems] = useState([]);

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

  // For the actual 35 grid of days of the week (creates a functional component using useState to have 
  // an array of size 35, setting initial values to nothing and giving each an id and space for text), grid items = current state of the grid, setGridItems is the function to override values
  const calculateGridItems = (firstDay, finalDate) => {return Array(35).fill("").map((_, index) => ({ id: index, text: " " })); };

  useEffect(() => {
    const firstDay = getFirstDayOfMonth(currentMonthIndex);
    const finalDate = getFirstDayOfMonth(currentMonthIndex) + numberOfDaysInMonth(currentMonthIndex);

    const initialGridItems = calculateGridItems(firstDay, finalDate);
    setGridItems(initialGridItems);
  }, [currentMonthIndex]); // These functions are called each time currentMonthIndex is changed basically

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

  const handleEdit = (id) => { // For having each grid box have it's own text
    if (id >= firstDay && id < finalDate) { // Adjusted to prevent text to be added to invalid dates (e.g. next month or prev month)
      const newText = prompt("Add your plan for this day: ", gridItems[id].text);
      if (newText !== null) 
        {
          setGridItems((prev) => 
            {
              const updatedGrid = prev.map((item) => item.id === id ? { ...item, text: newText } : item);
              console.log("New Plan '%s' Added at index '%d'.", newText, id); // For Printing changes into the console 
              console.log("Updated Grid Items:", updatedGrid); // Note that React runs code twice in development mode
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
      <div className = "search">
        <input type ="search" className="searchBar" placeholder="Search for Plan... "></input>
      </div>
      <div className = "calendarTitle">
        <button className = "calendarButton" onClick = {handlePrevMonthClick} >&lt;</button> {/* lt means less than symbol */}
        {months[currentMonthIndex]}
        <button className = "calendarButton" onClick = {handleNextMonthClick}>&gt;</button> {/* gt means greater than symbol */}
      </div>
      <div className = "daysOfWeek">
        <div>Monday</div>
        <div>Tuesday</div>
        <div>Wednesday</div>
        <div>Thursday</div>
        <div>Friday</div>
        <div>Saturday</div>
        <div>Sunday</div>
      </div>
      <div className = "daysGrid">
        {gridItems.map((item) => (
          <div 
            key={item.id} 
            className={`daysGridArrays 
              ${item.id === currentDay + firstDay - 1 && currentMonth === currentMonthIndex ? "highlight" : ""}
              ${item.id < firstDay || item.id >= finalDate || (item.id <= currentDay && currentMonthIndex <= currentMonth) ? "no-hover" : ""}
              ${item.id <= currentDay && currentMonthIndex <= currentMonth ? "past-day" : ""}
              `}
            onClick={() => handleEdit(item.id)}
          >
            {item.id >= firstDay && item.id < finalDate && <div className="daysGridDates">{item.id - firstDay + 1}. </div>} {/* This is so that the date doesn't move off */}
            
            {item.text}
          </div>
        ))}
      </div>
      <div className = "todayTitle">Today's Plans:</div>
      <div className="todayText">
        {gridItems.find(item => item.id === currentDay + firstDay - 1)?.text && (
          <div>
            {gridItems.find(item => item.id === currentDay + firstDay - 1).text}
          </div>
        )}
      </div>
      <div className = "tomorrowTitle">Tomorrow's Plans:</div>
      <div className="tomorrowText">
        {gridItems.find(item => item.id === currentDay + firstDay)?.text && (
          <div>
            {gridItems.find(item => item.id === currentDay + firstDay).text}
          </div>
        )}
      </div>
      
    </div>
  );
}

export default App;
