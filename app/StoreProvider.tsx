"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@store/index";

export default function StoreProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <Provider store={store}>{children}</Provider>;
}

