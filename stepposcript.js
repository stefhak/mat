var resultat;
var lan = new Object();
var kommun = new Object();
var skola = new Object();
var days = ["Mån", "Tis", "Ons", "Tors", "Fre"];
var meny;
var backbutton;
var startPos;
var weekIx;


function clear () {
  var anchor = document.getElementById("header_left");
  while (anchor.firstChild) {
      anchor.removeChild(anchor.firstChild);
  }
  var anchor = document.getElementById("header_center");
  while (anchor.firstChild) {
      anchor.removeChild(anchor.firstChild);
  }
  var anchor = document.getElementById("header_right");
  while (anchor.firstChild) {
      anchor.removeChild(anchor.firstChild);
  }
  var anchor = document.getElementById("main");
  while (anchor.firstChild) {
      anchor.removeChild(anchor.firstChild);
  }
}
function touchStart (e) {
  console.log("x-pos: " + e.touches[0].pageX + " y-pos: " + e.touches[0].pageY);
  startPos = e;
}
function touchEnd (e) {
  console.log("x-pos: " + e.touches[0].pageX + " y-pos: " + e.touches[0].pageY);
  if (e.touches[0].pageX > (startPos.touches[0].pageX + 30)) {
    console.log("right swipe detected");
    if (weekIx > 0) {
      weekIx--;
      display_meny(weekIx);
    }
  } else if ((e.touches[0].pageX + 30) < startPos.touches[0].pageX) {
    console.log("leftt swipe detected");
    if (weekIx < 4) {
      weekIx++;
      display_meny(weekIx);
    }


  }
  
}

function detectSwipe () {
  var touchzone = document.getElementById("main");
  touchzone.addEventListener("touchstart", touchStart, false);
  touchzone.addEventListener("touchend", touchEnd, false);
}

function display_meny_page () {
  clear();
  console.log("skola vald");
  backbutton = new Image();
  backbutton.src = "back.png";
  backbutton.addEventListener("click", display_skolor);
  document.getElementById("header_left").appendChild(backbutton);
  var para = document.createElement("p");
  para.innerHTML = skola.name;
  para.style.fontSize = "18px";
  document.getElementById("header_center").appendChild(para);
  //document.getElementById("header_center").appendChild(document.createElement("br"));
  para = document.createElement("p");
  //ktext.style.color = "red";
  para.innerHTML = kommun.name;
  document.getElementById("header_center").appendChild(para);
  //document.getElementById("header_center").appendChild(document.createElement("br"));
  para = document.createElement("p");
  para.id = "weekNo";
  document.getElementById("header_center").appendChild(para);
  var logo = new Image();
  logo.src = kommun.listOfSchools[0].logo_url;
  document.getElementById("header_right").appendChild(logo);
  var tabell = document.createElement("table");
  tabell.id = "tabellen";
  document.getElementById("main").appendChild(tabell);
  var row, cell;
  days.forEach(function (el, ix, arr) {
    row = document.createElement("tr");
    row.id = el;
    row.className = "day_row";
    tabell.appendChild(row);
    cell = document.createElement("td");
    cell.id = el + "date";
    cell.className = "day_date_cell";
    row.appendChild(cell);
    para = document.createElement("p");
    para.id = el + "dateday";
    para.className = "day_date_day";
    cell.appendChild(para);
    para = document.createElement("p");
    para.id = el + "datedate";
    para.className = "day_date_date";
    cell.appendChild(para);
    cell = document.createElement("td");
    cell.id = el + "meal";
    cell.className = "day_meal_cell";
    row.appendChild(cell);
  });
}
function display_meny (weekIndex) {
  if (weekIndex == 2) {
    document.body.style.background = "#99CCFF"
  } else {
    document.body.style.background = "#CCFFFF";
  }
  document.getElementById("weekNo").innerHTML = "Vecka " + meny.weeks[weekIndex].week;
  for (var i = 0; i < days.length; i++) {
    document.getElementById(days[i] + "dateday").innerHTML = days[i];
    document.getElementById(days[i] + "datedate").innerHTML = meny.weeks[weekIndex].days[i].date;
    if (meny.weeks[weekIndex].days[i].items) {
      for (var j = 0; j < meny.weeks[weekIndex].days[i].items.length; j++) {
        document.getElementById(days[i] + "meal").innerHTML = meny.weeks[weekIndex].days[i].items[j];
        document.getElementById(days[i] + "meal").innerHTML += "<br />";
      }
    } else if (meny.weeks[weekIndex].days[i].reason) {
     document.getElementById(days[i] + "meal").innerHTML = meny.weeks[weekIndex].days[i].reason;
    }
  }
}
function skola_vald () {
  skola = kommun.listOfSchools[this.skola];
  weekIx = 2;
  display_meny_page();
  function reqListener () {
    console.log("got response2");
    console.log(this.responseText);
    meny = JSON.parse(this.responseText);
    display_meny(weekIx);
    detectSwipe();
  }
  console.log("got to get matsedel");
  var oReq = new XMLHttpRequest({mozSystem: true});
  oReq.onload = reqListener;
  oReq.open("get", skola.url + "?fmt=json&v=2&limit=5&offset=-2", true);
  oReq.send();

}
function display_skolor () {
  clear();
  console.log("kommun vald");
  backbutton = new Image();
  backbutton.src = "back.png";
  backbutton.addEventListener("click", display_kommuner);
  document.getElementById("header_left").appendChild(backbutton);
  var textnode = document.createTextNode(kommun.name);
  document.getElementById("header_center").appendChild(textnode);
  document.getElementById("header_center").appendChild(document.createElement("br"));
  var logo = new Image();
  logo.src = kommun.listOfSchools[0].logo_url;
  document.getElementById("header_right").appendChild(logo);

  var anchor = document.getElementById("main");
  for (var index in kommun.listOfSchools) {
    console.log("another skola");
    var node=document.createElement("LI");
    var btn=document.createElement("input");
    btn.type = "button";
    btn.value = kommun.listOfSchools[index].name;
    btn.id = "mainbtn";
    btn.skola = index;
    btn.addEventListener("click", skola_vald);
    node.appendChild(btn);
    anchor.appendChild(node);
  }

}
function kommun_vald () {
  kommun.listOfSchools = lan.listOfKommuner[this.kommun];
  kommun.name = this.value;
  display_skolor();
}
function display_kommuner () {
  clear();
  console.log("län valt");
  backbutton = new Image();
  backbutton.src = "back.png";
  backbutton.addEventListener("click", display_lan);
  document.getElementById("header_left").appendChild(backbutton);
  var textnode = document.createTextNode(lan.name);
  document.getElementById("header_center").appendChild(textnode);
  document.getElementById("header_center").appendChild(document.createElement("br"));
  var logo = new Image();
  logo.src = "mat90.png";
  document.getElementById("header_right").appendChild(logo);
  var anchor = document.getElementById("main");
  for (var index in lan.listOfKommuner) {
    console.log("another kommun");
    var node=document.createElement("LI");
    btn=document.createElement("input");
    btn.type = "button";
    btn.value = index;
    btn.kommun = index;
    btn.id = "mainbtn";
    btn.addEventListener("click", kommun_vald);
    node.appendChild(btn);
    anchor.appendChild(node);
  }

}
function lan_valt () {
  lan.listOfKommuner = resultat.provinces[this.lan];
  lan.name = this.value;
  display_kommuner();
}
function display_lan () {
  clear();
  var logo = new Image();
  logo.src = "mat90.png";
  document.getElementById("header_right").appendChild(logo);
  var anchor = document.getElementById("main");
  for (var index in resultat.provinces) {
    var node=document.createElement("LI");
    var btn=document.createElement("input");
    btn.type = "button";
    btn.value = index;
    btn.id = "mainbtn";
    btn.lan = index;
    btn.addEventListener("click", lan_valt);
    node.appendChild(btn);
    anchor.appendChild(node);
  }
}

function start () {
  function reqListener () {
    console.log("got response");
    console.log(this.responseText);
    resultat = JSON.parse(this.responseText);
    display_lan();
  }
  console.log("got to get json");
  var oReq = new XMLHttpRequest({mozSystem: true});
  oReq.onload = reqListener;
  oReq.open("get", "http://meny.dinskolmat.se/?fmt=json", true);
  oReq.send();
}
window.addEventListener('load', start);