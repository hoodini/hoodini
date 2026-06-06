/**
 * YUV.AI Survey — Google Apps Script backend (אופציונלי)
 * ----------------------------------------------------------------------------
 * אוסף את תשובות הסקר ישירות לתוך Google Sheet, בחינם, בלי שרת.
 *
 * הגדרה (5 דקות):
 *  1. צרו Google Sheet חדש.
 *  2. תפריט: Extensions → Apps Script. הדביקו את כל הקובץ הזה.
 *  3. Deploy → New deployment → סוג: "Web app".
 *       - Execute as: Me
 *       - Who has access: Anyone
 *  4. העתיקו את ה-URL שמסתיים ב-/exec.
 *  5. ב-config.js הגדירו:
 *       endpointType: "gas",
 *       formEndpoint: "<ה-URL מסעיף 4>",
 *
 * כל שורה ב-Sheet = משיב אחד. עמודות נוצרות אוטומטית לפי השדות.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // ודא שורת כותרות
    var headers;
    if (sheet.getLastRow() === 0) {
      headers = Object.keys(data);
      sheet.appendRow(headers);
    } else {
      headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      // הוסף עמודות חדשות אם הופיעו שדות חדשים
      Object.keys(data).forEach(function (k) {
        if (headers.indexOf(k) === -1) {
          headers.push(k);
          sheet.getRange(1, headers.length).setValue(k);
        }
      });
    }

    var row = headers.map(function (h) { return data[h] != null ? data[h] : ""; });
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("YUV.AI survey endpoint is live.");
}
