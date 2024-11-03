import {
  InferActionArgs,
  InferComponentProps,
  InferHeaderArgs,
  InferLoaderArgs,
} from "htmx-router/types";
import * as r from "home.js";

export type RouteParams = {
  
};

export type ComponentProps = InferComponentProps<typeof r>;
export type LoaderArgs = InferLoaderArgs<RouteParams>;
export type ActionArgs = InferActionArgs<RouteParams>;
export type HeaderArgs = InferHeaderArgs<RouteParams, typeof r>;