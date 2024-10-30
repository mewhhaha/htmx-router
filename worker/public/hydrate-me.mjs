import { Signal } from "signal-polyfill";
class HydrateMe extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const src = this.getAttribute("src");
    if (src === null) {
      this.parentElement?.removeChild(this);
      return;
    }
    const Component = window.components[src];
    let node = this;
    const children = [...this.children];
    for (const child of this.children) {
      this.removeChild(child);
    }
    effect(() => {
      const props = { children };
      for (const attribute of this.attributes) {
        props[attribute.name] = attribute.value;
      }
      const html = Component(props);
      node.insertAdjacentElement("beforebegin", html);
      node.parentElement?.removeChild(node);
      node = html;
    });
  }
}

export const define = () => {
  window.customElements.define("hydrate-me", HydrateMe);
};

let needsEnqueue = true;
const w = new Signal.subtle.Watcher(() => {
  if (needsEnqueue) {
    needsEnqueue = false;
    queueMicrotask(processPending);
  }
});
function processPending() {
  needsEnqueue = true;
  for (const s of w.getPending()) {
    s.get();
  }
  w.watch();
}
export function effect(callback) {
  let cleanup;
  const computed = new Signal.Computed(() => {
    typeof cleanup === "function" && cleanup();
    cleanup = callback();
  });
  w.watch(computed);
  computed.get();
  return () => {
    w.unwatch(computed);
    typeof cleanup === "function" && cleanup();
    cleanup = undefined;
  };
}
