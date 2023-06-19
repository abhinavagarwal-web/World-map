import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryClick = (countryCode) => {
    const country = countries.find((country) => country.cca3 === countryCode);
    setSelectedCountry(country);
  };

  const fetchFlagURL = (countryCode) => {
    const country = countries.find((country) => country.cca3 === countryCode);
    if (country) {
      return country.flags.png || null;
    }
    return null;
  };

  const formatCurrencies = (currencies) => {
    return Object.values(currencies || {}).map((currency) => currency.name).join(', ');
  };

  return (
    <div style={{ height: '100vh' }}>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
        />

        {countries.map((country) => (
          <Marker
            key={country.cca3}
            position={[country.latlng[0], country.latlng[1]]}
            eventHandlers={{
              click: () => handleCountryClick(country.cca3),
            }}
          />
        ))}

        {selectedCountry && (
          <Popup
            position={[selectedCountry.latlng[0], selectedCountry.latlng[1]]}
            onClose={() => setSelectedCountry(null)}
          >
            <div>
              <h2>{selectedCountry.name.common}</h2>
              <img
                src={fetchFlagURL(selectedCountry.cca3)}
                alt={`${selectedCountry.name.common} Flag`}
                style={{ width: '100px', height: 'auto' }}
              />
              <p>Population: {selectedCountry.population?.toLocaleString() || 'N/A'}</p>
              <p>Area: {selectedCountry.area?.toLocaleString() || 'N/A'} sq. km</p>
              <p>Capital: {selectedCountry.capital || 'N/A'}</p>
              <p>Timezone: {selectedCountry.timezones?.[0] || 'N/A'}</p>
              <p>Region: {selectedCountry.region || 'N/A'}</p>
              <p>Currency: {formatCurrencies(selectedCountry.currencies) || 'N/A'}</p>
              <p>Language: {Object.values(selectedCountry.languages || {}).join(', ') || 'N/A'}</p>
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
};

export default App;
