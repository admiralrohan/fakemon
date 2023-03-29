import React from "react";

export const FakemonSelectContext = React.createContext();
FakemonSelectContext.displayName = "FakemonSelectContext";

function FakemonSelectProvider(props = {}) {
  const [selectedFakemon, setSelectedFakemon] = React.useState(null);
  const exportedMembers = { selectedFakemon, setSelectedFakemon };

  return <FakemonSelectContext.Provider value={exportedMembers} {...props} />;
}

export default FakemonSelectProvider;
