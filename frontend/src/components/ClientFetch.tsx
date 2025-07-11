"use client";

import React, { useEffect, useState } from "react";

const ClientFetch = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:4000/api/");
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>ClientFetch</h1>
      <p>
        Works ONLY if CORS is enabled in the Express app (might need to clear browser cache too)
      </p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ClientFetch;
