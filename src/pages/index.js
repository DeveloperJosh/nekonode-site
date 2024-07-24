import React, { useState } from 'react';
import { TabGroup, TabPanel, TabPanels, TabList, Tab } from '@headlessui/react';
import AnimeList from '../components/AnimeList';
import Timetable from '../components/Timetable';
import TopAnimeList from '../components/TopAnimeList';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const api = process.env.NEXTAUTH_URL;

const HomePage = ({ initialLatestAnime, topAnime, initialPage, newsPosts }) => {
  const [latestAnime, setLatestAnime] = useState(initialLatestAnime);
  const [page, setPage] = useState(initialPage);
  const [type, setType] = useState(1); // 1 for subs, 2 for dubs

  const handlePagination = async (newPage) => {
    try {
      const { data } = await axios.get('/api/latest', {
        params: { page: newPage, limit: 12, type },
      });
      setLatestAnime(data);
      setPage(newPage);
    } catch (error) {
      console.error('Error fetching latest episodes:', error);
    }
  };

  const handleTabChange = async (tabIndex) => {
    const newType = tabIndex === 1 ? 2 : 1; // 0 for subbed, 1 for dubbed
    setType(newType);
    try {
      const { data } = await axios.get('/api/latest', {
        params: { page: 1, limit: 12, type: newType },
      });
      setLatestAnime(data);
      setPage(1);
    } catch (error) {
      console.error('Error fetching episodes:', error);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <div className="container mx-auto px-4 sm:px-2 py-8 flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 lg:w-2/3 lg:mr-4">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h1 className="text-2xl sm:text-4xl font-bold text-yellow-500 mb-2 sm:mb-0">
                Recently Updated
              </h1>
              <TabGroup onChange={handleTabChange}>
                <div className="flex flex-col sm:flex-row items-center">
                  <TabList className="flex space-x-2 sm:space-x-4 mb-2 sm:mb-0">
                    <Tab
                      className={({ selected }) =>
                        selected
                          ? 'py-1 px-2 sm:py-2 sm:px-4 text-sm sm:text-base leading-5 font-medium text-gray-800 bg-yellow-500 rounded transition duration-150 ease-in-out'
                          : 'py-1 px-2 sm:py-2 sm:px-4 text-sm sm:text-base leading-5 font-medium text-gray-400 hover:text-gray-800 hover:bg-yellow-600 rounded transition duration-150 ease-in-out'
                      }
                    >
                      Sub
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        selected
                          ? 'py-1 px-2 sm:py-2 sm:px-4 text-sm sm:text-base leading-5 font-medium text-gray-800 bg-yellow-500 rounded transition duration-150 ease-in-out'
                          : 'py-1 px-2 sm:py-2 sm:px-4 text-sm sm:text-base leading-5 font-medium text-gray-400 hover:text-gray-800 hover:bg-yellow-600 rounded transition duration-150 ease-in-out'
                      }
                    >
                      Dub
                    </Tab>
                  </TabList>
                  <div className="flex space-x-2 sm:ml-4">
                    {page > 1 && (
                      <button
                        onClick={() => handlePagination(page - 1)}
                        className="bg-yellow-500 text-gray-800 px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-lg rounded hover:bg-yellow-600 transition duration-150 ease-in-out"
                      >
                        &lt;
                      </button>
                    )}
                    <button
                      onClick={() => handlePagination(page + 1)}
                      className="bg-yellow-500 text-gray-800 px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-lg rounded hover:bg-yellow-600 transition duration-150 ease-in-out"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              </TabGroup>
            </div>
            <TabGroup onChange={handleTabChange}>
              <TabPanels>
                <TabPanel>
                  <AnimeList animes={latestAnime} />
                </TabPanel>
                <TabPanel>
                  <AnimeList animes={latestAnime} />
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
          <Timetable />
        </div>
        <div className="w-full lg:w-1/3 lg:ml-4 mt-4 lg:mt-0">
          <TopAnimeList topAnime={topAnime} />
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const initialPage = parseInt(query.page, 10) || 1;

  try {
    const [latestResponse, topAnimeResponse] = await Promise.all([
      axios.get(`${api}/api/latest`, {
        params: { page: initialPage, limit: 12, type: 1 }, // default to subbed
      }),
      axios.get(`${api}/api/top10`),
    ]);

    return {
      props: {
        initialLatestAnime: latestResponse.data,
        topAnime: topAnimeResponse.data.results,
        initialPage,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        initialLatestAnime: [],
        topAnime: [],
        initialPage,
      },
    };
  }
}

export default HomePage;
