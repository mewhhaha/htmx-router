type LinkProps = {
  to: string;
  children?: string;
  active?: boolean;
};

export const Link = ({ to, children, ...rest }: LinkProps) => {
  return (
    <a
      class="text-blue-500 cursor-pointer hover:text-blue-600"
      href={to}
      {...rest}
    >
      <span id={to}>{children}</span>
    </a>
  );
};
