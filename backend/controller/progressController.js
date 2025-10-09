import WeightEntry from "../models/weightEntry.model.js";
import Profile from "../models/profile.model.js";

/**
 * Get weight entries for the authenticated user
 * Query params: period (90days, 6months, 1year, all)
 */
export const getWeightEntries = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = "90days" } = req.query;

    // Calculate date filter based on period
    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case "90days":
        dateFilter = {
          date: { $gte: new Date(now.setDate(now.getDate() - 90)) },
        };
        break;
      case "6months":
        dateFilter = {
          date: { $gte: new Date(now.setMonth(now.getMonth() - 6)) },
        };
        break;
      case "1year":
        dateFilter = {
          date: { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) },
        };
        break;
      case "all":
      default:
        dateFilter = {}; // No filter, get all entries
        break;
    }

    // Fetch entries sorted by date (newest first)
    const entries = await WeightEntry.find({
      userId,
      ...dateFilter,
    })
      .sort({ date: -1 })
      .lean();

    // Get profile to use as fallback and for goal weight
    const profile = await Profile.findOne({ user: userId }).lean();

    // Calculate statistics
    let stats = {
      currentWeight: 0,
      startWeight: 0,
      weightChange: 0,
      entriesCount: entries.length,
    };

    if (entries.length > 0) {
      stats.currentWeight = entries[0].weight; // Most recent
      stats.startWeight = entries[entries.length - 1].weight; // Oldest in the period
      stats.weightChange = stats.currentWeight - stats.startWeight;
    } else if (profile?.weight) {
      // If no entries yet, use profile weight
      stats.currentWeight = profile.weight;
      stats.startWeight = profile.weight;
    }

    // Get goal weight from profile if available
    if (profile?.targetWeight) {
      stats.goalWeight = profile.targetWeight;
    }

    return res.status(200).json({
      success: true,
      data: {
        entries,
        stats,
      },
    });
  } catch (error) {
    console.error("Error fetching weight entries:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch weight entries",
    });
  }
};

/**
 * Add a new weight entry
 */
export const addWeightEntry = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      weight,
      bodyFatPercentage,
      muscleMass,
      bodyMeasurements,
      notes,
      date,
    } = req.body;

    // Validate weight
    if (!weight || typeof weight !== "number" || weight < 30 || weight > 300) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid weight between 30 and 300 kg",
      });
    }

    // Create new entry
    const entry = new WeightEntry({
      userId,
      weight,
      bodyFatPercentage: bodyFatPercentage || undefined,
      muscleMass: muscleMass || undefined,
      bodyMeasurements: bodyMeasurements || undefined,
      notes: notes?.trim() || undefined,
      date: date ? new Date(date) : new Date(),
    });

    await entry.save();

    return res.status(201).json({
      success: true,
      message: "Weight entry added successfully",
      data: entry,
    });
  } catch (error) {
    console.error("Error adding weight entry:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add weight entry",
    });
  }
};

/**
 * Delete a weight entry
 */
export const deleteWeightEntry = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const entry = await WeightEntry.findOneAndDelete({
      _id: id,
      userId, // Ensure user can only delete their own entries
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Weight entry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Weight entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting weight entry:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete weight entry",
    });
  }
};

/**
 * Get progress insights and analysis
 */
export const getProgressInsights = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all weight entries
    const entries = await WeightEntry.find({ userId }).sort({ date: 1 }).lean();

    if (entries.length < 2) {
      return res.status(200).json({
        success: true,
        data: {
          message: "Not enough data for insights. Add more weight entries!",
          entriesCount: entries.length,
        },
      });
    }

    // Calculate various metrics
    const currentWeight = entries[entries.length - 1].weight;
    const startWeight = entries[0].weight;
    const totalChange = currentWeight - startWeight;

    // Calculate average weekly change
    const daysDiff =
      (new Date(entries[entries.length - 1].date) - new Date(entries[0].date)) /
      (1000 * 60 * 60 * 24);
    const weeksDiff = daysDiff / 7;
    const avgWeeklyChange = weeksDiff > 0 ? totalChange / weeksDiff : 0;

    // Last 30 days trend
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const last30DaysEntries = entries.filter(
      (e) => new Date(e.date) >= thirtyDaysAgo
    );

    let last30DaysChange = 0;
    if (last30DaysEntries.length >= 2) {
      last30DaysChange =
        last30DaysEntries[last30DaysEntries.length - 1].weight -
        last30DaysEntries[0].weight;
    }

    // Get profile for goal weight
    const profile = await Profile.findOne({ userId }).lean();
    const goalWeight = profile?.goalWeight;

    let progressToGoal = null;
    if (goalWeight) {
      const totalToLose = startWeight - goalWeight;
      const lostSoFar = startWeight - currentWeight;
      const percentComplete =
        totalToLose !== 0 ? (lostSoFar / totalToLose) * 100 : 0;

      progressToGoal = {
        goalWeight,
        remaining: currentWeight - goalWeight,
        percentComplete: Math.round(percentComplete),
      };
    }

    return res.status(200).json({
      success: true,
      data: {
        currentWeight,
        startWeight,
        totalChange,
        avgWeeklyChange: parseFloat(avgWeeklyChange.toFixed(2)),
        last30DaysChange: parseFloat(last30DaysChange.toFixed(2)),
        entriesCount: entries.length,
        trackingDays: Math.round(daysDiff),
        progressToGoal,
      },
    });
  } catch (error) {
    console.error("Error fetching progress insights:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch progress insights",
    });
  }
};
