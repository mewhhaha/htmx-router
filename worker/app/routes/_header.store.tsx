import * as t from "./+types._header.store";
export const loader = ({ request }: t.LoaderArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const search = searchParams.get("q") || "";

  return { search };
};

export default function Store({ loaderData: { search } }: t.ComponentProps) {
  return (
    <main class="mx-auto w-full max-w-3xl bg-red-300 p-12">
      <title>Store</title>
      <div>
        <form
          hx-boost="true"
          action={`/store`}
          method="GET"
          class="group relative flex w-96 items-center rounded-md border bg-white text-black"
        >
          <input
            id="search"
            name="q"
            type="text"
            placeholder="Search..."
            value={search}
            class="peer min-w-0 grow rounded-md border-none bg-white px-4 py-2 text-black focus:outline-dashed"
          />
          <label
            for="search"
            class={`
              absolute -top-2 -left-2 size-full rounded-md border bg-white/30 shadow transition-[top,left] ease-in-out
              group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:left-0
              peer-focus:bg-transparent peer-focus:outline peer-focus:outline-2 peer-focus:outline-blue-500`}
          />
          <button
            type="submit"
            class={`
              focus:outlinefocus:outline-2 absolute -top-1 right-3 size-8 cursor-pointer rounded-full border bg-white/70 shadow-lg transition-[top,right]
              ease-in-out group-focus-within:top-1 
              group-focus-within:right-1 
              hover:bg-gray-200/70 focus:bg-white focus:outline-blue-500
              `}
          >
            <span class="sr-only">Search</span>
            <SearchIcon class="m-auto size-6" />
          </button>
        </form>
      </div>
      <ul>
        <li>Item 1</li>
      </ul>
      This is the about store
    </main>
  );
}

type SearchIconProps = JSX.IntrinsicElements["svg"];

const SearchIcon = (props: SearchIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      {...props}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
};
