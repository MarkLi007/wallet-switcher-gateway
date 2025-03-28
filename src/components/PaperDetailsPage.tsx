import React, { useState } from 'react';

interface Version {
  version: number;
  text: string;
}

export const PaperDetailsPage: React.FC = () => {
  const [versionA, setVersionA] = useState<number | null>(null);
  const [versionB, setVersionB] = useState<number | null>(null);
  const [diffResult, setDiffResult] = useState<any>(null);

  const handleVersionAChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVersionA(Number(e.target.value));
  };

  const handleVersionBChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVersionB(Number(e.target.value));
  };

  const handleDiff = async () => {
    if (versionA === null || versionB === null) return;

    const response = await fetch(`/api/diff?versionA=${versionA}&versionB=${versionB}`);
    const data = await response.json();

    setDiffResult(data.diff);
  };

  return (
    <div>
      <h2>Compare Paper Versions</h2>
      <select onChange={handleVersionAChange} value={versionA || ''}>
        <option value="">Select Version A</option>
        {/* 版本选项 */}
      </select>
      <select onChange={handleVersionBChange} value={versionB || ''}>
        <option value="">Select Version B</option>
        {/* 版本选项 */}
      </select>
      <button onClick={handleDiff}>Compare Versions</button>

      {diffResult && (
        <div>
          <h3>Diff Result</h3>
          <pre>{diffResult}</pre>
        </div>
      )}
    </div>
  );
};
