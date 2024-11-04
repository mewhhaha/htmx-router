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

    // @ts-expect-error we just hoping components is defined
    const Component = window.components?.[src];

    const children: any[] = [...this.children];

    for (const child of this.children) {
      this.removeChild(child);
    }

    const props: Record<string, unknown> = { children };
    for (const attribute of this.attributes) {
      props[attribute.name] = attribute.value;
    }

    const node = Component(props);

    this.insertAdjacentElement("beforebegin", node);
    this.parentElement?.removeChild(this);
  }
}

export const define = () => {
  window.customElements.define("hydrate-me", HydrateMe);
};
