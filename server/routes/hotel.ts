import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DatabaseService } from "../database/db";

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

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default router;
