# Sentencing and Driving-Restriction Audit — August 29, 2026

## Result

- The active catalog contains **67 offenses and 298 selectable sentencing outcomes**.
- Every outcome has an explicit **minimum confinement, maximum confinement, minimum fine, and maximum fine** field.
- No sentencing number changed in this review.
- DUI, fleeing/eluding, and homicide by vehicle now have separately displayed driver-license consequences.

One fine endpoint is intentionally nonnumeric: the retaliation tier of terroristic threats has a statutory $50,000 minimum fine but the offense section states no maximum. The catalog records the maximum as `null`, which means “no statutory maximum stated,” rather than inventing a number.

## DingDuff method

The DingDuff connector was used to retrieve the current full text and metadata for all 55 offense and cross-cutting sentencing sections in the August 8 archive. Every current DingDuff `version_id` matched the archived version exactly. There were no changed source versions and no retrieval failures.

DingDuff also supplied the current text of:

- O.C.G.A. § 17-10-8, confirming that when a felony statute sets no fine, the court may impose a fine up to $100,000;
- O.C.G.A. §§ 40-5-54, 40-5-57.1, 40-5-58, 40-5-63, 40-5-64, 40-5-64.1, and 40-5-67.2 for license suspensions, revocations, limited permits, ignition-interlock permits, youth-driver rules, and administrative-suspension interaction; and
- O.C.G.A. § 40-5-151 for the separate commercial-license warning.

DingDuff's rendered full-text view still omits subsection 16-11-131(b.1) and the punishment tail of 16-11-106(b), although DingDuff's search index recognizes the omitted firearm-purchase language and its Georgia-opinion search confirms the fixed five-year first-offense sentence under § 16-11-106. The two attempt-to-purchase ranges were therefore cross-checked against the current consolidated § 16-11-131 text. The pre-July 2023 gang tier was cross-checked against the 2022 code version. Those supplemental checks confirmed the catalog's existing numbers.

## Driving restrictions added

### DUI — O.C.G.A. § 40-6-391

The criminal sentence uses a ten-year history window, while Driver Services generally uses a separate five-year window:

- first within five years: 12-month suspension; early full reinstatement may be requested after 120 days, and a limited permit may be available;
- second within five years: three-year suspension; ignition-interlock limited permit eligibility may begin after 120 days, and full reinstatement is not available before 18 months; and
- third within five years: habitual-violator status and a five-year revocation, with a conditional probationary-license route after two years.

The display also warns that implied-consent, under-21, commercial-license, and death-resulting-collision rules may change the result.

### Fleeing or attempting to elude — O.C.G.A. § 40-6-395

Every conviction is a mandatory-suspension offense under § 40-5-54. The ordinary five-year sequence is 12 months, three years, then a five-year habitual-violator revocation. The under-21 rule is listed separately because it generally uses six months for a first youth suspension and 12 months for a later one.

### Homicide by vehicle — O.C.G.A. § 40-6-393

- first degree under subsection (a): three-year suspension with no early reinstatement and no limited permit;
- second degree: the general five-year sequence for listed driving convictions applies; and
- an existing habitual-violator revocation remains a separate bar. A DUI-death habitual violator cannot use the usual probationary-license route.

## Safeguards

The catalog validator now requires every Title 40, Chapter 6 offense in the catalog to include a driving-restriction summary and at least one complete restriction item. The production build remains the integration check for all four sentencing endpoints and the new driving fields.

This is a research aid, not legal advice. Confirm the current official code, the client's full driving history, the arrest dates, license class, age, and any pending administrative suspension before relying on a particular driving consequence.
