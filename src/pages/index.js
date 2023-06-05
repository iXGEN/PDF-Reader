import React, { useState } from "react";
import PDFViewer from "../components/PDFViewer";

const HomePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div>
      <h1>PDF Viewer</h1>
      <input type="file" onChange={handleFileChange} />
      {selectedFile && <PDFViewer pdfFile={selectedFile} />}
    </div>
  );
};

export default HomePage;
