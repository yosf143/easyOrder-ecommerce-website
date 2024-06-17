// controllers/frontend/cart.js
const Invoice = require('../../models/Invoice');
const Coupon = require('../../models/Coupon');
const PhoneNo = require('../../models/PhoneNo');
 
 
function getCartPage(req, res) {
    const cartItems = req.session.cart || [];
    const error = req.session.error || '';
    
    req.session.error = '';
    res.render('./frontend/resources/cart', { cartItems, error });
} 

async function applyCoupon(totalDue, couponCode) {
    if (!couponCode) {
        return { totalDue, error: null }; 
    }

    try {
        
        const coupon = await Coupon.findOne({ code: couponCode });

        if (coupon) {
          
            totalDue -= (totalDue * coupon.discountPercentage) / 100;
            totalDue = totalDue.toFixed(2);
            return { totalDue, error: null };
        } else {
            return { totalDue, error: 'الكوبون غير صحيح أو غير مفعل حالياً' };
        }
    } catch (err) {
        console.error('Error applying coupon:', err);
        return { totalDue, error: 'Internal Server Error' };
    }
}
 
async function sendOrder(req, res) {
    const { clientName, clientAddress, totalDue, cartItems, couponCode } = req.body;

    try {
      
        if (!clientName || !clientAddress || !totalDue) {
            req.session.error = 'بيانات الطلب غير مكتملة';
            return res.redirect('/cart');
        }

        const parsedCartItems = JSON.parse(cartItems);
        if (parsedCartItems.length === 0) {
            req.session.error = 'يرجى تعبئة السلة قبل المتابعة';
            return res.redirect('/cart');
        }

        let formattedTotalDue = totalDue ? parseFloat(totalDue) : 0.0;

        
        const { totalDue: updatedTotalDue, error } = await applyCoupon(formattedTotalDue, couponCode);

        if (error) {
            req.session.error = error;
            return res.redirect('/cart');
        }

        formattedTotalDue = updatedTotalDue;
 
        const currentDate = new Date();
        const creationDateTime = currentDate.toLocaleString();

        const invoiceData = new Invoice({
            cartItems: parsedCartItems,
            clientName,
            clientAddress,
            totalDue: formattedTotalDue,
            creationDateTime,
            paymentStatus: 'غير مدفوع'
        });
 
        await invoiceData.save();

        req.session.cart = [];
        res.clearCookie('cartCount');
 
        const host = req.get('host');
        const invoiceUrl = `https://${host}/vieworder/${invoiceData._id}`;

    
        const phoneNo = await PhoneNo.findOne();

        if (!phoneNo) {
           
            return res.status(500).json({ success: false, message: 'Phone number not found in database' });
        }

        const phoneNumber = phoneNo.number;

        let message = `السلام عليكم، أود طلب هذه الأصناف:\n\n`;
        message += `الاسم: ${clientName}\n`;
        message += `العنوان: ${clientAddress}\n\n`;

        parsedCartItems.forEach(item => {
            message += `${item.detail} - ${item.size} - العدد: ${item.quantity}\n`;
        });

        message += `\nالإجمالي: ${formattedTotalDue}`;
        message += `\n\nرابط الفاتورة:`;
        message += `\n${invoiceUrl}`;

        const WhatsAppLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
 
        res.redirect(WhatsAppLink);
    } catch (err) {
        console.error('Error sending order:', err);
        res.status(500).json({ success: false, message: 'Error sending order' });
    }
}

function addToCart(req, res) {
    const item = req.body.item;
    req.session.cart = req.session.cart || [];

    const activeImage = item.activeImage;

    const existingItemIndex = req.session.cart.findIndex(cartItem =>
        cartItem._id === item._id &&
        cartItem.category === item.category &&
        cartItem.name === item.name &&
        cartItem.selectedSize === item.selectedSize &&
        cartItem.selectedSizePrice === item.selectedSizePrice &&
        cartItem.activeImage.uuid === activeImage.uuid
    );

    if (existingItemIndex !== -1) {
    
        req.session.cart[existingItemIndex].quantity++;
    } else {
       
        const newItem = {
            ...item,
            activeImage: {
                uuid: activeImage.uuid,
                url: activeImage.url 
            },
            quantity: 1
        };
        req.session.cart.push(newItem);
    }

    res.json({ cartItemCount: req.session.cart.reduce((total, cartItem) => total + cartItem.quantity, 0) });
}






function updateQuantity(req, res) {
    const { itemId, itemName, size, imageUuid, quantity } = req.body;
    let cartItems = req.session.cart || [];

    const itemIndex = cartItems.findIndex(item =>
        item._id === itemId &&
        item.name === itemName &&
        item.selectedSize === size &&
        item.activeImage.uuid === imageUuid  
    );

    if (itemIndex !== -1) {
        if (quantity === 0) {
            cartItems.splice(itemIndex, 1);
        } else {
            cartItems[itemIndex].quantity = quantity;
        }
     
        req.session.cart = cartItems;

        res.json({ cartItemCount: cartItems.reduce((total, item) => total + item.quantity, 0) });
    } else {
        res.status(404).json({ error: 'المنتج غير موجود في السلة. يرجى إعادة تشغيل المتصفح.' });
    }
}


module.exports = {
    getCartPage,
    sendOrder,
    addToCart,
    updateQuantity
};
