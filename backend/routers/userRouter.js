const mongoose =require('mongoose');
const express=require('express')
const cors=require('cors')
//const app=express()
const router=express.Router();
const Organization = require('../models/dbmodel');
const Team = require('../models/teammodel');
const Member = require('../models/membermodel');
const multer=require('multer')

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const upload = multer({ storage });

  // 1. Register organizations
// router.post('/organizations', async (req, res) => {
//     try {
//       const organization = await Organization.create(req.body);
//       res.status(201).json(organization);
//     } catch (error) {
//         console.error(error);
//       res.status(500).json({ error: 'Failed to create organization' });
//     }
//   });

router.post('/organizations', async (req, res) => {
    try {
      const { name, organizationId, location } = req.body;
  
      // Validate organizationId if it's an ObjectId
      
      console.log(organizationId);
  
      const organization = new Organization({
        name,
        organizationId,  // Ensure this is a valid ObjectId or string
        location
      });
  
      await organization.save();
      res.status(201).json(organization);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create organization' });
    }
  });
  
  
  // 2. Add teams to an organization
  
//       const { organizationId } = req.params;
//       const organization = await Organization.findOne({organizationId:organizationId});
//       if (!organization) return res.status(404).json({ error: 'Organization not found' });
  
//       const team = await Team.create({ ...req.body,organizationId:organizationId });
//       res.status(201).json(team);
//     } catch (error) {
//         console.error(error); // Log detailed error for debugging
// //res.status(500).json({ error: 'Failed to create team', details: error.message });


//       res.status(500).json({ error: 'Failed to create team' });
//     }

//const { organizationId } = req.params;
    
// Convert organizationId to ObjectId if necessary
//const orgId = mongoose.Types.ObjectId.isValid(organizationId) ? mongoose.Types.ObjectId(organizationId) : null;



// Now find the organization using the ObjectId
// const { name, teamId  } = req.body;
// console.log("Recieved data:"+name+"id:"+organizationId+"team id :"+teamId);

// const organization = await Organization.findById(organizationId);
// console.log(organization);

// if (!organization) {
//   return res.status(404).json({ error: 'Organization not found' });
// }

// // Create the team
// const team = await Team.create({ ...req.body, organizationId});

// res.status(201).json(team);
// } catch (error) {
// console.error(error); // Log detailed error for debugging
// res.status(500).json({ error: 'Failed to create team' });}
//   });


router.post('/organizations/:organizationId/teams', async (req, res) => {
    try {
        // Extract organizationId from URL params
        const { organizationId } = req.params;

        // Extract other data from request body
        const { name, teamId } = req.body;

        console.log("Received data: name = " + name + ", organizationId = " + organizationId);
        console.log("OrganizationId from URL params: " + organizationId);
       

        // Find the organization using the organizationId
        const organization = await Organization.findOne({organizationId:organizationId});
        console.log("Found organization: ", organization);

        if (!organization) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        // Create the team
        const team = await Team.create({ name, organizationId, teamId });

        res.status(201).json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create team' });
    }
});

  
  // 3. Add members to a team
  router.post('/teams/:teamId/members', upload.single('image'),async (req, res) => {
     try {
    //   const { teamId } = req.params;
    //   const {name,uniqueId,image}=req.body
    //   console.log(name);
    //   console.log(uniqueId);
    //   console.log(teamId);

    //   const team = await Team.findOne({teamId:teamId});
    //   if (!team) return res.status(404).json({ error: 'Team not found' });
  
    //   const member = await Member.create({ ...req.body, teamId });
    //   res.status(201).json(member);
    // } catch (error) {
        
    //   res.status(500).json({ error: 'Failed to create member' });
    // }

    const { teamId } = req.params;
    const { name, uniqueId } = req.body; // Get name and uniqueId from form data

    // If an image is uploaded, it will be in req.file
    const image = req.file ? req.file.path : null; // Use the file path if an image is uploaded, else null

    // Log received data (including image if any)
    console.log("Name:", name);
    console.log("Unique ID:", uniqueId);
    console.log("Team ID:", teamId);
    console.log("Image Path:", image);

    // Find the team based on teamId
    const team = await Team.findOne({ teamId });
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Create the member object, including the optional image
    const memberData = { name, uniqueId, teamId, image };

    // Create a new member in the database
    const member = await Member.create(memberData);

    // Send the response
    res.status(201).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create member' });}
  
  });
  
  // 4. Upload image for a member
//   router.post('/members/:memberId/image', upload.single('image'), async (req, res) => {
//     try {
//       const { memberId } = req.params;
//       const member = await Member.findById(memberId);
//       if (!member) return res.status(404).json({ error: 'Member not found' });
  
//       member.image = `/uploads/${req.file.filename}`;
//       await member.save();
//       res.status(200).json(member);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to upload image' });
//     }
//   });
  
  // 5. Fetch all members with hierarchy
  router.get('/hierarchy', async (req, res) => {
    try {
      const organizations = await Organization.find().lean();
      const teams = await Team.find().lean();
      const members = await Member.find().lean();
  
      const hierarchy = organizations.map((org) => {
        const orgTeams = teams.filter((team) => team.organizationId === org.organizationId);
        const teamData = orgTeams.map((team) => ({
          ...team,
          members: members.filter((member) => member.teamId === team.teamId),
        }));
        return { ...org, teams: teamData };
      });
  
      res.json(hierarchy);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch hierarchy' });
    }
  });
  
  
  module.exports = router;
