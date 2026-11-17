# TanStack Query patterns

## Client setup

```ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 min default — most of our data is not live
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,    // opt in per query where it matters
      retry: (failureCount, error) =>
        isAuthError(error) ? false : failureCount < 2,   // never retry a 401/403
    },
  },
});
```

Retrying an auth failure three times just makes the user wait three times as long for the same redirect.

## Paginated list, within budget

```ts
const PAGE_SIZE = 20;                       // default 20, never above 50

export function useTodos(filters: Filters, cursor?: string) {
  return useQuery({
    queryKey: todoKeys.list({ ...filters, cursor }),
    queryFn: () => fetchTodos({ ...filters, limit: PAGE_SIZE, cursor }),
    placeholderData: keepPreviousData,      // no flash to empty while the next page loads
  });
}
```

## Infinite query

```ts
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: todoKeys.list(filters),
  queryFn: ({ pageParam }) => fetchTodos({ ...filters, limit: PAGE_SIZE, cursor: pageParam }),
  initialPageParam: undefined as string | undefined,
  getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
});
```

Pair with `@tanstack/react-virtual` above ~200 accumulated rows — see `aoneahsan-cccs-react-performance`.

## Counting without reading

```ts
// Firestore
const snap = await getCountFromServer(query(collection(db, 'todos'), where('done', '==', false)));
const count = snap.data().count;          // 1 read per 1000 index entries, not 1 per document

// SQL
select count(*) from todos where done = false;
```

Or maintain a counter field updated on write, when the count is displayed constantly.

## Optimistic update with rollback

```ts
useMutation({
  mutationFn: toggleTodo,
  onMutate: async (vars) => {
    await queryClient.cancelQueries({ queryKey: todoKeys.detail(vars.id) });
    const previous = queryClient.getQueryData(todoKeys.detail(vars.id));
    queryClient.setQueryData(todoKeys.detail(vars.id), (old) => ({ ...old, done: vars.done }));
    return { previous };
  },
  onError: (_e, vars, ctx) => queryClient.setQueryData(todoKeys.detail(vars.id), ctx?.previous),
  onSettled: (_d, _e, vars) => queryClient.invalidateQueries({ queryKey: todoKeys.detail(vars.id) }),
});
```

`cancelQueries` first — otherwise an in-flight refetch lands after your optimistic write and overwrites it.

## Dependent queries

```ts
const { data: user } = useQuery({ queryKey: userKeys.me(), queryFn: fetchMe });
const { data: orders } = useQuery({
  queryKey: orderKeys.byUser(user?.id),
  queryFn: () => fetchOrders(user!.id),
  enabled: !!user?.id,                   // do not fire with an undefined id
});
```

## Prefetching on intent

```tsx
<Link
  to={`/todos/${id}`}
  onMouseEnter={() => queryClient.prefetchQuery({
    queryKey: todoKeys.detail(id), queryFn: () => fetchTodo(id),
  })}
>
```

Hover-prefetch makes navigation feel instant at the cost of one extra read — worth it for detail pages, not
for a long list where hovering is incidental.

## Sampling without fetching the pool

Never fetch a whole collection to pick K random items. Fetch at most `max(3 × K, 50)` using an indexed
strategy — a random-key field, a rotating cursor, or a pre-aggregated pool — and sample from that.
