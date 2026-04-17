function syncAllSupabaseTables() {
  const SUBAPASE_URL = 'https://narzeblpnlmnvpbfoufv.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hcnplYmxwbmxtbnZwYmZvdWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MTE1OTksImV4cCI6MjA5MTM4NzU5OX0.SNfRd7JNnVP_WdwPvJ4y_CNYPO3-8WhrmxukdjMM5H8';

  // LIST YOUR TABLES HERE: Add as many as you want in quotes
  const TABLES = ['users', 'orders'];

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  TABLES.forEach(tableName => {
    const url = `${SUBAPASE_URL}/rest/v1/${tableName}?select=*`;
    const options = {
      'method': 'get',
      'headers': {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY
      }
    };

    try {
      const response = UrlFetchApp.fetch(url, options);
      const data = JSON.parse(response.getContentText());

      if (data.length > 0) {
        // Find the sheet for this table, or create it if it doesn't exist
        let sheet = ss.getSheetByName(tableName);
        if (!sheet) {
          sheet = ss.insertSheet(tableName);
        }

        sheet.clear(); // Clear old data

        const headers = Object.keys(data[0]);
        sheet.appendRow(headers);

        const rows = data.map(item => headers.map(header => item[header]));
        sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);

        // Make the headers bold so it's organized
        sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
      }
    } catch (e) {
      Logger.log('Error syncing table ' + tableName + ': ' + e.message);
    }
  });
}
s