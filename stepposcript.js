var resultat;
var lan = new Object();
var kommun = new Object();
var skola = new Object();
var days = ["Mån", "Tis", "Ons", "Tors", "Fre"];
var meny;
var backbutton;


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
function display_meny () {
  clear();
  console.log("skola vald");
  backbutton = new Image();
  backbutton.src = "back.png";
  backbutton.addEventListener("click", display_skolor);
  document.getElementById("header_left").appendChild(backbutton);
  var textnode = document.createTextNode(skola.name);
  document.getElementById("header_center").appendChild(textnode);
  document.getElementById("header_center").appendChild(document.createElement("br"));
  textnode = document.createTextNode(kommun.name);
  document.getElementById("header_center").appendChild(textnode);
  document.getElementById("header_center").appendChild(document.createElement("br"));
  function reqListener () {
    console.log("got response2");
    console.log(this.responseText);
    meny = JSON.parse(this.responseText);
    textnode = document.createTextNode("Meny vecka " + meny.weeks[2].week );
    document.getElementById("header_center").appendChild(textnode);
    var logo = new Image();
    logo.src = kommun.listOfSchools[0].logo_url;
    document.getElementById("header_right").appendChild(logo);
    var anchor = document.getElementById("main");
    for (var i = 0; i < 5; i++) {
      anchor.innerHTML += days[i] + " " + meny.weeks[2].days[i].date + ": ";
      if (meny.weeks[2].days[i].item) {
        anchor.innerHTML += meny.weeks[2].days[i].item;
      } else if (meny.weeks[2].days[i].reason) {
        anchor.innerHTML += meny.weeks[2].days[i].reason;
      }
      anchor.innerHTML += "<br />";
    }
  }
  console.log("got to get matsedel");
  var oReq = new XMLHttpRequest({mozSystem: true});
  oReq.onload = reqListener;
  oReq.open("get", skola.url + "?fmt=json&v=2&limit=5&offset=-2", true);
  oReq.send();

}
function skola_vald () {
  skola = kommun.listOfSchools[this.skola];
  display_meny();
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