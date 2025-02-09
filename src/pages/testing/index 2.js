import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { fetchPDF } from "@/http/pdfService";
import { useState } from "react";
import { useEffect } from "react";

export default function TestPage({ user }) {
  const [jsonArr, setJsonArr] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (jsonArr === null) {
      handleFetchPDF();
    }
  }, [jsonArr]);

  const handleFetchPDF = async () => {
    try {
      setIsLoading(true);
      const res = await fetchPDF();
      setJsonArr(res);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>
        {/* Optional: Display loading state */}
        {isLoading && <p className="mt-2">Loading...</p>}

        {/* Optional: Display JSON data */}
        {jsonArr && (
          <div className="mt-4">
            <h3 className="font-bold">Data Preview:</h3>
            <pre className="mt-2 p-4 bg-gray-100 rounded-md overflow-auto">
              {JSON.stringify(jsonArr, null, 2)} {jsonArr.data[0].user}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
