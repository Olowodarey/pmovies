import Trending from "./_component/Trending";
import Upcoming from "@/app/_component/Upcoming";
import Series from "./_component/Series";
import "./globals.css";

const HomePage = () => {
  return (
    <div className="px-5 lg:px-7">
      <Trending />
      <Upcoming />
      <Series />
    </div>
  );
};

export default HomePage;
