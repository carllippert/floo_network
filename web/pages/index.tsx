import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/header";
import Hero from "../components/hero";
import Footer from "../components/footer";
import Opportunities from "../components/opportunities";
import { useAppContext } from "../context/appContext";

const Home: NextPage = () => {
  let { evil } = useAppContext();
  return (
    <div data-theme={evil ? "dark" : "cyberpunk"}>
      <Header />
      {/* <Hero /> */}
      <div className="min-h-screen max-w-5xl mx-auto px-6">
        <Opportunities />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
