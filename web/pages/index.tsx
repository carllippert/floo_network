import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/header";
import Hero from "../components/hero";
import Footer from "../components/footer";
import Opportunities from "../components/opportunities";

const Home: NextPage = () => {
  return (
    <>
      <Header />
      {/* <Hero /> */}
      <div className="min-h-screen max-w-5xl mx-auto px-6">
        <Opportunities />
      </div>
      <Footer />
    </>
  );
};

export default Home;
