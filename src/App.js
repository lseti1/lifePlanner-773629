import React, { useState, useEffect, useRef } from "react";
import './App.css';

function App() {
  const months = ['January', 'Febuary', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth(); 
  const nextDate = new Date();
  nextDate.setDate(currentDate.getDate() + 1);
  const [currentMonthOnCalendar, setCurrentMonthOnCalendar] = useState(currentMonth);
  const [gridItems, setGridItems] = useState([]);

  // These are related to having a pop up window (as oppose to a prompt)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalText, setModalText] = useState('');
  const [currentEditId, setCurrentEditId] = useState(null);

  // These are related to Search Bar and the Results
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const searchRef = useRef(null);

  const getFirstDayOfMonth = (monthIndex) => {
    const year = 2025;
    const firstDayIndex = new Date(year, monthIndex, 1).getDay();
    return firstDayIndex - 1;
  };

  const numberOfDaysInMonth = (monthIndex) => {
    const year = 2025;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    return daysInMonth;
  };

  const firstDayIndex = getFirstDayOfMonth(currentMonthOnCalendar);
  const finalDayIndex = getFirstDayOfMonth(currentMonthOnCalendar) + numberOfDaysInMonth(currentMonthOnCalendar);

  // To Set up the grid of an array of 35, initialising each to nothing and setting id up for each array with empty text for now
  const calculateGridItems = (firstDayIndex, finalDayIndex, currentMonthOnCalendar) => {
    const gridItems = Array(35).fill("").map((_, index) => ({ id: index, text: "" }));

    // To ensure that plans are still linked to their correct dates even after refreshes
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key.startsWith(`plan_${currentMonthOnCalendar}_`)) {
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
    const firstDayIndex = getFirstDayOfMonth(currentMonthOnCalendar);
    const finalDayIndex = getFirstDayOfMonth(currentMonthOnCalendar) + numberOfDaysInMonth(currentMonthOnCalendar);

    const initialGridItems = calculateGridItems(firstDayIndex, finalDayIndex, currentMonthOnCalendar);
    setGridItems(initialGridItems);
  }, [currentMonthOnCalendar]); 

  const changePrevMonth = () => {
    setCurrentMonthOnCalendar((prevIndex) => (prevIndex === 0 ? 11 : prevIndex - 1));
  }
  const changeNextMonth = () => {
    setCurrentMonthOnCalendar((prevIndex) => (prevIndex === 11 ? 0 : prevIndex + 1));
  }

  const handlePrevMonthClick = () => {
    changePrevMonth();
    setGridItems(calculateGridItems(firstDayIndex, finalDayIndex));
  };

  const handleNextMonthClick = () => {
    changeNextMonth();
    setGridItems(calculateGridItems(firstDayIndex, finalDayIndex));
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setModalText(''); // Clear the modal text
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

  const searchPlans = (search) => {
    const allPlans = seePlans();
    return allPlans.filter((plan) =>
      plan.plan.toLowerCase().includes(search.toLowerCase())
    );
  };

  useEffect(() => {
    if (search) {   // To show results on search bar if active
      const filteredResults = searchPlans(search);
      setResults(filteredResults);
      setIsVisible(true);
    }
    else {
      setResults([]);
    }
  }, [search]);

  const handleMinimising = (event) => { // To hide results when search bar is clicked off
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

  const TodaysPlan = getPlan(currentDay + getFirstDayOfMonth(currentMonth) - 1, currentMonth);
  const TomorrowsPlan = getPlan(currentDay + getFirstDayOfMonth(currentMonth), currentMonth);
  const currentDayIndex = currentDay + getFirstDayOfMonth(currentMonth) - 1; 
  const isCalendarOnCurrentMonth = currentMonthOnCalendar === currentMonth;
  const selectedDayIndex = currentEditId - firstDayIndex + 1;

  // TO allow each date to have editable text
  const handleEdit = (id) => {
    if ((id >= currentDayIndex && id < finalDayIndex && currentMonthOnCalendar == currentMonth) || (currentMonthOnCalendar > currentMonth && id >= firstDayIndex && id < finalDayIndex)) {
      setCurrentEditId(id);
      setModalText(gridItems[id].text);
      setIsModalVisible(true);
      console.log("ID = ", id);
    }
  };

  const handleSave = () => {
    if (currentEditId !== null) {
      setGridItems((prev) => {
        return prev.map((item) => item.id === currentEditId ? { ...item, text: modalText } : item);
      });
      console.log("currentEditId = ", currentEditId);
      console.log("selectedDayIndex = ", selectedDayIndex);
      savePlan(modalText, currentEditId, currentMonthOnCalendar);
      closeModal();
    }
  };

  const handleQuickDelete = (e, id) => {
    e.stopPropagation();
    setGridItems((prev) => {
      return prev.map((item) => item.id === id ? { ...item, text: ""} : item);
    });

    savePlan("", id, currentMonthOnCalendar); 
  };

  return (
    <div>
      <div className="unsupportedMessage">
        <h1>Attention</h1>
        <p>This screen size is not supported by this app. <br  />Please use a larger screen to utilise this application.</p>
      </div>
      <div className="topNamePlate">
        <h1><b>Life Planner</b></h1>
        <h1>{months[currentMonth]} {currentDay}</h1>
      </div>
      <div className="search" ref={searchRef}>
        <input type="search" className="searchBar" placeholder="Search for Plan... " value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => setIsVisible(true)}></input>
        {isVisible && (
          <div className="results">
            {results.length > 0 ? (results.map((results, index) => (
              <div className="resultItem" key={index}>
                <li onClick={() => {setCurrentMonthOnCalendar(results.month); setIsVisible(false); setSearch(""); }}>
                  {results.plan} ({months[results.month]} {results.index - getFirstDayOfMonth(results.month) + 1})
                </li>
              </div>
            ))) : search ? (<p className="resultItem noHover">No plans found.</p>) : null}
          </div>
        )}
      </div>
      <div className="calendarTitle">
        <button className="calendarButton bt1" onClick={handlePrevMonthClick} >&lt;</button>
        {/* <h2>{months[currentMonthOnCalendar]}</h2> */}
        <select className="monthSelector" value={currentMonthOnCalendar} onChange={(e) => setCurrentMonthOnCalendar(e.target.value)}>
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>
        <button className="calendarButton bt2" onClick={handleNextMonthClick}>&gt;</button>
      </div>
      <div className="daysOfWeek">
        <p>Monday</p>
        <p>Tuesday</p>
        <p>Wednesday</p>
        <p>Thursday</p>
        <p>Friday</p>
        <p>Saturday</p>
        <p>Sunday</p>
      </div>
      <div className="daysGrid">
        {gridItems.map((item) => (
          <div key={item.id} className={`daysGridArrays 
              ${item.id === currentDayIndex && isCalendarOnCurrentMonth ? "today" : ""}
              ${item.id >= currentDayIndex && item.id < finalDayIndex && isCalendarOnCurrentMonth || currentMonthOnCalendar > currentMonth && item.id > firstDayIndex - 1 && item.id < finalDayIndex ? "" : "noHover"}
              ${item.id < currentDayIndex && isCalendarOnCurrentMonth || currentMonthOnCalendar < currentMonth ? "pastDay" : ""} `}
            onClick={() => handleEdit(item.id)}>
            {item.id >= firstDayIndex && item.id < finalDayIndex && (
              <div className="daysGridDates">{item.id - firstDayIndex + 1}.</div>
            )} 
            {item.text}
            <button className="daysGridArrayDeleteButton" onClick={(e) => handleQuickDelete(e, item.id)}>Clear</button>            
          </div>
        ))}
      </div>
      {isModalVisible && (
        <>
          <div className="modalBackground" onClick={closeModal}></div>
          {gridItems.map((item) => (
            <div className="modal" key={item.id}>
              <h1>{months[currentMonthOnCalendar]} {selectedDayIndex} Plan: </h1>
              <textarea
                value={modalText}
                onChange={(e) => setModalText(e.target.value)}
              />
              <div className="modalButtonsContainer">
                <button className="modalButton" onClick={handleSave}>Save</button>
                <button className="modalButton" onClick={closeModal}>Exit</button>
              </div>
            </div>
          ))}
        </>
      )}

      <div className="todayTitle">
        <h2>Today's Plans:</h2>
      </div>
      <div className="todayText">
        <p>{TodaysPlan ? TodaysPlan.plan.trim() != "" ? TodaysPlan.plan : "No Plans For Today" : "No Plans For Today"}</p>
      </div>
      <div className="todayTomorrowOverlay planToday" onClick={() => {setCurrentMonthOnCalendar(currentMonth); handleEdit(currentDayIndex); }}>
        <h1>Click to Edit</h1>
      </div>
      <div className="tomorrowTitle">
        <h2>Tomorrow's Plans:</h2>
      </div>
      <div className="tomorrowText">
        <p>{TomorrowsPlan ? TomorrowsPlan.plan.trim() != "" ? TomorrowsPlan.plan : "No Plans For Today" : "No Plans For Today"}</p>
      </div>
      <div className="todayTomorrowOverlay planTomorrow" onClick={() => {setCurrentMonthOnCalendar(currentMonth); handleEdit(currentDayIndex + 1); }}>
        <h1>Click to Edit</h1>
      </div>
      <div className="disclaimer">
        <p>This app uses Session Storage, plans <br />will not be saved when closed<br />(Also best viewed in Full Screen)</p>
      </div>
    </div>
  );
}

export default App;
