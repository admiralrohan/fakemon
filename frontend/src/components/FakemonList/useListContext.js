import React from "react";
import { ListContext } from "./FakemonList";

function useListContext() {
  const context = React.useContext(ListContext);

  if (context === undefined) {
    throw new Error(`useListContext must be used within a ListProvider`);
  }

  return context;
}

export default useListContext;
