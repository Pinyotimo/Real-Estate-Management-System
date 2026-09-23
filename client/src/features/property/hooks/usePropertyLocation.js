import { useState, useEffect, useMemo } from "react";
import {
  getCountiesForRegion,
  getEstatesForCounty,
  getRegionForCounty,
} from "../../../data/kenyaLocations";

export const usePropertyLocation = ({ initialCounty = "", initialEstate = "" } = {}) => {
  const [region, setRegion] = useState(() => getRegionForCounty(initialCounty));
  const [county, setCounty] = useState(initialCounty);
  const [estate, setEstate] = useState(initialEstate);
  const [estateMode, setEstateMode] = useState("select");

  const counties = useMemo(() => getCountiesForRegion(region), [region]);
  const estates = useMemo(() => getEstatesForCounty(county), [county]);

  // On mount only: if the loaded estate isn't in the curated list, show it via the custom text input
  useEffect(() => {
    if (initialEstate && !getEstatesForCounty(initialCounty).includes(initialEstate)) {
      setEstateMode("custom");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setCounty("");
    setEstate("");
    setEstateMode("select");
  };

  const handleCountyChange = (e) => {
    setCounty(e.target.value);
    setEstate("");
    setEstateMode("select");
  };

  const handleEstateSelectChange = (e) => {
    if (e.target.value === "__other__") {
      setEstateMode("custom");
      setEstate("");
    } else {
      setEstate(e.target.value);
    }
  };

  const handleEstateInputChange = (e) => setEstate(e.target.value);

  // Method to hydrate location from loaded property data
  const hydrate = (loadedCounty = "", loadedEstate = "") => {
    const newRegion = getRegionForCounty(loadedCounty);
    setRegion(newRegion);
    setCounty(loadedCounty);
    setEstate(loadedEstate);
    
    // Check if estate is in curated list
    if (loadedEstate && !getEstatesForCounty(loadedCounty).includes(loadedEstate)) {
      setEstateMode("custom");
    } else {
      setEstateMode("select");
    }
  };

  return {
    region,
    county,
    estate,
    estateMode,
    counties,
    estates,
    handleRegionChange,
    handleCountyChange,
    handleEstateSelectChange,
    handleEstateInputChange,
    hydrate,
  };
};