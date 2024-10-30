export function jsx(tag, { children, ...props }) {
    if (typeof tag === "function") {
        return tag({ children, ...props });
    }
    const element = document.createElement(tag);
    const f = (child) => {
        console.log(child);
        if (Array.isArray(child)) {
            child.forEach(f);
        }
        else if (child instanceof HTMLElement) {
            element.appendChild(child);
        }
        else if (typeof child === "object" &&
            child !== null &&
            "get" in child &&
            typeof child.get === "function") {
            f(child.get());
        }
        else if (child === null || child === false || child === undefined) {
            // Do nothing
        }
        else {
            const textNode = document.createTextNode(child.toString());
            element.appendChild(textNode);
        }
    };
    if (Array.isArray(children)) {
        children.forEach(f);
    }
    else {
        f(children);
    }
    for (const prop in props) {
        if (prop.match(/on[A-Z]/)) {
            element.addEventListener(prop.toLowerCase().slice(2), props[prop]);
        }
        else {
            element.setAttribute(prop, props[prop]);
        }
    }
    return element;
}
export function jsxs(tag, props) {
    return jsx(tag, props);
}
