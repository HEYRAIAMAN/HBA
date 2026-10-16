# 🎂 Happy Birthday Nishu — Website Guide

Sab kuch **`js/config.js`** se control hota hai: naam, password, captions, gaane, quiz aur last note.
Baaki files chhedne ki zaroorat nahi hai.

---

## 1️⃣ Pehle ye 3 cheezein badlo (`js/config.js`)

| Kya | Kahan | Example |
|---|---|---|
| 🔐 Password | `password:` | `"1405"` (koi special date) |
| 💡 Hint | `passwordHint:` | `"Hint: humari pehli date 😉"` |
| 🎂 Birthday date (countdown ke liye) | `birthday:` | `"2026-11-05"` |
| ✉️ Last note | `letter:` | backticks `` ` ` `` ke andar apna khat likho |
| 🎮 Quiz ke sahi jawab | `quiz:` → `answer:` | 0 = pehla option, 1 = doosra… |

---

## 2️⃣ Photos daalo 📸

Jab tak photo nahi daaloge, site pe us jagah ek **placeholder** dikhega jisme exact file ka naam likha hoga.
Bas usi naam se photo us folder mein daal do.

```
assets/photos/
├── 2018/  1.jpg 2.jpg 3.jpg      ← har saal ki 3 photos (timeline)
├── 2019/  1.jpg … 12.jpg         ← college wala saal (12 photos; config mein `wide: true` wali landscape photos poori chaudai mein dikhti hain)
├── ...    (2020 se 2026 tak same)
├── special/
│   ├── bholi.jpg       ← "Dekhne mein kitni bholi bhali" wala gaana isi pe bajega
│   ├── tu-ho-toh.jpg   ← "Tu ho toh" wala gaana isi pe bajega
│   ├── then.jpg        ← bachpan wali photo (Tab vs Ab)
│   ├── now.jpg         ← abhi wali photo
│   └── cutout-1.png … cutout-4.png  ← pehli slide (Happy Birthday) ke cake wale cutouts (background hata hua PNG)
└── swipe/  1.jpg … 8.jpg         ← swipe karne wali cards
```

- Kisi saal mein zyada photos hain? Config mein us saal ki `photos:` list mein aur naam add kar do (`"assets/photos/2019/4.jpg"`).
- 🧷 **Collage / scrapbook look:** kisi saal mein `collage: true` likho (2019 mein laga hai). Photos tedhi aur ek doosre pe chadhi hui, tape ke saath dikhti hain, aur `photos:` list mein ye extra tukde bhi daal sakte ho:
  - `{ note: "Center Park 🌳", tone: "yellow" }` → sticky note (`tone`: yellow / pink / blue / green)
  - `{ meme: "drake", rows: [{ src, text, yes }, …] }` → Drake meme, apni photos ke saath (`yes: true` = approve wala panel)
  - `{ bunk: { title, rows: [{ label, pct, emoji }] } }` → attendance register, bars scroll pe bharte hain
  - photo pe `stick: "🎓"` (emoji sticker) aur `span: true` (poori chaudai)
- **iPhone ki .HEIC photos browser mein nahi chalti.** Mac pe JPG mein badlo aur size bhi chhota karo (ye ek command dono kaam karta hai):
  ```bash
  mkdir -p converted && sips -s format jpeg -Z 1600 *.HEIC --out converted/
  ```
  (`-Z 1600` = photo ka sabse lamba side 1600px. Phone pe isse site fast chalti hai.)

---

## 3️⃣ Gaane daalo 🎵

✅ **Saare gaane already `assets/music/` mein daal diye gaye hain (`.m4a` format, jo har phone pe chalta hai).** Badalna ho to same naam se nayi file daal do:

| File ka naam | Gaana | Kahan bajega | Link |
|---|---|---|---|
| `hbd-meme.m4a` | Aaaa Happy Birthday To You (meme) | Shuru (Happy Birthday) | [link](https://youtube.com/shorts/SW53N_Vw23c) |
| `chalte-chalte.m4a` | Chalte Chalte Yun Hi Koi Mil Gaya Tha | 8 Saal Ka Safar | [link](https://youtube.com/shorts/iE9IQNyd_Aw) |
| `voh-dekhne-mein.m4a` | Voh Dekhne Mein (Ali Zafar) | "Bholi bhali" photo | [link](https://youtube.com/shorts/e84IP6acLVk) |
| `offcampus-reconnect.m4a` | When you both reconnect again | Videos section | [link](https://youtube.com/shorts/ex36_-5NitE) |
| `seene-se-lag-jao.m4a` | Chal Wahan Jaate Hain (Arijit Singh) | 2018 wali slide | [link](https://youtube.com/shorts/CbCRFa6rGes) |
| `milne-lage-dil.m4a` | Milne Lage Dil | 2019 wali slide (college) | [link](https://youtube.com/shorts/arMXbyQymBk) |
| `tu-chahiye.m4a` | Tu Chahiye (Atif Aslam) | 2020 wali slide (covid) | [link](https://youtube.com/shorts/iuT7uymjWHw) |
| `kal-chaudhvin.m4a` | Kal Chaudhvin Ki Raat (Jagjit Singh) | Tab vs Ab | [link](https://youtube.com/shorts/wU1YwyH4DIs) |
| `pal-pal-dil-ke-paas.m4a` | Pal Pal Dil Ke Paas | Swipe photos | [link](https://youtube.com/shorts/vGj0UiBlAyM) |
| `tu-ho-toh.m4a` | Tu Ho Toh | "Tu ho toh" photo | [link](https://youtube.com/shorts/iw4A57Asp-4) |
| `suno-na.m4a` | Suno Na Suno Na | Reasons cards | [link](https://youtube.com/shorts/Z03sygE__s0) |
| `offcampus-black-yellow.m4a` | Black & yellow edit | Quiz | [link](https://youtube.com/shorts/8PWyLCzfPdE) |
| `chaka-chak.m4a` | Chaka Chak | Cake 🎂 | [link](https://youtube.com/shorts/QRwl33U64LQ) |
| `mere-khayalon-ki-malika.m4a` | Mere Khayalon Ki Malika (1 min) | Last letter ✉️ | [link](https://youtube.com/shorts/C49S0uyoA1o) |

**Kaise kaam karta hai:** website slides mein chalti hai. Neeche **"Aage ➜"** dabao (ya laptop pe → arrow key) to agli slide aati hai, aur har slide ka gaana aaram se fade hoke shuru hota hai. Chhote 10–15 sec wale gaane loop mein chalte rehte hain. Upar right mein 🎵 button se music band/chalu hota hai. Koi video play karo to gaana khud ruk jata hai.

**Shorts se mp3 kaise nikalein** (Mac Terminal mein):
```bash
brew install yt-dlp ffmpeg
cd ~/Desktop/HBA/assets/music
yt-dlp -f "bestaudio[ext=m4a]" -o "chalte-chalte.%(ext)s" "https://youtube.com/shorts/iE9IQNyd_Aw"
# baaki gaano ke liye bhi same: -o "<file ka naam>.%(ext)s" "<link>"
```
(Agar poora gaana chahiye, Shorts ki jagah poore gaane ka YouTube link use karo. Bas file ka naam same rakhna.)

---

## 4️⃣ Videos daalo 🎬

`assets/videos/1.mp4 … 4.mp4` daalo, aur captions config mein `videos:` mein badlo.

⚠️ **Phone ke videos bahut heavy hote hain.** Daalne se pehle 720p mein compress karo:
```bash
ffmpeg -i input.mov -vf "scale=-2:720" -c:v libx264 -crf 28 -preset veryfast -c:a aac -b:a 96k -movflags +faststart 1.mp4
```
Ya free app **HandBrake** use karo (preset: *Fast 720p30*). Har video **50MB se kam** rakhna.

Bahut lambe videos hain? YouTube pe **Unlisted** upload karo aur config mein aise likho:
```js
{ youtube: "VIDEO_ID", vertical: true, caption: "Chhoti si Nishu 🧸" },
```

---

## 5️⃣ Apne laptop pe test karo 💻

```bash
cd ~/Desktop/HBA
python3 -m http.server 8000
```
Phir browser mein kholo: **http://localhost:8000**
(Phone pe test karna hai to phone aur laptop same WiFi pe rakho, aur phone mein `http://<laptop-ka-IP>:8000` kholo.)

---

## 6️⃣ Online daalo aur link bhejo 🌐

**Sabse aasaan: Netlify Drop (free)**
1. https://app.netlify.com/drop kholo (free account bana lo)
2. Poora **HBA folder** drag karke wahan chhod do
3. Ek link milega. Site settings mein jaake naam badal sakte ho, jaise `happy-birthday-nishu.netlify.app`
4. Wahi link Nishu ko bhej do ❤️

> Netlify pe HTTPS free milta hai, isliye cake wala 🎤 mic feature bhi chalega.

**GitHub Pages bhi chalega**, lekin free plan pe repo **public** hota hai. Matlab saari photos GitHub pe koi bhi dekh sakta hai. Isliye personal photos ke liye Netlify behtar hai.

🔐 **Dhyan rahe:** password ek cute "gate" hai, bank wala lock nahi. Koi tech wala page ka code khol ke password dekh sakta hai. Link sirf Nishu ko bhejna.

---

## Website ka flow (har point ek slide hai, "Aage ➜" se aage badho)
💚 Laptop pe cursor ek hara dil hai jiske peeche ✨🌸🦋 udte hain. Phone pe jahan tap karo wahan ye nikalte hain.

1. 🔐 Password lock (galat password pe funny message)
2. 🎉 Happy Birthday + naam typing + confetti + balloons (+ countdown)
3. 📅 8 Saal Ka Safar, 9wa Shuru: pehli slide pe Nishu ka funny sticker (`assets/photos/special/nishu-sticker.png`). Tap karo to speech bubble mein naya joke aata hai, jokes `stickerLines` mein badal sakte ho. Phir har saal ki alag slide, photos upar se girti hain (photo pe tap karo to badi dikhegi)
4. 🌟 "Dekhne mein kitni bholi bhali" special photo
5. 🎬 Grow-up videos (har video ki alag slide)
6. ⇆ Tab vs Ab slider
7. 📸 Swipe photo cards
8. 🌟 "Tu ho toh" special photo
9. 💌 12 Reasons: card pe tap karo to khulta hai, phir tap karo to agla
10. 🎮 Quiz
11. 🎂 Cake: phoonk ke ya tap karke candles bujhao
12. ✉️ Lifafa khulta hai, letter type hota hai, phir "I Love You" ❤️
