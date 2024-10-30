import { Signal } from "signal-polyfill";

class HydrateMe extends HTMLElement {
  constructor() {
    super();
  }
  async connectedCallback() {
    const src = this.getAttribute("src");
    if (src === null) {
      this.parentElement?.removeChild(this);
      return;
    }

    const component = await import(src);
    effect(() => {
      const children: any[] = [...this.children];

      for (const child of this.children) {
        this.removeChild(child);
      }

      const props: Record<string, unknown> = { children };
      for (const attribute of this.attributes) {
        props[attribute.name] = attribute.value;
      }

      const Component = component.default;
      const node = Component(props);
      this.insertAdjacentElement("beforebegin", node);
      this.parentElement?.removeChild(this);
    });
  }
}

window.customElements.define("hydrate-me", HydrateMe);

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

export function effect(callback: () => (() => void) | void) {
  let cleanup: (() => void) | void;

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
