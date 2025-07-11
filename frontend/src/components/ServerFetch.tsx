const fetchExpressSampleData = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const ServerFetch = async () => {
  const data = await fetchExpressSampleData();

  return (
    <div>
      <h1>ServerFetch</h1>
      <p>Works fine even without CORS set in Express app</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ServerFetch;
