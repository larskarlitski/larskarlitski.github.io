function search(query) {
  query = query.toLowerCase().match(/\S+/g) || [];
  let count = 0;

  for (let li of document.querySelectorAll("#restaurants li")) {
    let name = li.querySelector("h3").innerText;
    let date = li.querySelector("span.date").innerText;
    let properties = Array.from(li.querySelectorAll("p.properties span")).map(e => e.innerText);
    let notes = li.querySelector("p.notes").innerText;
    let by = li.classList.contains("faina") ? "faina" : "lars";
    let closed = li.classList.contains("closed");

    li.hidden = !query.every(function (q) {
      return name.toLowerCase().includes(q) ||
        date.toLowerCase().includes(q) ||
        notes.toLowerCase().includes(q) ||
        properties.some(p => p.toLowerCase().includes(q)) ||
        by.includes(q) ||
        (closed && "geschlossen".includes(q));
    });

    if (!li.hidden)
      count += 1;
  }

  let countElement = document.getElementById("count");
  countElement.innerText = String(count);
  countElement.hidden = query.length === 0;
}

function main() {
  document.getElementById("search").addEventListener("input", function (event) {
    search(event.target.value);
  });
}

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", main);
else
  main();
