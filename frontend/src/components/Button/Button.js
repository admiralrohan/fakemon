import styled from "@emotion/styled";
import React from "react";

const variants = {
  primary: {
    bgColor: "#0d6efd",
    borderColor: "#0d6efd",
    hoverBgColor: "#0b5ed7",
    hoverBorderColor: "#0a58ca",
  },
  secondary: {
    bgColor: "#6c757d",
    borderColor: "#6c757d;",
    hoverBgColor: "#5c636a",
    hoverBorderColor: "#565e64",
  },
};

function Button({ children, variant = "primary", ...props }, ref) {
  return (
    <Wrapper ref={ref} variant={variant} {...props}>
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.button`
  color: white;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;

  /* For links */
  text-decoration: none;
  display: block;

  background-color: ${({ variant }) => variants[variant].bgColor};
  border-color: ${({ variant }) => variants[variant].borderColor};
  transition: background-color 200ms;

  &:hover {
    color: white;
    background-color: ${({ variant }) => variants[variant].hoverBgColor};
    border-color: ${({ variant }) => variants[variant].hoverBorderColor};
    transition: background-color 500ms;
  }

  &:disabled {
    opacity: 0.65;
  }
`;

export default React.forwardRef(Button);
