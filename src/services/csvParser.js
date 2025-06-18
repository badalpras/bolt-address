import Papa from 'papaparse';

export function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data;
          const addresses = data.map((row, index) => {
            // Try to find business name and address columns
            const businessName = row['Business name'] || row['business name'] || row['Business Name'] || 
                                row['name'] || row['Name'] || row['business'] || row['Business'] || '';
            const address = row['address'] || row['Address'] || row['location'] || row['Location'] || '';
            
            return {
              id: `csv-${Date.now()}-${index}`,
              businessName: String(businessName).trim(),
              address: String(address).trim(),
              isSelected: false,
              isOnRoute: false,
              isDuplicate: false,
              isHighlighted: false
            };
          }).filter(addr => addr.businessName || addr.address);
          
          resolve(addresses);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

export function parseTabDelimited(text) {
  const lines = text.trim().split('\n');
  return lines.map((line, index) => {
    const [businessName = '', address = ''] = line.split('\t');
    return {
      id: `tab-${Date.now()}-${index}`,
      businessName: businessName.trim(),
      address: address.trim(),
      isSelected: false,
      isOnRoute: false,
      isDuplicate: false,
      isHighlighted: false
    };
  }).filter(addr => addr.businessName || addr.address);
}