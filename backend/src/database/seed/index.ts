import { db } from "../../config/database.js";
import { categories, settings } from "../schema/index.js";

async function seed(): Promise<void> {
  console.log("Seeding database...");

  const existingCategory = await db.select().from(categories).limit(1);
  if (existingCategory.length === 0) {
    await db.insert(categories).values({
      name: "General",
      slug: "general",
      description: "General product category",
      displayOrder: 0,
      isActive: true,
    });
    console.log("Created default category: General");
  }

  const existingSettings = await db.select().from(settings).limit(1);
  if (existingSettings.length === 0) {
    await db.insert(settings).values({
      businessName: "NEXO",
      currency: "COP",
      currencySymbol: "$",
      defaultLanguage: "es",
      whatsappNumber: "",
      theme: "system",
    });
    console.log("Created default settings");
  }

  console.log("Seed completed!");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
