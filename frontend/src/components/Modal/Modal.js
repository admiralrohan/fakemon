import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styled from "@emotion/styled";

function Modal({ title, trigger, isOpen, setIsOpen, children }) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Overlay />

        <Content>
          <Title>{title}</Title>
          {children}
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const Overlay = styled(Dialog.Overlay)`
  background-color: rgba(0, 0, 0, 0.44);
  position: fixed;
  inset: 0;
`;
const Content = styled(Dialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid black;
  padding: 16px;
  background-color: white;

  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 400px;
`;
const Title = styled(Dialog.Title)`
  font-size: ${20 / 16}rem;
  text-align: center;
  margin: 0;
`;

export default Modal;
