import {
  InferActionArgs,
  InferComponentProps,
  InferHeaderArgs,
  InferLoaderArgs,
  InferPartialArgs,
} from "htmx-router/types";
import * as r from "./_header.blog.js";

export type RouteParams = {
  
};

export type ComponentProps = InferComponentProps<typeof r>;
export type LoaderArgs = InferLoaderArgs<RouteParams>;
export type PartialArgs = InferPartialArgs<RouteParams>;
export type ActionArgs = InferActionArgs<RouteParams>;
export type HeaderArgs = InferHeaderArgs<RouteParams, typeof r>;