import React from "react";
import * as RadixVisuallyHidden from "@radix-ui/react-visually-hidden";

function VisuallyHidden({ children }) {
  return <RadixVisuallyHidden.Root>{children}</RadixVisuallyHidden.Root>;
}

export default VisuallyHidden;
