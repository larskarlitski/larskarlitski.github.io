import Mustache from "./mustache.js";
import fs from "node:fs";
import restaurants from "./mittwochsdates/restaurants.js";

let templates = {};

function load(name) {
  if (!templates.name)
    templates[name] = fs.readFileSync("templates/mittwochsdates/" + name, { encoding: "utf-8" });

  return templates[name];
}

function restaurantView(restaurant, index) {
  return {
    number: index + 1,
    ...restaurant
  };
}

function count(iterable, predicate) {
  let count = 0;

  for (let item of iterable) {
    if (predicate(item))
      count++;
  }

  return count;
}

let view = {
  restaurants: restaurants.map(restaurantView).reverse(),
  stats: {
    total: restaurants.length,
    starred: count(restaurants, r => r.starred),
    faina: {
      total: count(restaurants, r => r.by === "faina"),
      starred: count(restaurants, r => r.starred && r.by === "faina")
    },
    lars: {
      total: count(restaurants, r => r.by === "lars"),
      starred: count(restaurants, r => r.starred && r.by === "lars")
    }
  }
};

fs.mkdirSync("site/mittwochsdates", { recursive: true });

for (let file of fs.readdirSync("static/mittwochsdates"))
  fs.copyFileSync("static/mittwochsdates/" + file, "site/mittwochsdates/" + file)

fs.writeFileSync(
   "site/mittwochsdates/index.html",
   Mustache.render("{> index.html}", view, load, ["{", "}"])
);
