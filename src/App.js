import './App.css';

function App() {
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
      <div className = "daysGrid">7 x 5 Grid for Days</div>
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
