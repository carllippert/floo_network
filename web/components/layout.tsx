import Header from "../components/header";
import Footer from "../components/footer";
import { useAppContext } from "../context/appContext";

const Layout = ({ children }: { children: any }) => {
  let { evil } = useAppContext();
  return (
    <div data-theme={evil ? "dark" : "cyberpunk"}>
      <Header />
      <div className="min-h-screen max-w-5xl mx-auto px-6">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
