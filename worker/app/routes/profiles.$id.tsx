import { ctx } from "../../src/router/router";

export const loader = ({ params }: ctx) => {
  return { id: params.id };
};

export default function Route({
  loaderData: { id } = { id: "" },
}: {
  children?: string;
  loaderData?: { id: string };
}) {
  return (
    <div>
      Profil {id}
      <hydrate-me hidden="true" src="counter">
        <div>hello</div>
        <div>world</div>
      </hydrate-me>
    </div>
  );
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "hydrate-me": { src: string; children?: string; hidden: "true" };
    }
  }
}
