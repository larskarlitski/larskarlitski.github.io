// ^
//   (?<tag>[^\s\.#]+)
//   (?:#(?<id>[^\s\.#]+))?
//   (?:\.(?<classes>[^\s#]+))?
// $
let re = /^(?<tag>[^\s\.#]+)(?:#(?<id>[^\s\.#]+))?(?:\.(?<classes>[^\s#]+))?$/;

export default function e(tagspec, ...args) {
  let m = tagspec.match(re);
  if (!m) {
    throw new Error("invalid tag specification: " + tagspec);
  }

  let element = document.createElement(m.groups.tag);
  if (m.groups.id) {
    element.id = m.groups.id;
  }
  if (m.groups.classes) {
    element.classList.add(...m.groups.classes.split("."));
  }

  if (args.length === 0) {
    return element;
  }

  // is the first argument a plain object?
  if (args[0] && Object.getPrototypeOf(args[0]) === Object.prototype) {
    for (let [attr, value] of Object.entries(args[0])) {
      if (attr.startsWith("on")) {
        element.addEventListener(attr.slice(2), value);
      } else {
        element.setAttribute(attr, value);
      }
    }

    args = args.slice(1);
  }

  for (let child of args) {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else if (child !== null && child !== undefined) { // allow null arguments
      element.appendChild(child);
    }
  }

  return element;
}
