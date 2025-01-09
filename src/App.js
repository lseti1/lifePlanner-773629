import React, { useState } from "react";
import './App.css';

function App() {

  // Create a 7x5 grid by generating 35 items
  const [gridItems, setGridItems] = useState(
    Array(35).fill("").map((_, index) => ({ id: index, text: "" }))
  );

  // Handle editing a grid item
  const handleEdit = (id) => {
    const newText = prompt("Edit the text for this box:", gridItems[id].text);
    if (newText !== null) {
      setGridItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, text: newText } : item
        )
      );
    }
  };

  return (
    <div> 
      <div className = "topNamePlate">
        <div>Planned Life TM</div>
        <button className="accountButton">User</button>
      </div>
      <div className = "addBar">
        <input type ="search" className="searchBar" placeholder="Search for Plan:"></input>
        <button className= "filterButtons">+ Add Plan</button>
      </div>
      <div className = "calendarTitle">Month: ???</div>
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
            {item.text || item.id + 1}
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
