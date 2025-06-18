import React, { useState } from 'react';
import { Trash2, RotateCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AddressTable = ({
  addresses,
  onUpdateAddress,
  onDeleteAddress,
  onGeocodeAddress,
  showCoordinates,
  isGeocoding
}) => {
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleCellClick = (id, field, currentValue) => {
    setEditingCell({ id, field });
    setEditValue(currentValue);
  };

  const handleCellSave = () => {
    if (editingCell) {
      onUpdateAddress(editingCell.id, { [editingCell.field]: editValue });
      setEditingCell(null);
      setEditValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCellSave();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setEditValue('');
    }
  };

  const getGeocodingStatus = (address) => {
    if (!address.address) return null;
    if (address.latitude && address.longitude) return 'success';
    return 'pending';
  };

  const renderGeocodingStatus = (address) => {
    const status = getGeocodingStatus(address);
    
    if (!status) return null;
    
    switch (status) {
      case 'success':
        return (
          <CheckCircle 
            size={16} 
            className="text-green-600" 
            title="Successfully geocoded"
          />
        );
      case 'pending':
        return (
          <AlertCircle 
            size={16} 
            className="text-yellow-600" 
            title="Needs geocoding"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="w-16 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Business Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Address
              </th>
              <th className="w-20 px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              {showCoordinates && (
                <>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Latitude
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Longitude
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {addresses.map((address, index) => (
              <tr
                key={address.id}
                id={`address-row-${address.id}`}
                className={`hover:bg-gray-50 ${
                  address.isHighlighted ? 'bg-yellow-100' : ''
                } ${address.isDuplicate ? 'bg-red-50' : ''} ${
                  address.isOnRoute ? 'bg-green-50' : ''
                }`}
                style={{ height: '60px' }}
              >
                <td className="px-2 py-2">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onDeleteAddress(address.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100 transition-colors"
                      title="Delete this address row"
                    >
                      <Trash2 size={14} />
                    </button>
                    {address.address && (
                      <button
                        onClick={() => onGeocodeAddress(address.id)}
                        disabled={isGeocoding}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100 disabled:text-gray-400 transition-colors"
                        title="Re-geocode this address"
                      >
                        <RotateCw size={14} className={isGeocoding ? 'animate-spin' : ''} />
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2">
                  {editingCell?.id === address.id && editingCell?.field === 'businessName' ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={() => handleCellClick(address.id, 'businessName', address.businessName)}
                      className="cursor-pointer min-h-[24px] py-1 px-2 hover:bg-gray-100 rounded"
                    >
                      {address.businessName || 'Click to edit'}
                    </div>
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingCell?.id === address.id && editingCell?.field === 'address' ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={handleKeyPress}
                      className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={() => handleCellClick(address.id, 'address', address.address)}
                      className={`cursor-pointer min-h-[24px] py-1 px-2 hover:bg-gray-100 rounded ${
                        address.latitude && address.longitude ? 'text-green-600 font-medium' : ''
                      }`}
                    >
                      {address.address || 'Click to edit'}
                    </div>
                  )}
                </td>
                <td className="px-2 py-2 text-center">
                  {renderGeocodingStatus(address)}
                </td>
                {showCoordinates && (
                  <>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {address.latitude ? address.latitude.toFixed(6) : '-'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {address.longitude ? address.longitude.toFixed(6) : '-'}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddressTable;