const Club = require('../model/club.model');
const User = require('../model/Users');

joinClub = async (req, res) => {
  const { clubId } = req.params;
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    const club = await Club.findById(clubId);

    if (!user || !club) {
      return res.status(404).json({ message: 'User or Club not found' });
    }

    if (user.joinedClubs.includes(clubId)) {
      return res.status(400).json({ message: 'User is already a member of this club' });
    }

    user.joinedClubs.push(clubId);
    club.members.push(userId);

    await user.save();
    await club.save();

    res.status(200).json({ message: 'Successfully joined the club' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


getClubMembers = async (req, res) => {
    const { clubId } = req.params;
    const { adminId } = req.body;

    try {
      const club = await Club.findById(clubId).populate('members');

      if (!club) {
        return res.status(404).json({ message: 'Club not found' });
      }

      if (club.admin.toString() !== adminId) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }

      res.status(200).json({ members: club.members });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };


  getUserClubs = async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await User.findById(userId).populate('joinedClubs');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ joinedClubs: user.joinedClubs });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

module.exports = {
    joinClub,
    getClubMembers,
    getUserClubs
  };


