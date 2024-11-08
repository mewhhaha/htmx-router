import { NavLink, NavLinkProps } from "../components/NavLink";
import * as t from "./+types._header";

const links = [
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/store", label: "Store" },
];

const HeaderLink = ({ children, ...props }: NavLinkProps) => {
  return (
    <NavLink
      id={sanitize(props.to)}
      {...props}
      class={`
          group
          font-fancy
          aria-[current="page"]: relative min-w-16 rounded rounded-b-none border border-slate-300 bg-slate-100 px-2 py-1 text-center text-slate-900
        underline
        aria-[current="page"]:bg-slate-800 aria-[current="page"]:text-slate-100 aria-[current="page"]:no-underline
        ${props.class || ""}`}
    >
      {children}
      <div
        class={`
          absolute -inset-x-2 -bottom-1 h-1 scale-x-0 rounded bg-black transition-transform ease-in-out group-hover:scale-x-25
        group-focus-visible:bg-blue-500 group-aria-[current="page"]:scale-x-100`}
      />
    </NavLink>
  );
};

export const loader = ({ request }: t.LoaderArgs) => {
  const url = new URL(request.url);

  return {
    pathname: url.pathname,
  };
};

export const partial = ({ request }: t.PartialArgs) => {
  const currentUrl = request.headers.get("hx-current-url");
  if (!currentUrl) return null;

  const findLink = (pathname: string) => {
    return links.find(({ to }) => isActive(pathname, to));
  };

  const prev = findLink(new URL(currentUrl).pathname);
  const next = findLink(new URL(request.url).pathname);
  if (prev === next) return null;
  if (!next) return null;
  if (!prev) return null;

  return (
    <>
      <HeaderLink to={prev.to} hx-swap-oob="morph">
        {prev.label}
      </HeaderLink>
      <HeaderLink to={next.to} active hx-swap-oob="morph">
        {next.label}
      </HeaderLink>
    </>
  );
};

export default function Route({
  children,
  loaderData: { pathname },
}: t.ComponentProps) {
  const active = links.find(({ to }) => isActive(pathname, to));

  return (
    <div class="flex flex-col">
      <header class="grid w-full grid-cols-[1fr_auto_1fr] border-b border-black bg-slate-100 px-2 py-1 shadow">
        <div class="col-start-2 flex">
          <h1 class="text-2xl font-bold text-slate-700">jacob</h1>
          <div class="size-10 rounded-4xl border-b border-black"></div>
          <nav class="mx-auto flex gap-4 rounded-4xl border-t border-slate-900 px-4 py-2">
            {links.map(({ to, label }) => {
              return (
                <HeaderLink to={to} active={active?.to === to}>
                  {label}
                </HeaderLink>
              );
            })}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

const sanitize = (value: string) => {
  return value.replaceAll(/[^\w-]/g, "-");
};

const isActive = (pathname: string, to: string) => {
  return pathname === to || pathname.startsWith(`${to}/`);
};
