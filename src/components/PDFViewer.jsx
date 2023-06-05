import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFViewer = ({ pdfFile }) => {
  const [numPages, setNumPages] = useState(null);
  const [pdfData, setPdfData] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    const fetchPdfData = async () => {
      try {
        const response = await fetch(URL.createObjectURL(pdfFile));
        if (response.ok) {
          const blob = await response.blob();
          setPdfData(blob);
        } else {
          console.error(
            "Failed to fetch PDF data:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching PDF data:", error);
      }
    };

    if (pdfFile) {
      fetchPdfData();
    }
  }, [pdfFile]);

  return (
    <div>
      {pdfData ? (
        <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      ) : (
        <p>No PDF file selected.</p>
      )}
    </div>
  );
};

export default PDFViewer;
