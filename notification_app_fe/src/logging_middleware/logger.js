
export async function Log(stack, level, packageName, message) {
  const s = stack.toLowerCase();
  const l = level.toLowerCase();
  const p = packageName.toLowerCase();

  const validStacks = ["frontend", "backend"];
  const validLevels = ["debug", "info", "warn", "error", "fatal"];
  const validFrontendPackages = ["api", "component", "hook", "page", "state", "style", "auth", "config", "middleware", "utils"];

  if (!validStacks.includes(s) || !validLevels.includes(l) || !validFrontendPackages.includes(p)) {
    console.error(`Validation Failed: Invalid parameters provided to the Log function.`);
    return;
  }

  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhYTA3NTlAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMDQ5NywiaWF0IjoxNzc3Njk5NTk3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZGY5OWJlMTktNmJjYy00M2VjLWE1MzktZDkyZTY5ZmU2Mjk1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYWRhcnNoIGFuYW5kIiwic3ViIjoiNWFmZjQ1MTYtMWU1OC00NGE1LThiNTQtMDY5NWVkYWIwNjU2In0sImVtYWlsIjoiYWEwNzU5QHNybWlzdC5lZHUuaW4iLCJuYW1lIjoiYWRhcnNoIGFuYW5kIiwicm9sbE5vIjoicmEyMzExMDAzMDEwMDYxIiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiNWFmZjQ1MTYtMWU1OC00NGE1LThiNTQtMDY5NWVkYWIwNjU2IiwiY2xpZW50U2VjcmV0IjoiZVNHanZNV0JoZ2Rkak1zVSJ9.4mHq3nKXpMcO90J7D1GBPwNXcSN0qVIhxi9WkHEsDmE";

  try {
    const response = await fetch("http://20.207.122.201/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        stack: s,
        level: l,
        package: p,
        message: message
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`[Log Sent Successfully] logID: ${data.logID}`);
    } else {
      console.error(`[Server Rejected Log] Status Code: ${response.status}`);
    }
  } catch (error) {
    console.error("[Log Network Connection Error]:", error.message);
  }
}