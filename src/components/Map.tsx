import React from 'react';

interface MapProps {
  address?: string;
}

const Map: React.FC<MapProps> = ({ 
  address = "Regal Estate Consultants, Shop No. 3, Bharat Altavistas, next to ICICI Bank, Lokhandwala Complex, Andheri West, Mumbai, Maharashtra 400053"
}) => {
  const encodedAddress = encodeURIComponent(address);
  
  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOOTYmAT18Y08s&q=${encodedAddress}&zoom=15`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Regal Estate Consultants Location"
        className="w-full h-full"
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/5" />
    </div>
  );
};

export default Map;