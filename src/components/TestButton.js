import { useState } from "react";

export default function TestButton() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/v1/test/gemini", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <button onClick={fetchUser} className="p-4 bg-green-400">
        API TEST BUTTON
      </button>
      {userData && (
        <pre style={{ marginTop: "10px", background: "#eee", padding: "10px" }}>
          {JSON.stringify(userData, null, 2)}
        </pre>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
