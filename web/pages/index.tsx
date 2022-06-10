import type { NextPage } from "next";
import Hero from "../components/hero";
import { useAppContext } from "../context/appContext";
import Layout from "../components/layout";

const Home: NextPage = () => {
  let { evil } = useAppContext();
  return (
    <Layout>
      <Hero />
    </Layout>
  );
};

export default Home;
