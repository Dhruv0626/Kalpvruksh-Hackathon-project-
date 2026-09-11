const { Material, Class } = require('../models');

// Create a new study resource / classwork material
const createMaterial = async (req, res) => {
  try {
    const { title, description, topic, subject, type, fileUrl, fileSize, classId } = req.body;

    if (!title || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a resource title and link/URL.',
      });
    }

    const material = await Material.create({
      title,
      description: description || '',
      topic: topic || 'General Resources',
      subject: subject || 'General Subject',
      type: type || 'pdf',
      fileUrl,
      fileSize: fileSize || 'Online Resource',
      teacherId: req.user._id,
      teacherName: req.user.name || 'Professor',
      classId: classId || null,
    });

    res.status(201).json({
      success: true,
      message: 'Study resource published successfully!',
      material,
    });
  } catch (error) {
    console.error('Error creating material:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create study resource.',
    });
  }
};

// Get all study materials (grouped by topic)
const getMaterials = async (req, res) => {
  try {
    const { classId, topic, type } = req.query;
    const filter = {};

    if (classId) filter.classId = classId;
    if (topic && topic !== 'All') filter.topic = topic;
    if (type && type !== 'All') filter.type = type;

    const materials = await Material.find(filter).sort({ createdAt: -1 }).lean();

    // Group materials by topic
    const topicMap = {};
    materials.forEach((item) => {
      const t = item.topic || 'General Resources';
      if (!topicMap[t]) {
        topicMap[t] = [];
      }
      topicMap[t].push(item);
    });

    const groupedTopics = Object.keys(topicMap).map((topicName) => ({
      topic: topicName,
      count: topicMap[topicName].length,
      items: topicMap[topicName],
    }));

    res.status(200).json({
      success: true,
      materials,
      groupedTopics,
      totalCount: materials.length,
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch study materials.',
    });
  }
};

// Delete material (Teacher)
const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    await Material.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Study resource deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resource.',
    });
  }
};

module.exports = {
  createMaterial,
  getMaterials,
  deleteMaterial,
};
