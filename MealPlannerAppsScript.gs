// === MEAL PLANNER BACKEND ===
// Paste this entire file into Extensions > Apps Script in your Google Sheet.

const SHEET_MEALS = 'Meals';
const SHEET_CATEGORIES = 'Categories';
const SHEET_PLAN = 'WeeklyPlan';

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const params = e.parameter || {};
    let body = {};
    if (e.postData && e.postData.contents) {
      try { body = JSON.parse(e.postData.contents); } catch (err) {}
    }
    const action = params.action || body.action;
    let result;

    switch (action) {
      case 'getMeals':
        result = getMeals();
        break;
      case 'addMeal':
        result = addMeal(body.name, body.category, body.slot);
        break;
      case 'getCategories':
        result = getCategories();
        break;
      case 'addCategory':
        result = addCategory(body.name);
        break;
      case 'getWeek':
        result = getWeek(body.weekStart || params.weekStart);
        break;
      case 'setSlot':
        result = setSlot(body.weekStart, body.day, body.slot, body.mealId, body.mealName, body.status);
        break;
      case 'getWeeksList':
        result = getWeeksList();
        break;
      default:
        result = { error: 'Unknown action: ' + action };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}

// ---- MEALS ----
function getMeals() {
  const sheet = getSheet(SHEET_MEALS);
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  return data.slice(1)
    .filter(r => r[0])
    .map(r => ({ id: r[0], name: r[1], category: r[2], slot: r[3], dateAdded: r[4] }));
}

function addMeal(name, category, slot) {
  const sheet = getSheet(SHEET_MEALS);
  const id = Utilities.getUuid();
  const now = new Date();
  sheet.appendRow([id, name, category, slot, now]);
  return { id, name, category, slot, dateAdded: now };
}

// ---- CATEGORIES ----
function getCategories() {
  const sheet = getSheet(SHEET_CATEGORIES);
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  return data.slice(1).filter(r => r[0]).map(r => r[0]);
}

function addCategory(name) {
  const sheet = getSheet(SHEET_CATEGORIES);
  const existing = getCategories();
  if (existing.indexOf(name) === -1) sheet.appendRow([name]);
  return { name };
}

// ---- WEEKLY PLAN ----
function getWeek(weekStart) {
  const sheet = getSheet(SHEET_PLAN);
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  return data.slice(1)
    .filter(r => r[0] === weekStart)
    .map(r => ({ weekStart: r[0], day: r[1], slot: r[2], mealId: r[3], mealName: r[4], status: r[5] }));
}

function setSlot(weekStart, day, slot, mealId, mealName, status) {
  const sheet = getSheet(SHEET_PLAN);
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === weekStart && data[i][1] === day && data[i][2] === slot) {
      rowIndex = i + 1;
      break;
    }
  }
  const rowValues = [weekStart, day, slot, mealId || '', mealName || '', status || 'assigned'];
  if (rowIndex === -1) {
    sheet.appendRow(rowValues);
  } else {
    sheet.getRange(rowIndex, 1, 1, rowValues.length).setValues([rowValues]);
  }
  return { weekStart, day, slot, mealId, mealName, status };
}

function getWeeksList() {
  const sheet = getSheet(SHEET_PLAN);
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const weeks = {};
  data.slice(1).forEach(r => { if (r[0]) weeks[r[0]] = true; });
  return Object.keys(weeks).sort().reverse();
}
