import styled from "@emotion/styled";
import React from "react";
import FakemonView from "../FakemonView";

function FakemonList({ fakemons }) {
  return (
    <Wrapper>
      {fakemons.map((fakemon) => (
        <FakemonView key={fakemon.id} fakemon={fakemon} />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default FakemonList;
