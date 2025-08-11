import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { readFileSync } from "fs";
import { join } from "path";
import bcrypt from "bcrypt";

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function initializeDatabase(): Promise<
  Database<sqlite3.Database, sqlite3.Statement>
> {
  if (db) {
    return db;
  }

  // Open SQLite database
  // Use in-memory database for serverless environments like Netlify
  const isNetlify = process.env.NETLIFY || process.env.NETLIFY_ENV || process.env.AWS_LAMBDA_FUNCTION_NAME;
  const dbPath = isNetlify
    ? ":memory:"
    : join(process.cwd(), "hotel_management.db");

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Log database initialization for debugging
  if (isNetlify) {
    console.log("✅ Using in-memory SQLite database for serverless environment");
  } else {
    console.log(`✅ Using SQLite database at: ${dbPath}`);
  }

  // Read and execute schema
  const schema = readFileSync(join(__dirname, "schema.sql"), "utf8");
  await db.exec(schema);

  // Create default admin user with hashed password
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await db.run(
    `
    INSERT OR REPLACE INTO users (email, password_hash, name, role, department) 
    VALUES (?, ?, ?, ?, ?)
  `,
    [
      "admin@armaflex.com",
      hashedPassword,
      "System Administrator",
      "admin",
      "Management",
    ],
  );

  // Insert sample users
  const sampleUsers = [
    [
      "receptionist@armaflex.com",
      await bcrypt.hash("reception123", 10),
      "Sarah Johnson",
      "receptionist",
      "Front Desk",
    ],
    [
      "housekeeping@armaflex.com",
      await bcrypt.hash("cleaning123", 10),
      "Maria Garcia",
      "housekeeping",
      "Housekeeping",
    ],
    [
      "maintenance@armaflex.com",
      await bcrypt.hash("repair123", 10),
      "Robert Wilson",
      "maintenance",
      "Maintenance",
    ],
    [
      "finance@armaflex.com",
      await bcrypt.hash("finance123", 10),
      "Emily Davis",
      "accountant",
      "Finance",
    ],
    [
      "restaurant@armaflex.com",
      await bcrypt.hash("food123", 10),
      "Michael Chen",
      "restaurant",
      "Restaurant",
    ],
    [
      "support@armaflex.com",
      await bcrypt.hash("help123", 10),
      "Lisa Brown",
      "support",
      "IT Support",
    ],
  ];

  for (const user of sampleUsers) {
    await db.run(
      `
      INSERT OR IGNORE INTO users (email, password_hash, name, role, department) 
      VALUES (?, ?, ?, ?, ?)
    `,
      user,
    );
  }

  console.log("✅ Database initialized successfully");
  return db;
}

export async function getDatabase(): Promise<
  Database<sqlite3.Database, sqlite3.Statement>
> {
  if (!db) {
    return await initializeDatabase();
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}

// Database query helpers
export class DatabaseService {
  private static instance: DatabaseService;
  private db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async init(): Promise<void> {
    this.db = await getDatabase();
  }

  // User operations
  async findUserByEmail(email: string) {
    if (!this.db) await this.init();
    return await this.db!.get(
      "SELECT * FROM users WHERE email = ? AND is_active = true",
      [email],
    );
  }

  async createUser(userData: any) {
    if (!this.db) await this.init();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return await this.db!.run(
      `
      INSERT INTO users (email, password_hash, name, role, department) 
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        userData.email,
        hashedPassword,
        userData.name,
        userData.role,
        userData.department,
      ],
    );
  }

  async getAllUsers() {
    if (!this.db) await this.init();
    return await this.db!.all(
      `SELECT id, email, name, role, department, is_active, created_at, updated_at
       FROM users ORDER BY created_at DESC`,
    );
  }

  async updateUser(userId: number, userData: any) {
    if (!this.db) await this.init();

    let query = `
      UPDATE users
      SET name = ?, role = ?, department = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    let params = [userData.name, userData.role, userData.department, userId];

    // If password is provided, include it in the update
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      query = `
        UPDATE users
        SET name = ?, role = ?, department = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      params = [
        userData.name,
        userData.role,
        userData.department,
        hashedPassword,
        userId,
      ];
    }

    return await this.db!.run(query, params);
  }

  async updateUserStatus(userId: number, isActive: boolean) {
    if (!this.db) await this.init();
    return await this.db!.run(
      `UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [isActive, userId],
    );
  }

  async deleteUser(userId: number) {
    if (!this.db) await this.init();
    return await this.db!.run("DELETE FROM users WHERE id = ?", [userId]);
  }

  // Room operations
  async getAllRooms() {
    if (!this.db) await this.init();
    return await this.db!.all(`
      SELECT r.*, rt.name as room_type_name, rt.base_price, rt.max_occupancy 
      FROM rooms r 
      JOIN room_types rt ON r.room_type_id = rt.id
      ORDER BY r.room_number
    `);
  }

  async createRoom(roomData: any) {
    if (!this.db) await this.init();
    return await this.db!.run(
      `
      INSERT INTO rooms (room_number, room_type_id, floor, status, notes)
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        roomData.room_number,
        roomData.room_type_id,
        roomData.floor,
        roomData.status || "available",
        roomData.notes || null,
      ],
    );
  }

  async updateRoom(roomId: number, roomData: any) {
    if (!this.db) await this.init();
    return await this.db!.run(
      `
      UPDATE rooms
      SET room_number = ?, room_type_id = ?, floor = ?, status = ?, notes = ?
      WHERE id = ?
    `,
      [
        roomData.room_number,
        roomData.room_type_id,
        roomData.floor,
        roomData.status,
        roomData.notes || null,
        roomId,
      ],
    );
  }

  async deleteRoom(roomId: number) {
    if (!this.db) await this.init();
    return await this.db!.run("DELETE FROM rooms WHERE id = ?", [roomId]);
  }

  // Room type operations
  async getAllRoomTypes() {
    if (!this.db) await this.init();
    return await this.db!.all(
      "SELECT * FROM room_types WHERE is_active = true ORDER BY name",
    );
  }

  async createRoomType(roomTypeData: any) {
    if (!this.db) await this.init();
    return await this.db!.run(
      `
      INSERT INTO room_types (name, description, base_price, max_occupancy, amenities)
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        roomTypeData.name,
        roomTypeData.description,
        roomTypeData.base_price,
        roomTypeData.max_occupancy,
        roomTypeData.amenities,
      ],
    );
  }

  async updateRoomType(roomTypeId: number, roomTypeData: any) {
    if (!this.db) await this.init();
    return await this.db!.run(
      `
      UPDATE room_types
      SET name = ?, description = ?, base_price = ?, max_occupancy = ?, amenities = ?
      WHERE id = ?
    `,
      [
        roomTypeData.name,
        roomTypeData.description,
        roomTypeData.base_price,
        roomTypeData.max_occupancy,
        roomTypeData.amenities,
        roomTypeId,
      ],
    );
  }

  // Reservation operations
  async getAllReservations() {
    if (!this.db) await this.init();
    return await this.db!.all(`
      SELECT
        r.id,
        r.check_in_date,
        r.check_out_date,
        r.adults,
        r.children,
        r.total_amount,
        r.status,
        r.special_requests,
        r.created_at,
        g.first_name || ' ' || g.last_name as guest_name,
        g.email as guest_email,
        g.phone as guest_phone,
        rm.room_number,
        rt.name as room_type_name,
        u.name as created_by
      FROM reservations r
      JOIN guests g ON r.guest_id = g.id
      JOIN rooms rm ON r.room_id = rm.id
      JOIN room_types rt ON rm.room_type_id = rt.id
      LEFT JOIN users u ON r.created_by = u.id
      ORDER BY r.created_at DESC
    `);
  }

  async createReservation(reservationData: any) {
    if (!this.db) await this.init();
    return await this.db!.run(
      `
      INSERT INTO reservations (guest_id, room_id, check_in_date, check_out_date, adults, children, total_amount, status, special_requests, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        reservationData.guest_id,
        reservationData.room_id,
        reservationData.check_in_date,
        reservationData.check_out_date,
        reservationData.adults,
        reservationData.children,
        reservationData.total_amount,
        reservationData.status || "confirmed",
        reservationData.special_requests,
        reservationData.created_by,
      ],
    );
  }

  async updateReservationStatus(reservationId: number, status: string) {
    if (!this.db) await this.init();
    return await this.db!.run(
      `UPDATE reservations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, reservationId],
    );
  }

  async cancelReservation(reservationId: number) {
    if (!this.db) await this.init();
    return await this.db!.run(
      `UPDATE reservations SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [reservationId],
    );
  }

  async getAvailableRooms(checkIn: string, checkOut: string) {
    if (!this.db) await this.init();
    return await this.db!.all(
      `
      SELECT r.*, rt.name as room_type_name, rt.base_price, rt.max_occupancy 
      FROM rooms r 
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.status = 'available' 
      AND r.id NOT IN (
        SELECT room_id FROM reservations 
        WHERE status IN ('confirmed', 'checked_in') 
        AND (
          (check_in_date <= ? AND check_out_date > ?) OR
          (check_in_date < ? AND check_out_date >= ?) OR
          (check_in_date >= ? AND check_out_date <= ?)
        )
      )
      ORDER BY rt.base_price
    `,
      [checkIn, checkIn, checkOut, checkOut, checkIn, checkOut],
    );
  }

  // Guest operations
  async createGuest(guestData: any) {
    if (!this.db) await this.init();
    return await this.db!.run(
      `
      INSERT INTO guests (first_name, last_name, email, phone, address, id_number) 
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        guestData.first_name,
        guestData.last_name,
        guestData.email,
        guestData.phone,
        guestData.address,
        guestData.id_number,
      ],
    );
  }

  async findGuestByEmail(email: string) {
    if (!this.db) await this.init();
    return await this.db!.get("SELECT * FROM guests WHERE email = ?", [email]);
  }

  // Payment operations
  async createPayment(paymentData: any) {
    if (!this.db) await this.init();
    return await this.db!.run(
      `
      INSERT INTO payments (reservation_id, stripe_payment_intent_id, amount, currency, status, payment_method, card_last4, card_brand, description, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        paymentData.reservation_id,
        paymentData.stripe_payment_intent_id,
        paymentData.amount,
        paymentData.currency || "USD",
        paymentData.status,
        paymentData.payment_method,
        paymentData.card_last4,
        paymentData.card_brand,
        paymentData.description,
        paymentData.metadata ? JSON.stringify(paymentData.metadata) : null,
      ],
    );
  }

  async updatePaymentStatus(paymentId: number, status: string, metadata?: any) {
    if (!this.db) await this.init();
    return await this.db!.run(
      `UPDATE payments SET status = ?, metadata = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, metadata ? JSON.stringify(metadata) : null, paymentId],
    );
  }

  async getPaymentsByReservation(reservationId: number) {
    if (!this.db) await this.init();
    return await this.db!.all(
      `SELECT * FROM payments WHERE reservation_id = ? ORDER BY created_at DESC`,
      [reservationId],
    );
  }

  async getAllPayments() {
    if (!this.db) await this.init();
    return await this.db!.all(`
      SELECT
        p.*,
        r.id as reservation_id,
        g.first_name || ' ' || g.last_name as guest_name,
        g.email as guest_email,
        rm.room_number
      FROM payments p
      JOIN reservations r ON p.reservation_id = r.id
      JOIN guests g ON r.guest_id = g.id
      JOIN rooms rm ON r.room_id = rm.id
      ORDER BY p.created_at DESC
    `);
  }

  async createRefund(refundData: any) {
    if (!this.db) await this.init();
    return await this.db!.run(
      `
      INSERT INTO payment_refunds (payment_id, stripe_refund_id, amount, reason, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        refundData.payment_id,
        refundData.stripe_refund_id,
        refundData.amount,
        refundData.reason,
        refundData.status,
        refundData.created_by,
      ],
    );
  }

  async getRefundsByPayment(paymentId: number) {
    if (!this.db) await this.init();
    return await this.db!.all(
      `SELECT * FROM payment_refunds WHERE payment_id = ? ORDER BY created_at DESC`,
      [paymentId],
    );
  }

  // Notification preferences methods
  static async getNotificationPreferences(userId?: number, guestId?: number) {
    const database = await getDatabase();

    const preferences = await database.get(
      `SELECT * FROM notification_preferences
       WHERE user_id = ? OR guest_id = ?`,
      [userId, guestId],
    );

    if (!preferences) {
      return null;
    }

    return {
      ...preferences,
      email_preferences: preferences.email_preferences
        ? JSON.parse(preferences.email_preferences)
        : {},
      sms_preferences: preferences.sms_preferences
        ? JSON.parse(preferences.sms_preferences)
        : {},
    };
  }

  static async upsertNotificationPreferences(preferences: {
    userId?: number;
    guestId?: number;
    emailAddress?: string;
    phoneNumber?: string;
    enableEmail?: boolean;
    enableSMS?: boolean;
    emailPreferences?: any;
    smsPreferences?: any;
    quietHoursEnabled?: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
    language?: string;
    timezone?: string;
  }) {
    const database = await getDatabase();

    const existingPrefs = await this.getNotificationPreferences(
      preferences.userId,
      preferences.guestId,
    );

    if (existingPrefs) {
      await database.run(
        `UPDATE notification_preferences
         SET email_address = ?, phone_number = ?, enable_email = ?, enable_sms = ?,
             email_preferences = ?, sms_preferences = ?, quiet_hours_enabled = ?,
             quiet_hours_start = ?, quiet_hours_end = ?, language = ?, timezone = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ? OR guest_id = ?`,
        [
          preferences.emailAddress,
          preferences.phoneNumber,
          preferences.enableEmail,
          preferences.enableSMS,
          JSON.stringify(preferences.emailPreferences || {}),
          JSON.stringify(preferences.smsPreferences || {}),
          preferences.quietHoursEnabled,
          preferences.quietHoursStart,
          preferences.quietHoursEnd,
          preferences.language,
          preferences.timezone,
          preferences.userId,
          preferences.guestId,
        ],
      );
    } else {
      await database.run(
        `INSERT INTO notification_preferences
         (user_id, guest_id, email_address, phone_number, enable_email, enable_sms,
          email_preferences, sms_preferences, quiet_hours_enabled, quiet_hours_start,
          quiet_hours_end, language, timezone)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          preferences.userId,
          preferences.guestId,
          preferences.emailAddress,
          preferences.phoneNumber,
          preferences.enableEmail,
          preferences.enableSMS,
          JSON.stringify(preferences.emailPreferences || {}),
          JSON.stringify(preferences.smsPreferences || {}),
          preferences.quietHoursEnabled,
          preferences.quietHoursStart,
          preferences.quietHoursEnd,
          preferences.language,
          preferences.timezone,
        ],
      );
    }

    return this.getNotificationPreferences(
      preferences.userId,
      preferences.guestId,
    );
  }

  // Additional room methods
  static async getRoomById(roomId: number) {
    const database = await getDatabase();
    return await database.get(
      `
      SELECT r.*, rt.name as room_type_name, rt.base_price, rt.max_occupancy
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.id = ?
    `,
      [roomId],
    );
  }

  // Additional reservation methods
  static async updateReservation(reservationId: number, reservationData: any) {
    const database = await getDatabase();

    const updates: string[] = [];
    const values: any[] = [];

    if (reservationData.guest_id !== undefined) {
      updates.push("guest_id = ?");
      values.push(reservationData.guest_id);
    }

    if (reservationData.room_id !== undefined) {
      updates.push("room_id = ?");
      values.push(reservationData.room_id);
    }

    if (reservationData.check_in_date !== undefined) {
      updates.push("check_in_date = ?");
      values.push(reservationData.check_in_date);
    }

    if (reservationData.check_out_date !== undefined) {
      updates.push("check_out_date = ?");
      values.push(reservationData.check_out_date);
    }

    if (reservationData.adults !== undefined) {
      updates.push("adults = ?");
      values.push(reservationData.adults);
    }

    if (reservationData.children !== undefined) {
      updates.push("children = ?");
      values.push(reservationData.children);
    }

    if (reservationData.total_amount !== undefined) {
      updates.push("total_amount = ?");
      values.push(reservationData.total_amount);
    }

    if (reservationData.status !== undefined) {
      updates.push("status = ?");
      values.push(reservationData.status);
    }

    if (reservationData.confirmation_code !== undefined) {
      updates.push("confirmation_code = ?");
      values.push(reservationData.confirmation_code);
    }

    if (reservationData.special_requests !== undefined) {
      updates.push("special_requests = ?");
      values.push(reservationData.special_requests);
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(reservationId);

    return await database.run(
      `UPDATE reservations SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );
  }

  // Additional payment methods
  static async findPaymentByStripeId(stripePaymentIntentId: string) {
    const database = await getDatabase();
    return await database.get(
      `SELECT * FROM payments WHERE stripe_payment_intent_id = ?`,
      [stripePaymentIntentId],
    );
  }

  static async updatePaymentStatus(paymentId: number, status: string) {
    const database = await getDatabase();
    return await database.run(
      `UPDATE payments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, paymentId],
    );
  }

  static async updateRefundStatus(stripeRefundId: string, status: string) {
    const database = await getDatabase();
    return await database.run(
      `UPDATE payment_refunds SET status = ? WHERE stripe_refund_id = ?`,
      [status, stripeRefundId],
    );
  }

  static async getReservationById(reservationId: number) {
    const database = await getDatabase();
    return await database.get(
      `SELECT r.*, g.first_name, g.last_name, g.email, g.phone
       FROM reservations r
       JOIN guests g ON r.guest_id = g.id
       WHERE r.id = ?`,
      [reservationId],
    );
  }

  static async getGuestById(guestId: number) {
    const database = await getDatabase();
    return await database.get(`SELECT * FROM guests WHERE id = ?`, [guestId]);
  }

  // Notification logs methods
  static async logNotification(log: {
    userId?: number;
    guestId?: number;
    type: "email" | "sms";
    templateName: string;
    recipient: string;
    subject?: string;
    status?: string;
    errorMessage?: string;
    sentAt?: Date;
    deliveredAt?: Date;
    metadata?: any;
  }) {
    const database = await getDatabase();

    const result = await database.run(
      `INSERT INTO notification_logs
       (user_id, guest_id, type, template_name, recipient, subject, status,
        error_message, sent_at, delivered_at, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        log.userId,
        log.guestId,
        log.type,
        log.templateName,
        log.recipient,
        log.subject,
        log.status || "pending",
        log.errorMessage,
        log.sentAt,
        log.deliveredAt,
        JSON.stringify(log.metadata || {}),
      ],
    );

    return result.lastID;
  }

  static async updateNotificationStatus(
    logId: number,
    status: string,
    errorMessage?: string,
    deliveredAt?: Date,
  ) {
    const database = await getDatabase();

    await database.run(
      `UPDATE notification_logs
       SET status = ?, error_message = ?, delivered_at = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, errorMessage, deliveredAt, logId],
    );
  }

  static async getNotificationLogs(
    filters: {
      userId?: number;
      guestId?: number;
      type?: string;
      status?: string;
      limit?: number;
      offset?: number;
    } = {},
  ) {
    const database = await getDatabase();

    let query = `SELECT * FROM notification_logs WHERE 1=1`;
    const params: any[] = [];

    if (filters.userId) {
      query += ` AND user_id = ?`;
      params.push(filters.userId);
    }

    if (filters.guestId) {
      query += ` AND guest_id = ?`;
      params.push(filters.guestId);
    }

    if (filters.type) {
      query += ` AND type = ?`;
      params.push(filters.type);
    }

    if (filters.status) {
      query += ` AND status = ?`;
      params.push(filters.status);
    }

    query += ` ORDER BY created_at DESC`;

    if (filters.limit) {
      query += ` LIMIT ?`;
      params.push(filters.limit);

      if (filters.offset) {
        query += ` OFFSET ?`;
        params.push(filters.offset);
      }
    }

    return database.all(query, params);
  }
}
