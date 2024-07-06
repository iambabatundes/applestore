import React, { useState } from "react";
import "../../styles/sideBarRight.css";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
} from "date-fns";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

const SidebarRight = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getHeader = () => {
    return format(currentDate, "MMMM yyyy");
  };

  const getDaysOfWeek = () => {
    const start = startOfWeek(currentDate);
    return Array.from({ length: 7 }).map((_, index) =>
      format(addDays(start, index), "EEE")
    );
  };

  const getDatesForCurrentMonth = () => {
    const startMonth = startOfMonth(currentDate);
    const endMonth = endOfMonth(currentDate);
    const startWeek = startOfWeek(startMonth);
    const endWeek = endOfWeek(endMonth);
    let date = startWeek;
    const days = [];

    while (date <= endWeek) {
      days.push(date);
      date = addDays(date, 1);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <aside className="sidebar-right">
      <div className="calendar">
        <div className="header">
          <span onClick={handlePrevMonth}>
            <FaArrowAltCircleLeft />
          </span>
          <h2>{getHeader()}</h2>
          <span onClick={handleNextMonth}>
            <FaArrowAltCircleRight />
          </span>
        </div>
        <div className="days-of-week">
          {getDaysOfWeek().map((day, index) => (
            <div key={index} className="day">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-grid">
          {getDatesForCurrentMonth().map((date, index) => (
            <div
              key={index}
              className={`day ${
                !isSameMonth(date, currentDate) ? "disabled" : ""
              } ${isToday(date) ? "today" : ""}`}
            >
              {format(date, "d")}
            </div>
          ))}
        </div>
      </div>
      <div className="schedule">
        <h2>Schedule</h2>
        <div className="event">
          <p>Learn user flow</p>
          <span className="time">09:00 AM - 10:00 AM</span>
        </div>
        <div className="event">
          <p>Identify user pains</p>
          <span className="time">12:00 PM - 01:00 PM</span>
        </div>
      </div>
      <span>Delete</span>
    </aside>
  );
};

export default SidebarRight;
