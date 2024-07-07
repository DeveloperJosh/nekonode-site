import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const Timetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [currentDayIndex, setCurrentDayIndex] = useState(new Date().getDay());
  const [viewedDate, setViewedDate] = useState(new Date());

  useEffect(() => {
    const getCurrentDay = () => {
      return days[currentDayIndex];
    };

    const getData = async () => {
      try {
        const day = getCurrentDay();
        const response = await fetch(`https://api.jikan.moe/v4/schedules?filter=${day}`);
        const data = await response.json();
        setTimetable(data.data || []);
      } catch (error) {
        console.error('Error fetching timetable data:', error);
      }
    };

    getData();
  }, [currentDayIndex]); // Removed 'days' from dependency array

  const formatDate = (timeString) => {
    if (!timeString) return 'N/A';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(now);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const filterPastAnime = (timeString) => {
    if (!timeString) return false;
    const [hours, minutes] = timeString.split(':');
    const now = new Date();
    const animeTime = new Date();
    animeTime.setHours(parseInt(hours, 10));
    animeTime.setMinutes(parseInt(minutes, 10));
    return animeTime >= now;
  };

  const filteredTimetable = timetable ? timetable.filter(entry => filterPastAnime(entry.broadcast.time)) : [];

  const formatName = (anime) => {
    return anime
      .replace(/[^a-zA-Z0-9- ]/g, "")
      .replace(/\s+/g, '-')
      .toLowerCase();
  };
  

  const goToNextDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex + 1) % 7);
    const newDate = new Date(viewedDate);
    newDate.setDate(newDate.getDate() + 1);
    setViewedDate(newDate);
  };

  const goToPreviousDay = () => {
    setCurrentDayIndex((prevIndex) => (prevIndex - 1 + 7) % 7);
    const newDate = new Date(viewedDate);
    newDate.setDate(newDate.getDate() - 1);
    setViewedDate(newDate);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-800 text-gray-200 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center">Estimated Schedule - Now: {viewedDate.toLocaleDateString('en-US')}</h2>
      <div className="flex justify-between items-center mb-6">
        <button className="bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600" onClick={goToPreviousDay}>Previous Day</button>
        <h3 className="text-2xl font-semibold">{days[currentDayIndex].charAt(0).toUpperCase() + days[currentDayIndex].slice(1)}, {viewedDate.toLocaleDateString('en-US')}</h3>
        <button className="bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600" onClick={goToNextDay}>Next Day</button>
      </div>
      <div className="space-y-4">
        {filteredTimetable.length === 0 ? (
          <p className="text-center text-lg">No anime scheduled for today.</p>
        ) : (
          filteredTimetable.map((entry, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">{formatDate(entry.broadcast.time)}</span>
                <h3 className="text-lg font-bold">{entry.title}</h3>
                <span className="text-sm text-gray-300">{entry.title_japanese}</span>
              </div>
              <Link href={`/anime/${formatName(entry.title)}`} passHref className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600">
                Go to Anime
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Timetable;
