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
    seene:    { file: "assets/music/seene-se-lag-jao.m4a",        title: "Chal Wahan Jaate Hain 💞 (Seene se tum aake lag jao na) — Arijit Singh" },
    roothna:  { file: "assets/music/pal.m4a",                     title: "Pal 💞 — Arijit Singh, Shreya Ghoshal" },
    college:  { file: "assets/music/milne-lage-dil.m4a",          title: "Milne Lage Dil 💞" },
    y2025:    { file: "assets/music/saath-2025.m4a",             title: "Dil Kya Kare ❤️ — Kishore Kumar" },
    y2024:    { file: "assets/music/saath-2024.m4a",             title: "Romance is ok… but this feeling 💓" },
    y2023:    { file: "assets/music/saath-2023.m4a",             title: "Varoon Forvere 💘" },
    y2021:    { file: "assets/music/saath-2021-b.m4a",           title: "Chalrey Chalrey Waal 💘" },
    covid:    { file: "assets/music/tu-chahiye.m4a",              title: "Tu Chahiye 💞 — Atif Aslam" },
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
     Photos zyada/kam ho to list mein add/remove kar do.
     Kisi bhi saal mein ye extra cheezein daal sakte ho (2018 mein sab hain, wahi dekh lo):
       song:    us saal ka alag gaana (upar "songs" ka naam)
       journey: true  → 🏍️ "safar shuru" wali road
       meme:    { no: "...", yes: "..." } → 🙅 / 😍 wala meme
       firstPhoto: { src: "...jpg", say: "...", label: "..." } → side mein poori photo (polaroid) + bolne wala bubble
       game:    { title, say, hint, viruses, cutouts:[{src,say}], win } → "Covid bhagao" mini game (2020 mein dekho)
       mana:    { title, say, hint, rooth, happy, win, actions:[{icon,label,gain,lines}], tease, taps } → "Roothna-manana" interactive (2022 mein dekho)
       calendar:{ title, say, hint, win, praise, mascot:{src,lines}, months:[{m,src,cap,pos}] } → 12 mahine ka "Smile Calendar" (2023 mein dekho)
       love:    { title, say, hint, win, praise, couple:{src,lines}, levels:[{src,title,cap,pos}] } → dil ke shape wala "Love Level Up" (2024 mein dekho)
       battery: { title, device, start, say, charger, couple, needs:[{aadat,zaroorat}], charging, leaving, win } → "Aadat se Zaroorat" battery interactive (2025 mein dekho)
       jars:    { title, say, hint, days, finalText, win, jars:[{name,color,emoji,items:[{e,t}]}] } → "8 Saal Ka Hisaab" shishe wala interactive (2026 mein dekho)
       grow:    { src, say, btn, meters, steps, hint } → tap karne pe badi hone wala interactive cutout (2021 mein dekho)
       cutout:  { src: "...png", say: "..." } → side mein background hata hua photo + bolne wala bubble
       photos:  "file.jpg" ya { src: "file.jpg", cap: "photo ke neeche likhna", fit: "contain" (poori photo dikhe), cutout: true (background hata hui png, bina frame ke), wide: true (landscape photo, poori chaudai mein), span: true / stick: "🎓" (collage mein poori chaudai / emoji sticker), pos: "50% 15%" (lambi photo ka kaunsa hissa dikhe — chehra kat raha ho to isse upar/neeche khiskao) } */
  timeline: [
    {
      year: 2018, title: "Jahan se sab shuru hua",
      caption: "Pata hi nahi tha ki Golu bhaiya se kab Goluuuu ban gaya… jaha bhagwan se mangi hui achi ladki ki dua aur aap mil gaye",
      song: "seene",
      journey: true,
      firstPhoto: { src: "assets/photos/2018/first.jpg", say: "Ek Celebrations ka dabba… aur safar shuru 🍫🏍️", label: "Humari pehli photo 📸" },
      photos: [
        { src: "assets/photos/2018/watch.png", cutout: true },
        { src: "assets/photos/2018/3.jpg", cap: "Madam ka pout 😗 vs Golu ka swag 😎" },
        { src: "assets/photos/2018/4.jpg", cap: "Khir ki photo nahi hai 😜" },
        { src: "assets/photos/2018/5.jpg", cap: "Papa ka meme of the year 😂", fit: "contain" },
      ],
    },
    {
      year: 2019, title: "Dosti se kuch zyada",
      caption: "Baatein lambi hone lagi, aur raatein chhoti. College ke din, roz milna, paise na hote hue bhi saath ghoomna — crazy din. Center Park, GVD ki coffee, Nehru Park, Chasta Cafe… what a year! 🎓☕",
      song: "college",
      collage: true,   // scrapbook look: tedhi/chadhi hui photos, tape, stickers, meme (tukde yahin se badlo/hatao)
      photos: [
        { src: "assets/photos/2019/1.jpg", span: true, stick: "🎓" },
        { src: "assets/photos/2019/2.jpg", stick: "💖" },
        "assets/photos/2019/3.jpg",
        { note: "Center Park 🌳", tone: "yellow" },
        { src: "assets/photos/2019/4.jpg", stick: "😎" },
        "assets/photos/2019/5.jpg",
        // 🎭 Drake meme (apni photos ke saath): yes: true = approve wala panel
        { meme: "drake", rows: [
          { src: "assets/photos/2019/2.jpg", pos: "50% 40%", text: "Paise aane ka wait karna 💸", yes: false },
          { src: "assets/photos/2019/4.jpg", pos: "50% 35%", text: "Jeb khaali, phir bhi Center Park chalo 😎", yes: true },
        ] },
        "assets/photos/2019/6.jpg",
        { note: "GVD ki coffee ☕", tone: "pink" },
        { src: "assets/photos/2019/7.jpg", stick: "✨" },
        "assets/photos/2019/8.jpg",
        { note: "Nehru Park 🌿", tone: "green" },
        { src: "assets/photos/2019/9.jpg", stick: "📚" },
        // 📒 Attendance register: pct = bar kitni bhari (0-100)
        { bunk: { title: "Attendance register 📒", rows: [
          { label: "Lecture attendance", pct: 9, emoji: "😴" },
          { label: "Jeb mein paise", pct: 4, emoji: "💸" },
          { label: "Saath ghoomna", pct: 100, emoji: "😎💯" },
        ] } },
        "assets/photos/2019/10.jpg",
        { src: "assets/photos/2019/11.jpg", stick: "🤪" },
        { note: "Chasta Cafe ✨", tone: "blue" },
        { src: "assets/photos/2019/12.jpg", span: true, stick: "💞" },
      ],
    },
    {
      year: 2020, title: "Door reh ke bhi paas",
      caption: "Covid ka time… ghar pe game khelna, aur milna mask ke saath 😷🎮",
      song: "covid",
      game: {
        title: "Covid bhagao! 🦠💉",
        say: "Virus pe tap karo! 🦠",
        hint: "virus pe tap karo… ya seedha vaccine 💉 lagao, sanitizer 🧴 se 3 virus bhi maar sakte ho",
        viruses: 8,
        cutouts: [
          { src: "assets/photos/2020/mask-girl.png", say: "Mask mein bhi itni cute? 😷" },
          { src: "assets/photos/2020/mask-couple.png", say: "Mask ke saath hi sahi, milna to tha 😷❤️" },
        ],
        win: "Covid khatam! 🎉 Ab mask utaro, milna hai 🥰",
      },
      photos: [
        { src: "assets/photos/2020/1.jpg", pos: "50% 30%" },
        { src: "assets/photos/2020/2.jpg", fit: "contain" },
        { src: "assets/photos/2020/4.jpg", pos: "50% 25%" },
        { src: "assets/photos/2020/6.jpg", pos: "50% 20%" },
      ],
    },
    {
      year: 2021, title: "Saath mein badhte hue",
      song: "y2021",
      caption: "Tum badi hoti gayi, moti bhi… aur pyaar bhi. Kitni pyaari ho, bata pana mushkil hai 😍",
      meme: { no: "Dubli Nishu", yes: "Moti Nishu ❤️" },
      grow: {
        src: "assets/photos/2021/grow.png",
        say: "Main to badi ho gayi 😎 (tap karo!)",
        btn: "🍔 Khana khilao",
        meters: ["Badi hui 📏", "Moti bhi 🍩", "Pyaar ❤️"],
        steps: ["Ek samosa aur… 🥟", "Aaj to pizza hi pizza 🍕", "Waffle bhi chalega 🧇", "Thodi si badi ho gayi 😋", "Ab to kapde tight 😅", "Aur bhi pyaari lag rahi ho 🥰", "Bas bas! Par pyaar ka kya? 💞", "Pyaar to infinity ♾️ hi rahega ❤️"],
        hint: "pyaar-meter ko ∞ tak le jao 👇",
      },
      photos: [
        { src: "assets/photos/2021/hug.png", cutout: true },
        "assets/photos/2021/1.jpg",
        { src: "assets/photos/2021/2.jpg", cap: "Hero-Heroine 🎬" },
        "assets/photos/2021/3.jpg",
        { src: "assets/photos/2021/4.jpg", cap: "Parchhai bhi saath hai 🌗" },
        { src: "assets/photos/2021/5.jpg", cap: "Moti hoti Nishu 🍩" },
        { src: "assets/photos/2021/6.jpg", cap: "Cute Nishu 🥰" },
      ],
    },
    {
      year: 2022, title: "Hasi, jhagde aur pyaar",
      caption: "Roothna-manana bhi humara favourite game ban gaya.",
      song: "roothna",
      mana: {
        title: "Roothi Nishu ko manao 😤➜🥰",
        say: "Nishu rooth gayi hai 😤 Manao use!",
        hint: "gusse ka meter 100% karo… par chhedna mat 😜",
        rooth: "assets/photos/2022/rooth.png",
        happy: "assets/photos/2022/hug-hoodie.png",
        win: "Maan gayi! 🥰 Ab ek tight hug do 🤗",
        winLabel: "Maan gayi 🥰",
        after: "Maan to gayi… ab aur kitna manaoge 🥰",
        actions: [
          { icon: "🍫", label: "Chocolate", gain: 24, lines: ["Chocolate le li… par baat abhi band hai 😒🍫", "Hmm… ye wala achha hai 🍫", "Ek aur de do, phir sochti hoon 😋"] },
          { icon: "🌹", label: "Phool", gain: 20, lines: ["Phool? Filmy mat bano 🙄🌹", "Achha… thodi si smile aa gayi 🙂", "Phool achha hai, par chocolate zyada 😝"] },
          { icon: "🥺", label: "Sorry", gain: 14, lines: ["Sorry bolne se kya hoga? Phir bolo 🥺", "Aankhein chhoti karke bol rahe ho? Cute lag rahe ho 😒", "Theek hai theek hai… maaf kiya (thoda sa) 🙂"] },
          { icon: "🤗", label: "Hug", gain: 30, lines: ["Hug? Door raho… achha thoda paas aao 🤏", "Hug se pighal gayi 🥹", "Ab to bilkul pighal gayi 🤗"] },
        ],
        tease: { icon: "😜", label: "Chhedo", lose: 25, lines: ["Tune phir chheda?! 😤", "Ab to baat hi nahi karni 🙅‍♀️", "Hmph! 😠 Mooh pher liya"] },
        taps: {
          angry: ["Haath mat lagao! 😤", "Mooh phera hai, dikh nahi raha? 🙄", "Baat nahi karni! 😠"],
          mid: ["Hmm… ab bolo 😒", "Thoda sa gussa baaki hai 🙂"],
          happy: ["Hehe 😘", "Ab kya? 🥰", "Itna kya dekh rahe ho 🙈"],
        },
      },
      photos: [
        { src: "assets/photos/2022/1.jpg", pos: "50% 25%", cap: "Kaam ke beech bhi ek smile 😏💻" },
        { src: "assets/photos/2022/hug-door.png", cutout: true, cap: "Itne din baad mile to seedha hug 🤗" },
        { src: "assets/photos/2022/3.jpg", pos: "50% 20%", cap: "Chashme wali cutie 🤓" },
        { src: "assets/photos/2022/4.jpg", pos: "50% 25%", cap: "Raat, rooftop aur tum 🌃", stick: "🌙" },
        { src: "assets/photos/2022/5.jpg", pos: "50% 25%", cap: "Aankhein badi karke gussa? 👀" },
        { src: "assets/photos/2022/6.jpg", cap: "Roothi thi… cake ne mana liya 🍫", stick: "🍰" },
        { src: "assets/photos/2022/7.jpg", pos: "50% 25%", cap: "Video call wali Nishu 📱 (neeche main bhi hoon 😄)", stick: "📱" },
        { src: "assets/photos/2022/8.jpg", pos: "50% 25%", cap: "Sabse pyaari wali photo 💙", stick: "💙" },
        { src: "assets/photos/2022/9.jpg", pos: "50% 30%", cap: "Selfie meri, nazar sab ki Nishu pe 😎" },
        { src: "assets/photos/2022/red-couple.png", cutout: true, cap: "Lal kurte mein meri Nishu ❤️" },
        { src: "assets/photos/2022/11.jpg", pos: "50% 30%", cap: "Gusse ka antidote: ek tight hug 🤗" },
        { src: "assets/photos/2022/12.jpg", pos: "50% 20%", cap: "Coffee peeche, nazar kisi aur pe 👀☕", stick: "☕" },
      ],
    },
    {
      year: 2023, title: "Har din tumhare naam",
      song: "y2023",
      caption: "Tumhari smile mera sabse bada blessing hai 🙏 Kya saal tha ye — har mahine ki ek photo ✨",
      calendar: {
        title: "Smile Calendar 2023 🙏",
        say: "Kisi bhi mahine pe tap karo ✨",
        hint: "saare 12 mahine kholo… har ek mein ek nayi smile hai 🙏",
        win: "Saare 12 mahine! Tumhari smile mera sabse bada blessing 🙏❤️",
        praise: ["Wah! Ye wali to meri favourite 😍", "Smile ne din bana diya ☀️", "Itni pyaari kaise lagti ho? 🥹", "Blessing mil gayi 🙏", "Ek aur smile, ek aur khushi 🌸"],
        mascot: { src: "assets/photos/2023/mascot.png", lines: ["Main to bas photo dekhne aayi thi 😌", "Tum bhi ek smile do na 😊", "Aur kholo, aur kholo 📅", "Saal bhar ki smile yahin hai 🌸"] },
        months: [
          { m: "Jan", src: "assets/photos/2023/1.jpg", cap: "Mere haath, tumhara sar 😄" },
          { m: "Feb", src: "assets/photos/2023/2.jpg", cap: "Swag on 😎 chashme ke peeche bhi cute", pos: "50% 40%" },
          { m: "Mar", src: "assets/photos/2023/3.jpg", cap: "Raat ki roshni mein jagmag Nishu ✨", pos: "50% 70%" },
          { m: "Apr", src: "assets/photos/2023/4.jpg", cap: "Puppy se bhi zyada cute 🐶", pos: "50% 6%" },
          { m: "May", src: "assets/photos/2023/5.jpg", cap: "Dhoop, tilak aur tumhari smile 🌞", pos: "50% 30%" },
          { m: "Jun", src: "assets/photos/2023/6.jpg", cap: "Do dil, ek selfie 💙", pos: "50% 25%" },
          { m: "Jul", src: "assets/photos/2023/7.jpg", cap: "Kamar pe haath, attitude full 😌", pos: "50% 30%" },
          { m: "Aug", src: "assets/photos/2023/8.jpg", cap: "Shy shy Nishu 🙈", pos: "50% 35%" },
          { m: "Sep", src: "assets/photos/2023/9.jpg", cap: "Titliyan bhi jal gayi 🦋", pos: "50% 45%" },
          { m: "Oct", src: "assets/photos/2023/10.jpg", cap: "Pahaadon mein bhi sabse alag 🏔️", pos: "50% 40%" },
          { m: "Nov", src: "assets/photos/2023/11.jpg", cap: "Ek phool, aur woh bhi tumhare haath se 🌼", pos: "50% 50%" },
          { m: "Dec", src: "assets/photos/2023/12.jpg", cap: "Hawa baalon se khel rahi, aur main tumse 😍", pos: "50% 35%" },
        ],
      },
      photos: [
        { src: "assets/photos/2023/13.jpg", cap: "Roshni, raunak aur tum ✨ (bonus smile)" },
        { src: "assets/photos/2023/14.jpg", pos: "50% 30%", cap: "Sukoon wala pal 🫶 (bonus smile)" },
      ],
    },
    {
      year: 2024, title: "Aur bhi khoobsurat",
      song: "y2024",
      caption: "Is saal tum ek level aur upar chali gayi… Har saal tum aur pyaari ho jaati ho, ye kaise kar leti ho? 💖",
      love: {
        title: "Love Level Up ❤️",
        say: "Dil pe tap karo — har level pe Nishu aur pyaari hoti jaati hai 😍",
        hint: "9 level hain… dekho kaise ek level aur upar jaati ho 💖",
        win: "MAX LEVEL! 🎉 Par pyaar ka level kabhi max nahi hota ♾️❤️",
        praise: ["Aur pyaari ho gayi 😍", "Level up! Dil bhi up 💖", "Ye kaise kar leti ho? 🥹", "Wah! Aur ek level ✨", "Dil dhak-dhak 💓"],
        couple: { src: "assets/photos/2024/couple.png", lines: ["Hum dono, ek frame mein ❤️", "Ye wali nazar to dil le gayi 🥹", "Jodi ho to aisi 💑", "Pyaar hi pyaar 💕"] },
        levels: [
          { src: "assets/photos/2024/1.jpg", title: "Khoobsurat 🌷", cap: "Chaat khate hue bhi itni pyaari 😋", pos: "50% 12%" },
          { src: "assets/photos/2024/2.jpg", title: "Foodie mode 🍽️", cap: "Khana mast, aur saath tumhara to aur bhi mast 🧡", pos: "50% 60%" },
          { src: "assets/photos/2024/3.jpg", title: "Jodi no. 1 💑", cap: "Jab tum aise dekhti ho, dil pighal jata hai 🥹", pos: "50% 35%" },
          { src: "assets/photos/2024/4.jpg", title: "Cutie pie 🍬", cap: "Ek smile aur main out ✨", pos: "50% 20%" },
          { src: "assets/photos/2024/5.jpg", title: "Saree queen 👑", cap: "Saree mein poori Queen 👑", pos: "50% 55%" },
          { src: "assets/photos/2024/6.jpg", title: "Masti level 😜", cap: "Zubaan nikali, aur dil le gayi 😝", pos: "50% 30%" },
          { src: "assets/photos/2024/7.jpg", title: "Attitude level 😏", cap: "Ye wali look to jaan le legi 🍹", pos: "50% 20%" },
          { src: "assets/photos/2024/8.jpg", title: "Pahaadon ki rani 🏔️", cap: "Phoolon jaisi, pahaadon se bhi unchi pasand 🌼", pos: "50% 55%" },
          { src: "assets/photos/2024/9.jpg", title: "MAX LEVEL 🔥", cap: "Meri filter wali shakal pe tumhari hasi 🤣 — sabse pyaari", pos: "50% 40%" },
        ],
      },
      photos: [],
    },
    {
      year: 2025, title: "Pakki wali jodi",
      song: "y2025",
      caption: "Ab tum sirf meri aadat nahi, meri zaroorat ho.",
      battery: {
        title: "Aadat se Zaroorat 🔋",
        device: "Aman 📱",
        start: 9,
        say: "Meri battery low hai 🪫 Nishu (charger) pe tap karo!",
        hint: "Nishu pe tap karke charge karo… ya Door jao dabake dekho kya hota hai 😜",
        charger: "assets/photos/2025/charger.png",
        couple: "assets/photos/2025/couple.png",
        lowStatus: "Low battery… Nishu miss kar rahi hai 🪫",
        midStatus: "Charging… 🔌",
        fullStatus: "Full charge ✅ Ab sab theek hai",
        step: 22, drain: 38,
        charging: ["Charging… 🔌", "Thodi si jaan aayi ⚡", "Tumhara saath = fast charging 😍", "Aur thoda… 🔋", "Dil ki battery bhi bhar rahi hai 💖"],
        leaving: ["Door jaate hi battery gir gayi 😭", "Bina tumhare mera signal nahi 📵", "Charger kahan gayi? 🥺"],
        win: "Full charge! 🎉 Tum meri aadat nahi, meri zaroorat ho ❤️",
        afterFull: "Battery full hai… par tumhara saath kabhi full nahi hota 🥰",
        needs: [
          { aadat: "Subah ka good morning", zaroorat: "Din nahi chalta bina iske ☀️" },
          { aadat: "Khana khaya? ka message", zaroorat: "Isse pet nahi, dil bharta hai 🍽️" },
          { aadat: "Raat ki call", zaroorat: "Neend nahi aati iske bina 🌙" },
          { aadat: "Tumhari smile", zaroorat: "Meri poori battery 🔋" },
        ],
      },
      photos: [
        { src: "assets/photos/2025/1.jpg", cap: "Phoolon ke darwaze pe meri rani 👑 (pagdi bhi suit karti hai)", pos: "50% 30%" },
        { src: "assets/photos/2025/2.jpg", cap: "Baithi hui bhi royal 😌" },
        { src: "assets/photos/2025/3.jpg", cap: "Doggo se bhi zyada pyaar? Jalan ho rahi hai 🐶😤", pos: "50% 30%", stick: "🐶" },
        { src: "assets/photos/2025/4.jpg", cap: "Chashme pe 'I don't care'… par mujhe tumhari bahut care hai 😎❤️", pos: "50% 22%" },
        { src: "assets/photos/2025/5.jpg", cap: "Ye bhi tumhara fan hai 🐒 (nazar mat lagana)" },
        { src: "assets/photos/2025/6.jpg", cap: "Is hug mein poori duniya bhool gaya 🫂", pos: "50% 55%", stick: "🫂" },
        { src: "assets/photos/2025/7.jpg", cap: "Gulabi saree, gulabi dil 💗", pos: "50% 25%", stick: "💗" },
        { src: "assets/photos/2025/8.jpg", cap: "Peeche sab kutte hi kutte, par cutest tum 🐶😜", pos: "50% 20%" },
        { src: "assets/photos/2025/9.jpg", cap: "Mood off nahi, bas selfie mood 😒😏", pos: "50% 35%" },
        { src: "assets/photos/2025/10.jpg", cap: "Pout ka copyright sirf Nishu ke naam 😗", pos: "50% 30%", stick: "😗" },
        { src: "assets/photos/2025/11.jpg", cap: "Chand bhi dekhta reh gaya 🌙", pos: "50% 55%", stick: "🌙" },
        { src: "assets/photos/2025/12.jpg", cap: "Meri jodi, meri duniya 💑", pos: "50% 40%", stick: "💑" },
        { src: "assets/photos/2025/13.jpg", cap: "Peeche se bhi pehchaan lunga 🚶‍♀️", pos: "50% 40%" },
        { src: "assets/photos/2025/14.jpg", cap: "Film wali look 🎞️ — heroine ban gayi ✨", pos: "50% 30%", stick: "✨" },
      ],
    },
    {
      year: 2026, title: "Aaj — tumhara din ✨",
      caption: "8 saal mein kitna kuch seekha saath mein, kitni hasi, kitni baatein — sab aapse hi hai ❤️",
      jars: {
        title: "8 Saal Ka Hisaab 📒",
        say: "Teen shishe hain… tap karke bharo 💛",
        hint: "har shishe pe tap karo, ya 'Sab kuch bharo' dabao — dekho 8 saal mein kitna kuch bhar gaya 💛",
        days: 2922,
        finalText: "Sab aapse hi hai ❤️",
        win: "8 saal, 3 shishe, ek hi jawab: sab aapse hi hai ❤️",
        jars: [
          { name: "Seekha 📚", color: "#e8c27a", emoji: "📚", items: [
            { e: "⏳", t: "Sabr rakhna aapse seekha" },
            { e: "👂", t: "Pehle sunna, phir bolna" },
            { e: "🥺", t: "Maafi maangna aasaan nahi, par zaroori" },
            { e: "🤝", t: "Pyaar mein 'main' nahi, 'hum' hota hai" },
          ] },
          { name: "Hasi 😂", color: "#ff7aa8", emoji: "😂", items: [
            { e: "🤣", t: "Wo bina wajah ki hasi" },
            { e: "😆", t: "Peeche se aake darana" },
            { e: "🍕", t: "Khaane pe jhagda, phir hasi" },
            { e: "😝", t: "Selfie mein zubaan nikalna" },
          ] },
          { name: "Baatein 💬", color: "#7fb8ff", emoji: "💬", items: [
            { e: "🌙", t: "Raat ke 2 baje wali baatein" },
            { e: "🗣️", t: "Meri bakwaas bhi dhyan se sunna" },
            { e: "💭", t: "Wo chhote-chhote sapne" },
            { e: "🤫", t: "Wo baatein jo sirf hum dono jaante hain" },
          ] },
        ],
      },
      cutout: { src: "assets/photos/2026/glasses.png", say: "I don't care? Par mujhe tumhari bahut care hai 😎❤️" },
      photos: [
        { src: "assets/photos/2026/1.jpg", wide: true, cap: "Selfie queen aur peeche main 😄 (zubaan andar kar lo 😜)", stick: "😜" },
        { src: "assets/photos/2026/2.jpg", pos: "50% 20%", cap: "Chocolate ke saamne duniya bhool jaati ho 🍫", stick: "🍫" },
        { src: "assets/photos/2026/3.jpg", wide: true, cap: "Wednesday ho ya Sunday — selfie to banti hai 🤳", stick: "🤳" },
        { src: "assets/photos/2026/back.png", cutout: true, cap: "Phool jaisi, phool ke saath 🌼" },
      ],
    },
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
