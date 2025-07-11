import ClientFetch from "@/components/ClientFetch";
import ServerFetch from "@/components/ServerFetch";

const HomePage = async () => {
  return (
    <div>
      <h1>HomePage</h1>

      <ServerFetch />
      <br />
      <ClientFetch />
    </div>
  );
};

export default HomePage;
