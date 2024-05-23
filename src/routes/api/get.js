// src/routes/api/get.js
const { createSuccessResponse } = require('../../response');
const Fragment = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports.getFragment = (req, res) => {
  const response = createSuccessResponse({
    fragments: [],
  });
  res.status(200).json(response);
};

module.exports.getFragmentId = async (req, res) => {
  try {
    // Logging request details
    logger.info(`GET /fragments/${req.params.id} requested by user ${req.user}`);

    // Fetching fragment by ID
    const fragment = await Fragment.byId(req.user, req.params.id);

    if (!fragment) {
      console.log(`Fragment with id ${req.params.id} not found for user ${req.user}`);
      return res.status(404).json({ error: 'Fragment not found' });
    }

    // Fetching fragment data
    const data = await fragment.getData();

    // Logging data details
    logger.info(`Fragment data retrieved for id ${req.params.id}`);

    // Assuming 'data' is a buffer, send it directly with appropriate headers
    res.status(200).send(data);
  } catch (error) {
    // Logging error details
    console.error(`Error fetching fragment id ${req.params.id}:`, error);

    // Sending error response
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// curl -i \
//   -X POST \
//   -u user1@email.com:password1 \
//   -H "Content-Type: text/plain" \
//   -d "This is a fragment" \
//   http://localhost:8080/v1/fragments
