// test_priority.js

// Example payload exactly matching the screenshot
const notifications = [
  {
    "ID": "d146095a-0d86-4a34-9e69-3900a14576bc",
    "Type": "Result",
    "Message": "mid-sem",
    "Timestamp": "2026-04-22 17:51:30"
  },
  {
    "ID": "b283218f-ea5a-4b7c-93a9-1f2f240d64b0",
    "Type": "Placement",
    "Message": "CSX Corporation hiring",
    "Timestamp": "2026-04-22 17:51:18"
  },
  {
    "ID": "81589ada-0ad3-4f77-9554-f52fb558e09d",
    "Type": "Event",
    "Message": "farewell",
    "Timestamp": "2026-04-22 17:51:06"
  }
];

const weights = {
  "Placement": 3,
  "Result": 2,
  "Event": 1
};

// Priority Sorting Algorithm
function getPriorityInbox(data, topN = 10) {
  const sorted = [...data].sort((a, b) => {
    // Check type weight first
    const weightDiff = (weights[b.Type] || 0) - (weights[a.Type] || 0);
    
    if (weightDiff !== 0) {
      return weightDiff; // Higher weight comes first
    }

    // If type matches, evaluate timestamp
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });

  return sorted.slice(0, topN);
}

// Run the test
console.log("--- PRIORITY INBOX OUTPUT ---");
console.log(getPriorityInbox(notifications, 10));