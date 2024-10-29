type LinkProps = {
  to: string;
  children?: string;
};

export const Link = ({ to, children }: LinkProps) => {
  return (
    <a class="text-blue-500 cursor-pointer hover:text-blue-600" href={to}>
      {children}
    </a>
  );
};
