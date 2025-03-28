import React from 'react';
import { useQuery } from 'react-query';

const fetchStats = async () => {
  const res = await fetch('/api/papersStats');
  return res.json();
};

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useQuery('papersStats', fetchStats);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <p>Total Papers: {data.totalPapers}</p>
        <p>Total Citations: {data.totalCitations}</p>
      </div>
      {/* 可视化数据展示，例如被引用次数排名 */}
    </div>
  );
};

export default Dashboard;
