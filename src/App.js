import React, { useState } from "react";
import './App.css';

function App() {
  const months = ['January', 'Febuary', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

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

  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const changePrevMonth = () => {
    setCurrentMonthIndex((prevIndex) => (prevIndex === 0 ? 11 : prevIndex - 1));
    
  }
  const changeNextMonth = () => {
    setCurrentMonthIndex((prevIndex) => (prevIndex === 11 ? 0 : prevIndex + 1));
  }

  const firstDay = getFirstDayOfMonth(currentMonthIndex);
  console.log("First Day = ", firstDay);
  const daysInMonth = numberOfDaysInMonth(currentMonthIndex);
  console.log("Days In Month = ", daysInMonth);
  const finalDate = getFirstDayOfMonth(currentMonthIndex) + numberOfDaysInMonth(currentMonthIndex);
  console.log("Final Date = ", finalDate)

  // For the actual 35 grid of days of the week (creates a functional component using useState to have 
  // an array of size 35, setting initial values to nothing and giving each an id and space for text), grid items = current state of the grid, setGridItems is the function to override values
  const [gridItems, setGridItems] = useState(Array(35).fill("").map((_, index) => ({ id: index, text: index >= firstDay && index < finalDate ? "Valid Day" : "" })));

  const handleEdit = (id) => // For having each grid box have it's own text
    {
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
    };

    


  return (
    <div> 
      <div className = "topNamePlate">
        <div>Planned Life</div>
        <button className="accountButton">User</button>
      </div>
      <div className = "addBar">
        <input type ="search" className="searchBar" placeholder="Search for Plan:"></input>
        <button className= "addButtons">+ Add Plan</button>
      </div>
      <div className = "calendarTitle">
        <button className = "calendarButton" onClick = {changePrevMonth} >&lt;</button> {/* lt means less than symbol */}
        {months[currentMonthIndex]}
        <button className = "calendarButton" onClick = {changeNextMonth}>&gt;</button> {/* gt means greater than symbol */}
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
          <div key={item.id} className="daysGridArrays" onClick={() => handleEdit(item.id)}>
            {item.text}
          </div>
        ))}
      </div>
      <div className = "today">Coming Up Today:</div>
      <div className = "tomorrow">Tomorrow: </div>
      <div className = "otherUtilities">Other Utilities:</div>

      <div className = "filterBar">
        <div>Filters: </div>
        <button className= "filterButtons">Birthdays</button>
        <button className= "filterButtons">Events</button>
        <button className= "filterButtons">Reminders</button>
        <button className= "filterButtons">Appointments</button>
      </div>
      
    </div>
  );
}

export default App;
