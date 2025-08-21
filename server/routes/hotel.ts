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
    console.log(`🔐 Login attempt for: ${email}`);

    const user = await db.findUserByEmail(email);
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log(
      `✅ User found: ${user.email}, Role: ${user.role}, Active: ${user.is_active}`,
    );

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      console.log(`❌ Invalid password for: ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log(`✅ Password valid for: ${email}`);

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
    console.error("❌ Login error:", error);

    // Provide more specific error messages for debugging
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
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

// Enhanced booking system - handles all service types from the new booking page
router.post("/bookings", async (req, res) => {
  try {
    const { serviceType, guestInfo, specialRequests, ...serviceDetails } = req.body;

    console.log(`📝 New booking request: ${serviceType}`, {
      guest: `${guestInfo.firstName} ${guestInfo.lastName}`,
      email: guestInfo.email
    });

    // Create or find guest
    let guestRecord = await db.findGuestByEmail(guestInfo.email);
    if (!guestRecord) {
      const guestData = {
        first_name: guestInfo.firstName,
        last_name: guestInfo.lastName,
        email: guestInfo.email,
        phone: guestInfo.phone,
        country: guestInfo.country,
        city: guestInfo.city,
        nationality: guestInfo.nationality
      };
      const guestResult = await db.createGuest(guestData);
      guestRecord = { id: guestResult.lastID, ...guestData };
    }

    // Generate booking reference
    const bookingReference = `ARM-${serviceType.toUpperCase()}-${Date.now().toString().slice(-6)}`;

    // Prepare booking data based on service type
    let bookingData: any = {
      booking_reference: bookingReference,
      booking_type: serviceType,
      guest_id: guestRecord.id,
      status: 'pending',
      payment_status: 'pending',
      currency: 'UGX',
      special_requests: specialRequests,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add service-specific details
    switch (serviceType) {
      case 'accommodation':
        bookingData = {
          ...bookingData,
          room_type: serviceDetails.roomType,
          check_in_date: serviceDetails.checkIn,
          check_out_date: serviceDetails.checkOut,
          adults: serviceDetails.adults || 1,
          children: serviceDetails.children || 0,
          total_amount: serviceDetails.totalAmount
        };
        break;

      case 'dining':
        bookingData = {
          ...bookingData,
          dining_venue: serviceDetails.diningVenue,
          dining_date: serviceDetails.diningDate,
          dining_time: serviceDetails.diningTime,
          party_size: serviceDetails.partySize || 1,
          total_amount: serviceDetails.totalAmount
        };
        break;

      case 'events':
        bookingData = {
          ...bookingData,
          event_space: serviceDetails.eventSpace,
          event_date: serviceDetails.eventDate,
          event_start_time: serviceDetails.eventStartTime,
          event_end_time: serviceDetails.eventEndTime,
          event_type: serviceDetails.eventType,
          attendees: serviceDetails.attendees,
          total_amount: serviceDetails.totalAmount
        };
        break;

      case 'facilities':
        bookingData = {
          ...bookingData,
          service_name: serviceDetails.serviceName,
          service_date: serviceDetails.serviceDate,
          service_time: serviceDetails.serviceTime,
          total_amount: serviceDetails.totalAmount
        };
        break;

      default:
        return res.status(400).json({ error: "Invalid service type" });
    }

    // Create the booking
    const result = await db.createBooking(bookingData);
    const bookingId = result.lastID;

    // Send booking confirmation notification
    try {
      const { notificationService } = await import("../services/notificationService");

      const notificationData = {
        recipientEmail: guestInfo.email,
        recipientPhone: guestInfo.phone,
        guestName: `${guestInfo.firstName} ${guestInfo.lastName}`,
        bookingReference,
        serviceType,
        totalAmount: serviceDetails.totalAmount,
        currency: 'UGX',
        bookingId
      };

      // Send email notification
      const emailSent = await notificationService.sendBookingConfirmation(
        notificationData,
        ["email"]
      );

      // Log notification
      if (guestInfo.email) {
        await db.logNotification({
          guestId: guestRecord.id,
          type: "email",
          templateName: "bookingConfirmation",
          recipient: guestInfo.email,
          subject: `Booking Confirmation - ${serviceType} - Armaflex Hotel`,
          status: emailSent.email ? "sent" : "failed",
          sentAt: emailSent.email ? new Date() : undefined,
          metadata: { bookingId, bookingReference, serviceType },
        });
      }

    } catch (notificationError) {
      console.error("Failed to send booking confirmation:", notificationError);
      // Don't fail the booking creation if notification fails
    }

    // Send real-time notification to staff
    try {
      // This would integrate with WebSocket or similar for real-time updates
      console.log(`🔔 New ${serviceType} booking notification for staff:`, {
        bookingId,
        bookingReference,
        guest: `${guestInfo.firstName} ${guestInfo.lastName}`,
        amount: serviceDetails.totalAmount
      });
    } catch (error) {
      console.error("Failed to send staff notification:", error);
    }

    res.json({
      booking_id: bookingId,
      booking_reference: bookingReference,
      guest_id: guestRecord.id,
      message: "Booking created successfully",
      status: "pending"
    });

  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// Get all bookings with enhanced filtering
router.get("/bookings", authenticateToken, async (req, res) => {
  try {
    const { 
      status, 
      serviceType, 
      paymentStatus, 
      dateFrom, 
      dateTo, 
      guestName,
      limit = 50,
      offset = 0 
    } = req.query;

    const filters = {
      status: status as string,
      serviceType: serviceType as string,
      paymentStatus: paymentStatus as string,
      dateFrom: dateFrom as string,
      dateTo: dateTo as string,
      guestName: guestName as string,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    };

    const bookings = await db.getBookingsWithFilters(filters);
    res.json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Update booking status
router.put("/bookings/:id/status", authenticateToken, async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    const { status, payment_status, internal_notes } = req.body;
    const { user } = req;

    const updateData: any = { updated_at: new Date().toISOString() };
    
    if (status) updateData.status = status;
    if (payment_status) updateData.payment_status = payment_status;
    if (internal_notes !== undefined) updateData.internal_notes = internal_notes;

    await db.updateBooking(bookingId, updateData);

    // Log the status change
    console.log(`📝 Booking ${bookingId} updated by ${user.email}:`, updateData);

    // Send notification to guest if status changed
    if (status && (status === 'confirmed' || status === 'cancelled')) {
      try {
        const booking = await db.getBookingById(bookingId);
        if (booking && booking.guest) {
          const { notificationService } = await import("../services/notificationService");
          
          await notificationService.sendBookingStatusUpdate({
            recipientEmail: booking.guest.email,
            guestName: `${booking.guest.first_name} ${booking.guest.last_name}`,
            bookingReference: booking.booking_reference,
            newStatus: status,
            serviceType: booking.booking_type
          });
        }
      } catch (notificationError) {
        console.error("Failed to send status update notification:", notificationError);
      }
    }

    res.json({ message: "Booking updated successfully" });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ error: "Failed to update booking status" });
  }
});

// Guest rating and review endpoints
router.post("/reviews", async (req, res) => {
  try {
    const {
      guestName,
      email,
      overall,
      roomQuality,
      service,
      cleanliness,
      location,
      valueForMoney,
      wouldRecommend,
      review,
      bookingId
    } = req.body;

    const reviewData = {
      guest_name: guestName,
      guest_email: email,
      overall_rating: overall,
      room_quality: roomQuality,
      service_quality: service,
      cleanliness_rating: cleanliness,
      location_rating: location,
      value_rating: valueForMoney,
      would_recommend: wouldRecommend,
      review_text: review,
      booking_id: bookingId,
      status: 'pending', // Reviews need approval
      created_at: new Date().toISOString()
    };

    const result = await db.createReview(reviewData);

    // Notify staff about new review
    try {
      console.log(`⭐ New review submitted by ${guestName} (${overall}/5 stars)`);
    } catch (error) {
      console.error("Failed to send review notification:", error);
    }

    res.json({
      review_id: result.lastID,
      message: "Review submitted successfully",
      status: "pending_approval"
    });

  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ error: "Failed to submit review" });
  }
});

// Get reviews (public endpoint for approved reviews)
router.get("/reviews", async (req, res) => {
  try {
    const { status = 'approved', limit = 10, offset = 0 } = req.query;
    
    const reviews = await db.getReviews({
      status: status as string,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });

    res.json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Manage reviews (admin only)
router.put("/reviews/:id/status", authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    if (user.role !== "admin" && user.role !== "receptionist") {
      return res.status(403).json({ error: "Admin or receptionist access required" });
    }

    const reviewId = parseInt(req.params.id);
    const { status, admin_notes } = req.body;

    await db.updateReviewStatus(reviewId, status, admin_notes);

    res.json({ message: "Review status updated successfully" });
  } catch (error) {
    console.error("Update review status error:", error);
    res.status(500).json({ error: "Failed to update review status" });
  }
});

// Dashboard statistics
router.get("/dashboard/stats", authenticateToken, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    const stats = await db.getDashboardStats(period as string);
    
    res.json(stats);
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
});

// Service management endpoints
router.get("/services", authenticateToken, async (req, res) => {
  try {
    const services = await db.getAllServices();
    res.json(services);
  } catch (error) {
    console.error("Get services error:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

router.post("/services", authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const result = await db.createService(req.body);
    res.json({ id: result.lastID, message: "Service created successfully" });
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({ error: "Failed to create service" });
  }
});

// Reservation routes (legacy compatibility)
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
    const reservationId = result.lastID;

    // Send booking confirmation notification
    try {
      const { notificationService } = await import(
        "../services/notificationService"
      );

      // Generate confirmation code
      const confirmationCode = `ARM-${reservationId}-${Date.now().toString().slice(-6)}`;

      // Get room details
      const room = await db.getRoomById(reservation.room_id);

      const notificationData = {
        recipientEmail: guest.email,
        recipientPhone: guest.phone,
        guestName: `${guest.first_name} ${guest.last_name}`,
        roomNumber: room?.room_number || "N/A",
        checkInDate: new Date(reservation.check_in_date).toLocaleDateString(),
        checkOutDate: new Date(reservation.check_out_date).toLocaleDateString(),
        totalAmount: reservation.total_amount,
        confirmationCode,
        reservationId,
      };

      // Send email and SMS notifications based on guest preferences
      const emailSent = await notificationService.sendBookingConfirmation(
        notificationData,
        ["email"],
      );

      // Log notification
      if (guest.email) {
        await db.logNotification({
          guestId: guestRecord.id,
          type: "email",
          templateName: "bookingConfirmation",
          recipient: guest.email,
          subject: "Booking Confirmation - Armaflex Hotel",
          status: emailSent.email ? "sent" : "failed",
          sentAt: emailSent.email ? new Date() : undefined,
          metadata: { reservationId, confirmationCode },
        });
      }

      // Update reservation with confirmation code
      await db.updateReservation(reservationId, {
        confirmation_code: confirmationCode,
      });
    } catch (notificationError) {
      console.error("Failed to send booking confirmation:", notificationError);
      // Don't fail the reservation creation if notification fails
    }

    res.json({
      reservation_id: reservationId,
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
      { reservation_id, description },
    );

    // Save payment record to database
    await db.createPayment({
      reservation_id,
      stripe_payment_intent_id: paymentIntent.id,
      amount,
      currency: currency || "USD",
      status: "pending",
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
    const paymentIntent =
      await paymentService.getPaymentIntent(paymentIntentId);

    // Update payment status based on Stripe status
    if (paymentIntent.status === "succeeded") {
      // Find payment by stripe_payment_intent_id and update
      const payments = await db.getAllPayments();
      const payment = payments.find(
        (p) => p.stripe_payment_intent_id === paymentIntentId,
      );

      if (payment) {
        await db.updatePaymentStatus(payment.id, "succeeded", {
          card_last4:
            paymentIntent.charges?.data[0]?.payment_method_details?.card?.last4,
          card_brand:
            paymentIntent.charges?.data[0]?.payment_method_details?.card?.brand,
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
    if (user.role !== "admin" && user.role !== "accountant") {
      return res
        .status(403)
        .json({ error: "Admin or accountant access required" });
    }

    const paymentId = parseInt(req.params.id);
    const { amount, reason } = req.body;

    // Get payment details
    const payments = await db.getAllPayments();
    const payment = payments.find((p) => p.id === paymentId);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Create refund in Stripe
    const refund = await paymentService.createRefund(
      payment.stripe_payment_intent_id,
      amount,
      reason,
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

    res.json({ message: "Refund created successfully", refund_id: refund.id });
  } catch (error) {
    console.error("Create refund error:", error);
    res.status(500).json({ error: "Failed to create refund" });
  }
});

// Stripe webhook endpoint
router.post("/webhooks/stripe", async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
      return res
        .status(400)
        .json({ error: "Missing signature or webhook secret" });
    }

    // Verify webhook signature and construct event
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    // Handle the event
    await paymentService.handleWebhookEvent(event);

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({ error: "Webhook signature verification failed" });
  }
});

// Notification endpoints

// Get notification preferences
router.get(
  "/notifications/preferences",
  authenticateToken,
  async (req, res) => {
    try {
      const user = req.user as any;
      const preferences = await db.getNotificationPreferences(user.id);

      if (!preferences) {
        // Return default preferences if none exist
        return res.json({
          email: {
            bookingConfirmation: true,
            paymentReceipts: true,
            checkInReminders: true,
            checkOutReminders: true,
            staffAlerts: true,
            maintenanceUpdates: false,
            promotionalOffers: false,
            systemUpdates: true,
          },
          sms: {
            bookingConfirmation: false,
            paymentReceipts: false,
            checkInReminders: true,
            checkOutReminders: false,
            urgentAlerts: true,
            staffEmergencies: true,
          },
          preferences: {
            emailAddress: user.email || "",
            phoneNumber: "",
            enableEmail: true,
            enableSMS: false,
            quietHours: {
              enabled: false,
              start: "22:00",
              end: "08:00",
            },
            language: "en",
            timezone: "UTC",
          },
        });
      }

      res.json({
        email: preferences.email_preferences,
        sms: preferences.sms_preferences,
        preferences: {
          emailAddress: preferences.email_address,
          phoneNumber: preferences.phone_number,
          enableEmail: preferences.enable_email,
          enableSMS: preferences.enable_sms,
          quietHours: {
            enabled: preferences.quiet_hours_enabled,
            start: preferences.quiet_hours_start,
            end: preferences.quiet_hours_end,
          },
          language: preferences.language,
          timezone: preferences.timezone,
        },
      });
    } catch (error) {
      console.error("Get notification preferences error:", error);
      res.status(500).json({ error: "Failed to get notification preferences" });
    }
  },
);

// Save notification preferences
router.post(
  "/notifications/preferences",
  authenticateToken,
  async (req, res) => {
    try {
      const user = req.user as any;
      const { email, sms, preferences } = req.body;

      await db.upsertNotificationPreferences({
        userId: user.id,
        emailAddress: preferences.emailAddress,
        phoneNumber: preferences.phoneNumber,
        enableEmail: preferences.enableEmail,
        enableSMS: preferences.enableSMS,
        emailPreferences: email,
        smsPreferences: sms,
        quietHoursEnabled: preferences.quietHours?.enabled,
        quietHoursStart: preferences.quietHours?.start,
        quietHoursEnd: preferences.quietHours?.end,
        language: preferences.language,
        timezone: preferences.timezone,
      });

      res.json({ message: "Notification preferences saved successfully" });
    } catch (error) {
      console.error("Save notification preferences error:", error);
      res
        .status(500)
        .json({ error: "Failed to save notification preferences" });
    }
  },
);

// Test notification endpoint
router.post("/notifications/test", authenticateToken, async (req, res) => {
  try {
    const user = req.user as any;
    const { type, email, phone } = req.body;

    const { notificationService } = await import(
      "../services/notificationService"
    );

    if (type === "email" && email) {
      const success = await notificationService.sendEmail(
        "bookingConfirmation",
        {
          recipientEmail: email,
          guestName: user.name,
          roomNumber: "TEST-101",
          confirmationCode: "TEST-" + Date.now(),
          checkInDate: new Date().toLocaleDateString(),
          checkOutDate: new Date(
            Date.now() + 24 * 60 * 60 * 1000,
          ).toLocaleDateString(),
          totalAmount: 150.0,
        },
      );

      // Log the test notification
      await db.logNotification({
        userId: user.id,
        type: "email",
        templateName: "bookingConfirmation",
        recipient: email,
        subject: "Test Email Notification",
        status: success ? "sent" : "failed",
        sentAt: success ? new Date() : undefined,
        metadata: { test: true },
      });

      res.json({
        success,
        message: success ? "Test email sent" : "Failed to send test email",
      });
    } else if (type === "sms" && phone) {
      const success = await notificationService.sendSMS("bookingConfirmation", {
        recipientPhone: phone,
        guestName: user.name,
        roomNumber: "TEST-101",
        confirmationCode: "TEST-" + Date.now(),
        checkInDate: new Date().toLocaleDateString(),
        checkOutDate: new Date(
          Date.now() + 24 * 60 * 60 * 1000,
        ).toLocaleDateString(),
        totalAmount: 150.0,
      });

      // Log the test notification
      await db.logNotification({
        userId: user.id,
        type: "sms",
        templateName: "bookingConfirmation",
        recipient: phone,
        status: success ? "sent" : "failed",
        sentAt: success ? new Date() : undefined,
        metadata: { test: true },
      });

      res.json({
        success,
        message: success ? "Test SMS sent" : "Failed to send test SMS",
      });
    } else {
      res.status(400).json({ error: "Invalid test parameters" });
    }
  } catch (error) {
    console.error("Test notification error:", error);
    res.status(500).json({ error: "Failed to send test notification" });
  }
});

// Get notification logs
router.get("/notifications/logs", authenticateToken, async (req, res) => {
  try {
    const user = req.user as any;
    const { type, status, limit = 50, offset = 0 } = req.query;

    const logs = await db.getNotificationLogs({
      userId: user.id,
      type: type as string,
      status: status as string,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });

    res.json(logs);
  } catch (error) {
    console.error("Get notification logs error:", error);
    res.status(500).json({ error: "Failed to get notification logs" });
  }
});

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default router;
