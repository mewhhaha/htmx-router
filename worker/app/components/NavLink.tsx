export type NavLinkProps = {
  to: string;
  children?: string;
  active?: boolean;
} & JSX.IntrinsicElements["a"];

export const NavLink = ({ to, children, active, ...rest }: NavLinkProps) => {
  return (
    <a href={to} aria-current={active ? "page" : undefined} {...rest}>
      {children}
    </a>
  );
};
