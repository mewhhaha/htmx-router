const redirect = (location: string) => {
  return new Response(null, {
    status: 302,
    headers: { Location: location },
  });
};

export const loader = () => {
  throw redirect("/blog");
};
