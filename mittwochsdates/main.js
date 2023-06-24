import e from "./e.js";
import restaurants from "./restaurants.js";

let months = [
  undefined,
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember"
];

let nbsp = "\u00A0";

function star(hidden) {
  // TODO use .cloneNode?
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("icon");
  if (hidden) {
    svg.style.visibility = "hidden";
  }
  svg.setAttributeNS(null, "viewBox", "0 0 576 512");
  svg.setAttributeNS(null, "width", "576");
  svg.setAttributeNS(null, "height", "512");
  let p = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p.setAttributeNS(null, "d", "M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z");
  svg.appendChild(p);
  return svg;
}

function prettyDate(date) {
  if (date.month) {
    return months[date.month] + nbsp + String(date.year);
  } else {
    return String(date.year);
  }
}

function prettyNumber(index) {
  return "#" + (index + 1);
}

function card(restaurant, index) {
  let properties = [
    e("span", prettyNumber(index)),
    e("span", " • "),
    e("span", restaurant.district),
  ];
  let classes = [
    "restaurant",
    restaurant.by
  ];

  if (restaurant.url) {
    properties.push(
      e("span", " • "),
      e("a", { href: restaurant.url }, "Webseite")
    );
  }

  if (restaurant.closed) {
    properties.push(
      e("span", " • "),
      e("span", "Geschlossen")
    );
    classes.push("closed");
  }

  return e("li." + classes.join("."), { "data-restaurant": index },
    star(!restaurant.starred),
    e("div",
      e("span.date", prettyDate(restaurant.date)),
      e("h3", restaurant.name),
      e("p.properties", ...properties),
      restaurant.notes ? e("p.notes", restaurant.notes) : undefined
    )
  );
}

function search(query) {
  query = query.toLowerCase().match(/\S+/g) || [];
  let count = 0;
  document.querySelectorAll("#restaurants li").forEach(function (li) {
    let index = Number(li.dataset.restaurant);
    let restaurant = restaurants[index];
    li.hidden = !query.every(function (q) {
      return restaurant.name.toLowerCase().includes(q) ||
        prettyDate(restaurant.date).toLowerCase().includes(q) ||
        prettyNumber(index).includes(q) ||
        restaurant.district.toLowerCase().includes(q) ||
        restaurant.notes?.toLowerCase().includes(q) ||
        restaurant.by.includes(q) ||
        (restaurant.closed && "geschlossen".includes(q));
    });
    if (!li.hidden) {
      count += 1;
    }
  });
  let countElement = document.getElementById("count");
  countElement.innerText = String(count);
  countElement.hidden = query.length === 0;
}

function countRestaurants({ by, starred }) {
  return restaurants.filter(function (r) {
    if (by !== undefined && r.by !== by) {
      return false;
    }
    if (starred !== undefined && !!r.starred !== starred) {
      return false;
    }
    return true;
  }).length;
}

document.addEventListener("DOMContentLoaded", function () {
  let cards = restaurants.map(card).reverse();
  document.getElementById("restaurants").append(...cards);

  document.getElementById("stats").append(
    String(cards.length),
    e("span.detail",
      "(",
      e("span.faina", String(countRestaurants({ by: "faina" }))),
      ",",
      e("span.lars", String(countRestaurants({ by: "lars" }))),
      ")"
    ),
    " Dates • ",
    countRestaurants({ starred: true }),
    e("span.detail",
      "(",
      e("span.faina", String(countRestaurants({ by: "faina", starred: true }))),
      ",",
      e("span.lars", String(countRestaurants({ by: "lars", starred: true }))),
      ")"
    ),
    " Sterne"
  );

  document.getElementById("search").addEventListener("input", function (event) {
    search(event.target.value);
  });
});
