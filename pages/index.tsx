import { NextPage } from 'next';
import Head from 'next/head';
import Hero from '../components/Hero';
import MealPackages from '../components/MealPackages';
import Categories from '../components/Categories';
import ProductGrid from '../components/ProductGrid';
import Navbar from '../components/Navbar';
import Popup from '@/components/pop-up/popup';
import Wave from '@/components/wave';
import { useState } from 'react';

const Home: NextPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleClosePopup = () => {
    setIsPopupOpen(false); // Close the popup when this function is called
  };
  return (
    <>
      <Head>
        <title>Ramadan Iftar Delivery</title>
        <meta name="description" content="Daily Iftar meals delivered to your doorstep" />
      </Head>

      <main className="min-h-screen ">
        <Navbar />
        <Hero />
        <Wave/>
        <MealPackages />
        <Categories />
        <ProductGrid />
        {isPopupOpen && <Popup onClose={handleClosePopup} />}
        {/* <button 
        onClick={() => setIsPopupOpen(true)} // Open the popup when clicked
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Open Popup
      </button> */}
      </main>
    </>
  );
};

export default Home;
