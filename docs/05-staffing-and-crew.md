# 5. Staffing & Crew

## 5.1 Org structure

Year 1 runs lean and deliberately overlapping. Both owners work in the field early on;
that is normal and necessary, and the plan is to engineer yourself out of it.

```
                    ┌───────────────────────┐
                    │   Managing Members    │
                    │  Operator A + B (2)   │
                    └───────────┬───────────┘
                ┌───────────────┴───────────────┐
                ▼                               ▼
    ┌───────────────────────┐     ┌─────────────────────────┐
    │  Operator A           │     │  Operator B             │
    │  Production & Field   │     │  Sales, Estimating,     │
    │                       │     │  Admin & Finance        │
    └───────────┬───────────┘     └────────────┬────────────┘
                │                              │
     ┌──────────┴──────────┐                   ▼
     ▼                     ▼        ┌────────────────────────┐
┌─────────────┐    ┌──────────────┐ │ Office Coordinator     │
│ Lead Carp.  │    │ Lead Carp.   │ │ (PT → FT by month 6)   │
│  + Helper   │    │  + Helper    │ │ Intake, scheduling,    │
│  (Crew 1)   │    │  (Crew 2)    │ │ AR/AP, permits         │
└─────────────┘    └──────────────┘ └────────────────────────┘
                │
                ▼
     ┌────────────────────────────────────────┐
     │  Subcontractors (as needed)            │
     │  Electrical · Plumbing · HVAC · Roof   │
     │  Drywall · Paint · Flooring · Concrete │
     └────────────────────────────────────────┘
```

**Both crews carry the on-call rotation.** There is no separate emergency team in Year 1 —
that's what makes the economics work, because emergency response alone cannot keep a
dedicated crew busy, and a dedicated crew sitting idle is a 40-point margin drag.

## 5.2 Roles & compensation

> Wage figures are national midpoints. **Calibrate to your market** before making offers —
> carpenter wages vary by more than 2x across US metros.

| Role | Count (Yr 1) | Base pay | Notes |
|---|---|---|---|
| **Managing Member — Production** | 1 | $60,000 salary | Field leadership, QC, on-call escalation |
| **Managing Member — Sales/Admin** | 1 | $60,000 salary | Estimating, sales, adjuster relationships, finance |
| **Lead Carpenter** | 2 (1 at start, 2 by mo. 4) | $30 – $38/hr | Runs a crew, reads plans, owns quality & the daily log |
| **Carpenter / Helper** | 2 (1 at start, 2 by mo. 6) | $19 – $26/hr | Production support, demo, material handling |
| **Office Coordinator** | 1 (PT mo. 1 → FT mo. 6) | $21 – $26/hr | Intake, scheduling, AR/AP, permits, review requests |

**Owner salary is a real expense, not a leftover.** It is in the P&L
([§6.3](06-financial-model.md#63-operating-overhead)) because if you don't price your own
labor into your bids, every job looks profitable and the company slowly starves. Pay
yourselves a below-market-but-real salary in Year 1, raise it in Year 2 when margins
support it.

### Variable compensation

Base pay alone doesn't produce the behavior this business needs. Layer on:

| Incentive | Amount | Who | Drives |
|---|---|---|---|
| **On-call stipend** | $200/week | Tech on rotation | Willingness to be tethered 168 hrs |
| **Emergency callout premium** | 1.5x base, 2-hr minimum | Responding tech | Getting out of bed and going |
| **Rebuild conversion bonus** | $250 per emergency call that becomes a signed contract ≥$5,000 | Responding tech | **The core business thesis** |
| **Job margin bonus** | 10% of gross margin *above* the estimated margin | Crew lead | Efficiency, waste control, honest estimating |
| **Safety bonus** | $500/quarter | Every field employee | Zero recordable incidents, zero shortcuts |
| **Review bonus** | $25 per 5-star review naming the tech | Field employees | Reputation = call volume = everything |

**The conversion bonus is the most important line in this table.** Emergency response is
a customer acquisition channel, which means the technician standing in a flooded kitchen
at 2am is your top-of-funnel salesperson whether you compensate them for it or not. $250
against a $19,000 contract at 40% margin is a 1.3% customer acquisition cost. Pay it
happily and pay it fast — same-week, visibly, so the behavior gets reinforced while the
memory is fresh.

**The margin bonus needs one guardrail:** it must be paid on *quality-passed* work only,
released after the punch list closes. Otherwise you're paying people to rush, and you'll
buy the margin back in callbacks.

## 5.3 The labor burden math

**This is the number most contractors get wrong, and getting it wrong means every bid you
write is too low.** Your true cost of an employee is far above their hourly wage.

| Component | Typical | Notes |
|---|---|---|
| Base wage | $34.00 | Lead carpenter |
| FICA (Social Security + Medicare) | 7.65% | $2.60 |
| Federal unemployment (FUTA) | ~0.6% | $0.20 |
| State unemployment (SUTA) | 1 – 5% | $1.02 (at 3%) |
| **Workers' comp — carpentry class codes** | **6 – 20%** | **$4.08 (at 12%)** ⚠ |
| General liability allocation | ~1.5% | $0.51 |
| Paid time off / holidays | ~4% | $1.36 |
| Training, certifications, PPE | ~2% | $0.68 |
| **Burdened hourly cost** | | **$44.45** |
| | | **Burden multiplier: 1.31x** |

**Then apply utilization.** Nobody bills 100% of paid hours. Drive time between jobs,
shop time, material runs, weather delays, and training are all paid and non-billable.

```
  Burdened cost              $44.45 / paid hour
  Utilization                     70%
  ───────────────────────────────────────────────
  TRUE COST PER BILLABLE HR  $63.50

  Bill rate                  $115.00 / hr
  Gross margin on labor          44.8%   ✓
```

**Three things fall out of this that should change how you operate:**

1. **Workers' comp is the swing factor.** Carpentry class codes are among the most
   expensive in construction. Get your actual rate from your broker in week one — the
   difference between 8% and 18% is roughly $3.40/hr, which across two crews is about
   **$28,000 a year.** It also decides whether your bid prices are right.
2. **Utilization is worth more than wage negotiation.** Moving utilization from 65% to
   75% cuts your cost per billable hour by $9.15 — more than you'd save haggling $3/hr
   off a wage, and without losing a good carpenter. Route jobs geographically, stage
   materials the night before, and stop sending leads on material runs.
3. **Never bid off base wage.** Bidding at $34/hr when the true billable cost is $63.50
   means you are losing money on labor before you buy a single board. This is the most
   common fatal error in small contracting.

## 5.4 Hiring

**Hire for reliability first, skill second.** You can teach a reliable person to hang a
door. You cannot teach an unreliable person to answer the phone at 2am.

**What actually predicts success here:**
- Shows up on time to the interview (a real signal, not a cliché)
- Clean driving record — they will drive a company vehicle
- Can explain a job they're proud of, in detail
- Can explain a mistake they made and what they changed after
- Is *willing* to be on call and understands what it means
- Presents well to a homeowner — this is a trust business in people's houses
- Passes a background check (**non-negotiable** — you are sending them into homes,
  often at night, often to people who are frightened)

**Interview process:** phone screen → in-person → **paid working interview, one full day
on a real job.** The working day tells you more than every question you could ask. Pay
them for it regardless of outcome.

**Where to find them:** referrals from your own crew (pay a $500 referral bonus after 90
days), lumberyard and supply-house counters, local trade schools and apprenticeship
programs, and — bluntly — the good carpenter at a competitor who is tired of not being
paid on time.

**Retention is cheaper than recruiting.** Turnover in a crew is enormously expensive: lost
productivity, retraining, quality problems, and unfamiliar faces in customers' homes. Pay
on time every single week, provide good tools, don't make people supply their own
consumables, give real schedule predictability where possible, and never make someone
absorb the cost of a mistake that was actually an estimating error.

## 5.5 Onboarding — first week

| Day | Content |
|---|---|
| **1** | Paperwork (W-4, I-9, direct deposit), handbook, safety orientation, PPE issued, vehicle policy, phone/app setup |
| **2** | Shadow a crew lead. Company standards: cleanliness, customer interaction, photo documentation |
| **3** | Emergency protocol: intake, dispatch, safety screens, the documentation standard, the vehicle load list |
| **4–5** | Working with the crew under supervision. Daily log training. First solo tasks. |
| **30-day** | Formal check-in: what's working, what's confusing, pay review if warranted |

**Non-negotiables covered on day one:** no work without PPE; fall protection above 6 feet;
no impaired work, ever; every job gets photographed; the daily log gets filled out; and
the customer's house gets left cleaner than you found it.

## 5.6 Subcontractor management

Subs will deliver 20–30% of your project revenue. Manage them like it.

**Before a sub sets foot on a jobsite — all four, no exceptions:**
1. ☐ Signed subcontractor agreement on file → [forms/subcontractor-agreement.md](../forms/subcontractor-agreement.md)
2. ☐ **Current Certificate of Insurance** naming `[COMPANY] LLC` as additional insured
3. ☐ **Proof of their workers' compensation coverage** (or valid state exemption)
4. ☐ Verified trade license (verify it on the state board site — don't accept a photo)

> **Why #3 will cost you real money if you skip it.** At your annual workers' comp audit,
> the carrier reviews every dollar you paid to subcontractors. **For any sub without proof
> of their own comp coverage, they charge you premium as if that person were your
> employee.** A year of paying a $60K uninsured sub can generate a five-figure audit bill
> that arrives with no warning and no negotiation. A COI folder is the cheapest insurance
> in this business. → [forms/sub-insurance-checklist.md](../forms/sub-insurance-checklist.md)

**Set COI expiration reminders.** A COI that was valid in March is worthless in October,
and the audit looks at the whole year.

**Operating rules:**
- Written scope and written price before work starts. Verbal sub quotes create disputes
  you will lose.
- Pay subs on your terms (net 15–30), not on the customer's payment timing — but never
  pay ahead of work completed.
- **Collect a lien waiver with every sub payment.** An unpaid sub can lien your customer's
  house even if you already paid the general amount, and you will end up paying twice.
- Hold 10% retainage on subs over $5,000 until final sign-off.
- Subs represent your company to the homeowner. Same standards: clean, professional,
  no smoking, no music without asking, site cleaned daily. Hold them to it or replace them.

**Build a bench of two per trade.** One-deep is a schedule failure waiting to happen, and
the sub who knows they're your only option prices accordingly.
