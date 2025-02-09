import { useState } from 'react';

export default function Documents() {

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("Document uploaded successfully!");
      } else {
        alert("Error uploading document.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error uploading document.");
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white">
      <div className="flex flex-col justify-start items-center w-full h-full p-8">
        <div className='font-semibold text-xl'>
          Upload Document
        </div>
        <div className='flex flex-row w-full justify-center text-center h-[5rem]'>
          <input 
            type="file" 
            accept=".json" 
            onChange={handleFileChange} 
            className="m-4 pl-20"
          />
        </div>
        <button onClick={handleUpload} className="w-[12rem] h-[3rem] border-aluminum border-2 p-2 rounded-md hover:bg-slate">
          Upload Document
        </button>
      </div>
    </div>
  );
}
