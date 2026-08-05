# HiBid Tracking Inquiry — Email + Decision Tree

← [Forms index](README.md) · [Account Brief §6.4](../06-budget-barn-account-brief.md#-the-tracking-problem-most-important--read-this-one-twice)

**Send this before the Budget Barn meeting if there's time, or the same day you're
hired.** The answer determines the scoreboard metric, and you do not want to be
discovering it in week three.

**Who sends it matters.** HiBid support answers *sellers*, not strangers. If Marvo
hasn't been hired yet, ask Andrew to forward it from his own account, or ask for the
five minutes of screen-share described in [§4](#4-if-hibid-goes-quiet) instead.

---

## 1. The email

**To:** HiBid support / Budget Barn's HiBid account rep
**Subject:** Seller question — third-party conversion tracking on our auction pages

---

Hi,

I'm working with **Budget Barn** (Gallatin, TN — seller ID 149798,
`budgetbarn.hibid.com`) on paid advertising to drive new bidder registrations to their
auctions.

Before we spend anything, I need to understand what we can and can't measure. Five
questions:

1. **Can a seller add their own tracking pixel** (specifically a Meta/Facebook pixel,
   or Google Analytics) to their auction pages and lot listings? If so, where in the
   seller dashboard is that configured?

2. **If a full pixel isn't supported, is there any server-side or Conversions API
   option** for passing registration or bid events back to an advertiser?

3. **Are UTM parameters preserved** through the registration flow? In other words, if
   we send traffic to a lot page with `?utm_source=facebook`, does that attribution
   survive to the point where a bidder creates an account?

4. **Does the seller dashboard report new bidder registrations per auction** — with
   dates — and can that be exported? We may need to compare registration counts week
   over week against advertising activity.

5. **Is there any seller-facing referral or tracking link feature** we should be using
   instead of the above?

Happy to jump on a call if that's easier than writing it out.

Thanks,
**Marvo**
`[phone]` · `[email]`

---

## 2. Why each question is there

| Q | What a "yes" unlocks |
|---|---|
| 1 | Full conversion optimization. Meta can bid toward actual registrations — by far the best outcome. |
| 2 | Same as above but more durable; survives browser tracking restrictions. |
| 3 | No pixel, but you can still prove which channel produced a bidder. Good enough. |
| 4 | The manual fallback. Crude, but it's real data Andrew already has. |
| 5 | Sometimes platforms have a purpose-built answer nobody advertises. Always worth asking. |

---

## 3. What to do with each answer

### ✅ Yes to Q1 or Q2 — pixel or CAPI supported

**Best case.** Install it, set the conversion event to **bidder registration**, and
optimize campaigns toward it directly.

- Scoreboard primary metric: **new registered bidders**, with a cost-per-registration
  target
- Note the caveat anyway: registration is not a purchase. Someone can register and
  never bid.

### ⚠️ No to 1 and 2, yes to Q3 — UTMs survive

**Workable.** Optimize Meta toward **landing page views on the auction**, and use UTM
data plus HiBid's reporting to confirm attribution after the fact.

- Scoreboard primary metric: **clicks through to the live auction**
- Secondary, reported but not the verdict: registrations Andrew can attribute
- Say plainly in the scoreboard that Meta's system is optimizing for the click, not
  the registration, and that this makes results somewhat less efficient than they'd
  otherwise be

### ⚠️ Yes only to Q4 — seller reporting exists, no tracking

**Manual attribution.** Establish a baseline before launch, then compare.

- Get Andrew's **new-bidder counts for the last 4–6 auctions before launch.** This
  baseline is essential and it's free — do it on day 0 regardless of what HiBid says.
- Compare weekly new-bidder counts during the campaign against that baseline
- Scoreboard primary metric: **lift in new bidders per auction vs. the pre-campaign
  baseline**
- Be honest that this is correlation, not attribution. Seasonality and inventory mix
  move these numbers too.

### ❌ No to everything

**Pivot to an owned list — and honestly, do this one regardless.**

Run **Meta lead ads or click-to-Messenger** offering *"get a text the moment the next
auction goes live."* This is fully trackable inside Meta, fully optimizable, and it
builds an asset Budget Barn owns forever and can market to for free.

- Scoreboard primary metric: **auction-alert sign-ups**, with a cost-per-signup target
- Secondary: clicks to the auction, plus the manual baseline comparison from above
- **This is arguably the best play even if the pixel works.** A tracked registration is
  useful once. An owned SMS/email list of people who asked to hear about auctions pays
  Budget Barn every single week, forever, at zero marginal cost.

---

## 4. If HiBid goes quiet

Don't let this block the launch. Two fallbacks, both free:

1. **Ask Andrew for 5 minutes in his HiBid seller dashboard.** Look for a settings or
   integrations section yourself. Faster than support, and you'll learn the reporting
   at the same time.
2. **Test it directly.** Load a Budget Barn lot page with a UTM string appended and
   check whether the parameter survives navigation and registration. Ten minutes,
   answers Q3 on its own.

**Either way, get the pre-launch baseline of new bidders per auction from Andrew on
day 0.** That single number makes the final report defensible no matter what tracking
turns out to be available — and if you skip it, you can never go back and get it.

---

## 5. What to tell Andrew

Whatever the answer, say it plainly and early. From the
[proposal](budget-barn-proposal.md):

> "Your bidding happens on HiBid, and you don't own HiBid — so I may not be able to
> track someone all the way from an ad to a finished registration. I'm checking what's
> possible. We may end up measuring clicks to your live auction plus sign-ups to an
> auction-alert list you own. I'd rather tell you now than in week four."

Raising this before he's paid you anything is worth more than the tracking itself.
It's the clearest possible signal that you're measuring honestly rather than picking
whichever number flatters you at the end of the month.
