const { requireSignin, adminMiddleware } = require("../../common-middleware");
const { updateOrder, getCustomerOrders } = require("../../controllers/admin/order");
const router = require("express").Router();

router.post("/order/update", requireSignin, adminMiddleware, updateOrder);
router.post("/order/getCustomerOrders", requireSignin, adminMiddleware, getCustomerOrders);

module.exports = router;