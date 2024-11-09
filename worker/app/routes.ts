
import * as root from "./root.tsx";
import { route } from "htmx-router";
import * as $_header_about from "./routes/_header.about.tsx";
import * as $_header_blog from "./routes/_header.blog.tsx";
import * as $_header_store_products__id from "./routes/_header.store.products.$id.tsx";
import * as $_header_store_products__index from "./routes/_header.store.products._index.tsx";
import * as $_header from "./routes/_header.tsx";
import * as $_index from "./routes/_index.tsx";
const $$_header_store_products__index = { id: "_header.store.products._index", mod: $_header_store_products__index };
const $$_header_store_products__id = { id: "_header.store.products.$id", mod: $_header_store_products__id, params: ["id"] };
const $$_header_about = { id: "_header.about", mod: $_header_about };
const $$_header_blog = { id: "_header.blog", mod: $_header_blog };
const $$_header = { id: "_header", mod: $_header };
const $$_index = { id: "_index", mod: $_index };
const $root = { id: "", mod: root };

export const routes: route[] = [["/store/products", [$root,$$_header,$$_header_store_products__index]],
["/store/products/:id", [$root,$$_header,$$_header_store_products__id]],
["/about", [$root,$$_header,$$_header_about]],
["/blog", [$root,$$_header,$$_header_blog]],
["/", [$root,$$_index]]];
