import React from "react";
import { FakemonSelectContext } from "../components/FakemonSelectProvider";

/**
 * For Fakemon selection logic inside `FakemonList`
 */
function useFakemonSelect() {
  const context = React.useContext(FakemonSelectContext);

  if (context === undefined) {
    throw new Error(
      `useFakemonSelect must be used within a FakemonSelectProvider`
    );
  }

  return context;
}

export default useFakemonSelect;
