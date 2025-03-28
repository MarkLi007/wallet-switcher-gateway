
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AddVersionForm from '@/components/AddVersionForm';

const AddVersionPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="cnki-heading text-2xl">Add New Version</h1>
        <p className="text-gray-600">Add a new version to an existing paper with references</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <AddVersionForm />
      </div>
    </DashboardLayout>
  );
};

export default AddVersionPage;
