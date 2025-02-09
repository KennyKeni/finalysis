import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import PdfUpload from "@/components/PdfUpload";
import { fetchPDF } from "@/http/pdfService";

export default function TestPage({ user }) {

  const handleFetchPDF = async () => {
    try {
      const res = await fetchPDF();
      console.log("TESTING:::", res);
    } catch (error) {
      console.log(error.message);
    }
  };


  handleFetchPDF();

  return (
    <div>
      <h1>Testing Page for API's</h1>
      <p>Welcome {user.name}</p>
      <PdfUpload></PdfUpload>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired();
