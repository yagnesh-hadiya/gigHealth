import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { Permissions } from "./AuthTypes";

export interface PrivateRouteProps {
  children: ReactNode;
  isTalentRoute?: boolean;
}

export interface RouteType {
  element:
    | string
    | number
    | boolean
    | ReactElement<any, string | JSXElementConstructor<any>>
    | Iterable<ReactNode>
    | ReactPortal
    | null
    | undefined;
  needsAuth: boolean;
  isTalentRoute?: boolean;
}

export interface ACLRouteProps {
  children: ReactNode;
  module: string;
  submodule: string | null;
  action: Permissions[];
}
