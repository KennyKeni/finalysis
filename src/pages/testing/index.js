import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { fetchPDF } from "@/http/pdfService";
import { useState } from "react";
import { useEffect } from "react";

export default function TestPage({ user }) {
  const [jsonArr, setJsonArr] = useState(null);

  useEffect(() => {
    if (jsonArr === null) {
      handleFetchPDF();
    }
  }, [jsonArr]);

  const handleFetchPDF = async () => {
    try {
      const res = await fetchPDF();
      setJsonArr(res);
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log(jsonArr);
  
  return (
    <div>
      <div>

      </div>
    </div>
  )
}
