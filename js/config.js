/* =========================================================
   ✏️  SIRF YE FILE EDIT KARNI HAI
   Naam, password, captions, gaane, note — sab yahin se badlo.
   Photo/video ka path wahi rakho jo neeche likha hai,
   ya apni file ka naam yahan likh do.
   ========================================================= */

window.CONFIG = {
  name: "Nishu",
  from: "Aman",                       // letter ke end mein signature

  // 🔐 Password (chhote/bade letters se farak nahi padta)
  password: "nishu",                  // ✏️ ise badal do — jaise "1405" (special date)
  passwordHint: "Hint: tumhara naam 😜", // ✏️ password badla to hint bhi badlo

  // 🎂 Birthday date (YYYY-MM-DD). Agar date aage hai to countdown dikhega.
  birthday: "",                       // ✏️ jaise "2026-11-05" — khaali chhodo to countdown nahi

  heroLine: "Duniya ki sabse pyaari ladki ko janamdin mubarak ❤️",

  /* ---------------- 🎵 GAANE ----------------
     Har section ka apna gaana hai. Scroll karte hi gaana badal jata hai.
     mp3 files "assets/music/" folder mein inhi naamon se daalo. */
  songs: {
    hero:     { file: "assets/music/hbd-meme.m4a",                title: "Aaaa Happy Birthday To You 🤣" },
    timeline: { file: "assets/music/chalte-chalte.m4a",           title: "Chalte Chalte Yun Hi Koi Mil Gaya Tha" },
    bholi:    { file: "assets/music/voh-dekhne-mein.m4a",         title: "Voh Dekhne Mein — Ali Zafar" },
    videos:   { file: "assets/music/offcampus-reconnect.m4a",     title: "When you both reconnect again 💛" },
    thennow:  { file: "assets/music/kal-chaudhvin.m4a",           title: "Kal Chaudhvin Ki Raat — Jagjit Singh" },
    swipe:    { file: "assets/music/pal-pal-dil-ke-paas.m4a",     title: "Pal Pal Dil Ke Paas — Kishore Kumar" },
    tuhotoh:  { file: "assets/music/tu-ho-toh.m4a",               title: "Tu Ho Toh 🤌" },
    reasons:  { file: "assets/music/suno-na.m4a",                 title: "Suno Na Suno Na — Chalte Chalte" },
    quiz:     { file: "assets/music/offcampus-black-yellow.m4a",  title: "Always black & yellow 💛" },
    cake:     { file: "assets/music/chaka-chak.m4a",              title: "Chaka Chak — Atrangi Re" },
    letter:   { file: "assets/music/mere-khayalon-ki-malika.m4a", title: "Mere Khayalon Ki Malika — Abhijeet" },
  },

  /* ---------------- 😜 FUNNY STICKER ("8 Saal Ka Safar" wali pehli slide pe) ----------------
     Sticker pe tap karne se ye lines ek-ek karke aati hain. Apni marzi se badlo/badhao. */
  stickerLines: [
    "Oye! Mujhe tap karo 👆😜",
    "Duck face wali Nishu 🦆",
    "Ye chashma meri jaan hai 🌼😎",
    "9wa saal bhi jhelna padega 😝",
    "Main cute hoon, pata hai 😌",
    "Aage badho na, kya dekh rahe ho! 🙈",
  ],

  /* ---------------- 📅 8 SAAL KA SAFAR ----------------
     Har saal ki photos: assets/photos/2018/1.jpg, 2.jpg, 3.jpg ...
     Photos zyada/kam ho to list mein add/remove kar do. */
  timeline: [
    { year: 2018, title: "Jahan se sab shuru hua",       caption: "Pata hi nahi tha ki ek din tum meri poori duniya ban jaogi.", photos: ["assets/photos/2018/1.jpg", "assets/photos/2018/2.jpg", "assets/photos/2018/3.jpg"] },
    { year: 2019, title: "Dosti se kuch zyada",          caption: "Baatein lambi hone lagi, aur raatein chhoti.",                 photos: ["assets/photos/2019/1.jpg", "assets/photos/2019/2.jpg", "assets/photos/2019/3.jpg"] },
    { year: 2020, title: "Door reh ke bhi paas",         caption: "Har din tumhari ek awaaz ka intezaar.",                       photos: ["assets/photos/2020/1.jpg", "assets/photos/2020/2.jpg", "assets/photos/2020/3.jpg"] },
    { year: 2021, title: "Saath mein badhte hue",        caption: "Tum badi hoti gayi, aur pyaar bhi.",                           photos: ["assets/photos/2021/1.jpg", "assets/photos/2021/2.jpg", "assets/photos/2021/3.jpg"] },
    { year: 2022, title: "Hasi, jhagde aur pyaar",       caption: "Roothna-manana bhi humara favourite game ban gaya.",          photos: ["assets/photos/2022/1.jpg", "assets/photos/2022/2.jpg", "assets/photos/2022/3.jpg"] },
    { year: 2023, title: "Har din tumhare naam",         caption: "Tumhari smile mera sabse bada sukoon.",                       photos: ["assets/photos/2023/1.jpg", "assets/photos/2023/2.jpg", "assets/photos/2023/3.jpg"] },
    { year: 2024, title: "Aur bhi khoobsurat",           caption: "Har saal tum aur pyaari ho jaati ho, ye kaise karti ho?",     photos: ["assets/photos/2024/1.jpg", "assets/photos/2024/2.jpg", "assets/photos/2024/3.jpg"] },
    { year: 2025, title: "Pakki wali jodi",              caption: "Ab tum sirf meri aadat nahi, meri zaroorat ho.",              photos: ["assets/photos/2025/1.jpg", "assets/photos/2025/2.jpg", "assets/photos/2025/3.jpg"] },
    { year: 2026, title: "Aaj — tumhara din ✨",          caption: "8 saal baad bhi dil wahi kehta hai: sirf tum.",              photos: ["assets/photos/2026/1.jpg", "assets/photos/2026/2.jpg", "assets/photos/2026/3.jpg"] },
  ],

  /* ---------------- 🌟 SPECIAL PHOTOS (apne gaane ke saath) ---------------- */
  spotlights: {
    bholi:   { photo: "assets/photos/special/bholi.jpg",     song: "bholi",   line: "Dekhne mein kitni bholi bhali…", sub: "…aur dil chura ke le gayi 😌" },
    tuhotoh: { photo: "assets/photos/special/tu-ho-toh.jpg", song: "tuhotoh", line: "Tu ho toh…",                     sub: "sab kuch hai mere paas ❤️" },
  },

  /* ---------------- 🎬 GROW-UP VIDEOS ----------------
     Option 1 (file):    { src: "assets/videos/1.mp4", caption: "..." }
     Option 2 (YouTube): { youtube: "VIDEO_ID", vertical: true, caption: "..." }
     (bade videos YouTube pe "Unlisted" daal ke ID yahan likh do) */
  videos: [
    { src: "assets/videos/1.mp4", caption: "Chhoti si Nishu 🧸" },
    { src: "assets/videos/2.mp4", caption: "School wali Nishu 🎒" },
    { src: "assets/videos/3.mp4", caption: "Thodi badi ho gayi 🌸" },
    { src: "assets/videos/4.mp4", caption: "Aur ab — meri jaan ❤️" },
  ],

  /* ---------------- ⇆ TAB vs AB ---------------- */
  thenNow: {
    then: "assets/photos/special/then.jpg", thenLabel: "Tab 🧸",
    now:  "assets/photos/special/now.jpg",  nowLabel:  "Ab 👑",
  },

  /* ---------------- 📸 SWIPE PHOTOS ---------------- */
  swipe: [
    { photo: "assets/photos/swipe/1.jpg", caption: "Ye wali smile 😍" },
    { photo: "assets/photos/swipe/2.jpg", caption: "Uff ye aankhein" },
    { photo: "assets/photos/swipe/3.jpg", caption: "Meri favourite photo" },
    { photo: "assets/photos/swipe/4.jpg", caption: "Pagal 😂" },
    { photo: "assets/photos/swipe/5.jpg", caption: "Queen 👑" },
    { photo: "assets/photos/swipe/6.jpg", caption: "Ye din yaad hai?" },
    { photo: "assets/photos/swipe/7.jpg", caption: "Cutie pie 🥹" },
    { photo: "assets/photos/swipe/8.jpg", caption: "Sabse pyaari ❤️" },
  ],

  /* ---------------- 💌 REASONS (chhote rakhna) ---------------- */
  reasons: [
    "Tumhari hasi — sab theek kar deti hai",
    "Gussa karke bhi 'khana khaya?' poochna",
    "Tumhari aankhein, seedha dil tak",
    "Mere bure din mein tumhara saath",
    "Meri bakwaas bhi dhyan se sunna",
    "Tumhari pagalpanti 😂",
    "8 saal baad bhi wahi butterflies 🦋",
    "Tumhare saath chup rehna bhi achha lagta hai",
    "Tum mujhe behtar insaan banati ho",
    "Tumhara woh 'suno na…' bolna",
    "Har photo mein tum hi cute lagti ho",
    "Kyunki tum, tum ho ❤️",
  ],

  /* ---------------- 🎮 QUIZ ----------------
     answer = sahi option ka number (0 = pehla, 1 = doosra, ...)
     ✏️ Pehle 2 sawaalon ke options/jawab apne hisaab se badlo! */
  quiz: [
    { q: "Humari pehli mulaqat kahan hui thi?",          options: ["College / School", "Coaching", "Dost ke through", "Online 😜"], answer: 0 },
    { q: "Humari pehli date pe kya khaya tha?",          options: ["Pizza 🍕", "Momos 🥟", "Gol gappe", "Yaad nahi 🙈"],         answer: 1 },
    { q: "Mujhe tumhari kaunsi cheez sabse pasand hai?", options: ["Tumhari hasi", "Tumhara gussa 😤", "Tumhari baatein", "Sab kuch ❤️"], answer: 3, right: "Bilkul sahi! Sab kuch 😌" },
    { q: "Main tumse kitna pyaar karta hoon?",           options: ["Bahut", "Bahut zyada", "Infinity ♾️", "Infinity se bhi zyada"], answer: 3, right: "Haan, utna hi ❤️" },
    { q: "Duniya ki sabse cute ladki kaun hai?",         options: ["Koi aur", "Pata nahi", "Nishu 👑", "Sochna padega 🤔"],       answer: 2, right: "Obviously tum hi 😍" },
  ],

  candles: 5,

  /* ---------------- ✉️ LAST NOTE ----------------
     Apna note yahan likho (backticks ` ` ke andar). Enter se nayi line. */
  letter: `Meri pyaari Nishu,

Happy Birthday meri jaan ❤️

8 saal pehle jab tum meri zindagi mein aayi thi, tab socha bhi nahi tha ki ek din tum hi meri poori duniya ban jaogi. In saalon mein humne kitna kuch saath dekha — hasi, jhagde, roothna-manana, door rehna, phir paas aana… aur har baar tumne mera haath aur kaske pakda.

Tumhari ek smile se mera poora din ban jata hai. Tumhari choti choti baatein, tumhara pagalpan, tumhara "suno na" bolna — sab kuch mujhe bahut pyaara hai.

Thank you mujhe itna pyaar karne ke liye, mujhe samajhne ke liye, aur hamesha saath rehne ke liye. Promise karta hoon — har birthday, har din, har pal main tumhare saath rahunga.

Bas aise hi hasti raho, muskurati raho… kyunki tu ho toh sab kuch hai.

Happy Birthday once again 🎂✨`,
};
