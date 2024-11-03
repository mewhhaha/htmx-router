export type InferComponentProps<module> = {
  children: JSX.Element | undefined;
  loaderData: module extends {
    loader: infer loader extends (...args: any) => any;
  }
    ? Awaited<ReturnType<loader>>
    : never;
};

export type InferLoaderArgs<params extends Record<string, string>> = {
  request: Request;
  params: params;
  context: [unknown, ExecutionContext];
};

export type InferActionArgs<params extends Record<string, string>> = {
  request: Request;
  params: params;
  context: [unknown, ExecutionContext];
};

export type InferHeaderArgs<params extends Record<string, string>, module> = {
  params: params;
  loaderData: module extends {
    loader: infer loader extends (...args: any) => any;
  }
    ? ReturnType<loader>
    : never;
};
