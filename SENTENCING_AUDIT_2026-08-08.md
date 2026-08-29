# Sentencing Database Audit — August 8, 2026

**Method:** Every offense in the database (all 66, now 67) was checked against the current O.C.G.A. text retrieved in full from the DingDuff primary-source statute database (no snippets, no secondary sources). Full statute texts are archived in `research/saved-statutes.zip` (56 sections, each with its DingDuff effective date). The audit covered: classification, sentence minimum/maximum, fine minimum/maximum, mandatory minimums and must-serve language, and tier structure (recidivist tiers, drug-weight tiers, value tiers). Parole-board CSL ratings were not part of this audit.

**Headline result:** No numeric errors were found in any existing sentence range, drug-weight tier, theft value band, DUI tier, or trafficking mandatory minimum/fine. The changes below add statutory tiers that were missing, resolve the database's own open "confirm with counsel" flags, and tighten recidivist detail.

---

## Changes made

### New offense added
- **Trafficking in MDMA/MDA (Ecstasy) — O.C.G.A. § 16-13-31.1.** Previously only referenced in a note under MDMA possession. Now a full weight-tiered entry: 28–<200 g → 3–30 yrs / $25,000–$250,000; 200–<400 g → 5–30 yrs / $50,000–$250,000; ≥400 g → 10–30 yrs / $100,000–$250,000, with the section's own departure routes noted.

### Missing statutory tiers added
- **Aggravated assault (§ 16-5-21):** added the (c)(1)(C) *body-only* assault on a public-safety officer tier (5–20 yrs, $2,000 fine floor, **no** mandatory minimum) — the existing officer option was relabeled so the 3-year mandatory minimum no longer appears to reach body-only cases; added the (j)(2)(B) intent-to-rape with prior sexual-felony tier (life or split sentence with lifetime probation).
- **Aggravated battery (§ 16-5-24):** added a defendant-under-17 public-safety-officer option (same 10–20 range; the 3-year mandatory minimum applies only to defendants 17+).
- **Rape (§ 16-6-1(d)(2)):** added the prior-sexual-felony tier (life, or split term + probation for life; 25-year floor via § 17-10-6.1; LWOP if the prior was itself a serious violent felony, § 17-10-7(b)(2)).
- **Child molestation (§ 16-6-4):** added the (b)(2) Romeo-and-Juliet misdemeanor for *plain* child molestation (victim 14–15, defendant ≤18 and ≤4 years older) and the (f)(2) prior-sexual-felony life/split tier; the sodomy-based Romeo-and-Juliet label now states its distinct 13–15 age window; second-offense option now notes the pretrial written-notice requirement for life and that only a prosecutor-agreed departure is available.
- **Burglary (§ 16-7-1(d)):** added fourth-or-subsequent-conviction options to both degrees — same ranges, but adjudication/sentence may not be suspended, probated, deferred, or withheld.
- **Theft by taking / receiving / deception (§ 16-8-12):** the value bands verified exactly; added a note covering the statutory overrides the value bands don't capture — third-or-subsequent theft conviction (felony 1–5 regardless of value), firearm/explosive/destructive device (1–10; 5–10 repeat), fiduciary or government/bank employee breach (1–15), and the other special categories. (Note: the current text has **no** vehicle or cargo tier — those subsections are reserved.)

### Open flags resolved (verified against current text)
- **Armed robbery, pharmacy subsection (§ 16-8-41(c)(1)):** states only a 15-year floor, no maximum — the 15-to-life presentation is correct and the "confirm with counsel" hedge was replaced with the verified explanation.
- **Terroristic threats, retaliation tier (§ 16-11-37(e)):** $50,000 minimum fine, **no** maximum fine stated — confirmed.
- **Statutory rape 21+ with prior sexual felony (§ 16-6-3(d)(2)):** no finite range restated; the 10-year floor carries over via § 17-10-6.2(b); only a prosecutor-agreed departure can go below it. Note updated.
- **Aggravated sexual battery, prior sexual felony (§ 16-6-22.2(e)(2)):** 25-year floor confirmed via § 17-10-6.1(b)(2)(E); LWOP interaction noted.
- **Repeat-misdemeanor recidivist option:** confirmed as **O.C.G.A. § 17-10-3.2** (effective July 1, 2026) — 1–10 felony, first year non-probatable. Fixed: only the first year is barred from probation (the option previously implied full probation ineligibility), and the statute is now cited.

### Other corrections
- **Battery, third offense same victim (§ 16-5-23.1(e)):** now carries the incorporated subsection (d) minimum-sentence bar (not suspendable/probatable except weekend-service or hardship findings).
- **Sexual battery, second offense:** must-serve now notes the required ≥1-year probation tail and that only a prosecutor-agreed departure is available.
- **DUI:** added the July 1, 2008 counting rules for the fourth-offense felony.
- **Simple battery label:** now includes detention officers.
- Review date advanced to August 8, 2026; catalog validation updated to 67 offenses (passes: 67 offenses, 298 outcomes).

---

## Items DingDuff could not verify (no changes made — do not treat as errors)

1. **Firearm by felon (§ 16-11-131) — attempt-to-purchase tiers and the on-supervision option.** DingDuff's snapshot (eff. 2022-07-01) omits subsection (b.1) even though its own (g) references it, so these two options (added from the consolidated code during the Aug 2 review) could not be re-verified from this source. Nothing retrieved contradicts them.
2. **Firearm during felony (§ 16-11-106) — first-offense fixed 5 years.** The snapshot truncates subsection (b) before the punishment clause. The second-offense fixed 10 was verified.
3. **Gang act pre-July 2023 tier** — only the current (2023) version was retrievable; the pre-2023 option shows the same 5–20 numbers and nothing contradicts it.

Everything else in the database was affirmatively verified against retrieved text, including the 2026 session-law provisions (HB 535 fentanyl tiers at § 16-13-31(b.1) with the 40-year cap at (h)(2); HB 483/1075 victim categories; § 17-10-3.2; and the 2026 DPS-pursuit provision in § 40-6-395(d)).

*Prepared with DingDuff primary-source retrieval. This is a research aid, not legal advice; verify against the current official code before relying on any entry in a filed case.*
