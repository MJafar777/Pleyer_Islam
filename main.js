"use strict";

// sellecting elements
let box__Left = document.querySelector(".box__Left");
let Suralar = document.querySelector(".Suralar");
let yozuvKurinish = document.querySelector(".yozuvKurinish");

let ArrBox = [];

const fetchFunc = async function () {
  let a = 1;
  let b = 114;
  let nomi = await fetch(`https://api.quran.sutanlab.id/surah`);
  let nomiJson = await nomi.json();
  let uzb = await fetch(
    `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/uzb-alaaudeenmansou.json`
  );
  let uzbJson = await uzb.json();

  for (let i = a; i <= b; i++) {
    let b = await fetch(`https://api.quran.sutanlab.id/surah/${i}`);
    let bJson = await b.json();
    ArrBox.push(bJson);
    renderFunc(bJson.data, uzbJson.quran, nomiJson.data);
  }
};
fetchFunc();
let findEl;
const renderFunc = (obj, uzb, nomi) => {
  let uzbArr = uzb.filter((val) => {
    return val.chapter == obj.number;
  });
  Suralar.innerHTML = "";
  nomi.forEach((val) => {
    let div = document.createElement("div");
    let p1 = document.createElement("p");
    console.log(val);
    p1.textContent = val.number;
    p1.classList.add("num");
    let p2 = document.createElement("p");
    let p3 = document.createElement("p");
    p3.textContent = val.name.long;
    p3.classList.add("nomi");

    p2.textContent = val.name.transliteration.en;
    p2.classList.add("nomi");
    div.classList.add("card");
    div.id = `${val.name.transliteration.en}`;
    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(p3);

    Suralar.append(div);
    div.addEventListener("click", () => {
      yozuvKurinish.innerHTML = "";
      findEl = div.id;
      let filter = ArrBox.find((val) => {
        return val.data.name.transliteration.en == findEl;
      });
      for (let i = 1; i < ArrBox.length; i++) {
        let parag = ` <p class="manolri">${filter.data.verses[i].text.arab}</p>
        <p class="manolri">${filter.data.verses[i].text.transliteration.en}</p>
        <p class="tafsiv">Tafsiv</p>
        <p class="manolri2">${filter.data.verses[i].translation.en}</p>
        <p class="manolri2">${uzbArr[i] ? uzbArr[i].text : ""}</p>
        <audio id="player"  controls class="audio">
             <source src="${
               filter.data.verses[i].audio.secondary[0]
             }" type="audio/ogg">
             <source src="${
               filter.data.verses[i].audio.secondary[0]
             }" type="audio/mpeg">
           </audio>`;
        yozuvKurinish.insertAdjacentHTML("beforeend", parag);
      }
      var x = 0;
      var music = document.getElementById("player");
      $("#player").bind("ended", function () {
        x = x + 1;
        music.src = (x % 4) + "/ogg";
        music.load();
        music.play();
      });
    });
  });
};
