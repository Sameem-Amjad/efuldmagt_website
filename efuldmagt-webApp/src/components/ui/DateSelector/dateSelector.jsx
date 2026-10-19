import React, { useState } from "react";

const DateSelector = ({ day, setDay, month, setMonth, year, setYear }) => {
  // const [day, setDay] = useState('');
  // const [month, setMonth] = useState('');
  // const [year, setYear] = useState('');

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from(
    { length: 101 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {/* Day Selector */}
      <select
        name="dobDay"
        className="rounded-lg"
        value={day}
        onChange={(e) => setDay(e.target.value)}
      >
        <option value="" disabled>
          DD
        </option>
        {days.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* Month Selector */}
      <select
        name="dobMonth"
        className="rounded-lg"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        <option value="" disabled>
          Month
        </option>
        {months.map((m, index) => (
          <option key={index} value={m}>
            {m}
          </option>
        ))}
      </select>

      {/* Year Selector */}
      <select
        name="dobYear"
        className="rounded-lg"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      >
        <option value="" disabled>
          YYYY
        </option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateSelector;
