💬 INTRODUCTION 💬                                                                                                      
easyOrder is simple, clean, fast e-commerce app. Start your busniess with useful features.
easyOrder is designed to focus on sending the order details to WhatsApp to make it easier for both client and seller for handling the order.


⭐ FEATURES ⭐
- Send the shopping cart details directly to Whatsapp.
- No client register required, reason is when user submits the order to Whatsapp, the Whatsapp account is replaced and can be seacure as a registered account.
- Payment methods: Cash on Delivery, Paypal Express Gateway.
- Responsive and clean website design, template owned by: bedimcode (https://github.com/bedimcode/responsive-website-restaurant).
- Admin Control Panel includes:
- Full Control of items, Add, Edit, Delete, Mark as Sould out/Available.
- Secure authentication for the control panel using JWT.
- Manage your admin account and the Whatsapp number
- Control of the received invoices.
- Add custom categories, sizes for the menu items according to your needs.
- Add coupons to allow clients apply them while making a purchase.
- a simple Image background remover page.

❗ How to Install ❗

1. Download the source.
2. npm install axios body-parser crypto dotenv ejs express express-session jsonwebtokens moment-timezone mongoose multer nodemon uuid
3. npm start

⚠️ NOTES ⚠️

- Update the .env file to connect your MongoDB account and handle the PayPal config
- when creating an item in the control panel, each image of the item is treated to be as a color so when client adds a different item image it's treaded as a seprate item in cart.
- update the timezone in Invoice.js modal according to to your timezone to save the invoice with accurate date and time.
- The Image background remover page in the admin panel is using the remove.bg API so you should include a valid api key inside the javascript.

📧 CONTACT 📧
- ps.yousef99@gmail.com
- contact@yosf143.om
