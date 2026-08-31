const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const {
  IconAirConditioning,
  IconArchive,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconDoor,
  IconFridge,
  IconLayoutRows,
  IconSnowflake,
  IconToolsKitchen2,
} = require("@tabler/icons-react");

const categories = [
  {
    number: "01",
    title: ["Aires", "acondicionados"],
    mainIcon: IconAirConditioning,
    badgeIcon: IconSnowflake,
    iconScale: 1,
    delay: "160ms",
  },
  {
    number: "02",
    title: ["Heladeras"],
    mainIcon: IconFridge,
    badgeIcon: IconFridge,
    iconScale: 0.98,
    delay: "230ms",
  },
  {
    number: "03",
    title: ["Freezers"],
    mainIcon: IconArchive,
    badgeIcon: IconArchive,
    iconScale: 1.02,
    delay: "300ms",
  },
  {
    number: "04",
    title: ["Camaras", "frigorificas"],
    mainIcon: IconBuildingWarehouse,
    badgeIcon: IconDoor,
    iconScale: 0.98,
    delay: "370ms",
  },
  {
    number: "05",
    title: ["Exhibidoras"],
    mainIcon: IconBuildingStore,
    badgeIcon: IconLayoutRows,
    iconScale: 0.98,
    delay: "440ms",
  },
  {
    number: "06",
    title: ["Equipos", "comerciales"],
    mainIcon: IconToolsKitchen2,
    badgeIcon: IconBuildingStore,
    iconScale: 0.98,
    delay: "510ms",
  },
];

function CategoryMainIcon({ Icon }) {
  return React.createElement(Icon, {
    size: 92,
    stroke: 1.5,
    "aria-hidden": "true",
  });
}

function CategoryBadgeIcon({ Icon }) {
  return React.createElement(Icon, {
    size: 22,
    stroke: 1.8,
    "aria-hidden": "true",
  });
}

function EquipmentCard({ category }) {
  return React.createElement(
    "article",
    {
      className: "equipment-card fade-up",
      style: {
        "--delay": category.delay,
        "--icon-scale": category.iconScale,
      },
    },
    React.createElement("span", { className: "card-number" }, category.number),
    React.createElement(
      "div",
      { className: "card-figure" },
      React.createElement(
        "div",
        { className: "equipment-visual-stage", "aria-hidden": "true" },
        React.createElement("span", { className: "equipment-visual-shape" }),
        React.createElement(
          "span",
          { className: "equipment-main-icon" },
          React.createElement(CategoryMainIcon, { Icon: category.mainIcon })
        )
      )
    ),
    React.createElement(
      "span",
      { className: "card-badge", "aria-hidden": "true" },
      React.createElement(CategoryBadgeIcon, { Icon: category.badgeIcon })
    ),
    React.createElement(
      "h3",
      null,
      category.title.map((line) =>
        React.createElement("span", { key: `${category.number}-${line}` }, line)
      )
    )
  );
}

function renderEquipmentCards() {
  return categories
    .map((category) =>
      renderToStaticMarkup(React.createElement(EquipmentCard, { category }))
    )
    .join("\n");
}

module.exports = {
  categories,
  CategoryMainIcon,
  CategoryBadgeIcon,
  renderEquipmentCards,
};

