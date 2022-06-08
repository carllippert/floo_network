import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/header";
import Hero from "../components/hero";
import Footer from "../components/footer";
import Opportunities from "../components/opportunities";
import { useAppContext } from "../context/appContext";
import Layout from "../components/layout";

const Home: NextPage = () => {
  let { evil } = useAppContext();
  return (
    <Layout>
      <Opportunities />
    </Layout>
  );
};

export default Home;
