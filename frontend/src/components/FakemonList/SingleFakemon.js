import React from "react";
import styled from "@emotion/styled";

function SingleFakemon({ fakemon, actions }) {
  return (
    <Wrapper>
      <TitleWrapper>
        <Side></Side>
        <Title>Fakemon #{fakemon.id}</Title>
        <Side>{actions}</Side>
      </TitleWrapper>

      <List>
        <List.DT>HP</List.DT>
        <List.DD>{fakemon.hp}</List.DD>

        <List.DT>Attack</List.DT>
        <List.DD>{fakemon.attack}</List.DD>

        <List.DT>Defense</List.DT>
        <List.DD>{fakemon.defense}</List.DD>
      </List>
    </Wrapper>
  );
}

const Wrapper = styled.li`
  border: 1px solid;
  padding: 8px 16px;
`;

const TitleWrapper = styled.div`
  display: flex;
`;
const Title = styled.h2`
  font-size: 1.25rem;
  text-align: center;
`;
// Empty content, for layout purposes only
const Side = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const List = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, max-content 1fr);
  column-gap: 16px;
  row-gap: 0;
  margin: 0;
`;
List.DT = styled.dt``;
List.DD = styled.dd`
  margin: 0;
`;

export default SingleFakemon;
