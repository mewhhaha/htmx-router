import counter from "./counter.js";
import { define } from "htmx-router-runtime";

(window as any).components ??= {};
(window as any).components["counter"] = counter;

define();
