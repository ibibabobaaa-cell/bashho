var P=[
["🍌","Бананы","Фрукты",129,"кг","#FFF1B8"],["🍅","Помидоры","Овощи",189,"кг","#FFD3CB"],["🥒","Огурцы","Овощи",149,"кг","#D6F2C2"],
["🍎","Яблоки","Фрукты",119,"кг","#FFD9D2"],["🥕","Морковь","Овощи",59,"кг","#FFE0B8"],["🍇","Виноград","Фрукты",249,"кг","#E6D6F7"],
["🫖","Электрочайник 1,7 л","Бытовая техника",1990,"шт","#D8E8F5"],["🥤","Блендер 600 Вт","Бытовая техника",3490,"шт","#F8D8E6"],
["📻","Микроволновка 20 л","Бытовая техника",5990,"шт","#DDE3E8"],["🧹","Пылесос 1800 Вт","Бытовая техника",8990,"шт","#D5EFEA"]];
var cart={},cat="Все",fmt=function(n){return n.toLocaleString("ru-RU")};
function card(p,i){return '<div class="card"><div class="pic" style="background:'+p[5]+'">'+p[0]+'</div><div class="in"><h3>'+p[1]+'</h3><small>'+p[2]+'</small><div class="row"><div class="price">'+fmt(p[3])+' ₽ <i>/ '+p[4]+'</i></div><button class="add" onclick="add('+i+')" aria-label="В корзину: '+p[1]+'">+</button></div></div></div>'}
function draw(){
 var cs=["Все","Овощи","Фрукты","Бытовая техника"];
 document.getElementById("tabs").innerHTML=cs.map(function(c){return '<button class="'+(c==cat?'on':'')+'" onclick="cat=\''+c+'\';draw()">'+c+'</button>'}).join("");
 document.getElementById("grid").innerHTML=P.map(function(p,i){return(cat=="Все"||p[2]==cat)?card(p,i):""}).join("");
 document.getElementById("hits").innerHTML=[1,0,2,7].map(function(i){return card(P[i],i)}).join("");
}
function sum(){var c=0,s=0;for(var k in cart){c+=cart[k];s+=cart[k]*P[k][3]}return[c,s]}
function zone(){return [150,250,400][+document.querySelector('input[name=z]:checked').value]}
function upd(){
 var t=sum(),fee=t[1]>=3000?0:zone();
 cnt.textContent=t[0];tot.textContent=fmt(t[1]);dCnt.textContent=t[0];dSum.textContent=fmt(t[1]);
 grand.textContent=fmt(t[1]+(t[0]?fee:0));
 free.textContent=t[1]>=3000?"Доставка бесплатная":"До бесплатной доставки: "+fmt(Math.max(0,3000-t[1]))+" ₽";
}
function add(i){cart[i]=(cart[i]||0)+1;upd()}
document.getElementById("zones").addEventListener("change",upd);
var ACCESS_KEY=""; // ключ с web3forms.com, приходит на вашу почту
f.addEventListener("submit",function(e){e.preventDefault();
 var t=sum();
 if(!t[0]){show("Корзина пуста. Добавьте товары в каталоге.");return}
 var fee=t[1]>=3000?0:zone();
 var list=Object.keys(cart).map(function(k){return"• "+P[k][1]+" — "+cart[k]+" × "+P[k][3]+" ₽"}).join("\n");
 var data={access_key:ACCESS_KEY,subject:"Новый заказ «Башхо» на "+(t[1]+fee)+" ₽",from_name:"Сайт Башхо",
  "Имя":nm.value,"Телефон":ph.value,"Адрес":ad.value,"Время":tm.value,
  "Товары":list,"Сумма товаров":t[1]+" ₽","Доставка":fee+" ₽","Итого":(t[1]+fee)+" ₽"};
 if(!ACCESS_KEY){show("Демо-режим: впишите ACCESS_KEY в script.js, чтобы заказы приходили на почту.");return}
 var b=f.querySelector("button");b.disabled=true;
 fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(data)})
 .then(function(r){return r.json()})
 .then(function(r){if(!r.success)throw 0;show("Спасибо, "+nm.value+"! Заказ принят, курьер позвонит на "+ph.value+".");cart={};upd();f.reset()})
 .catch(function(){show("Не удалось отправить заказ. Позвоните нам или попробуйте ещё раз.")})
 .then(function(){b.disabled=false})});
function show(m){ok.style.display="block";ok.textContent=m}
function route(){
 var h=(location.hash||"#home").slice(1);if(!document.getElementById(h))h="home";
 document.querySelectorAll(".page").forEach(function(s){s.classList.toggle("on",s.id==h)});
 document.querySelectorAll("#nav a").forEach(function(a){a.classList.toggle("on",a.getAttribute("href")=="#"+h)});
 scrollTo(0,0);
}
addEventListener("hashchange",route);draw();upd();route();
