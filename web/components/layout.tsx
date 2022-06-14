import Header from "../components/header";
import Footer from "../components/footer";
import { useAppContext } from "../context/appContext";
import Balances from "../components/balances";
const Layout = ({ children }: { children: any }) => {
  let { evil } = useAppContext();
  return (
    <div data-theme={evil ? "dark" : "light"}>
      <Header />

      <div className="min-h-screen max-w-5xl mx-auto px-6">
        {" "}
        <Balances /> {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
