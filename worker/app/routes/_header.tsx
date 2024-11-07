import { NavLink, NavLinkProps } from "../components/NavLink";
import * as t from "./+types._header";

const links = [
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
];

const HeaderLink = (props: NavLinkProps) => {
  return (
    <NavLink
      id={sanitize(props.to)}
      {...props}
      class={`
        bg-slate-100 rounded-md text-slate-900 px-2 min-w-16 text-center py-1 underline font-fancy
        hover:bg-blue-50 hover:text-blue-900
        aria-[current="page"]:bg-blue-100 aria-[current="page"]:no-underline
        ${props.class || ""}
    `}
    />
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
      <HeaderLink to={prev.to} hx-swap-oob="true">
        {prev.label}
      </HeaderLink>
      <HeaderLink to={next.to} active hx-swap-oob="true">
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
      <header class="w-full bg-slate-100 border-b border-black shadow px-2 py-1 grid grid-cols-[1fr_auto_1fr]">
        <div class="flex col-start-2">
          <h1 class="text-2xl font-bold text-black">jacob</h1>
          <div class="rounded-4xl border-black border-b size-10"></div>
          <nav class="flex gap-4 mx-auto border-t border-black rounded-4xl px-4 py-2">
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
