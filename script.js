var actionsContainer = document.getElementById("actionsContainer");

class Item {
  constructor (name, amount, useEnd) {
    this.name           = name;
    this.amount         = amount;
    this.useEnd         = useEnd;
    this.indicator      = document.getElementById(name + "Indicator");
    this.indicatorRow   = document.getElementById(name + "IndicatorRow");
    this.useLink        = document.getElementById(name + "UseLink");
  }

  use () {
    changeItemAmount(this.name, -1);
    this.useEnd();
  }
}

class SpecialItem extends Item {
  constructor (name, amount, max) {
    super(name, amount, () => {});
    this.max = max;
  }
}

var items =
{
  "dirt": new Item("dirt", 0, () => {}),
  "coal": new Item("coal", 0, () => { changePower(15) })
};

var specialItems =
{
  "power": new SpecialItem("power", 100, 100),
  "total": new SpecialItem("total", 0, 100)
};

function changeNumberWithinBounds(number, change, min, max)
{
  return (number + change < min) ? min : (number + change > max) ? max : number + change;
}

function changePower(change)
{
  // Changes the power amount while keeping it within 0 and its maximum value.
  specialItems.power.amount = changeNumberWithinBounds(specialItems.power.amount, change, 0, specialItems.power.max);
  
  // Updates the indicator.
  specialItems.power.indicator.innerHTML = specialItems.power.amount + "/" + specialItems.power.max;
  
  // Causes a game over if the power has run out.
  if (specialItems.power.amount === 0)
  {
    actionsContainer.innerHTML = "GAME OVER";
  }
}

function changeItemAmount(item, change)
{
  // Gets the total amount of all items.
  specialItems.total.amount = 0;
  
  for (var i in items)
  {
    specialItems.total.amount += items[i].amount;
  }
  
  // Checks if the change stays in bounds.
  if (specialItems.total.amount + change <= specialItems.total.max && items[item].amount + change >= 0)
  {
    // Changes the total and the item's amount.
    items[item].amount          = items[item].amount + change;
    specialItems.total.amount   = specialItems.total.amount + change;
    
    // If the total indicator's header is hidden, reveal it.
    if (specialItems.total.indicatorRow.getAttribute("class") == "invisible")
    {
      specialItems.total.indicatorRow.setAttribute("class", "");
    }
    
    // Updates the total indicator.
    specialItems.total.indicator.innerHTML = specialItems.total.amount + "/" + specialItems.total.max;
    
    // If the use link and the indicator's header is hidden, reveal them.
    if (items[item].indicatorRow.getAttribute("class") == "invisible")
    {
      items[item].indicatorRow.setAttribute("class", "");
      items[item].useLink.setAttribute("class", "");
    }
    
    // Updates the indicator.
    items[item].indicator.innerHTML = items[item].amount;
  }
}

function warn (on, msg="")
{
  if (!on)
    return document.getElementById("warningDiv").classList.add("invisible");
  document.getElementById("warningDiv").classList.remove("invisible");
  document.getElementById("warningDiv").innerHTML = msg;
}

function mine ()
{
  warn(false);
  if (specialItems.total.amount >= specialItems.total.max)
    warn(true, "You cannot store any more items! Throw some out to keep mining.");

  changePower(-1);

  if (Math.random() < 0.1)
  {
    // Gives coal 10% of the time.
    changeItemAmount("coal", 1);
  }
  else
  {
    // Gives dirt 90% of the time.
    changeItemAmount("dirt", 1);
  }
}
