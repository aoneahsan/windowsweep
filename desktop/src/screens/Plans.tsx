/** The approved Plans ledger: server counts first, then choices, referrals and Team. */
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Meter, Label } from 'react-aria-components';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../components/PrimaryButton';
import { PlanCards } from '../components/plans/PlanCards';
import { TeamPanel } from '../components/plans/TeamPanel';
import { getAllowance } from '../lib/allowance';
import {
  getAccountPoolLimit,
  getMyPlan,
  getPlans,
  getRecentRequest,
  getReferral,
} from '../lib/plans';
import { configuredFeatures } from '../lib/config';
import { FORMAT_LOCALE } from '../lib/format';
import '../styles/plans.css';

const queries = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 5 * 60_000 } },
});

function formattedDate(value: string): string {
  return new Intl.DateTimeFormat(FORMAT_LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

function PlansContent() {
  const { t } = useTranslation();
  const [copyStatus, setCopyStatus] = useState('');
  const [inviteStatus, setInviteStatus] = useState('');
  const configured = configuredFeatures().signIn;
  const allowance = useQuery({
    queryKey: ['plans', 'allowance'],
    queryFn: getAllowance,
    staleTime: 60_000,
    enabled: configured,
  });
  const mine = useQuery({ queryKey: ['plans', 'mine'], queryFn: getMyPlan, enabled: configured });
  const registry = useQuery({
    queryKey: ['plans', 'registry'],
    queryFn: getPlans,
    staleTime: 30 * 60_000,
    enabled: configured,
  });
  const pool = useQuery({
    queryKey: ['plans', 'account-pool'],
    queryFn: getAccountPoolLimit,
    staleTime: 30 * 60_000,
    enabled: configured,
  });
  const referral = useQuery({
    queryKey: ['plans', 'referral'],
    queryFn: getReferral,
    enabled: mine.data?.is_anonymous === false,
  });
  const recentRequest = useQuery({
    queryKey: ['plans', 'recent-request'],
    queryFn: getRecentRequest,
    enabled: mine.data?.is_anonymous === false,
  });
  const data = allowance.data;
  const plan = mine.data?.plan;
  const paid = Boolean(plan?.real_runs_unlimited ?? data?.plan.unlimited);
  const total = data ? data.device.limit + (data.account?.limit ?? 0) : 0;
  const left = data?.runs_left ?? 0;
  const resetDate = data ? formattedDate(data.resets_at) : '';
  const atLimit = Boolean(data && data.runs_left === 0);
  const deviceLimit = Boolean(atLimit && data?.is_anonymous);
  const team = registry.data?.find((item) => item.id === 'team');
  const extraLimit =
    registry.data?.find((item) => item.id === 'free')?.account_extra_real_runs_per_month ??
    pool.data;

  async function copy(text: string, action: 'command' | 'invite') {
    try {
      await navigator.clipboard.writeText(text);
      if (action === 'command') setCopyStatus(t('plans.limit.copied'));
      else setInviteStatus(t('plans.referral.copied'));
    } catch {
      if (action === 'invite') setInviteStatus(t('plans.referral.copyFailed'));
      else setCopyStatus(t('plans.limit.copyFailed'));
    }
  }

  return (
    <main className="content" id="plans-main">
      <section className="band band-app band-tight">
        <div className="wrap">
          <p className="caps ink-3">{t('plans.eyebrow')}</p>
          <h1 className="t-xl wide">{plan?.name ?? data?.plan.name ?? t('plans.meter.loading')}</h1>
          <div className="plan-state-row">
            <div>
              <p className="lede">{paid ? t('plans.paid.noLimit') : t('plans.meter.never')}</p>
              {mine.data?.source === 'team' && mine.data.team ? (
                <p className="t-sm ink-3">
                  {t('plans.paid.teamMember', { team: mine.data.team.name })}
                </p>
              ) : null}
              {mine.data?.source === 'admin' && mine.data.ends_at ? (
                <p className="t-sm ink-3">
                  {t('plans.paid.granted', {
                    plan: plan?.name,
                    date: formattedDate(mine.data.ends_at),
                  })}
                </p>
              ) : null}
              {mine.data?.source === 'referral' && mine.data.ends_at ? (
                <p className="t-sm ink-3">
                  {t('plans.paid.referral', {
                    plan: plan?.name,
                    date: formattedDate(mine.data.ends_at),
                  })}
                </p>
              ) : null}
              {mine.data?.source === 'payment' ? (
                <p className="t-sm ink-3">{t('plans.paid.portal')}</p>
              ) : null}
            </div>
            <Link className="lnk t-sm" to="/account">
              {t('nav.account')}
            </Link>
          </div>
        </div>
      </section>
      <section className="band band-app" aria-labelledby="plan-count-title">
        <div className="wrap">
          <div className="plan-count-grid">
            <div className="panel pad plan-meter">
              <p className="caps ink-3" id="plan-count-title">
                {t('plans.thisMonth')}
              </p>
              {allowance.isPending ? (
                <div className="plan-loading-skeleton" aria-hidden="true" />
              ) : null}
              {data ? (
                <>
                  <p className="plan-meter-number num wide">{paid ? '∞' : left}</p>
                  <p className="t-base" role="status">
                    {paid ? t('plans.paid.noLimit') : t('plans.meter.left', { count: left, total })}
                  </p>
                  {!paid ? (
                    <Meter value={left} minValue={0} maxValue={Math.max(1, total)}>
                      <Label className="visually-hidden">
                        {t('plans.meter.left', { count: left, total })}
                      </Label>
                      <div className="plan-meter-track">
                        <span style={{ width: `${total ? (left / total) * 100 : 0}%` }} />
                      </div>
                    </Meter>
                  ) : null}
                  {!paid ? (
                    <p className="t-sm ink-3">{t('plans.meter.reset', { date: resetDate })}</p>
                  ) : null}
                  {paid && mine.data?.source === 'payment' && mine.data.ends_at ? (
                    <p className="t-sm ink-3">
                      {t('plans.paid.renews', { date: formattedDate(mine.data.ends_at) })}
                    </p>
                  ) : null}
                </>
              ) : null}
              {allowance.isPending && configured ? (
                <p className="t-base" role="status">
                  {t('plans.meter.loading')}
                </p>
              ) : null}
              {!configured ? (
                <p className="t-base" role="status">
                  {t('account.notConfigured')}
                </p>
              ) : null}
              {allowance.isError ? (
                <>
                  <p className="t-base" role="alert">
                    {t('plans.meter.loadFailed')}
                  </p>
                  <button
                    className="btn btn-sm"
                    type="button"
                    onClick={() => void allowance.refetch()}
                  >
                    {t('plans.meter.tryAgain')}
                  </button>
                </>
              ) : null}
            </div>
            <div className="well pad plan-pools">
              <p className="caps ink-3">{t('plans.allowance')}</p>
              {data && !paid ? (
                <>
                  <p className="t-base">{t('plans.pool.device', { count: data.device.limit })}</p>
                  {data.is_anonymous && extraLimit !== undefined ? (
                    <p className="t-base">{t('plans.pool.signedOut', { count: extraLimit })}</p>
                  ) : null}
                  {!data.is_anonymous && data.account ? (
                    <p className="t-base">
                      {t('plans.pool.account', { count: data.account.limit })}
                    </p>
                  ) : null}
                </>
              ) : null}
              <p className="t-sm ink-3">{t('plans.meter.never')}</p>
            </div>
          </div>
          {atLimit ? (
            <div className="note note-warn plan-limit">
              <span aria-hidden="true">!</span>
              <div>
                <h2 className="t-md wide">
                  {t(deviceLimit ? 'plans.limit.titleDevice' : 'plans.limit.titleAll', {
                    count: deviceLimit ? data!.device.limit : total,
                  })}
                </h2>
                <p className="t-sm">{t('plans.limit.body', { date: resetDate })}</p>
                <div className="plan-actions">
                  <p className="t-sm">
                    {deviceLimit && extraLimit !== undefined
                      ? t('plans.limit.signIn', { count: extraLimit })
                      : t('plans.limit.pro')}
                  </p>
                  {deviceLimit ? (
                    <Link className="btn btn-primary" to="/account">
                      {t('plans.limit.signInAction')}
                    </Link>
                  ) : (
                    <a className="btn btn-primary" href="#plan-choose-title">
                      {t('plans.limit.proAction')}
                    </a>
                  )}
                </div>
                <details className="disclose plan-command">
                  <summary>
                    <span className="disclose-line">{t('plans.limit.cli')}</span>
                    <span className="disclose-more">{t('plans.limit.copy')}</span>
                  </summary>
                  <div className="disclose-body">
                    <p>{t('plans.limit.cliHelp')}</p>
                    <code className="mono">{t('plans.limit.cliSafeBatch')}</code>
                    <PrimaryButton
                      control="plans.copyCommand"
                      size="sm"
                      label={t('plans.limit.copy')}
                      onPress={() => void copy(t('plans.limit.cliSafeBatch'), 'command')}
                    />
                    {copyStatus ? <p role="status">{copyStatus}</p> : null}
                  </div>
                </details>
              </div>
            </div>
          ) : null}
        </div>
      </section>
      <PlanCards
        plans={registry.data}
        myPlan={mine.data}
        lastRequest={recentRequest.data}
        failed={registry.isError || mine.isError || !configured}
        retry={() => void registry.refetch()}
      />
      <section className="band band-app" aria-labelledby="referral-title">
        <div className="wrap plan-secondary-grid">
          <div>
            <p className="caps ink-3">{t('plans.referral.title')}</p>
            <h2 className="t-lg wide" id="referral-title">
              {t('plans.referral.title')}
            </h2>
            <p className="t-sm ink-3">{t('plans.referral.counts')}</p>
          </div>
          <div className="panel pad">
            {mine.data?.is_anonymous ? (
              <p className="t-sm">{t('plans.referral.signedOut')}</p>
            ) : null}
            {referral.isPending && mine.data && !mine.data.is_anonymous ? (
              <p role="status">{t('plans.meter.loading')}</p>
            ) : null}
            {referral.isError ? (
              <button className="btn" type="button" onClick={() => void referral.refetch()}>
                {t('plans.meter.tryAgain')}
              </button>
            ) : null}
            {referral.data ? (
              <>
                <div className="plan-referral-stats">
                  <p>
                    <span className="num t-lg">{referral.data.confirmed}</span>
                    <span className="t-sm ink-3">
                      {t('plans.referral.confirmed', { count: referral.data.confirmed })}
                    </span>
                  </p>
                  <p>
                    <span className="num t-lg">{referral.data.points}</span>
                    <span className="t-sm ink-3">
                      {t('plans.referral.pointsTotal', { count: referral.data.points })}
                    </span>
                  </p>
                  <p>
                    <span className="num t-lg">{referral.data.months_earned_total}</span>
                    <span className="t-sm ink-3">
                      {t('plans.referral.monthsEarned', {
                        count: referral.data.months_earned_total,
                        plan: referral.data.rule.reward_plan.name,
                      })}
                    </span>
                  </p>
                </div>
                {!referral.data.enabled ? (
                  <p className="t-sm">{t('plans.referral.off')}</p>
                ) : (
                  <>
                    <p className="t-sm ink-3">
                      {t('plans.referral.points', {
                        points: t('plans.referral.pointCount', {
                          count: referral.data.rule.points_per_confirmed,
                        }),
                      })}{' '}
                      {t('plans.referral.months', {
                        friends: t('plans.referral.friendCount', {
                          count: referral.data.rule.threshold,
                        }),
                        reward: t('plans.referral.proMonthCount', {
                          count: referral.data.rule.reward_months,
                          plan: referral.data.rule.reward_plan.name,
                        }),
                        cap: t('plans.referral.monthCount', {
                          count: referral.data.rule.cap_months_per_year,
                        }),
                      })}
                    </p>
                    {!referral.data.confirmed ? (
                      <p className="t-sm">{t('plans.referral.empty')}</p>
                    ) : null}
                    <p className="t-sm">
                      {t('plans.referral.waiting', { count: referral.data.pending })}
                    </p>
                    <p className="t-sm">
                      {t('plans.referral.expired', { count: referral.data.expired })}
                    </p>
                    <div className="plan-invite-row">
                      <div className="fw">
                        <label className="fw-lbl" htmlFor="invite-code">
                          {t('plans.referral.codeLabel')}
                        </label>
                        <input
                          className="field field-mono"
                          id="invite-code"
                          readOnly
                          value={referral.data.code ?? ''}
                        />
                      </div>
                      <PrimaryButton
                        control="plans.copyInvite"
                        label={t('plans.referral.copyLink')}
                        onPress={() =>
                          void copy(
                            `https://windowsweep.aoneahsan.com/?ref=${encodeURIComponent(referral.data.code ?? '')}`,
                            'invite'
                          )
                        }
                        disabled={!referral.data.code}
                      />
                    </div>
                  </>
                )}
                {inviteStatus ? (
                  <p className="t-sm" role="status">
                    {inviteStatus}
                  </p>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </section>
      <TeamPanel
        myPlan={mine.data}
        teamMinSeats={team?.min_seats ?? 3}
        failed={mine.isError || !configured}
      />
    </main>
  );
}

/** Keep the query cache across visits without bringing it into the boot bundle. */
export function Plans() {
  return (
    <QueryClientProvider client={queries}>
      <PlansContent />
    </QueryClientProvider>
  );
}
