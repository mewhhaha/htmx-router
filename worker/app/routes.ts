
import * as root from "./root.tsx";
import { route } from "htmx-router";
import * as $_header_about from "./routes/_header.about.tsx";
import * as $_header_blog from "./routes/_header.blog.tsx";
import * as $_header_home from "./routes/_header.home.tsx";
import * as $_header from "./routes/_header.tsx";
import * as $_index from "./routes/_index.tsx";
const $$_header_about = { id: "_header.about", mod: $_header_about };
const $$_header_blog = { id: "_header.blog", mod: $_header_blog };
const $$_header_home = { id: "_header.home", mod: $_header_home };
const $$_header = { id: "_header", mod: $_header };
const $$_index = { id: "_index", mod: $_index };
const $root = { id: "", mod: root };

export const routes: route[] = [["/about", [$root,$$_header,$$_header_about]],
["/blog", [$root,$$_header,$$_header_blog]],
["/home", [$root,$$_header,$$_header_home]],
["/", [$root,$$_index]]];
