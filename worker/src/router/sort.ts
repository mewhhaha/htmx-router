const segments = (a: string) => {
  let segments = 0;

  for (let i = 0; i < a.length; i++) {
    if (a.charAt(i) === "/") {
      segments += 1;
    }
  }
  return segments;
};

export const bySpecificity = (a: string, b: string) => {
  const aLength = segments(a);
  const bLength = segments(b);
  if (aLength === bLength) {
    if (a.endsWith("*")) {
      return 1;
    }

    if (b.endsWith("*")) {
      return -1;
    }

    if (a.match(/\/:[^/]+$/)) {
      return 1;
    }

    if (b.match(/\/:[^/]+$/)) {
      return -1;
    }

    return 0;
  }

  return bLength - aLength;
};
