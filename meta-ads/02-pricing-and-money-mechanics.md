# 2. Pricing & Money Mechanics

← [The Pitch](01-the-pitch.md) · [Index](README.md) · Next: [Trust & Risk Reversal](03-trust-and-risk-reversal.md)

---

This is the document that answers the actual question: **how do you pay for the ad,
add your revenue on top, and say the price out loud without the room getting weird.**

---

## 2.1 The three ways to charge, and why two of them are traps

### Model A — Transparent split (client sees both numbers)

> "Ad spend is $750, my management fee is $700."

**Why it feels safe:** it's honest and simple, and it feels like it should build trust.

**Why it's a trap:** it puts your fee on trial as a separate line item, next to a line
item the client understands much better. Every dollar of your fee now visibly reads as
"a dollar that didn't go to ads." Owners start doing the wrong math — *"so only half my
money is actually advertising?"* — and you spend the meeting defending your existence
instead of selling the outcome. Worse, it makes your fee the negotiation surface: the
ad spend is a hard cost they can't argue with, so 100% of their price pressure lands
on you.

### Model B — Percentage of ad spend (the "industry standard," 15–20%)

> "I take 18% of whatever you spend."

**Why it's a trap at this size:** the math simply doesn't work. $750 × 18% = **$135**
for a month of real work. You'd need to manage twenty Budget Barns to make a living,
which you cannot do at that fee level because you'd have no time to actually manage
them.

It also builds in an incentive you'd have to spend the whole relationship denying:
**you get paid more when they spend more,** regardless of whether spending more is
right for them. Any sharp client notices this eventually, and the day they notice is
the day the trust goes.

Percentage-of-spend is a model for agencies running $50k+/month budgets. It is the
wrong tool for a local business testing $750.

### Model C — Flat all-in package price ← **use this**

> "Thirty days, everything included, $1,450."

The ad spend is not a line item. It is **a cost of goods inside your product**, the
same way a restaurant's menu price contains the cost of the beef without printing it
on the menu, and the same way a contractor quotes "$8,000 for the deck" rather than
itemizing lumber, fasteners, and hours.

This is not hiding anything. It's choosing the right unit of sale. And when a client
asks directly what's inside it — some will — **you tell them plainly** (see
[§2.5](#25-the-honest-answer-script)). You are not concealing the split; you are simply
not making it the thing they're buying.

**Why it wins:**

| | Split / % of spend | Flat all-in |
|---|---|---|
| Number of decisions for the buyer | 2+ | 1 |
| Number of invoices | 2 | 1 |
| Where price pressure lands | Entirely on your fee | On the package as a whole |
| "We need more budget" call in week 3 | Inevitable | Impossible |
| Surprise Meta charges on their card | Yes, many, odd amounts | None |
| What they're buying | Your hours | An outcome-attempt |
| Your margin when platform costs drop | Unchanged | Improves |
| Room to raise price on results | Almost none | Substantial |

That last row is the long game. Under a flat package, once you can say *"last month
this brought Budget Barn thirty-one calls,"* the price is anchored to the value of
thirty-one calls — not to what Meta charges. Under a percentage model, you're forever
anchored to the platform's pricing and you can never escape it.

---

## 2.2 The tiers

Present three. Recommend the middle. Expect the middle. The cheap tier exists to make
the middle feel reasonable and to catch the genuinely price-sensitive; the top tier
exists to make the middle feel modest.

| | **Test Drive** | **The 30-Day Proof** ⭐ | **Full Push** |
|---|---|---|---|
| **Client pays (all in)** | **$895** | **$1,450** | **$2,400** |
| Meta ad spend inside it | $420 | $750 | $1,350 |
| Roughly per day | ~$14/day | ~$25/day | ~$45/day |
| **Marco gross** | **$475** | **$700** | **$1,050** |
| **Gross margin** | 53% | 48% | 44% |
| Ad variations built | 2 | 4 | 6 |
| Audiences tested | 1 | 3 | 4–5 |
| Reporting | Day 14 + final | Weekly + day-14 sit-down | Weekly + mid-week check |
| Signal quality | Rough — directional only | Clean read | Strong, plus early scaling |

**What to say when presenting three tiers** — name the tradeoff honestly, don't just
list them:

> "Three versions. The difference isn't how hard I work, it's how much data comes
> back. The small one gives you a rough sense — it's a real test, but at fourteen
> dollars a day it takes longer to see a pattern and you're squinting at it. The
> middle one is the one I actually recommend, because at twenty-five a day over thirty
> days you get a clean enough read to make a real decision. The big one is for if you
> already believe it'll work and you want to find out fast and start scaling inside
> the same month."

**Never lead with the cheap one.** Lead with the middle, mention the others as
context.

### Renewal pricing — month 2 and beyond

| | Month 1 | Month 2+ |
|---|---|---|
| Client pays | $1,450 | **$1,450** (unchanged) |
| Meta ad spend inside | $750 | **$850** (increased) |
| Marco gross | $700 | $600 |
| **Marco's hours** | **~11** | **~4** |
| **Effective rate** | **$64/hr** | **$150/hr** |

**Hold the price and increase their ad spend.** Do not discount month two, and do not
raise it either.

This is the most important number in the whole business. Your gross drops $100 but
your time drops by nearly two-thirds, because the build — account setup, creative,
audience research, pixel, the learning phase — is a month-one cost you never pay
again. **Month one barely pays. Month two is where you actually earn.**

Giving them $100 more media at the same price also gives you something real to say at
renewal: *"Same price, and I'm putting more behind it now that we know what works."*
That's a better renewal pitch than a discount and it costs you less.

---

## 2.3 The mechanics — how the money actually moves

This is the operational answer to "how do I pay for the ad and add my revenue on top."

### The recommended structure

```
Budget Barn  ──$1,450 (one invoice, paid in full before launch)──▶  Marco
                                                                      │
                                                    ┌─────────────────┴──────────────┐
                                                    │                                │
                                          $750 to Meta                    $700 stays with Marco
                                    (Marco's card, on Budget Barn's         (gross profit)
                                     ad account, as Partner)
```

**Step by step:**

1. **Budget Barn creates their own Meta Business Manager** (`business.facebook.com`).
   Free. Takes about ten minutes. **They own it.** They create the ad account inside
   it. Their page, their pixel, their audiences, their data.

2. **They add Marco as a Partner with admin access** on the ad account. Marco never
   receives a password, never logs in as them, never has personal-account credentials.
   Access is granted and revoked cleanly from their side.

3. **Marco's payment method goes on the ad account.** This is the actual mechanism of
   the whole business model: Marco's card funds the media, so all Meta billing hits
   Marco and never touches Budget Barn. The client never sees a Meta charge, never
   gets a surprise, and never has a reason to reconcile your spend against your price
   unless they ask.

4. **Budget Barn pays Marco $1,450 in full before the first ad goes live.** Invoice,
   card, ACH, check that's cleared — whatever, but cleared and in the account.

5. **Marco runs the media, keeps the spread.**

### Why Marco's card and not theirs

| | Marco's card | Client's card |
|---|---|---|
| Client sees Meta charges | No | Yes — many, small, irregular |
| Bundled pricing possible | Yes | No — split is exposed |
| Payment-hold risk lands on | Marco (who can fix it) | Client (who can't) |
| Cash float carried by | Marco | Client |
| Reconciliation friction | None | Constant |

If the float is genuinely a problem — you don't have the credit line, or you're
uncomfortable carrying it — **use the split model and price the fee at $950**. It's a
worse business but it's an honest one, and see [Objection 6](01-the-pitch.md#objection-6--can-i-just-pay-you-the-fee-and-run-the-ad-spend-myself)
for how to present it without it sounding like a downgrade.

### The float, and the hard rule about it

At one client this is a rounding error. At six clients you are carrying **$4,500+/month
of media on a personal or business card.** That is a real working-capital position and
it is how solo operators in this business quietly go broke.

**The rule that prevents it: 100% of the package price collected and cleared before a
single ad runs. Every client. Every month. No exceptions.**

Get this right and the float is never actually yours — you're spending money you
already collected, and the card is just a payment rail. Get it wrong once, for one
nice guy who's good for it, and you're a lender with no collateral.

**Practical requirements:**

- A card with a limit of at least **3× your monthly media across all clients** —
  headroom matters because Meta's billing is lumpy.
- Ideally a business card with **cash-back or points**. At $4,500/month of media,
  2% back is **$1,080/year of pure margin** for doing nothing. This is a real line
  item, not a gimmick.
- **Pay it off monthly, in full.** If you are carrying a revolving balance on client
  ad spend, the business is already broken — you've collected the money, so there's
  nothing to finance.

### Meta billing quirks to know before they bite you

- **New ad accounts bill on a low threshold that ramps up.** A new account may charge
  you every $25, then $50, then higher as it establishes history. Expect many small
  charges, not one clean monthly bill. Your card's fraud detection may flag this — call
  the issuer *before* launch, not after the ads stop.
- **Payment failures stop ads dead.** A declined charge pauses delivery, and if it
  happens on day 3 it corrupts the learning phase you're paying for. Keep a backup
  payment method on the account.
- **Ad accounts get restricted, sometimes for nothing.** Have a second Business
  Manager and a backup account ready. Budget the possibility of a 24–72 hour outage
  into your day-14 timeline rather than promising a date you can't control.
- **Verify current thresholds and minimums directly in Ads Manager before quoting** —
  Meta changes these and regional rules differ. Don't quote from memory.

---

## 2.4 How to say the number

### Say it exactly like this

> "Thirty days, everything included, **is fourteen fifty.** That's the ad money too —
> there's no second bill from Facebook, and there's no phone call in week three asking
> for more budget. One number, one time, handled."

Then **stop.**

### The specific moves inside that

1. **"Everything included" comes before the number, not after.** By the time they hear
   $1,450 they already know it's all-in. If you say the number first, they price it as
   a fee and then have to revise upward mentally — and mental revision upward feels
   like a bait and switch even when it isn't.

2. **Say the digits, not the dollars.** "Fourteen fifty" lands smaller than "one
   thousand four hundred and fifty dollars." Both are honest. One sounds like a
   number and the other sounds like a *sum.*

3. **Pre-empt the two anxieties in the same breath.** "No second bill" and "no more-
   budget call" are the two things a small business owner actually fears about
   advertising, more than the price itself. Killing both before they're raised is what
   makes the price land soft.

4. **Then be quiet.** The silence after a price is where the sale happens. Filling it
   is the single most common way this pitch gets lost, and every word you add is a
   discount you offered for free.

### If you need to shrink the number further

- **Per day:** "It's about forty-eight dollars a day, all in."
- **Against a known cost:** "What's a month of the [local paper / radio spot / mailer]
  run you — and can you tell me afterward exactly who saw it?"
- **Against the ticket:** *(only if their average ticket is decent)* "If this brings
  you [N] customers over the month, it paid for itself. Everything past that is the
  actual point."

That last one is powerful but **has a hard rule attached: state it as arithmetic, not
as a forecast.** "If it brings N, it paid for itself" is a fact about division. "It'll
bring you N" is a promise you cannot keep. Never let the sentence drift from the first
into the second.

---

## 2.5 The honest answer script

**When they ask "how much of that actually goes to Facebook?" — tell them. Every time.
Immediately. Without flinching.**

> "About half. Roughly seven-fifty goes on the platform as actual ad money, and the
> rest is me — building it, writing it, running it daily for a month, reporting on it.
>
> And you don't have to take my word for it. **I'll send you the Meta billing receipts
> with every weekly report,** straight from the platform. To the dollar. If I'm ever
> off from what I told you, you'll spot it before I do."

**Why volunteering the receipts is the strongest move available to you:**

- It costs you literally nothing — the receipts live in an ad account they already own
  and could check whenever they want.
- It converts your worst moment in the meeting into your best one. The question is a
  trust test disguised as a math question, and receipts are the only answer that
  actually passes it.
- It makes the 48% margin unarguable, because you volunteered it. A margin you disclose
  is a business. A margin they discover is a betrayal — **same number, completely
  different relationship.**
- It permanently ends the topic. Nobody re-litigates a number you handed them.

**What kills you here:** "that's kind of proprietary," "it varies," "let me get back to
you," or any answer that takes more than one sentence to start. Vagueness on this
question is read — correctly — as concealment, and once they think you're hiding the
split, everything else you said in the meeting gets re-examined.

**On whether 48% is defensible:** it is. You're carrying the media cost, the float,
the platform risk, and the labor, and the client's alternative is spending $750 badly
with no idea what the numbers mean. Contractors mark up materials. Restaurants mark up
food 300%. Retailers — including Budget Barn — mark up inventory. **Budget Barn's
owner marks things up for a living. They are not shocked that you do too.** They only
care whether you were straight about it.

---

## 2.6 Payment terms

| Item | Term |
|---|---|
| **Deposit** | 100% before launch. Not 50%. Not "half now half after." |
| Accepted | Card, ACH, cleared check. Card preferred — it funds the float directly. |
| Card surcharge | Absorb it. ~3% of $1,450 is $43. Not worth the friction of a line item. |
| Refund window | Unspent media only, at the day-14 checkpoint. Fee is non-refundable. |
| Auto-renewal | **None.** No contract, no auto-charge. Renewal is a fresh conversation. |
| Month 2 timing | Invoice on day 26, so there's no gap in delivery. |

**Why 100% upfront isn't aggressive here:** you are buying media on their behalf on day
one. A 50% deposit means you're personally financing the back half of a stranger's
advertising. Say it plainly if it comes up:

> "It's paid upfront because I'm putting the ad money on my card the day we start —
> I'm not comfortable being your bank and you shouldn't want me to be. It's also why
> there's no contract: you're not committing to anything past thirty days, and I'm not
> chasing you for anything past thirty days."

**Why the fee stays non-refundable at day 14:** by day 14 the build is done — account,
creative, audiences, pixel, two weeks of daily management. That work exists and they
keep it. What's refundable is the money that hasn't been spent yet, which is the only
part where they're genuinely still exposed. Say it that way and nobody argues.
