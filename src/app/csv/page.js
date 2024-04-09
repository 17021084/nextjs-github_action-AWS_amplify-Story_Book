// components/Camera.js
"use client";
import { mkConfig, generateCsv, download } from "export-to-csv";

const csvConfig = mkConfig({ useKeysAsHeaders: true });
const mockData = [
  {
    name: "Rouky",
    date: "2023-09-01",
    percentage: 0.4,
    quoted: '"Pickles"',
  },
  {
    name: "Keiko",
    date: "2023-09-01",
    percentage: 0.9,
    quoted: '"Cactus"',
  },
];

const Csv = () => {
  const csv = generateCsv(csvConfig)(mockData);

  return (
    <div>
      <h1> download csv</h1>
      <button
        onClick={() => {
          download(csvConfig)(csv);
        }}
      >
        download
      </button>
    </div>
  );
};

export default Csv;
