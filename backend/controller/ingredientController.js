import { Ingredient } from "../models/recipe.model.js";

export const addIngredientsBatch = async (req, res) => {
  try {
    const ingredients = req.body.ingredients; // Array von Zutaten mit Schadstoffen

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res
        .status(400)
        .json({ message: "No ingredients provided or wrong format." });
    }

    // Normalize and validate each ingredient before insert
    const normalized = [];
    for (const ingredient of ingredients) {
      // basic validation
      if (!ingredient.name || typeof ingredient.name !== "string") {
        return res.status(400).json({
          message: "Each ingredient must include a valid 'name' string.",
        });
      }

      const copy = { ...ingredient };

      // Accept contaminants as either an array of {name,value,unit}
      // or as an object map { arsenic: {value,unit}, ... }
      if (Array.isArray(copy.contaminants)) {
        const contaminantsObj = {};
        for (const contaminant of copy.contaminants) {
          if (
            !contaminant ||
            typeof contaminant.name !== "string" ||
            typeof contaminant.value !== "number" ||
            typeof contaminant.unit !== "string"
          ) {
            return res.status(400).json({
              message:
                "Each contaminant must have name (string), value (number), and unit (string).",
            });
          }
          // normalize key to camelCase / lowercase to be consistent
          const key = contaminant.name.replace(/\s+/g, "_").toLowerCase();
          contaminantsObj[key] = {
            value: contaminant.value,
            unit: contaminant.unit,
          };
        }
        copy.contaminants = contaminantsObj;
      } else if (copy.contaminants && typeof copy.contaminants === "object") {
        // ensure values are in expected shape { value, unit }
        // no further changes, but optionally we could validate shape here
      } else {
        // if no contaminants provided, ensure field is undefined (model allows missing)
        delete copy.contaminants;
      }

      // If amount/unit are strings, try to normalize numeric amount
      if (copy.amount && typeof copy.amount === "string") {
        const parsed = parseFloat(copy.amount.replace(/[^0-9.\-]/g, ""));
        if (!isNaN(parsed)) copy.amount = parsed;
      }

      normalized.push(copy);
    }

    // Bulk insert der Zutaten inklusive Schadstoffen
    // ordered:false will continue inserting even if one document fails validation
    const insertedIngredients = await Ingredient.insertMany(normalized, {
      ordered: false,
    });

    res.status(201).json({
      message: `${insertedIngredients.length} ingredients added successfully`,
      data: insertedIngredients,
    });
  } catch (error) {
    console.error("Error adding ingredients batch:", error);
    res.status(500).json({ message: "Failed to add ingredients batch", error });
  }
};

export const getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 }); // sort by name ascending
    res
      .status(200)
      .json({ message: "Ingredients fetched successfully", data: ingredients });
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    res.status(500).json({ message: "Failed to fetch ingredients", error });
  }
};
