
import * as root from "./root.tsx";
import { route } from "htmx-router";
import * as $home from "./routes/home.tsx";
import * as $_header_home from "./routes/_header.home.tsx";
import * as $_header_profiles from "./routes/_header.profiles.tsx";
import * as $_header from "./routes/_header.tsx";
import * as $_index from "./routes/_index.tsx";
const $$_header_home = { id: "_header.home", mod: $_header_home };
const $$_header_profiles = { id: "_header.profiles", mod: $_header_profiles };
const $$home = { id: "home", mod: $home };
const $$_header = { id: "_header", mod: $_header };
const $$_index = { id: "_index", mod: $_index };
const $root = { id: "", mod: root };

export const routes: route[] = [["/home", [$root,$$_header,$$_header_home]],
["/profiles", [$root,$$_header,$$_header_profiles]],
["/home", [$root,$$home]],
["/", [$root,$$_index]]];
