import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DatabaseService } from "../database/db";
import { paymentService } from "../services/paymentService";

const router = Router();
const db = DatabaseService.getInstance();

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Auth routes
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Room routes
router.get("/rooms", authenticateToken, async (req, res) => {
  try {
    const rooms = await db.getAllRooms();
    res.json(rooms);
  } catch (error) {
    console.error("Get rooms error:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

router.post("/rooms", authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const result = await db.createRoom(req.body);
    res.json({ id: result.lastID, message: "Room created successfully" });
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
});

router.put("/rooms/:id", authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const roomId = parseInt(req.params.id);
    await db.updateRoom(roomId, req.body);
    res.json({ message: "Room updated successfully" });
  } catch (error) {
    console.error("Update room error:", error);
    res.status(500).json({ error: "Failed to update room" });
  }
});

router.delete("/rooms/:id", authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const roomId = parseInt(req.params.id);
    await db.deleteRoom(roomId);
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Delete room error:", error);
    res.status(500).json({ error: "Failed to delete room" });
  }
});

// Room type routes
router.get("/room-types", authenticateToken, async (req, res) => {
  try {
    const roomTypes = await db.getAllRoomTypes();
    res.json(roomTypes);
  } catch (error) {
    console.error("Get room types error:", error);
    res.status(500).json({ error: "Failed to fetch room types" });
  }
});

router.post("/room-types", authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const result = await db.createRoomType(req.body);
    res.json({ id: result.lastID, message: "Room type created successfully" });
  } catch (error) {
    console.error("Create room type error:", error);
    res.status(500).json({ error: "Failed to create room type" });
  }
});

// Check room availability
router.get("/rooms/available", async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res
        .status(400)
        .json({ error: "Check-in and check-out dates required" });
    }

    const availableRooms = await db.getAvailableRooms(
      checkIn as string,
      checkOut as string,
    );
    res.json(availableRooms);
  } catch (error) {
    console.error("Check availability error:", error);
    res.status(500).json({ error: "Failed to check availability" });
  }
});

// Reservation routes
router.get("/reservations", authenticateToken, async (req, res) => {
  try {
    const reservations = await db.getAllReservations();
    res.json(reservations);
  } catch (error) {
    console.error("Get reservations error:", error);
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

router.post("/reservations", async (req, res) => {
  try {
    const { guest, reservation } = req.body;

    // Create or find guest
    let guestRecord = await db.findGuestByEmail(guest.email);
    if (!guestRecord) {
      const guestResult = await db.createGuest(guest);
      guestRecord = { id: guestResult.lastID, ...guest };
    }

    // Create reservation
    const reservationData = {
      ...reservation,
      guest_id: guestRecord.id,
    };

    const result = await db.createReservation(reservationData);

    res.json({
      reservation_id: result.lastID,
      guest_id: guestRecord.id,
      message: "Reservation created successfully",
    });
  } catch (error) {
    console.error("Create reservation error:", error);
    res.status(500).json({ error: "Failed to create reservation" });
  }
});

router.put("/reservations/:id/status", authenticateToken, async (req, res) => {
  try {
    const reservationId = parseInt(req.params.id);
    const { status } = req.body;

    await db.updateReservationStatus(reservationId, status);
    res.json({ message: "Reservation status updated successfully" });
  } catch (error) {
    console.error("Update reservation status error:", error);
    res.status(500).json({ error: "Failed to update reservation status" });
  }
});

router.put("/reservations/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const reservationId = parseInt(req.params.id);

    await db.cancelReservation(reservationId);
    res.json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    console.error("Cancel reservation error:", error);
    res.status(500).json({ error: "Failed to cancel reservation" });
  }
});

// User management routes (admin only)
router.get("/users", authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const users = await db.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.post("/users", authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const result = await db.createUser(req.body);
    res.json({ id: result.lastID, message: "User created successfully" });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.put("/users/:id", authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const userId = parseInt(req.params.id);
    await db.updateUser(userId, req.body);
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.put("/users/:id/status", authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const userId = parseInt(req.params.id);
    const { is_active } = req.body;
    await db.updateUserStatus(userId, is_active);
    res.json({ message: "User status updated successfully" });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({ error: "Failed to update user status" });
  }
});

router.delete("/users/:id", authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const userId = parseInt(req.params.id);

    // Prevent deleting self
    if (userId === user.id) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    await db.deleteUser(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Payment routes
router.post("/payments/create-intent", authenticateToken, async (req, res) => {
  try {
    const { amount, currency, reservation_id, description } = req.body;

    const paymentIntent = await paymentService.createPaymentIntent(
      amount,
      currency,
      { reservation_id, description }
    );

    // Save payment record to database
    await db.createPayment({
      reservation_id,
      stripe_payment_intent_id: paymentIntent.id,
      amount,
      currency: currency || 'USD',
      status: 'pending',
      description,
    });

    res.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    });
  } catch (error) {
    console.error("Create payment intent error:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

router.post("/payments/:id/confirm", authenticateToken, async (req, res) => {
  try {
    const paymentIntentId = req.params.id;
    const paymentIntent = await paymentService.getPaymentIntent(paymentIntentId);

    // Update payment status based on Stripe status
    if (paymentIntent.status === 'succeeded') {
      // Find payment by stripe_payment_intent_id and update
      const payments = await db.getAllPayments();
      const payment = payments.find(p => p.stripe_payment_intent_id === paymentIntentId);

      if (payment) {
        await db.updatePaymentStatus(payment.id, 'succeeded', {
          card_last4: paymentIntent.charges?.data[0]?.payment_method_details?.card?.last4,
          card_brand: paymentIntent.charges?.data[0]?.payment_method_details?.card?.brand,
        });
      }
    }

    res.json({ status: paymentIntent.status });
  } catch (error) {
    console.error("Confirm payment error:", error);
    res.status(500).json({ error: "Failed to confirm payment" });
  }
});

router.get("/payments", authenticateToken, async (req, res) => {
  try {
    const payments = await db.getAllPayments();
    res.json(payments);
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

router.get("/payments/reservation/:id", authenticateToken, async (req, res) => {
  try {
    const reservationId = parseInt(req.params.id);
    const payments = await db.getPaymentsByReservation(reservationId);
    res.json(payments);
  } catch (error) {
    console.error("Get reservation payments error:", error);
    res.status(500).json({ error: "Failed to fetch reservation payments" });
  }
});

router.post("/payments/:id/refund", authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    if (user.role !== 'admin' && user.role !== 'accountant') {
      return res.status(403).json({ error: 'Admin or accountant access required' });
    }

    const paymentId = parseInt(req.params.id);
    const { amount, reason } = req.body;

    // Get payment details
    const payments = await db.getAllPayments();
    const payment = payments.find(p => p.id === paymentId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Create refund in Stripe
    const refund = await paymentService.createRefund(
      payment.stripe_payment_intent_id,
      amount,
      reason
    );

    // Save refund record to database
    await db.createRefund({
      payment_id: paymentId,
      stripe_refund_id: refund.id,
      amount: refund.amount / 100, // Convert from cents
      reason,
      status: refund.status,
      created_by: user.id,
    });

    res.json({ message: 'Refund created successfully', refund_id: refund.id });
  } catch (error) {
    console.error("Create refund error:", error);
    res.status(500).json({ error: "Failed to create refund" });
  }
});

// Stripe webhook endpoint
router.post("/webhooks/stripe", async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
      return res.status(400).json({ error: 'Missing signature or webhook secret' });
    }

    // Verify webhook signature and construct event
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    // Handle the event
    await paymentService.handleWebhookEvent(event);

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({ error: "Webhook signature verification failed" });
  }
});

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default router;
