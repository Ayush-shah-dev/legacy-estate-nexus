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
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.5441234567!2d72.8236144!3d19.1404784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b6164b45d68b%3A0x79d73b06bdf04e0!2sRegal%20Estate%20Consultants!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
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