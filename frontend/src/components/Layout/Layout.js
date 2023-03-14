import styled from "@emotion/styled";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Battle from "../Battle";
import Gym from "../Gym";
import Gyms from "../Gyms";
import { Header } from "../Header";
import Profile from "../Profile";
import Toastr from "../Toastr";

function Layout() {
  return (
    <>
      <Header />

      <Wrapper>
        <Routes>
          <Route path="/" element={<Navigate replace to="/profile" />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/gyms" element={<Gyms />} />
          <Route path="/gyms/:id" element={<Gym />} />
          <Route path="/gyms/:id/battle" element={<Battle />} />
        </Routes>
      </Wrapper>

      <Toastr />
    </>
  );
}

const Wrapper = styled.div`
  width: 500px;
  margin: 25px auto;
`;

export default Layout;
