const geoCoder = async (address) => {
  return {
    address,
    coordinates: { lat: 0, lng: 0 },
  };
};

module.exports = geoCoder;
