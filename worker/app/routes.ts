
import * as root from "./root.tsx";
import { route } from "htmx-router";
import * as $home from "./routes/home.tsx";
import * as $profiles__id from "./routes/profiles.$id.tsx";
import * as $profiles from "./routes/profiles.tsx";
import * as $profiles__a_a from "./routes/profiles._a.a.tsx";
import * as $profiles__a_b from "./routes/profiles._a.b.tsx";
import * as $profiles__a from "./routes/profiles._a.tsx";
import * as $profiles__index from "./routes/profiles._index.tsx";
import * as $_index from "./routes/_index.tsx";
const $$profiles__a_a = { id: "profiles._a.a", mod: $profiles__a_a };
const $$profiles__a_b = { id: "profiles._a.b", mod: $profiles__a_b };
const $$profiles__a = { id: "profiles._a", mod: $profiles__a };
const $$profiles__index = { id: "profiles._index", mod: $profiles__index };
const $$profiles__id = { id: "profiles.$id", mod: $profiles__id, params: ["id"] };
const $$home = { id: "home", mod: $home };
const $$profiles = { id: "profiles", mod: $profiles };
const $$_index = { id: "_index", mod: $_index };
const $root = { id: "", mod: root };

export const routes: route[] = [["/profiles/a", [$root,$$profiles,$$profiles__a,$$profiles__a_a]],
["/profiles/b", [$root,$$profiles,$$profiles__a,$$profiles__a_b]],
["/profiles", [$root,$$profiles,$$profiles__index]],
["/profiles/:id", [$root,$$profiles,$$profiles__id]],
["/home", [$root,$$home]],
["/", [$root,$$_index]]];
