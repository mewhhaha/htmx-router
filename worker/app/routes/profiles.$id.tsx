import { ctx } from "../../src/router/router";

export const loader = ({ params }: ctx) => {
  console.log(params);
  return { id: params.id };
};

export default function Route({
  loaderData: { id } = { id: "" },
}: {
  children?: string;
  loaderData?: { id: string };
}) {
  return <div>Profil {id}</div>;
}
