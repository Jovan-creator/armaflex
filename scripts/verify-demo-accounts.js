#!/usr/bin/env node

import bcrypt from "bcrypt";
import { initializeDatabase } from "../server/database/db.js";

async function verifyDemoAccounts() {
  console.log("🔍 Verifying demo accounts...");

  try {
    const db = await initializeDatabase();

    // Test credentials that should work
    const testCredentials = [
      { email: "admin@armaflex.com", password: "admin123" },
      { email: "receptionist@armaflex.com", password: "reception123" },
      { email: "housekeeping@armaflex.com", password: "cleaning123" },
      { email: "maintenance@armaflex.com", password: "repair123" },
      { email: "finance@armaflex.com", password: "finance123" },
      { email: "restaurant@armaflex.com", password: "food123" },
      { email: "support@armaflex.com", password: "help123" },
    ];

    for (const cred of testCredentials) {
      const user = await db.get(
        "SELECT * FROM users WHERE email = ? AND is_active = true",
        [cred.email],
      );

      if (!user) {
        console.log(`❌ User not found: ${cred.email}`);
        continue;
      }

      const validPassword = await bcrypt.compare(
        cred.password,
        user.password_hash,
      );

      if (validPassword) {
        console.log(`✅ ${cred.email} - Password matches`);
      } else {
        console.log(`❌ ${cred.email} - Password does NOT match`);
        console.log(`   Expected: ${cred.password}`);
        console.log(`   Hash in DB: ${user.password_hash}`);
      }
    }

    console.log("\n📊 All users in database:");
    const allUsers = await db.all(
      "SELECT email, name, role, is_active FROM users",
    );
    console.table(allUsers);
  } catch (error) {
    console.error("❌ Error verifying demo accounts:", error);
  }
}

verifyDemoAccounts();
