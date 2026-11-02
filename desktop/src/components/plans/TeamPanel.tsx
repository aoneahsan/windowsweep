import { useState } from 'react';
import { Button } from 'react-aria-components';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { TextField } from '../forms/TextField';
import {
  createTeam,
  getFleet,
  inviteToTeam,
  removeTeamInvite,
  removeTeamMember,
  type MyPlan,
} from '../../lib/plans';
import { formatBytes, FORMAT_LOCALE } from '../../lib/format';
import { track } from '../../lib/analytics';

const teamSchema = z.object({
  name: z.string().trim().min(1, 'plans.team.createEmpty').max(80, 'plans.team.nameTooLong'),
});
const inviteSchema = z.object({ email: z.email('plans.team.inviteInvalid') });

interface Props {
  myPlan: MyPlan | undefined;
  teamMinSeats: number;
  failed: boolean;
}

/** Team owner and member views share one server-paged fleet answer. */
export function TeamPanel({ myPlan, teamMinSeats, failed }: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const team = myPlan?.team;
  const owner = team?.role === 'owner';
  const fleet = useQuery({
    queryKey: ['plans', 'fleet', team?.id, page],
    queryFn: () => getFleet(page),
    enabled: Boolean(team),
    staleTime: 5 * 60_000,
  });
  const createForm = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
    defaultValues: { name: '' },
    mode: 'onBlur',
  });
  const inviteForm = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: '' },
    mode: 'onBlur',
  });
  const create = useMutation({
    mutationFn: createTeam,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['plans', 'mine'] });
      setStatus(t('plans.team.created'));
    },
  });
  const invite = useMutation({
    mutationFn: inviteToTeam,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['plans', 'fleet'] });
    },
  });
  const remove = useMutation({
    mutationFn: async (target: { inviteId?: string; userId?: string }) => {
      if (target.inviteId) await removeTeamInvite(target.inviteId);
      else if (target.userId) await removeTeamMember(target.userId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['plans', 'fleet'] });
    },
  });

  function failure(cause: unknown): string {
    if (cause instanceof Error && cause.message === 'no_seats') return t('plans.team.noSeat');
    if (cause instanceof Error && cause.message === 'already_member')
      return t('plans.team.alreadyMember');
    return t('plans.team.failed', { message: t('plans.team.retry') });
  }

  async function onCreate(values: z.infer<typeof teamSchema>) {
    track('control.press', { control: 'team.create', route: '/plans' });
    setError('');
    setStatus('');
    try {
      await create.mutateAsync(values.name);
    } catch (cause) {
      setError(failure(cause));
    }
  }
  async function onInvite(values: z.infer<typeof inviteSchema>) {
    track('control.press', { control: 'team.invite', route: '/plans' });
    setError('');
    setStatus('');
    try {
      const result = await invite.mutateAsync(values.email);
      setStatus(
        t(result.email_sent ? 'plans.team.invited' : 'plans.team.inviteEmailUnconfirmed', {
          email: values.email,
        })
      );
      inviteForm.reset();
    } catch (cause) {
      setError(failure(cause));
    }
  }
  async function onRemove(target: { inviteId?: string; userId?: string }, email: string) {
    track('control.press', {
      control: target.inviteId ? 'team.removeInvite' : 'team.removeMember',
      route: '/plans',
    });
    setError('');
    setStatus('');
    try {
      await remove.mutateAsync(target);
      setStatus(t('plans.team.removed', { email }));
    } catch (cause) {
      setError(failure(cause));
    }
  }

  return (
    <section className="band band-app" id="team" aria-labelledby="team-status-title">
      <div className="wrap plan-secondary-grid">
        <div>
          <p className="caps ink-3">{t('plans.team.eyebrow')}</p>
          <h2 className="t-lg wide" id="team-status-title">
            {t('plans.team.title')}
          </h2>
          <p className="t-sm ink-3">{t('plans.team.lede')}</p>
        </div>
        <div className="well pad">
          {!myPlan && !failed ? (
            <p className="t-sm" role="status">
              {t('plans.meter.loading')}
            </p>
          ) : null}
          {failed ? (
            <p className="t-sm" role="alert">
              {t('plans.meter.loadFailed')}
            </p>
          ) : null}
          {myPlan && !myPlan.plan.fleet_reports ? (
            <>
              <p className="t-sm">{t('plans.team.locked', { min: teamMinSeats })}</p>
              <a className="btn" href="#plan-choose-title">
                {t('plans.team.lockedAction')}
              </a>
            </>
          ) : null}
          {myPlan?.plan.fleet_reports && !team ? (
            <form
              onSubmit={(event) => {
                void createForm.handleSubmit(onCreate)(event);
              }}
            >
              <Controller
                control={createForm.control}
                name="name"
                render={({ field, fieldState }) => (
                  <TextField
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    label={t('plans.team.createLabel')}
                    required
                    error={fieldState.error?.message ? t(fieldState.error.message) : undefined}
                  />
                )}
              />
              <Button className="btn btn-primary" type="submit" isDisabled={create.isPending}>
                {t('plans.team.createAction')}
              </Button>
            </form>
          ) : null}
          {team ? (
            <>
              <p className="t-sm">
                {t(owner ? 'plans.team.ownerSimple' : 'plans.team.memberState')}
              </p>
              {owner ? (
                <p className="t-sm ink-3">{t('plans.team.capacity', { count: team.seats })}</p>
              ) : null}
              {fleet.isPending ? (
                <p className="t-sm" role="status">
                  {t('plans.meter.loading')}
                </p>
              ) : null}
              {fleet.isError ? (
                <Button className="btn" onPress={() => void fleet.refetch()}>
                  {t('plans.meter.tryAgain')}
                </Button>
              ) : null}
              {fleet.data ? (
                <p className="t-sm">
                  {t('plans.team.fleetSummary', {
                    members: fleet.data.totals.members,
                    machines: fleet.data.totals.machines,
                    runs: fleet.data.totals.real_runs_30d,
                  })}
                </p>
              ) : null}
              {owner && fleet.data ? (
                <>
                  <form
                    onSubmit={(event) => {
                      void inviteForm.handleSubmit(onInvite)(event);
                    }}
                  >
                    <Controller
                      control={inviteForm.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <TextField
                          name={field.name}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          inputRef={field.ref}
                          type="email"
                          label={t('plans.team.inviteLabel')}
                          placeholder={t('plans.team.invitePlaceholder')}
                          required
                          error={
                            fieldState.error?.message ? t(fieldState.error.message) : undefined
                          }
                        />
                      )}
                    />
                    <Button className="btn" type="submit" isDisabled={invite.isPending}>
                      {t('plans.team.inviteAction')}
                    </Button>
                  </form>
                  <p className="t-sm ink-3">{t('plans.team.seatsNote')}</p>
                  <p className="t-sm ink-3">{t('plans.team.inviteHow')}</p>
                </>
              ) : null}
              {fleet.data?.invites.length ? (
                <div className="plan-table-scroll">
                  <table className="tbl">
                    <caption className="visually-hidden">{t('plans.team.title')}</caption>
                    <thead>
                      <tr>
                        <th>{t('plans.team.colMember')}</th>
                        <th>{t('plans.team.colStatus')}</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {fleet.data.invites.map((item) => (
                        <tr key={item.id}>
                          <td>{item.email}</td>
                          <td>{t('plans.team.statusInvited')}</td>
                          <td>
                            {owner ? (
                              <Button
                                className="btn btn-sm"
                                onPress={() => void onRemove({ inviteId: item.id }, item.email)}
                                isDisabled={remove.isPending}
                              >
                                {t('plans.team.remove')}
                              </Button>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              {fleet.data?.members.length ? (
                <div className="plan-table-scroll">
                  <table className="tbl">
                    <caption className="visually-hidden">{t('plans.team.fleetTitle')}</caption>
                    <thead>
                      <tr>
                        <th>{t('plans.team.colMember')}</th>
                        <th>{t('plans.team.colRole')}</th>
                        <th>{t('plans.team.fleetTitle')}</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {fleet.data.members.map((item) => (
                        <tr key={item.user_id}>
                          <td>{item.display_name || item.email || item.user_id}</td>
                          <td>
                            {t(
                              item.role === 'owner'
                                ? 'plans.team.roleOwner'
                                : 'plans.team.roleMember'
                            )}
                          </td>
                          <td>
                            {item.real_runs_30d} · {formatBytes(item.freed_bytes_30d)}
                          </td>
                          <td>
                            {owner && item.role !== 'owner' ? (
                              <Button
                                className="btn btn-sm"
                                onPress={() =>
                                  void onRemove(
                                    { userId: item.user_id },
                                    item.email ?? item.user_id
                                  )
                                }
                                isDisabled={remove.isPending}
                              >
                                {t('plans.team.remove')}
                              </Button>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              <h3 className="t-md wide">{t('plans.team.fleetTitle')}</h3>
              {fleet.data && !fleet.data.runs.length ? (
                <p className="t-sm ink-3">{t('plans.team.fleetEmpty')}</p>
              ) : null}
              {fleet.data?.runs.length ? (
                <div className="plan-table-scroll">
                  <table className="tbl">
                    <caption className="visually-hidden">{t('plans.team.fleetTitle')}</caption>
                    <thead>
                      <tr>
                        <th>{t('plans.team.colMember')}</th>
                        <th>{t('plans.team.fleetTitle')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fleet.data.runs.map((run) => (
                        <tr key={`${run.member_id}-${run.device_id}-${run.started_at}`}>
                          <td>
                            {fleet.data?.members.find((m) => m.user_id === run.member_id)
                              ?.display_name ||
                              fleet.data?.members.find((m) => m.user_id === run.member_id)?.email}
                          </td>
                          <td>
                            {new Intl.DateTimeFormat(FORMAT_LOCALE, { dateStyle: 'medium' }).format(
                              new Date(run.started_at)
                            )}{' '}
                            · {run.mode} · {run.sections.join(', ')} ·{' '}
                            {formatBytes(run.freed_bytes)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              {page > 0 ? (
                <Button className="btn" onPress={() => setPage(page - 1)}>
                  {t('plans.team.previousPage')}
                </Button>
              ) : null}
              {fleet.data?.next_page !== null && fleet.data?.next_page !== undefined ? (
                <Button className="btn" onPress={() => setPage(page + 1)}>
                  {t('plans.team.nextPage')}
                </Button>
              ) : null}
            </>
          ) : null}
          {status ? (
            <p className="t-sm" role="status">
              {status}
            </p>
          ) : null}
          {error ? (
            <p className="t-sm" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
