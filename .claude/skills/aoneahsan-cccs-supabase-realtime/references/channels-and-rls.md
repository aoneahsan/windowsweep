# Channels, authorisation and payloads

> API specifics move. Confirm names and signatures against the **`supabase:supabase`** plugin skill or
> Supabase's own docs before shipping; the decisions below are what this file is for.

## Choosing the mechanism

**Postgres Changes** streams the write-ahead log. It is the fastest thing to demo and the first thing to
outgrow: authorisation of each change is evaluated **per subscriber**, so cost scales with subscribers ×
writes rather than with either alone.

**Broadcast** sends a message you construct to a topic you name. A database trigger can send it, which keeps
the database as the source of the event while giving you control of the payload.

**Presence** tracks who is currently joined. It is ephemeral and best-effort — correct for "3 people
viewing", never for anything that must be right.

**The default for anything real:** a trigger that broadcasts to a private channel.

```sql
create or replace function notify_result_change()
returns trigger language plpgsql security definer as $$
begin
  perform realtime.broadcast_changes(
    'tenant:' || new.tenant_id::text || ':results',  -- topic: scope is in the name
    tg_op, tg_op, tg_table_name, tg_table_schema, new, old
  );
  return null;
end $$;

create trigger results_broadcast
  after insert or update or delete on public.results
  for each row execute function notify_result_change();
```

🔴 **`security definer` means this function bypasses RLS.** That is why it can read the row — and why the
topic it writes must be derived from the row's own scope column, never from anything caller-supplied.

## Topic naming

The topic **is** the access-control boundary, so it encodes the scope:

```
tenant:{tenant_id}:results        every member of one tenant
user:{user_id}:notifications      one person
room:{room_id}:messages           one conversation
```

A topic anyone may join is a public channel, whatever it is called. If two users must not see each other's
events, their topics must differ — filtering on the client is the same defect as filtering a query result in
the browser.

## Authorising a private channel

A private channel checks a policy on the realtime messages table at join time. The policy answers one
question: **may this user join this topic?**

```sql
create policy "join own tenant result topic"
on realtime.messages for select
to authenticated
using (
  realtime.topic() like 'tenant:%:results'
  and split_part(realtime.topic(), ':', 2)::uuid in (
    select tenant_id from public.tenant_members where user_id = auth.uid()
  )
);
```

Two properties worth noting: it is evaluated **once at subscribe** rather than per message, and it is
provable from the topic string plus a membership lookup — the same shape as the query rule in
`aoneahsan-cccs-postgres-multitenancy-rbac`.

**Mark the channel private explicitly** when creating it client-side; a channel created without that flag is
not authorised, and it will happily deliver.

## 🔴 The DELETE payload

An insert or update can carry the row. A delete cannot, in the same way:

- Postgres only supplies the full old row to the replication stream when the table's replica identity is set
  to full. By default a delete carries the **primary key and nothing else**.
- So a subscriber **cannot filter a delete on any other column** — a client filtering "only my tenant's rows"
  receives deletes it cannot classify.

Two workable answers:

1. **Broadcast a payload you chose.** The trigger has the old row; put the scope column in the message.
2. **Soft-delete**, so the event is an update with the full row and the filter works normally.

Setting replica identity to full is the third option and it costs WAL volume on every update, not just
deletes. Choose it deliberately.

## Payload discipline

The message is delivered to every subscriber on the topic, and it lands in memory, in logs, and in whatever
error reporter is attached.

| Rule | Why |
|---|---|
| **Send an identifier and a verb, not the record** | The client refetches what it is allowed to see. The event does not have to carry it |
| **No personal or clinical detail in a notification payload** | A toast is rendered on a screen other people can see — `aoneahsan-cccs-phi-safe-engineering` |
| **Keep it small** | Every subscriber pays for every byte |
| **Version it** | A payload shape that changes breaks connected clients that have not reloaded |

The identifier-and-verb pattern is also what makes the refetch-on-reconnect design coherent: if the event
never carried the data, no one is tempted to trust it as the data.

## Enabling it at all

- A table must be **added to the realtime publication** before Postgres Changes emits anything for it. A
  subscription that connects cleanly and never fires is usually this.
- Broadcast needs no publication — only the trigger and the policy.
- Both are **per project**, and since 2026-08-06 there is only the one hosted project — so a publication or
  policy you "already added" was added to the database users are on. Verify it there, and remember the old
  "it worked locally" escape hatch no longer exists to absorb the mistake.
