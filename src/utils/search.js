const Topic = require('../models/topic');

const topicUtils = {};

topicUtils.searchTopic = async (topic) => {
    try {
        if (topic) {
            result = await Topic.find({
                topic: new RegExp(`^${topic}$`, 'i')
            });
            console.log(result)
        }
        return result;
    } catch (err) {
        const errorObj = { code: 404, error: 'Can not find the topic' };
        throw errorObj;
    }
};

module.exports = topicUtils;