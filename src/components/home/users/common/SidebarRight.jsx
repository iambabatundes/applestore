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
  isSameDay,
} from "date-fns";
import {
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaMapMarkerAlt,
  FaTimes,
  FaPlus,
  FaCircle,
} from "react-icons/fa";

const SidebarRight = ({ isOpen, toggleSidebar, isMobile }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events] = useState([
    {
      id: 1,
      title: "Product Review Meeting",
      time: "09:00 AM - 10:00 AM",
      location: "Conference Room A",
      type: "meeting",
      date: new Date(),
    },
    {
      id: 2,
      title: "Customer Support Call",
      time: "12:00 PM - 01:00 PM",
      location: "Online",
      type: "call",
      date: new Date(),
    },
    {
      id: 3,
      title: "Order Processing Review",
      time: "03:00 PM - 04:00 PM",
      location: "Office",
      type: "task",
      date: new Date(),
    },
  ]);

  const getHeader = () => {
    return format(currentDate, "MMMM yyyy");
  };

  const getDaysOfWeek = () => {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const getEventsForSelectedDate = () => {
    return events.filter((event) => isSameDay(event.date, selectedDate));
  };

  const getEventTypeColor = (type) => {
    const colors = {
      meeting: "#667eea",
      call: "#f093fb",
      task: "#4facfe",
    };
    return colors[type] || "#667eea";
  };

  if (!isOpen && isMobile) return null;

  return (
    <aside className={`sidebar-right ${isOpen ? "open" : "closed"}`}>
      {isMobile && (
        <button className="sidebar-close-btn" onClick={toggleSidebar}>
          <FaTimes />
        </button>
      )}

      <div className="sidebar-right-content">
        {/* Calendar Section */}
        <div className="calendar-card">
          <div className="calendar-header">
            <button className="calendar-nav-btn" onClick={handlePrevMonth}>
              <FaChevronLeft />
            </button>
            <h2 className="calendar-title">{getHeader()}</h2>
            <button className="calendar-nav-btn" onClick={handleNextMonth}>
              <FaChevronRight />
            </button>
          </div>

          <div className="calendar-grid-wrapper">
            <div className="days-of-week">
              {getDaysOfWeek().map((day, index) => (
                <div key={index} className="day-name">
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-grid">
              {getDatesForCurrentMonth().map((date, index) => {
                const hasEvent = events.some((event) =>
                  isSameDay(event.date, date)
                );
                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(date)}
                    className={`calendar-day ${
                      !isSameMonth(date, currentDate) ? "disabled" : ""
                    } ${isToday(date) ? "today" : ""} ${
                      isSameDay(date, selectedDate) ? "selected" : ""
                    } ${hasEvent ? "has-event" : ""}`}
                  >
                    <span className="day-number">{format(date, "d")}</span>
                    {hasEvent && <span className="event-dot"></span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="schedule-card">
          <div className="schedule-header">
            <h2>
              Schedule
              <span className="schedule-date">
                {format(selectedDate, "MMM d, yyyy")}
              </span>
            </h2>
            <button className="add-event-btn" title="Add Event">
              <FaPlus />
            </button>
          </div>

          <div className="schedule-list">
            {getEventsForSelectedDate().length > 0 ? (
              getEventsForSelectedDate().map((event) => (
                <div key={event.id} className="event-card">
                  <div
                    className="event-indicator"
                    style={{ backgroundColor: getEventTypeColor(event.type) }}
                  ></div>
                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-details">
                      <span className="event-time">
                        <FaClock className="detail-icon" />
                        {event.time}
                      </span>
                      <span className="event-location">
                        <FaMapMarkerAlt className="detail-icon" />
                        {event.location}
                      </span>
                    </div>
                    <span className={`event-badge ${event.type}`}>
                      {event.type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-events">
                <p>No events scheduled for this day</p>
                <button className="btn-add-first-event">
                  <FaPlus /> Add Event
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats-card">
          <h3 className="stats-title">This Month</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-circle meeting">
                <FaCircle />
              </div>
              <div className="stat-info">
                <span className="stat-value">8</span>
                <span className="stat-label">Meetings</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-circle call">
                <FaCircle />
              </div>
              <div className="stat-info">
                <span className="stat-value">12</span>
                <span className="stat-label">Calls</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-circle task">
                <FaCircle />
              </div>
              <div className="stat-info">
                <span className="stat-value">15</span>
                <span className="stat-label">Tasks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarRight;
