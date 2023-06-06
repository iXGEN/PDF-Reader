import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFViewer = ({ pdfFile }) => {
  const [numPages, setNumPages] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [pdfText, setPdfText] = useState(null);
  const [fullText, setFullText] = useState("");

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    console.log("Número de páginas ONDOCUMENTLOAD:", numPages);
  };

  const extractTextFromPage = async (page) => {
    const textContent = await page.getTextContent();
    const textItems = textContent.items;
    let pageText = "";

    for (let i = 0; i < textItems.length; i++) {
      pageText += textItems[i].str + " ";
    }

    return pageText;
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

  useEffect(() => {
    const extractTextFromPdf = async () => {
      if (pdfData) {
        try {
          const pdf = await pdfjs.getDocument(pdfData).promise;
          let pdfText = "";
          console.log("Número de páginas antes del for:", numPages);
          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            console.log(
              "ASDJASDJADASDJASJDASJDAJDASJDASJDKKSDKASDDADSDSDKASDASKDASKDSAKDKASDKASDKOASDASÑDAS-ODAÑJDASJÑDASJÑODASKÑDASLKDAKÑLDASKÑDSAÑKDASÑLKDASKÑLDASÑKDASÑDÑASKDKÑSADÑKASDKÑADÑKSAKÑDASKÑD",
              page
            );
            const pageText = await extractTextFromPage(page);
            pdfText += pageText;
          }

          setPdfText(pdfText);
        } catch (error) {
          console.error("Error extracting text from PDF:", error);
        }
      }
    };

    if (numPages && numPages > 0) {
      extractTextFromPdf();
    }
  }, [pdfData, numPages]);

  useEffect(() => {
    if (pdfText) {
      setFullText(pdfText);
    }
  }, [pdfText]);

  useEffect(() => {
    console.log(fullText);
  }, [fullText]);

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
      {fullText && <div>{fullText}</div>}
    </div>
  );
};

export default PDFViewer;
