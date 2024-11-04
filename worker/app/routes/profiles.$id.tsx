import * as t from "./+types.profiles.$id";

export const loader = async ({ params }: t.LoaderArgs) => {
  return { id: params.id };
};

export default function Route({ loaderData: { id } }: t.ComponentProps) {
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
