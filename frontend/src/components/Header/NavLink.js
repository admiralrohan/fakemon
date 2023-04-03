import styled from "@emotion/styled";
import { Link, useLocation } from "react-router-dom";

function NavLink({ to, children }) {
  const { pathname } = useLocation();
  const isActive = pathname.includes(to);

  return (
    <Wrapper
      to={to}
      aria-current={isActive && "page"}
      style={{ "--opacity": isActive ? 1 : 0.75 }}
    >
      {children}
    </Wrapper>
  );
}

const Wrapper = styled(Link)`
  color: rgba(255, 255, 255, var(--opacity));
  text-decoration: none;

  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`;

export default NavLink;
