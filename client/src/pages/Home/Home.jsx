import Navbar from "../../components/common/NavBar";

function Home() {
  return (
    <div>
      <Navbar />

      <main className="px-8 py-12">
        <h1 className="text-4xl font-bold">
          Welcome to ClockIt
        </h1>

        <p className="mt-3 text-gray-600">
          Your student community starts here.
        </p>
      </main>
    </div>
  );
}

export default Home;