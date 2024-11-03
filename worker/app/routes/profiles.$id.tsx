import { ctx } from "../../src/router/router";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const loader = async ({ params }: ctx) => {
  await sleep(2000);
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
