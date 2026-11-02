import { useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  FieldError,
  Group,
  Input,
  Label,
  NumberField,
  Radio,
  RadioGroup,
} from 'react-aria-components';
import { Trans, useTranslation } from 'react-i18next';
import { z } from 'zod';

import { PrimaryButton } from '../PrimaryButton';
import { requestPlan, type MyPlan, type Plan, type PlanRequest } from '../../lib/plans';
import { FORMAT_LOCALE } from '../../lib/format';

const seatsSchema = z.object({ seats: z.number().int().min(1).max(1000) });
const money = (cents: number) =>
  new Intl.NumberFormat(FORMAT_LOCALE, {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(cents / 100);
const date = (value: string) =>
  new Intl.DateTimeFormat(FORMAT_LOCALE, { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(value)
  );

interface Props {
  plans: Plan[] | undefined;
  myPlan: MyPlan | undefined;
  lastRequest: PlanRequest | null | undefined;
  failed: boolean;
  retry: () => void;
}

/** Prices and seats come from active plan rows; only the explanatory copy is static. */
export function PlanCards({ plans, myPlan, lastRequest, failed, retry }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { billing: interval } = useSearch({ from: '/plans' });
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const pro = plans?.find((plan) => plan.id === 'pro');
  const team = plans?.find((plan) => plan.id === 'team');
  const seatsForm = useForm<z.infer<typeof seatsSchema>>({
    resolver: zodResolver(seatsSchema),
    defaultValues: { seats: team?.min_seats ?? 3 },
    mode: 'onBlur',
  });
  const minSeats = team?.min_seats;
  const {
    setValue,
    formState: { isDirty },
  } = seatsForm;
  useEffect(() => {
    if (minSeats !== undefined && !isDirty) setValue('seats', minSeats);
  }, [minSeats, isDirty, setValue]);
  const mutation = useMutation({
    mutationFn: requestPlan,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['plans', 'mine'] }),
        queryClient.invalidateQueries({ queryKey: ['plans', 'recent-request'] }),
      ]);
    },
  });

  async function choose(plan: Plan) {
    setError('');
    setStatus('');
    if (!myPlan || myPlan.is_anonymous) {
      void navigate({ to: '/account' });
      return;
    }
    const seats = plan.per_seat ? seatsForm.getValues('seats') : 1;
    if (!Number.isInteger(seats) || seats < plan.min_seats || seats > 1000) {
      seatsForm.setError('seats', {
        message: t('plans.choose.seatsHint', { min: plan.min_seats }),
      });
      return;
    }
    try {
      await mutation.mutateAsync({ planId: plan.id, interval, seats });
      setStatus(t('plans.request.sent', { plan: plan.name }));
    } catch (cause) {
      const code = z.object({ code: z.string() }).safeParse(cause);
      if (code.success && code.data.code === '23505') {
        await queryClient.invalidateQueries({ queryKey: ['plans', 'mine'] });
      } else {
        setError(t('plans.request.failed'));
      }
    }
  }

  function priceLabel(plan: Plan): string {
    const price = money(interval === 'month' ? plan.price_month_cents : plan.price_year_cents);
    return t(
      plan.per_seat
        ? interval === 'month'
          ? 'plans.choose.perSeatMonth'
          : 'plans.choose.perSeatYear'
        : interval === 'month'
          ? 'plans.choose.perMonth'
          : 'plans.choose.perYear',
      { price }
    );
  }
  function yearlyNote(plan: Plan): string {
    return interval === 'year'
      ? t('plans.choose.yearlyNote', {
          year: money(plan.price_year_cents),
          atMonthly: money(plan.price_month_cents * 12),
        })
      : '';
  }
  const pending = myPlan?.pending_request;
  return (
    <section className="band band-well" aria-labelledby="plan-choose-title">
      <div className="wrap">
        <div className="plan-section-head">
          <div>
            <p className="caps ink-3">{t('plans.choose.billing')}</p>
            <h2 className="t-lg wide" id="plan-choose-title">
              {t('plans.choose.title')}
            </h2>
          </div>
          <RadioGroup
            value={interval}
            onChange={(value) =>
              void navigate({
                to: '/plans',
                search: { billing: value === 'year' ? 'year' : 'month' },
              })
            }
            aria-label={t('plans.choose.billing')}
            className="plan-billing"
          >
            <Radio value="month">{t('plans.choose.monthly')}</Radio>
            <Radio value="year">{t('plans.choose.yearly')}</Radio>
          </RadioGroup>
        </div>
        {failed ? (
          <div role="alert">
            <p>{t('plans.choose.loadFailed')}</p>
            <Button className="btn" onPress={retry}>
              {t('plans.meter.tryAgain')}
            </Button>
          </div>
        ) : null}
        {!plans && !failed ? <p role="status">{t('plans.meter.loading')}</p> : null}
        {plans ? (
          <div className="plan-cards">
            {[pro, team]
              .filter((plan): plan is Plan => Boolean(plan))
              .map((plan) => {
                const current = myPlan?.plan.id === plan.id;
                return (
                  <article
                    className="panel pad plan-card"
                    key={plan.id}
                    aria-labelledby={`${plan.id}-title`}
                  >
                    <p className="caps ink-3">
                      {plan.per_seat
                        ? t('plans.choose.fromSeats', { min: plan.min_seats })
                        : t('plans.choose.onePerson')}
                    </p>
                    <h3 className="t-lg wide" id={`${plan.id}-title`}>
                      {plan.name}
                    </h3>
                    <p className="plan-price num">{priceLabel(plan)}</p>
                    {interval === 'year' ? <p className="t-sm ink-3">{yearlyNote(plan)}</p> : null}
                    <p className="t-sm">
                      {t(plan.per_seat ? 'plans.choose.team' : 'plans.choose.pro', {
                        min: plan.min_seats,
                        machines: plan.report_machines,
                      })}
                    </p>
                    {plan.per_seat ? (
                      <Controller
                        control={seatsForm.control}
                        name="seats"
                        render={({ field, fieldState }) => (
                          <NumberField
                            name={field.name}
                            value={field.value}
                            onChange={field.onChange}
                            minValue={plan.min_seats}
                            maxValue={1000}
                            validationBehavior="aria"
                            isInvalid={Boolean(fieldState.error)}
                            className="fw"
                          >
                            <Label className="fw-lbl">{t('plans.choose.seats')}</Label>
                            <Group>
                              <Input
                                className="field"
                                inputMode="numeric"
                                onBlur={field.onBlur}
                                ref={field.ref}
                              />
                            </Group>
                            <FieldError className="fw-error">
                              {fieldState.error
                                ? t('plans.choose.seatsRange', { min: plan.min_seats })
                                : undefined}
                            </FieldError>
                            <span className="fw-desc">
                              {t('plans.choose.seatsHint', { min: plan.min_seats })}
                            </span>
                          </NumberField>
                        )}
                      />
                    ) : null}
                    <div className="plan-card-bottom">
                      <PrimaryButton
                        control={
                          myPlan?.is_anonymous
                            ? 'plans.signIn'
                            : plan.per_seat
                              ? 'plans.requestTeam'
                              : 'plans.requestPro'
                        }
                        label={
                          mutation.isPending
                            ? t('plans.request.sending')
                            : current
                              ? t('plans.choose.current')
                              : myPlan?.is_anonymous
                                ? t('plans.choose.signInAction')
                                : t(plan.per_seat ? 'plans.request.team' : 'plans.request.pro')
                        }
                        onPress={() => void choose(plan)}
                        disabled={Boolean(!myPlan || current || pending || mutation.isPending)}
                        state={mutation.isPending ? 'pending' : 'idle'}
                      />
                      {!current ? (
                        <p className="t-xs ink-3 plan-pay-line">
                          <Trans
                            i18nKey="plans.choose.consent"
                            components={{
                              1: (
                                <a
                                  href="https://windowsweep.aoneahsan.com/terms"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={t('plans.choose.termsNewTab')}
                                />
                              ),
                              3: (
                                <a
                                  href="https://windowsweep.aoneahsan.com/privacy"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={t('plans.choose.privacyNewTab')}
                                />
                              ),
                            }}
                          />
                        </p>
                      ) : null}
                    </div>
                  </article>
                );
              })}
          </div>
        ) : null}
        <div className="plan-request-note" role="status">
          <p className="t-sm">{t('plans.request.closed')}</p>
          <p className="t-sm ink-3">{t('plans.request.next')}</p>
          {myPlan?.is_anonymous ? <p className="t-sm">{t('plans.choose.signIn')}</p> : null}
          {pending ? (
            <p className="t-sm">
              {t('plans.request.pending', {
                plan: plans?.find((p) => p.id === pending.plan_id)?.name ?? pending.plan_id,
                date: date(pending.created_at),
              })}
            </p>
          ) : null}
          {!pending && lastRequest?.status === 'notified' && lastRequest.notified_at ? (
            <p className="t-sm">
              {t('plans.request.notified', { date: date(lastRequest.notified_at) })}
            </p>
          ) : null}
          {status ? <p className="t-sm">{status}</p> : null}
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
