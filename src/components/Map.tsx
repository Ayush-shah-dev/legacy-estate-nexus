import React from 'react';

interface MapProps {
  address?: string;
}

const Map: React.FC<MapProps> = ({ 
  address = "Regal Estate Consultants, Shop No. 3, Bharat Altavistas, next to ICICI Bank, Lokhandwala Complex, Andheri West, Mumbai, Maharashtra 400053"
}) => {
  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.8535736076353!2d72.83199567516557!3d19.138140782001995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b634c6a7a3e5%3A0x7b1aa8b4b75b5d8e!2sShop%20No.%203%2C%20Bharat%20Altavistas%2C%20next%20to%20ICICI%20Bank%2C%20Lokhandwala%20Complex%2C%20Andheri%20West%2C%20Mumbai%2C%20Maharashtra%20400053!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
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