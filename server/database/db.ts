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
  db = await open({
    filename: join(process.cwd(), "hotel_management.db"),
    driver: sqlite3.Database,
  });

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
}
