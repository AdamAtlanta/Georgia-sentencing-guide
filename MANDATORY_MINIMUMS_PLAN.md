# Plan: Adding Mandatory Minimum (Must-Serve) Information

**Date:** January 24, 2026
**Issue:** The website doesn't clearly indicate when a defendant MUST serve time in custody vs. when they can get probation

---

## The Problem (In Plain English)

Right now, the website shows sentencing ranges like "1 to 10 years" but doesn't tell lawyers/judges:
- **Can this be probated?** (defendant doesn't go to jail)
- **How much MUST be served?** (minimum time actually in custody)

**Example from your notes:**
- Felony fleeing/eluding shows "1 to 10 years"
- BUT: Georgia law requires **minimum 1 year to serve** (cannot be probated)
- Users need to know this critical detail!

**Legal Analogy:** It's like citing a case without mentioning it was overruled - technically you gave them the rule, but you left out crucial information that changes how it applies.

---

## The Solution

Add a new piece of information to each crime that tracks **"must-serve time"** - the portion of the sentence that CANNOT be suspended, probated, or deferred.

### What We'll Add

For each crime, we'll track:
1. **Sentence range** (already have this) - e.g., "1 to 10 years"
2. **Must-serve minimum** (NEW) - e.g., "1 year mandatory"
3. **Whether it can be probated** (NEW) - Yes/No

### How It Will Display

**Current display:**
```
Sentence: 1 to 10 years
Fine: $5,000 - $10,000
```

**New display:**
```
Sentence: 1 to 10 years
Must Serve: 1 year minimum (cannot be suspended or probated)
Fine: $5,000 - $10,000
```

---

## What Needs to Change

### 1. Database Structure (The Crime List)

**Where:** `src/data/crimes.json` file

**What to add:** A new field called `must_serve` for each crime

**Example - Fleeing/Eluding (Felony):**

**Before:**
```json
{
  "sentence": "1 to 10 years",
  "fine": "5000 - 10000"
}
```

**After:**
```json
{
  "sentence": "1 to 10 years",
  "fine": "5000 - 10000",
  "must_serve": "1 year",
  "probation_eligible": false
}
```

### 2. Display Component (How It Shows on Screen)

**Where:** `src/components/SentencingCard.js` file

**What to add:** Code to show the "Must Serve" information prominently

**Visual change:** Add a warning-style box below the sentence that says:
> ⚠️ **Mandatory Minimum:** 1 year must be served (cannot be suspended, probated, or deferred)

### 3. Research Needed (The Big Task)

We need to research ALL 29 crimes and find:
- Which have mandatory minimums that must be served
- Exact time that must be served
- Whether probation/suspension is prohibited

**Example crimes that likely need this:**
- ✅ Felony fleeing/eluding - 1 year must serve (you already identified)
- Trafficking crimes - usually have mandatory minimums
- Armed robbery - has mandatory minimum
- DUI offenses - some have minimum jail time
- Sex crimes - often have mandatory minimums
- Aggravated assault on police - likely has mandatory minimum

---

## Implementation Steps

### Phase 1: Research (Most Time-Consuming)

**What:** Look up each crime's mandatory minimum requirements

**How:**
1. For each crime in the database, search Georgia law for:
   - "O.C.G.A. § [statute number] mandatory minimum"
   - Check if statute says "shall not be suspended" or "shall not be probated"
   - Note the exact time that must be served

2. Create a spreadsheet/document with findings:
   - Crime name
   - Statute
   - Must-serve time (if any)
   - Can be probated? (Yes/No)
   - Source/notes

**Time estimate:** 2-3 hours for all 29 crimes

**I can help with this:** I can search Georgia law for each crime and compile the information

### Phase 2: Update Database (Technical but Straightforward)

**What:** Add `must_serve` and `probation_eligible` fields to crimes.json

**How:** For each crime that has mandatory minimums:
1. Open crimes.json file
2. Find the crime entry
3. Add the new fields
4. Save and validate

**Example update for Fleeing/Eluding:**
```json
"options": [
  {
    "label": "Fleeing with 20+ mph over speed limit",
    "sentence": "1 to 10 years",
    "fine": "5000 - 10000",
    "must_serve": "1 year",
    "probation_eligible": false,
    "severity_level": "Felony"
  }
]
```

**Time estimate:** 30-45 minutes

### Phase 3: Update Display Code (Technical)

**What:** Modify SentencingCard.js to show must-serve information

**How:** Add code that:
1. Checks if crime has `must_serve` field
2. If yes, displays prominent warning box
3. Shows exact time that must be served
4. Indicates "cannot be suspended/probated" if applicable

**Visual design:** Match current style with gold accent (#C5A067) and alert icon

**Time estimate:** 20-30 minutes

### Phase 4: Testing

**What:** Verify all changes work correctly

**How:**
1. Test locally at localhost:3000
2. Search for crimes with mandatory minimums
3. Verify must-serve info displays correctly
4. Check that crimes without mandatory minimums look normal
5. Deploy to Vercel

**Time estimate:** 15-20 minutes

---

## Proposed Data Structure

### New Fields to Add

**Field 1: `must_serve`**
- **Type:** Text (string)
- **Purpose:** Exact time that must be served in custody
- **Examples:**
  - `"1 year"`
  - `"25 years"`
  - `"90 days"`
  - `"10 years (no parole for first 5 years)"`
- **When to use:** Only add if there's a mandatory minimum that cannot be avoided

**Field 2: `probation_eligible`**
- **Type:** Yes/No (boolean)
- **Purpose:** Can any of the sentence be probated?
- **Values:**
  - `true` = Can be probated (normal sentencing)
  - `false` = Cannot be suspended/probated/deferred
- **When to use:** Set to `false` only if statute explicitly prohibits probation

**Field 3: `parole_notes`** (optional)
- **Type:** Text (string)
- **Purpose:** Special parole restrictions
- **Examples:**
  - `"No parole for first 10 years"`
  - `"Must serve 85% of sentence"`
- **When to use:** When there are special parole rules beyond just the mandatory minimum

---

## Priority Order for Research

### High Priority (Common/Serious Crimes)
1. Trafficking crimes (fentanyl, cocaine, meth, heroin, marijuana)
2. Felony fleeing/eluding
3. Armed robbery
4. Sex crimes (statutory rape, child molestation, aggravated sexual battery)
5. DUI offenses
6. Aggravated assault on police

### Medium Priority
7. Burglary
8. Felony theft
9. Gang activity
10. Terroristic threats
11. Obstruction with violence

### Lower Priority (Likely No Mandatory Minimums)
12. Misdemeanor possession
13. Misdemeanor theft
14. Forgery (most degrees)
15. Basic obstruction

---

## Sample Display Mock-Up

```
┌─────────────────────────────────────────────────────────┐
│ FLEEING OR ATTEMPTING TO ELUDE A POLICE OFFICER        │
│ O.C.G.A. § 40-6-395                            [Felony] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ [Dropdown: Fleeing with 20+ mph over speed limit]      │
│                                                         │
│ ┌───────────────────────┬───────────────────────────┐  │
│ │   CONFINEMENT         │   FINANCIAL PENALTY       │  │
│ │   1 to 10 years       │   $5,000 - $10,000       │  │
│ └───────────────────────┴───────────────────────────┘  │
│                                                         │
│ ⚠️  MANDATORY MINIMUM                                  │
│ ┌─────────────────────────────────────────────────┐   │
│ │ 1 year must be served in custody                │   │
│ │ Cannot be suspended, probated, or deferred      │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ Requirements: Mandatory sentence - no reduction to     │
│ lesser offense allowed                                 │
└─────────────────────────────────────────────────────────┘
```

---

## Questions to Resolve

### Question 1: Split Sentences
**Issue:** Some crimes allow "split sentences" (e.g., 25 years imprisonment + probation for life)

**Example:** Aggravated sexual battery allows this

**How to handle?**
- Option A: Note in `must_serve` field: "25 years (split sentence possible)"
- Option B: Add separate `split_sentence_eligible` field
- **Recommended:** Option A (simpler, clearer)

### Question 2: Parole Restrictions
**Issue:** Some crimes have parole restrictions separate from mandatory minimums

**Example:** "No parole for first 10 years" even though sentence is "25 to life"

**How to handle?**
- Add to `must_serve` field: "25 years (no parole for first 10 years)"
- OR add separate `parole_notes` field
- **Recommended:** Include in `must_serve` for now, add `parole_notes` later if needed

### Question 3: First Offender Act Eligibility
**Issue:** Some crimes prohibit First Offender treatment

**Example:** Statutory rape, child molestation

**How to handle?**
- This is separate from mandatory minimums
- Already captured in `notes` or `recidivist_info` for most crimes
- **Recommended:** Keep in notes, don't create new field

---

## Next Steps (What We'll Do)

### Option A: Do Research Now (Recommended)
1. I search Georgia law for each crime's mandatory minimum requirements
2. I create a findings document
3. You review and approve the findings
4. I update the database with new fields
5. I update the display code
6. We test and deploy

**Timeline:** 3-4 hours total

### Option B: Do Research Later
1. I update the display code to SHOW must-serve info (if present)
2. You manually add must-serve info to crimes as you research them
3. Deploy updates incrementally as you find information

**Timeline:** Spread over days/weeks

### Option C: Start with High-Priority Crimes Only
1. I research just the 11 high-priority crimes
2. Update those first
3. Do the rest later as needed

**Timeline:** 1-2 hours for high-priority crimes

---

## Recommendation

I recommend **Option C** (high-priority crimes first) because:
- Gets the most important information added quickly
- Lets your intern test and provide feedback on the display
- Doesn't delay the project waiting for all 29 crimes
- You can always add the rest later

**Would you like me to:**
1. Research the 11 high-priority crimes right now?
2. Create the findings document?
3. Then update the database and display code?

This would take about 1-2 hours and would significantly improve accuracy for the most serious crimes (trafficking, violent felonies, sex crimes, etc.).

---

## Legal Research Sources

For each crime, I'll check:
1. Official Georgia Code (Justia, GA General Assembly website)
2. Recent case law on mandatory minimums
3. Legal practice guides/attorney resources
4. Georgia Sentencing Commission materials

All findings will include citations so you can verify.
