// src/routes/api/get.js
const { createSuccessResponse } = require('../../response');
const Fragment = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports.getFragment = async (req, res) => {
  const expand = req.query.expand == 1;

  const currentFragments = await Fragment.byUser(req.user, expand);
  const response = createSuccessResponse({
    fragments: currentFragments,
  });
  res.status(200).json(response);
};

// Getting Fragment by ID
module.exports.getFragmentId = async (req, res) => {
  let fragment, data;

  // Fetching fragment by ID
  try {
    fragment = await Fragment.byId(req.user, req.params.id);
    logger.info(`Fragment found: ${JSON.stringify(fragment)}`);
  } catch (error) {
    logger.error(`Error fetching fragment by ID: ${error.message}`);
    return res.status(404).json({ error: 'Fragment not found' });
  }

  // Fetching fragment data
  try {
    data = await fragment.getData();
    logger.info(`Fragment data retrieved for id ${req.params.id}`);
  } catch (error) {
    logger.error(`Error retrieving fragment data: ${error.message}`);
    return res.status(500).json({ error: 'Error retrieving fragment data' });
  }

  // Assuming 'data' is a buffer, send it directly with appropriate headers
  res.status(200).send(data);
};

// curl -i \
//   -X POST \
//   -u user1@email.com:password1 \
//   -H "Content-Type: text/plain" \
//   -d "This is a fragment" \
//   http://localhost:8080/v1/fragments
