import express from "express";
import Group from "../models/Group.js";
import User from "../models/User.js";
import { Level1Result, Level2Result, Level3Result, Level4Result, Level5Result } from "../models/LevelResult.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Get user's group with leaderboard
router.get("/my-group/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the group that contains this user
    const group = await Group.findOne({ players: userId })
      .populate("players", "name email role");

    if (!group) {
      return res.status(404).json({ message: "User is not in any group" });
    }

    const playerIds = group.players.map(p => p._id);

    // Get all results for group players
    const [level1, level2, level3, level4, level5] = await Promise.all([
      Level1Result.find({ playerId: { $in: playerIds } }),
      Level2Result.find({ playerId: { $in: playerIds } }),
      Level3Result.find({ playerId: { $in: playerIds } }),
      Level4Result.find({ playerId: { $in: playerIds } }),
      Level5Result.find({ playerId: { $in: playerIds } }),
    ]);

    // Calculate stats per player
    const playerStats = {};
    group.players.forEach(player => {
      playerStats[player._id.toString()] = {
        playerId: player._id,
        name: player.name,
        email: player.email,
        totalProfit: 0,
        totalOutput: 0,
        totalCost: 0,
        totalRevenue: 0,
        submissions: 0,
        avgCostPerUnit: 0,
        efficiencyScore: 0,
      };
    });

    // Process all results
    const allResults = [...level1, ...level2, ...level3, ...level4, ...level5];
    allResults.forEach(r => {
      const pid = r.playerId.toString();
      if (playerStats[pid]) {
        playerStats[pid].totalProfit += r.profit || 0;
        playerStats[pid].totalOutput += r.output || 0;
        playerStats[pid].totalCost += r.totalCost || r.TC || 0;
        playerStats[pid].totalRevenue += r.totalRevenue || 0;
        playerStats[pid].submissions++;
      }
    });

    // Calculate derived metrics and build leaderboard array
    const leaderboard = Object.values(playerStats).map(player => {
      const avgCostPerUnit = player.totalOutput > 0 
        ? player.totalCost / player.totalOutput 
        : 0;
      
      // Efficiency score: based on profit margin and output
      const profitMargin = player.totalRevenue > 0 
        ? (player.totalProfit / player.totalRevenue) * 100 
        : 0;
      const efficiencyScore = Math.min(100, Math.max(0, 50 + profitMargin));

      return {
        ...player,
        avgCostPerUnit: Math.round(avgCostPerUnit),
        efficiencyScore: parseFloat(efficiencyScore.toFixed(1)),
      };
    });

    // Sort by profit (descending) and assign ranks
    leaderboard.sort((a, b) => b.totalProfit - a.totalProfit);
    leaderboard.forEach((player, index) => {
      player.rank = index + 1;
    });

    res.json({
      group: {
        _id: group._id,
        name: group.name,
        sessionId: group.sessionId,
        locked: group.locked,
        maxPlayers: group.maxPlayers,
        playerCount: group.players.length,
      },
      leaderboard,
      currentUserId: userId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's dashboard data - stats and recent results from their group
router.get("/my-dashboard/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user info
    const user = await User.findById(userId).select("name email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the group that contains this user
    const group = await Group.findOne({ players: userId })
      .populate("players", "name email role");

    // Get user's own results across all levels
    const [level1, level2, level3, level4, level5] = await Promise.all([
      Level1Result.find({ playerId: userId }).sort({ createdAt: -1 }),
      Level2Result.find({ playerId: userId }).sort({ createdAt: -1 }),
      Level3Result.find({ playerId: userId }).sort({ createdAt: -1 }),
      Level4Result.find({ playerId: userId }).sort({ createdAt: -1 }),
      Level5Result.find({ playerId: userId }).sort({ createdAt: -1 }),
    ]);

    // Combine all results with level info
    const allResults = [
      ...level1.map(r => ({ ...r.toObject(), level: 1 })),
      ...level2.map(r => ({ ...r.toObject(), level: 2 })),
      ...level3.map(r => ({ ...r.toObject(), level: 3 })),
      ...level4.map(r => ({ ...r.toObject(), level: 4 })),
      ...level5.map(r => ({ ...r.toObject(), level: 5 })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Calculate user's aggregate stats
    let totalProfit = 0;
    let totalOutput = 0;
    let totalCost = 0;
    let totalRevenue = 0;

    allResults.forEach(r => {
      totalProfit += r.profit || 0;
      totalOutput += r.output || 0;
      totalCost += r.totalCost || r.TC || 0;
      totalRevenue += r.totalRevenue || 0;
    });

    const submissions = allResults.length;
    const avgCostPerUnit = totalOutput > 0 ? totalCost / totalOutput : 0;

    // Calculate user's rank in their group (if in a group)
    let userRank = null;
    let groupInfo = null;

    if (group) {
      const playerIds = group.players.map(p => p._id);

      // Get all results for group players
      const [gl1, gl2, gl3, gl4, gl5] = await Promise.all([
        Level1Result.find({ playerId: { $in: playerIds } }),
        Level2Result.find({ playerId: { $in: playerIds } }),
        Level3Result.find({ playerId: { $in: playerIds } }),
        Level4Result.find({ playerId: { $in: playerIds } }),
        Level5Result.find({ playerId: { $in: playerIds } }),
      ]);

      // Calculate profit per player
      const playerProfits = {};
      group.players.forEach(p => {
        playerProfits[p._id.toString()] = 0;
      });

      [...gl1, ...gl2, ...gl3, ...gl4, ...gl5].forEach(r => {
        const pid = r.playerId.toString();
        if (playerProfits[pid] !== undefined) {
          playerProfits[pid] += r.profit || 0;
        }
      });

      // Sort players by profit and find user's rank
      const sortedPlayers = Object.entries(playerProfits)
        .sort(([, a], [, b]) => b - a);
      
      const userIndex = sortedPlayers.findIndex(([id]) => id === userId);
      userRank = userIndex >= 0 ? userIndex + 1 : null;

      groupInfo = {
        _id: group._id,
        name: group.name,
        playerCount: group.players.length,
        locked: group.locked,
      };
    }

    // Format recent results for display
    const recentResults = allResults.slice(0, 10).map(r => ({
      _id: r._id,
      level: r.level,
      labor: r.labor,
      capital: r.capital || r.fixedCapital,
      output: r.output,
      totalCost: r.totalCost || r.TC,
      totalRevenue: r.totalRevenue,
      profit: r.profit,
      createdAt: r.createdAt,
    }));

    res.json({
      user: {
        _id: userId,
        name: user.name,
        email: user.email,
      },
      group: groupInfo,
      stats: {
        totalProfit,
        totalOutput,
        totalCost,
        totalRevenue,
        submissions,
        avgCostPerUnit: Math.round(avgCostPerUnit),
        levelsCompleted: submissions,
        rank: userRank,
      },
      recentResults,
      levelBreakdown: {
        level1: level1.length,
        level2: level2.length,
        level3: level3.length,
        level4: level4.length,
        level5: level5.length,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all groups
router.get("/", async (req, res) => {
  try {
    const groups = await Group.find({})
      .populate("players", "name email role")
      .sort({ createdAt: -1 });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single group by ID
router.get("/:id", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("players", "name email role");
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new group
router.post("/", async (req, res) => {
  try {
    const { name, maxPlayers = 5, sessionId } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Group name is required" });
    }

    const group = await Group.create({
      name,
      maxPlayers,
      sessionId: sessionId || uuidv4(),
      players: [],
      createdByAdmin: true,
      locked: false,
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add user to group
router.post("/:id/add-user", async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.locked) {
      return res.status(400).json({ message: "Group is locked. Cannot add users." });
    }

    if (group.players.length >= group.maxPlayers) {
      return res.status(400).json({ message: `Group is full. Maximum ${group.maxPlayers} players allowed.` });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already in this group
    if (group.players.includes(userId)) {
      return res.status(400).json({ message: "User is already in this group" });
    }

    // Check if user is already in another group
    const existingGroup = await Group.findOne({ players: userId });
    if (existingGroup) {
      return res.status(400).json({ 
        message: `User is already in group "${existingGroup.name}"` 
      });
    }

    group.players.push(userId);
    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate("players", "name email role");

    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove user from group
router.post("/:id/remove-user", async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.locked) {
      return res.status(400).json({ message: "Group is locked. Cannot remove users." });
    }

    group.players = group.players.filter(p => p.toString() !== userId);
    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate("players", "name email role");

    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lock group
router.patch("/:id/lock", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.players.length === 0) {
      return res.status(400).json({ message: "Cannot lock an empty group" });
    }

    group.locked = true;
    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate("players", "name email role");

    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unlock group
router.patch("/:id/unlock", async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(
      req.params.id,
      { locked: false },
      { new: true }
    ).populate("players", "name email role");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete group
router.delete("/:id", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.locked) {
      return res.status(400).json({ message: "Cannot delete a locked group. Unlock it first." });
    }

    await Group.findByIdAndDelete(req.params.id);
    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available users (not in any group)
router.get("/available/users", async (req, res) => {
  try {
    // Get all user IDs that are already in groups
    const groups = await Group.find({});
    const assignedUserIds = groups.flatMap(g => g.players.map(p => p.toString()));

    // Get users not in any group (only students)
    const availableUsers = await User.find({
      _id: { $nin: assignedUserIds },
      role: "student"
    }).select("name email role createdAt");

    res.json(availableUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get group stats
router.get("/stats/summary", async (req, res) => {
  try {
    const totalGroups = await Group.countDocuments();
    const lockedGroups = await Group.countDocuments({ locked: true });
    const unlockedGroups = await Group.countDocuments({ locked: false });
    
    const groups = await Group.find({});
    const totalPlayersInGroups = groups.reduce((sum, g) => sum + g.players.length, 0);
    const fullGroups = groups.filter(g => g.players.length >= g.maxPlayers).length;

    res.json({
      totalGroups,
      lockedGroups,
      unlockedGroups,
      totalPlayersInGroups,
      fullGroups,
      averagePlayersPerGroup: totalGroups > 0 ? (totalPlayersInGroups / totalGroups).toFixed(1) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
