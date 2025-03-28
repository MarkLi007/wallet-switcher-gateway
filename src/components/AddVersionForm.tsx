import React, { useState } from 'react';

const AddVersionForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/uploadVersion', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      alert('File uploaded successfully');
    }
  };

  return (
    <div>
      <h3>Upload New Version</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Version</button>
    </div>
  );
};

export default AddVersionForm;
