import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import PdfUpload from "@/components/PdfUpload";

export default function TestPage({ user }) {
  return (
    <div>
      <h1>Testing Page for API's</h1>
      <p>Welcome {user.name}</p>
      <PdfUpload></PdfUpload>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired();
