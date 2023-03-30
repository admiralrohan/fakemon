import styled from "@emotion/styled";
import React from "react";
import SingleFakemon from "./SingleFakemon";

function FakemonList({ fakemons, actions }) {
  return (
    <Wrapper>
      {fakemons.map((fakemon) => (
        <SingleFakemon
          key={fakemon.id}
          fakemon={fakemon}
          actions={actions && React.cloneElement(actions, { fakemon })}
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
  margin: 0;
  padding: 0;
`;

export default FakemonList;
