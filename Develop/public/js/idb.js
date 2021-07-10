var db;
var dbName = "BudgetTrackerDb";

const request = indexedDB.open(dbName, 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;

  db.createObjectStore("Transactions", { autoIncrement: true });
};

request.onerror = function (event) {
  console.log("Database error: " + event.target.errorCode);
};

request.onsuccess = function (event) {
  console.log("Indexed DB connected successfully.");
  db = event.target.result;

  if (navigator.onLine) {
    uploadTransaction();
  }
};

function saveRecord(record) {
  const transaction = db.transaction(["Transactions"], "readwrite");

  const budgetObjectStore = transaction.objectStore("Transactions");

  budgetObjectStore.add(record);

  alert(
    "Transaction has been saved in temporary storage until an internet connection has been reestablished."
  );
}

function uploadTransaction() {
  const transaction = db.transaction(["Transactions"], "readwrite");
  const budgetObjectStore = transaction.objectStore("Transactions");

  const allRecords = budgetObjectStore.getAll();

  allRecords.onsuccess = function () {
    if (allRecords.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(allRecords.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          const transaction = db.transaction(["Transactions"], "readwrite");
          const budgetObjectStore = transaction.objectStore("Transactions");
          budgetObjectStore.clear();

          alert("All saved transactions have been submitted!");
          window.location.reload();
        })
        .catch(error => console.log(error));
    }
  };
}

window.addEventListener("online", uploadTransaction);
