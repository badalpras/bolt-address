import React from 'react';
import { Upload, Trash2, MapPin, Eye, EyeOff, Plus } from 'lucide-react';

const TableControls = ({
  onFileUpload,
  onClearTable,
  onGeocodeAll,
  onToggleCoordinates,
  onAddTabDelimited,
  showCoordinates,
  isGeocoding,
  hasAddresses
}) => {
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white border-b border-gray-200">
      <div className="relative">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
          title="Upload CSV file"
        >
          <Upload size={18} />
        </label>
      </div>

      <button
        onClick={onAddTabDelimited}
        className="inline-flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        title="Add tab-delimited data"
      >
        <Plus size={18} />
      </button>

      <button
        onClick={onGeocodeAll}
        disabled={!hasAddresses || isGeocoding}
        className="inline-flex items-center justify-center w-10 h-10 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        title={isGeocoding ? 'Geocoding all addresses...' : 'Geocode all addresses'}
      >
        <MapPin size={18} className={isGeocoding ? 'animate-pulse' : ''} />
      </button>

      <button
        onClick={onToggleCoordinates}
        className="inline-flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        title={showCoordinates ? 'Hide coordinates columns' : 'Show coordinates columns'}
      >
        {showCoordinates ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>

      <button
        onClick={onClearTable}
        disabled={!hasAddresses}
        className="inline-flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        title="Clear all addresses from table"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default TableControls;