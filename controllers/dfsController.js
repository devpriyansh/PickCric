const ContestUserPrime = require('../models/ContestUserPrime');
const Jackpot = require('../models/Jackpot');
const staticMatches = require('../utils/staticMatches');

// exports.createJackpot = async (req, res) => {
//   try {
//     const {
//       matchId,
//       gameMode,
//       jackpotName,
//       subtitle,
//       subtitle2,
//       jackpotType,
//       leagueName,
//       matchType,
//       stats,
//       maxUserLimit,
//       startDate,
//       endDate,
//       topPrizes,
//       summary,
//       rules,
//       isHotContest,
//       showOnBanner
//     } = req.body;

//     // Validate matchId exists in static matches
//     const matchExists = staticMatches.find(match => match.id === parseInt(matchId));
//     if (!matchExists) {
//       return res.status(404).json({ error: 'Match Not Found' });
//     }

//     const newJackpot = await Jackpot.create({
//       matchId,
//       gameMode,
//       jackpotName,
//       subtitle,
//       subtitle2,
//       jackpotType,
//       leagueName,
//       matchType,
//       stats,
//       maxUserLimit,
//       startDate,
//       endDate,
//       topPrizes,
//       summary,
//       rules,
//       isHotContest,
//       showOnBanner
//     });

//     return res.status(201).json(newJackpot);
//   } catch (error) {
//     console.error('Error creating jackpot:', error);
//     return res.status(500).json({ error: 'Failed to create jackpot' });
//   }
// };

// Add this below your createJackpot function

const getLiveJackpots = async (req, res) => {
  try {
    // Find all jackpots where status is 1 (Live)
    const liveJackpots = await Jackpot.findAll({
      where: {
        status: 1 
      },
      order: [
        ['createdAt', 'DESC'] // Orders by newest first
      ]
    });

    // Return the data
    return res.status(200).json({
      success: true,
      count: liveJackpots.length,
      data: liveJackpots
    });

  } catch (error) {
    console.error("Error fetching live jackpots:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch live jackpots", 
      error: error.message 
    });
  }
};

const getJackpotById = async (req, res) => {
  try {
    // Extract the ID from the URL parameters
    const { id } = req.params;

    console.log("ID =", id)

    // Find the jackpot by its Primary Key (ID)
    const jackpot = await Jackpot.findByPk(id);
    console.log("J +==== ", jackpot)

    // If no jackpot is found with that ID, return a 404 error
    if (!jackpot) {
      return res.status(404).json({ 
        success: false, 
        message: "Jackpot not found" 
      });
    }

    // Return the full jackpot data (including availablePlayers)
    return res.status(200).json({
      success: true,
      data: jackpot
    });

  } catch (error) {
    console.error("Error fetching jackpot details:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch jackpot details", 
      error: error.message 
    });
  }
};

const submitJackpotEntry = async (req, res) => {
  try {
    const { jackpotId, userId, selectedPlayers } = req.body;

    // 1. Basic validation
    if (!jackpotId || !userId || !selectedPlayers) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: jackpotId, userId, or selectedPlayers" 
      });
    }

    // 2. Save the user's entry to the database
    const newEntry = await ContestUserPrime.create({
      jackpotId,
      userId,
      selectedPlayers: selectedPlayers, // ✅ Saves the array into the new column
      status: 1,
      joinedDate: new Date()
    });

    // 3. Return success
    return res.status(201).json({
      success: true,
      message: "Successfully joined the jackpot!",
      data: newEntry
    });

  } catch (error) {
    console.error("Error submitting jackpot entry:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to submit jackpot entry", 
      error: error.message 
    });
  }
};

// Don't forget to export it!
module.exports = {
  getLiveJackpots,
  getJackpotById,
  submitJackpotEntry
};