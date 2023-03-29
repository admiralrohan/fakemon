import styled from "@emotion/styled";
import React from "react";
import SingleFakemon from "./SingleFakemon";

function FakemonList({ fakemons, showUseButton = false }) {
  return (
    <Wrapper>
      {fakemons.map((fakemon) => (
        <SingleFakemon
          key={fakemon.id}
          fakemon={fakemon}
          showUseButton={showUseButton}
        />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style-type: none;
`;

export default FakemonList;
