# This Week's Menu — Weekly Meal Planner

A mobile-friendly weekly meal planner. Dinners are organized by category (tap a category to see its meals, with a tag showing if it was already used this week or last week). Lunches are a flat, repeatable list. All data is stored in a connected Google Sheet, so you can view or edit it directly if needed.

## Setup

### 1. Create the Google Sheet backend

1. Create a new Google Sheet.
2. Add three tabs, named exactly:
   - `Meals` — columns: `ID | Name | Category | Slot | DateAdded`
   - `Categories` — column: `Name`
   - `WeeklyPlan` — columns: `WeekStart | Day | Slot | MealID | MealName | Status`
3. Leave all three empty except for the header row — the app fills them in as you use it.
4. In the Sheet, go to **Extensions → Apps Script**.
5. Delete the placeholder code and paste in the contents of `MealPlannerAppsScript.gs` (from this repo, or ask Claude to reprint it).
6. Save, then click **Deploy → New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Deploy, authorize when prompted, and copy the **Web app URL** — you'll need it in step 3 below.
8. If you ever edit the script later, you must redeploy (**Deploy → Manage deployments → edit → new version**) for changes to take effect.

### 2. Publish this repo with GitHub Pages

1. Push/upload `index.html` to the root of this repo.
2. Go to **Settings → Pages**.
3. Under "Build and deployment," set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Save. GitHub will give you a URL like `https://yourusername.github.io/meal-planner/` after a minute or two.

### 3. Connect the app to your sheet

1. Open the GitHub Pages URL on your phone.
2. Paste in the Apps Script Web app URL from step 1 when prompted.
3. Tap **Connect**.

Optional: use your phone's "Add to Home Screen" so it launches like a normal app.

## Using the app

- **Dinner slots**: tap a slot, pick a category, then a meal. Meals already used this week or last week show a small tag, but nothing is hidden — repeats are allowed if you want them.
- **Lunch slots**: tap a slot and pick from a flat list, or add a new one (like "Leftovers") on the fly.
- **Skip**: every slot has a Skip option for days you're not planning (eating out, etc.).
- **Adding meals/categories**: do this right from the slot picker — no need to edit the Sheet by hand, though you always can.
- **History**: the clock icon shows past weeks saved in the Sheet.

## Notes

- The app talks directly to your Google Sheet via the Apps Script Web app URL — no other backend involved.
- The Apps Script URL is stored only in your phone's browser storage, not committed to this repo.
- This repo needs to be public for GitHub Pages to work on a free GitHub account (see conversation history for private-repo alternatives like Netlify/Vercel).
