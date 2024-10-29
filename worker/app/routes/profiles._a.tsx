export default function Route({
  children,
}: {
  children?: string;
  loaderData?: { id: string };
}) {
  return <div>I'm layout a{children}</div>;
}
