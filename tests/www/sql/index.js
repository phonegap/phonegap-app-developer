//-------------------------------------------------------------------------
// HTML5 Database
//-------------------------------------------------------------------------
var dbs = [];
var quotas = [2000000, 2000000];
var names = ['mydb', 'rand' + Math.random()];
function openDb(index) {
    try {
        databaseOutput('Openning db with name: ' + names[index]);
        return openDatabase(names[index], "1.0", "Apache Cordova Demo", quotas[index]);
    } catch (e) {
        databaseOutput('Got exception: ' + e);
    }
}

var callDatabase = function(index) {
    var db = dbs[index] = openDb(index);
    if (!db) {
        return;
    }
    databaseOutput("Database opened.");
    db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS DEMO');
        tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)', [],
             function(tx,results) { console.log("Created table"); },
             function(tx,err) { alert("Error creating table: "+err.message); });
        tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")', [],
             function(tx,results) { console.log("Insert row1 success"); },
             function(tx,err) { alert("Error adding 1st row: "+err.message); });
        tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")', [],
             function(tx,results) { console.log("Insert row2 success"); },
             function(tx,err) { alert("Error adding 2nd row: "+err.message); });
        databaseOutput("Data written to DEMO table.");
        console.log("Data written to DEMO table.");

        tx.executeSql('SELECT * FROM DEMO', [], function (tx, results) {
            var len = results.rows.length;
            var text = "DEMO table: " + len + " rows found.<br>";
            text = text + "<table border='1'><tr><td>Row</td><td>Data</td></tr>";
            for (var i=0; i<len; i++){
                text = text + "<tr><td>" + i + "</td><td>" + results.rows.item(i).id + ", " + results.rows.item(i).data + "</td></tr>";
            }
            text = text + "</table>";
            databaseOutput(text);
        }, function(tx, err) {
            alert("Error processing SELECT * SQL: "+err.message);
        });
        tx.executeSql('SELECT ID FROM DEMO', [], function (tx, results) {
            var len = results.rows.length;
            var text = "DEMO table: " + len + " rows found.<br>";
            text = text + "<table border='1'><tr><td>Row</td><td>Data</td></tr>";
            for (var i=0; i<len; i++){
                text = text + "<tr><td>" + i + "</td><td>" + results.rows.item(i).id + "</td></tr>";
            }
            text = text + "</table>";
            databaseOutput(text);
        }, function(tx, err) {
            alert("Error processing SELECT ID SQL: "+err.message);
        });
        
    },
    function(err) {
        console.log("Transaction failed: " + err.message);
    });


};

var readDatabase = function(index) {
    var db = dbs[index];
  if (!db) {
        db = dbs[index] = openDb(index);
        if (!db) {
            return;
        }
    }
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM DEMO WHERE id=2', [], function (tx, results) {
            var len = results.rows.length;
            var text = "DEMO table: " + len + " rows found.<br>";
            text = text + "<table border='1'><tr><td>Row</td><td>Data</td></tr>";
            for (var i=0; i<len; i++){
                text = text + "<tr><td>" + i + "</td><td>" + results.rows.item(i).id + ", " + results.rows.item(i).data + "</td></tr>";
            }
            text = text + "</table>";
            databaseOutput(text);
        }, function(tx, err) {
            alert("Error processing SELECT * WHERE id=2 SQL: "+err.message);
        });
    });
}

function increaseQuota(index) {
    quotas[index] *= 2;
    databaseOutput('quota ' + index + ' is now ' + quotas[index]);
}

var databaseOutput = function(s) {
    var el = document.getElementById("database_results");
    el.innerHTML = el.innerHTML + s + "<br>";
    el.scrollByLines(20000);
};

/**
 * Function called when page has finished loading.
 */
function init() {
    document.addEventListener("deviceready", function() {
        console.log("Device="+device.platform+" "+device.version);
    }, false);
}

window.onload = function() {
  addListenerToClass('callDatabase0', callDatabase, [0]);
  addListenerToClass('readDatabase0', readDatabase, [0]);
  addListenerToClass('increaseQuota0', increaseQuota, [0]);
  addListenerToClass('callDatabase1', callDatabase, 1);
  addListenerToClass('readDatabase1', readDatabase, 1);
  addListenerToClass('increaseQuota1', increaseQuota, 1);
  addListenerToClass('reloadPage', function() {
    location = location.href;
  });
  addListenerToClass('backBtn', backHome);
  init();
}
