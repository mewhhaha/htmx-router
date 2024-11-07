import { Link } from "../components/Link";
import * as t from "./+types._header";

type NavProps = {
  pathname: string;
} & JSX.IntrinsicElements["nav"];

const Nav = ({ pathname, ...rest }: NavProps) => {
  const links = [
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About" },
  ];

  const active = links.find(({ to }) => isActive(pathname, to));

  return (
    <nav class="flex gap-4" {...rest}>
      {links.map(({ to, label }) => {
        return (
          <Link to={to} aria-current={active?.to === to ? "page" : undefined}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export const partial = ({ request }: t.PartialArgs) => {
  const url = new URL(request.url);
  return <Nav id="header" pathname={url.pathname} hx-swap-oob="morph" />;
};

export const loader = ({ request }: t.LoaderArgs) => {
  const url = new URL(request.url);

  return {
    pathname: url.pathname,
  };
};

export default function Route({
  children,
  loaderData: { pathname },
}: t.ComponentProps) {
  return (
    <div class="flex flex-col">
      <header class="w-full bg-amber-200 border-b">
        <Nav id="header" pathname={pathname} />
        <h1 class="text-2xl font-bold">Jacob's blog</h1>
      </header>
      {children}
    </div>
  );
}

const isActive = (pathname: string, to: string) =>
  pathname === to || pathname.startsWith(`${to}/`);
