import styled from "@emotion/styled";
import React from "react";
import SingleFakemon from "./SingleFakemon";

export const ListContext = React.createContext();
ListContext.displayName = "ListContext";

function FakemonList({ fakemons, showUseButton = false }) {
  const [selectedFakemon, setSelectedFakemon] = React.useState("");
  const contextValue = { selectedFakemon, setSelectedFakemon, showUseButton };

  return (
    <ListContext.Provider value={contextValue}>
      <Wrapper>
        {fakemons.map((fakemon) => (
          <SingleFakemon key={fakemon.id} fakemon={fakemon} />
        ))}
      </Wrapper>
    </ListContext.Provider>
  );
}

const Wrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style-type: none;
`;

export default FakemonList;
