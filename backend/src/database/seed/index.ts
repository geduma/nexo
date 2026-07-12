import { supabase } from "../../config/database.js";

async function seed(): Promise<void> {
  console.log("Seeding database via Supabase REST API...");

  const { data: existingCategory } = await supabase
    .from("categories")
    .select("id")
    .limit(1);

  if (!existingCategory || existingCategory.length === 0) {
    const { error } = await supabase.from("categories").insert({
      name: "General",
      slug: "general",
      description: "General product category",
      display_order: 0,
      is_active: true,
    });
    if (error) throw error;
    console.log("Created default category: General");
  }

  const { data: existingSettings } = await supabase
    .from("settings")
    .select("id")
    .limit(1);

  if (!existingSettings || existingSettings.length === 0) {
    const { error } = await supabase.from("settings").insert({
      business_name: "NEXO",
      currency: "COP",
      currency_symbol: "$",
      default_language: "es",
      whatsapp_number: "",
      theme: "system",
    });
    if (error) throw error;
    console.log("Created default settings");
  }

  console.log("Seed completed!");
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
