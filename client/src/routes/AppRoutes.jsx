import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Simple placeholder page components
const Home = () => <div className="p-8 text-2xl">🏡 Home Page</div>;
const Properties = () => <div className="p-8 text-2xl">🔍 Property Listings</div>;
const AddProperty = () => <div className="p-8 text-2xl">➕ Add New Property</div>;

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/agent/create" element={<AddProperty />} />
    </Routes>
  );
};

export default AppRoutes;