import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Group from "../models/Group.js";
import { Level1Result, Level2Result, Level3Result, Level4Result, Level5Result } from "../models/LevelResult.js";

const router = express.Router();

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new user (admin only)
router.post("/users", async (req, res) => {
  try {
    const { name, email, password, role = "student" } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({ success: true, user: userResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role
router.patch("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user password
router.patch("/users/:id/password", async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { password: hashedPassword },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ success: true, message: "Password updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all results from all levels for all users
router.get("/results", async (req, res) => {
  try {
    const [level1, level2, level3, level4, level5] = await Promise.all([
      Level1Result.find({}).sort({ createdAt: -1 }),
      Level2Result.find({}).sort({ createdAt: -1 }),
      Level3Result.find({}).sort({ createdAt: -1 }),
      Level4Result.find({}).sort({ createdAt: -1 }),
      Level5Result.find({}).sort({ createdAt: -1 }),
    ]);

    res.json({
      level1,
      level2,
      level3,
      level4,
      level5,
      totals: {
        level1: level1.length,
        level2: level2.length,
        level3: level3.length,
        level4: level4.length,
        level5: level5.length,
        total: level1.length + level2.length + level3.length + level4.length + level5.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get results for a specific user
router.get("/results/user/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;
    
    const [level1, level2, level3, level4, level5] = await Promise.all([
      Level1Result.find({ playerId }).sort({ createdAt: -1 }),
      Level2Result.find({ playerId }).sort({ createdAt: -1 }),
      Level3Result.find({ playerId }).sort({ createdAt: -1 }),
      Level4Result.find({ playerId }).sort({ createdAt: -1 }),
      Level5Result.find({ playerId }).sort({ createdAt: -1 }),
    ]);

    res.json({ level1, level2, level3, level4, level5 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: "admin" });
    const studentUsers = await User.countDocuments({ role: "student" });
    
    const [l1, l2, l3, l4, l5] = await Promise.all([
      Level1Result.countDocuments(),
      Level2Result.countDocuments(),
      Level3Result.countDocuments(),
      Level4Result.countDocuments(),
      Level5Result.countDocuments(),
    ]);

    // Group stats
    const totalGroups = await Group.countDocuments();
    const lockedGroups = await Group.countDocuments({ locked: true });

    res.json({
      users: {
        total: totalUsers,
        admins: adminUsers,
        students: studentUsers
      },
      submissions: {
        level1: l1,
        level2: l2,
        level3: l3,
        level4: l4,
        level5: l5,
        total: l1 + l2 + l3 + l4 + l5
      },
      groups: {
        total: totalGroups,
        locked: lockedGroups
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get results by group with winner determination
router.get("/results/group/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    
    // Get the group and its players
    const group = await Group.findById(groupId).populate("players", "name email");
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const playerIds = group.players.map(p => p._id);

    // Get results for all players in the group
    const [level1, level2, level3, level4, level5] = await Promise.all([
      Level1Result.find({ playerId: { $in: playerIds } }).sort({ createdAt: -1 }),
      Level2Result.find({ playerId: { $in: playerIds } }).sort({ createdAt: -1 }),
      Level3Result.find({ playerId: { $in: playerIds } }).sort({ createdAt: -1 }),
      Level4Result.find({ playerId: { $in: playerIds } }).sort({ createdAt: -1 }),
      Level5Result.find({ playerId: { $in: playerIds } }).sort({ createdAt: -1 }),
    ]);

    // Calculate total profit per player
    const playerProfits = {};
    const playerSubmissions = {};

    group.players.forEach(player => {
      playerProfits[player._id.toString()] = 0;
      playerSubmissions[player._id.toString()] = 0;
    });

    const processResults = (results) => {
      results.forEach(r => {
        const pid = r.playerId.toString();
        if (playerProfits[pid] !== undefined) {
          playerProfits[pid] += r.profit || 0;
          playerSubmissions[pid]++;
        }
      });
    };

    processResults(level1);
    processResults(level2);
    processResults(level3);
    processResults(level4);
    processResults(level5);

    // Build player stats array
    const playerStats = group.players.map(player => ({
      playerId: player._id,
      name: player.name,
      email: player.email,
      totalProfit: playerProfits[player._id.toString()],
      totalSubmissions: playerSubmissions[player._id.toString()],
    }));

    // Sort by total profit to determine rankings
    playerStats.sort((a, b) => b.totalProfit - a.totalProfit);

    // Assign ranks
    playerStats.forEach((player, index) => {
      player.rank = index + 1;
    });

    // Determine winner (player with highest profit who has submissions)
    const winner = playerStats.find(p => p.totalSubmissions > 0) || null;

    res.json({
      group: {
        _id: group._id,
        name: group.name,
        sessionId: group.sessionId,
        locked: group.locked,
        maxPlayers: group.maxPlayers,
      },
      players: playerStats,
      winner,
      results: {
        level1,
        level2,
        level3,
        level4,
        level5,
      },
      totals: {
        level1: level1.length,
        level2: level2.length,
        level3: level3.length,
        level4: level4.length,
        level5: level5.length,
        total: level1.length + level2.length + level3.length + level4.length + level5.length,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all groups with their winners summary
router.get("/results/groups/summary", async (req, res) => {
  try {
    const groups = await Group.find({}).populate("players", "name email");
    
    const groupSummaries = await Promise.all(groups.map(async (group) => {
      const playerIds = group.players.map(p => p._id);

      // Get all results for group players
      const [level1, level2, level3, level4, level5] = await Promise.all([
        Level1Result.find({ playerId: { $in: playerIds } }),
        Level2Result.find({ playerId: { $in: playerIds } }),
        Level3Result.find({ playerId: { $in: playerIds } }),
        Level4Result.find({ playerId: { $in: playerIds } }),
        Level5Result.find({ playerId: { $in: playerIds } }),
      ]);

      // Calculate total profit per player
      const playerProfits = {};
      group.players.forEach(player => {
        playerProfits[player._id.toString()] = { 
          profit: 0, 
          submissions: 0,
          name: player.name,
          playerId: player._id
        };
      });

      const allResults = [...level1, ...level2, ...level3, ...level4, ...level5];
      allResults.forEach(r => {
        const pid = r.playerId.toString();
        if (playerProfits[pid]) {
          playerProfits[pid].profit += r.profit || 0;
          playerProfits[pid].submissions++;
        }
      });

      // Find winner
      const playersArr = Object.values(playerProfits)
        .filter(p => p.submissions > 0)
        .sort((a, b) => b.profit - a.profit);

      const winner = playersArr.length > 0 ? playersArr[0] : null;

      return {
        _id: group._id,
        name: group.name,
        sessionId: group.sessionId,
        locked: group.locked,
        playerCount: group.players.length,
        maxPlayers: group.maxPlayers,
        totalSubmissions: allResults.length,
        winner: winner ? {
          playerId: winner.playerId,
          name: winner.name,
          totalProfit: winner.profit,
          submissions: winner.submissions
        } : null
      };
    }));

    res.json(groupSummaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
