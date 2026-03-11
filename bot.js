const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const fs = require('fs')

const client = new Client({
    authStrategy: new LocalAuth()
})

let users = {}

// ======================
// QR LOGIN
// ======================

client.on('qr', qr => {
    qrcode.generate(qr, {small:true})
    console.log("Scan QR WhatsApp")
})

// ======================
// BOT READY
// ======================

client.on('ready', () => {
    console.log("BOT MOVA ONLINE")
})

// ======================
// PESAN MASUK
// ======================

client.on('message', async msg => {

try{

if(msg.fromMe) return

// blok grup
if(msg.from.includes("@g.us")) return

const text = msg.body.toLowerCase()
const sender = msg.from

console.log("Pesan:", text)

// ======================
// SESSION USER
// ======================

if(!users[sender]){

users[sender] = {
greeted:false,
lastReply:0,
step:"start"
}

}

// anti spam
const now = Date.now()
if(now - users[sender].lastReply < 3000) return

users[sender].lastReply = now


// ======================
// SALAM PERTAMA
// ======================

if(!users[sender].greeted){

users[sender].greeted = true

await msg.reply(`Halo 👋

Terima kasih sudah menghubungi *Admin MOVA*

Silakan pilih menu berikut:

1️⃣ Tentang MOVA  
2️⃣ Cara Daftar  
3️⃣ Link Pendaftaran  
4️⃣ Testimoni  
5️⃣ Bantuan Admin

Ketik angka menu.`)

return
}

// ======================
// MENU BOT
// ======================

switch(text){

case "1":

await msg.reply(`📌 *Tentang MOVA*

MOVA adalah platform digital yang memberikan peluang penghasilan melalui sistem referral.

Keuntungan:
✅ Komisi referral
✅ Sistem otomatis
✅ Bisa dijalankan dari HP
✅ Tanpa stok barang

Ketik *menu* untuk kembali.`)

break


case "2":

await msg.reply(`📝 *Cara Daftar MOVA*

1️⃣ Klik link pendaftaran  
2️⃣ Isi data lengkap  
3️⃣ Login dashboard  
4️⃣ Mulai bagikan link referral

Ketik *3* untuk mendapatkan link daftar.`)

break


case "3":

await msg.reply(`🚀 *Link Daftar MOVA*

Silakan daftar melalui link berikut:

https://movacuan.info

Setelah daftar admin akan membantu proses aktivasi.`)

break


case "4":

await msg.reply(`⭐ *Testimoni Member MOVA*

Banyak member sudah mendapatkan penghasilan dari MOVA.

Jika ingin tahu caranya ketik *2*.`)

break


case "5":

await msg.reply(`👨‍💻 *Admin MOVA*

Jika membutuhkan bantuan langsung silakan hubungi admin.

Admin akan membantu proses pendaftaran.`)

break


case "menu":

await msg.reply(`📋 *MENU MOVA*

1️⃣ Tentang MOVA  
2️⃣ Cara Daftar  
3️⃣ Link Pendaftaran  
4️⃣ Testimoni  
5️⃣ Bantuan Admin`)

break


default:

await msg.reply(`🤖 Bot MOVA

Maaf saya belum memahami pesan Anda.

Ketik *menu* untuk melihat daftar informasi.`)

}

}catch(err){

console.log("ERROR:", err)

}

})


// ======================
// AUTO FOLLOW UP
// ======================

setInterval(async () => {

for(let user in users){

try{

await client.sendMessage(user,
`Halo 👋

Apakah Anda masih tertarik dengan *MOVA*?

Jika ingin mendapatkan penghasilan dari sistem referral silakan ketik *menu*.`)

}catch(e){}

}

}, 7200000) // 2 jam


// ======================
// AUTO RECONNECT
// ======================

client.on('disconnected', () => {

console.log("BOT DISCONNECTED - RECONNECT")

client.initialize()

})

client.initialize()