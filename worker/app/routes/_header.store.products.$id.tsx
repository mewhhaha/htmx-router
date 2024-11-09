import { redirect } from "htmx-router";
import * as t from "./+types._header.store.products.$id";
type Product = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  rating_rate: number;
  rating_count: number;
};

const getProduct = async (db: D1Database, id: string) => {
  const product = await db
    .prepare("SELECT * FROM items WHERE id = ? LIMIT 1")
    .bind(id)
    .first<Product>();

  if (!product) {
    throw redirect("/store/products");
  }

  return { product };
};

export const loader = async ({
  params: { id },
  context: [env],
}: t.LoaderArgs) => {
  const { product } = await getProduct(env.DB, id);
  return { product };
};

export default function Product({ loaderData: { product } }: t.ComponentProps) {
  return (
    <main class="mx-auto w-full max-w-3xl bg-red-300 p-12">
      <title>{product.title}</title>
      <article>
        <h1 class="font-fancy mb-10 text-2xl font-bold text-pink-900">
          {product.title}
        </h1>
        <div class="flex gap-8">
          <div class="isolate grid w-1/2 [&>*]:[grid-area:1/1]">
            <img
              src={product.image}
              aria-hidden="true"
              class="m-4 aspect-square w-full rotate-2 border-4 border-pink-400 bg-white object-cover pr-4 shadow-lg"
            />
            <img
              src={product.image}
              aria-hidden="true"
              class="m-2 aspect-square w-full rotate-1 border-4 border-pink-400 bg-white object-cover shadow-lg"
            />

            <img
              src={product.image}
              alt={product.title}
              class="aspect-square w-full rotate-0 border-4 border-pink-400 bg-white object-cover shadow-lg"
            />
          </div>

          <div class="w-1/2 space-y-6">
            <div class="bg-white/80 p-4 shadow">
              <h2 class="font-fancy mb-2 text-2xl font-bold text-pink-900">
                Details
              </h2>
              <p class="text-gray-700">{product.description}</p>
            </div>

            <div class="bg-white/80 p-4 shadow">
              <h2 class="font-fancy mb-2 text-xl font-bold text-pink-900">
                Category
              </h2>
              <a
                href={`/store/products?q=${product.category}`}
                class="text-blue-600 underline hover:text-blue-800"
              >
                {product.category}
              </a>
            </div>

            <div class="bg-white/80 p-4 shadow">
              <h2 class="font-fancy mb-2 text-xl font-bold text-pink-900">
                Rating
              </h2>
              <div class="flex items-center gap-2">
                <span class="text-lg font-bold text-slate-800">
                  {product.rating_rate}/5
                </span>
                <span class="text-sm text-gray-600">
                  ({product.rating_count} reviews)
                </span>
              </div>
            </div>

            <button class="w-full cursor-pointer border-b-4 bg-white px-4 py-2 text-pink-600 transition-transform hover:rotate-1 hover:border-b-white hover:bg-pink-600 hover:text-white">
              Add to Cart
            </button>
          </div>
        </div>
      </article>
    </main>
  );
}
