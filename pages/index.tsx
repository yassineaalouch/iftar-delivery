import { NextPage } from 'next';
import Head from 'next/head';
import Hero from '../components/Hero';
import MealPackages from '../components/MealPackages';
import Categories from '../components/Categories';
import ProductGrid from '../components/ProductGrid';
import Navbar from '../components/Navbar';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Ramadan Iftar Delivery</title>
        <meta name="description" content="Daily Iftar meals delivered to your doorstep" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <main className="min-h-screen">
        <Navbar />
        <Hero />
        <MealPackages />
        <Categories />
        <ProductGrid />
      </main>
    </>
  );
};

export default Home;
