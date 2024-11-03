import counter from "./counter.js";
import { define } from "runtime";

(window as any).components ??= {};
(window as any).components["counter"] = counter;

define();
