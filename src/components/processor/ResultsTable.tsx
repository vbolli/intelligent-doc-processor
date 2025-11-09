import React from 'react';
import { downloadAsCSV, downloadAsJSON } from '../../utils/fileUtils';
import { DownloadIcon } from '../icons/DownloadIcon';
import { JsonIcon } from '../icons/JsonIcon';

interface ResultsTableProps {
  data: Record<string, any>[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500 bg-slate-900/50 rounded-md">
        No data was extracted.
      </div>
    );
  }

  const headers = Object.keys(data[0]);

  const handleDownloadCSV = () => {
    downloadAsCSV(data, 'extracted_data');
  };
  
  const handleDownloadJSON = () => {
    downloadAsJSON(data, 'extracted_data');
  };

  return (
    <div className="flex flex-col">
        <div className="self-end mb-4 flex items-center space-x-2">
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-600 border border-transparent rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-800 transition-colors"
              title="Download as JSON"
            >
              <JsonIcon />
              Download JSON
            </button>
            <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-slate-800 transition-colors"
            title="Download as CSV"
            >
            <DownloadIcon />
            Download CSV
            </button>
      </div>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden border-b border-slate-700 shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800">
                <tr>
                  {headers.map(header => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-slate-300 uppercase"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-slate-900 divide-y divide-slate-800">
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-slate-800/50 transition-colors">
                    {headers.map(header => (
                      <td key={`${rowIndex}-${header}`} className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">
                        {typeof row[header] === 'object' ? JSON.stringify(row[header]) : String(row[header])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;