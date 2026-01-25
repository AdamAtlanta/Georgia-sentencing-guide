# Georgia Sentencing Guide - Project Status

**Last Updated:** January 24, 2026 (End of Session)

---

## ✅ COMPLETED THIS SESSION

### 1. User Preferences Setup
**File:** `.claude/user-preferences.md`
- Configured Claude Code to provide non-technical instructions
- Set communication style for attorney (non-developer) user
- Enables step-by-step guidance with analogies and plain language

### 2. Database Expansions

**Total Crimes:** 29 (up from 23)

**Added Crimes:**
- **Fleeing or Attempting to Elude a Police Officer** (O.C.G.A. § 40-6-395)
  - Misdemeanor: 1st, 2nd, 3rd offense (basic)
  - Felony: 20+ mph over limit, collision, dangerous conditions, 4th+ offense
  - Includes 1-year mandatory minimum for felony tier

- **Obstruction of a Law Enforcement Officer** (O.C.G.A. § 16-10-24)
  - Misdemeanor: Basic obstruction (without violence)
  - Felony: With violence OR throwing bodily fluids at officer
  - Includes mandatory $300 minimum fine

**Enhanced Crimes:**
- **Marijuana Trafficking** - Now shows sentencing maximums (5-30, 7-30, 15-30 years)
- **DUI** - Added 4th offense (felony), clarified 10-year vs 5-year lookback periods

### 3. Mandatory Minimum Information Added

**New Feature:** Yellow warning boxes display when crime has mandatory minimum sentence

**Crimes Updated with Mandatory Minimums:**
1. **Armed Robbery** - 10 years (must serve all, no parole)
2. **Felony Fleeing/Eluding** - 1 year (cannot be suspended/probated)
3. **DUI Offenses:**
   - 1st: 24 hours
   - 2nd: 72 hours
   - 3rd: 15 days
   - 4th (felony): 1 year
4. **Statutory Rape (defendant 21+)** - 10 years (no parole until served)
5. **Child Molestation:**
   - 1st offense: 5 years
   - 2nd offense: 10 years
   - Aggravated: 25 years (no parole/probation/suspension)
6. **Aggravated Sexual Battery** - 25 years (cannot be reduced)

**Display Format:**
```
⚠️ MANDATORY MINIMUM - MUST SERVE
[X] years in custody
Cannot be suspended, probated, deferred, or withheld
```

### 4. Branding & Design Updates
- Footer now displays: **"Published by Swingle Levin, LLC"**
- Tagline changed to: **"Investigate. Mitigate. Advocate."**
- Professional legal styling maintained throughout

### 5. Research Documentation
**Files Created:**
- `MANDATORY_MINIMUMS_PLAN.md` - Complete strategy for tracking must-serve time
- `MANDATORY_MINIMUMS_FINDINGS.md` - Research findings for 11 high-priority crimes
  - Includes legal citations and sources
  - Documents mandatory minimums, parole restrictions, probation eligibility
  - Notes recent legal changes (e.g., Roundtree case on drug trafficking)

### 6. Deployment
- **Live Site:** https://georgia-sentencing-guide.vercel.app
- All updates deployed to production
- Intern can access for testing and review

---

## 📁 KEY FILES & THEIR PURPOSE

### Data Files
- `src/data/crimes.json` - Crime database (29 crimes)
- `src/data/crimes.json.backup` - Original backup (23 crimes)
- `src/data/title16_index.json` - Title 16 index reference

### Component Files
- `src/components/SearchInput.js` - Crime search with Fuse.js fuzzy search
- `src/components/SentencingCard.js` - Displays crime details, penalties, mandatory minimums
- `src/app/page.js` - Main homepage with hero section and footer
- `src/app/layout.js` - App layout wrapper
- `src/utils/search.js` - Search utility functions

### Documentation Files
- `PROJECT_STATUS.md` - This file (current project state)
- `MANDATORY_MINIMUMS_PLAN.md` - Planning document for must-serve implementation
- `MANDATORY_MINIMUMS_FINDINGS.md` - Legal research with citations
- `.claude/user-preferences.md` - Non-technical user communication settings
- `README.md` - Next.js standard documentation

### Configuration Files
- `package.json` - Dependencies and scripts
- `tailwind.config.mjs` - Styling configuration
- `next.config.mjs` - Next.js configuration
- `.gitignore` - Git exclusions

---

## 📊 DATABASE STRUCTURE REFERENCE

### Crime Entry Format

```json
{
  "id": "unique-identifier",
  "title": "Crime Name",
  "statute": "O.C.G.A. § XX-XX-XX",
  "type": "Felony|Misdemeanor|Wobbler|Felony/Misdemeanor",
  "description": "Detailed explanation of the offense",

  // OPTION 1: Simple penalty (no variables)
  "base_penalty": {
    "sentence": "X to Y years",
    "fine": "Amount or range",
    "must_serve": "Time that must be served",
    "probation_eligible": true|false,
    "mandatory_minimum": number
  },

  // OPTION 2: Complex penalty with variables
  "variables": [
    {
      "id": "variable_name",
      "label": "Display Label",
      "type": "select|number|currency",
      "options": [...],  // for select
      "ranges": [...]    // for number/currency
    }
  ],

  // Optional fields
  "notes": "Additional information",
  "recidivist_info": "Prior offense handling"
}
```

### Variable Option/Range Format

```json
{
  "label": "Option description",
  "sentence": "Penalty range",
  "fine": "Fine amount or range",
  "must_serve": "Time that MUST be served in custody",
  "probation_eligible": true|false,
  "severity_level": "Classification",
  "other": "Special requirements (e.g., registration, license consequences)"
}
```

### Field Meanings

| Field | Purpose | Example |
|-------|---------|---------|
| `must_serve` | Mandatory minimum time in custody | "10 years", "72 hours", "25 years" |
| `probation_eligible` | Can sentence be probated? | `false` = cannot suspend/probate |
| `severity_level` | Classification tier | "High & Aggravated", "Aggravated Felony" |
| `other` | Special requirements | "Sex offender registration required" |

---

## 🎯 NEXT STEPS (User's Priorities)

### Priority 1: Add Parole Information

**Goal:** Provide clear information about parole eligibility and restrictions

**What This Means (In Plain English):**
Even when someone is sentenced to prison, they may be eligible for parole (early release) after serving a certain percentage of their sentence. However, some crimes have special parole restrictions (e.g., "must serve 85% before parole" or "no parole for first 10 years").

**Tasks:**
1. **Research Georgia Parole Rules**
   - Standard parole eligibility (typically after what % of sentence?)
   - Crimes with special parole restrictions
   - Violent felony parole rules
   - Sex offender parole rules

2. **Add Parole Fields to Database**
   - `parole_eligible`: true/false
   - `parole_minimum`: "Percentage or time before parole possible"
   - `parole_notes`: "Special parole restrictions"

3. **Update Display**
   - Show parole information clearly
   - Distinguish between "must serve" (time in custody) and "parole eligible" (when can apply for early release)

**Example Display:**
```
Sentence: 10 to 20 years
Must Serve: 10 years minimum
Parole Eligible: After serving 10 years (50% of 20-year sentence)
```

**Crimes Likely to Need This:**
- Armed robbery
- Murder/manslaughter
- Sex crimes
- Aggravated assault
- Drug trafficking

---

### Priority 2: Add More Crimes

**Current Coverage:** 29 crimes
**Goal:** Expand to cover more common criminal charges

**Suggested Additions (By Category):**

#### A. Violent Crimes
- [ ] Simple assault
- [ ] Simple battery
- [ ] Aggravated battery
- [ ] Kidnapping
- [ ] False imprisonment
- [ ] Cruelty to children (1st, 2nd, 3rd degree)
- [ ] Murder (malice, felony murder)
- [ ] Voluntary manslaughter
- [ ] Involuntary manslaughter

#### B. Property Crimes
- [ ] Burglary (already have 1st and 2nd, but could clarify)
- [ ] Criminal trespass
- [ ] Criminal damage to property (1st, 2nd degree)
- [ ] Arson (1st, 2nd, 3rd degree)
- [ ] Shoplifting (separate from theft by taking)

#### C. Drug Crimes
- [ ] Possession with intent to distribute (Schedule I-V)
- [ ] Sale of controlled substances
- [ ] Manufacturing controlled substances

#### D. Weapons Crimes
- [ ] Carrying concealed weapon
- [ ] Possession of firearm by convicted felon
- [ ] Possession of firearm during commission of felony

#### E. Traffic Crimes
- [ ] Reckless driving
- [ ] Hit and run
- [ ] Vehicular homicide (1st, 2nd degree)
- [ ] Serious injury by vehicle

#### F. White Collar Crimes
- [ ] Identity fraud/theft
- [ ] Computer theft/computer trespass
- [ ] Financial transaction card fraud

#### G. Public Order Crimes
- [ ] Disorderly conduct
- [ ] Loitering
- [ ] Criminal trespass
- [ ] Public indecency

**Next Session Plan:**
1. Prioritize which category to start with
2. Research 5-10 crimes at a time
3. Add to database incrementally
4. Deploy updates after each batch

---

### Priority 3: Make Certain Entries More Clear

**Goal:** Improve clarity and accuracy of existing entries

**Areas for Improvement:**

#### A. Drug Trafficking - Address Roundtree Case
**Current Issue:** Entry doesn't reflect recent legal change (Roundtree case) allowing partial probation

**Fix Needed:**
- Add note about Roundtree decision
- Clarify that judges MAY be able to probate portions
- Note this is evolving area of law
- Keep substantial assistance exception

**Example Update:**
```
Notes: "Recent case law (Roundtree) suggests portions of trafficking
sentences may be probated at judge's discretion, though this remains
an evolving area of law. Substantial assistance exception still applies."
```

#### B. DUI - Clarify Time Served Credit
**Current Issue:** First offense shows "24 hours mandatory" but time served during arrest may count

**Fix Needed:**
- Make clear when time served counts
- Explain difference between jail time and community service options

#### C. Sex Crimes - Explain Split Sentences
**Current Issue:** "Split sentence" terminology may be unclear

**Fix Needed:**
- Add explanation: "Split sentence = X years in prison THEN probation for life"
- Make clear this is consecutive, not alternative

**Example:**
```
Sentence: 25 years to Life (split sentence possible)
Explanation: Defendant serves 25 years in prison, then placed on
probation for life upon release
```

#### D. Forgery - Add Common Scenarios
**Current Issue:** Degrees may be confusing (1st, 2nd, 3rd, 4th)

**Fix Needed:**
- Add examples to descriptions
- Clarify difference between degrees

**Example:**
```
1st Degree: Making fake check AND cashing it (uttering/delivery)
2nd Degree: Making fake check but NOT cashing it (possession only)
3rd Degree: Check forgery over $1,500 or 10+ checks
4th Degree: Check forgery under $1,500 and fewer than 10 checks
```

#### E. Armed Robbery - Add Weapon Clarification
**Current Issue:** Doesn't specify what counts as "armed"

**Fix Needed:**
- Define "offensive weapon"
- Note replica/toy weapons may qualify

#### F. Theft by Taking - Clarify Shoplifting
**Current Issue:** Overlap with shoplifting not addressed

**Fix Needed:**
- Note when theft becomes shoplifting
- Cross-reference if shoplifting added later

---

## 🔧 HOW TO RESUME WORK

### Start Dev Server
```bash
cd C:\Users\Adam\Desktop\georgia-sentencing-guide
npm run dev
```
Access at: http://localhost:3000

### Make Database Changes
1. Open `src/data/crimes.json`
2. Make edits (add crimes, update info)
3. Validate: `node -e "JSON.parse(require('fs').readFileSync('src/data/crimes.json', 'utf8')); console.log('Valid!')"`
4. Test locally at localhost:3000
5. Deploy when ready

### Deploy Updates to Production
```bash
vercel --prod
```
Live site: https://georgia-sentencing-guide.vercel.app

### Ask Claude for Help
Just say: "Let's work on [Priority 1/2/3]" and I'll:
1. Research the relevant Georgia laws
2. Update the database
3. Test the changes
4. Walk you through deployment

---

## 📈 PROJECT STATISTICS

| Metric | Count |
|--------|-------|
| Total Crimes | 29 |
| Crimes with Mandatory Minimums | 6 |
| Felonies | ~20 |
| Misdemeanors | ~5 |
| Wobblers | ~4 |
| Lines of JSON | ~850 |

---

## 🚨 IMPORTANT REMINDERS

### For Making Changes
1. **Always read files before editing** - Claude Code requires this
2. **Test locally first** - Check at localhost:3000 before deploying
3. **Validate JSON** - Run validation command after database changes
4. **Deploy to production** - Use `vercel --prod` to update live site
5. **Tell intern to refresh** - Users need to press F5 to see updates

### For Communication with Claude
- Claude knows you're non-technical
- Ask for step-by-step instructions anytime
- Request analogies if concepts are unclear
- Preferences are saved in `.claude/user-preferences.md`

### Legal Accuracy
- All penalties researched from official Georgia Code
- Sources documented in `MANDATORY_MINIMUMS_FINDINGS.md`
- When in doubt, verify against current O.C.G.A. statutes
- Note effective dates for recent law changes

---

## 📚 RESEARCH SOURCES

### Official Legal Sources
- [Justia Georgia Code](https://law.justia.com/codes/georgia/)
- Georgia General Assembly website
- O.C.G.A. official statutes

### Legal Practice Resources
- Georgia Sentencing Commission materials
- Criminal defense attorney blogs/resources
- Case law databases

### Documentation
All research findings include:
- Statute citations
- Source URLs
- Effective dates of amendments
- Case law references where applicable

---

## 💡 TIPS FOR NEXT SESSION

### Starting Fresh
1. Open VSCode to the project folder
2. Say: "What's the status of the Georgia Sentencing Guide?"
3. I'll summarize where we left off
4. Pick a priority to work on

### Quick Tasks
- **Add a single crime:** "Add [crime name] to the database"
- **Update entry:** "Make the [crime name] entry more clear"
- **Research:** "Research parole rules for [crime type]"

### Bigger Projects
- **Add category of crimes:** "Let's add all the assault crimes"
- **Parole overhaul:** "Add parole information to all crimes"
- **Clarity review:** "Review all entries for clarity issues"

---

## ✨ SESSION ACCOMPLISHMENTS

**What We Built:**
- Mandatory minimum tracking system
- Yellow warning boxes for must-serve time
- 2 new crime categories
- Enhanced 4 existing crimes
- Professional branding
- Research documentation

**User Experience Improvements:**
- Attorneys can now see mandatory minimums at a glance
- Clear distinction between sentence range and must-serve time
- Better understanding of probation eligibility
- Professional presentation with firm branding

**Technical Improvements:**
- Flexible data structure for mandatory minimums
- Display component handles both simple and complex penalties
- Documentation for future developers
- Non-technical user preferences configured

---

**Status:** ✅ Ready for intern review and feedback
**Next Session:** Choose from 3 priorities (parole info, more crimes, or clarity improvements)
