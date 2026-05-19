async function sendBulk() {
  const amount = document.getElementById("amount").value;

  const rawNumbers = document
    .getElementById("numbers")
    .value
    .trim();

  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "Sending requests...";

  const numbers = rawNumbers
    .split(/\n|,/)
    .map(num => num.trim())
    .filter(Boolean);

  try {
    const response = await fetch("/send-bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        numbers,
        amount
      })
    });

    const data = await response.json();

    resultsDiv.innerHTML = "";

    data.results.forEach(item => {
      const div = document.createElement("div");

      div.className = `result-item ${
        item.success ? "success" : "failed"
      }`;

      div.innerHTML = `
        <strong>${item.phone}</strong><br>
        ${item.success ? "STK Sent Successfully" : "Failed"}
      `;

      resultsDiv.appendChild(div);
    });

  } catch (error) {
    resultsDiv.innerHTML = error.message;
  }
}
