const logger = require('../../logger');
const Fragment = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');
const contentType = require('content-type');

module.exports = async (req, res) => {
  // Creating new Fragment
  const { type } = contentType.parse(req);
  const ownerId = req.user;
  const size = req.body.length;
  const data = req.body;

  const newFragment = new Fragment({ ownerId: ownerId, type: type, size: size });

  // Error Handling
  if (!newFragment) {
    throw new Error('Failed to Create fragment');
  }

  // Setting the data to the fragment
  await newFragment.setData(data);

  // Fetching the current host based on the environment to set location header
  const location =
    process.env.API_URL + '/v1/fragments/' + newFragment.id ||
    req.headers.host + '/v1/fragments/' + newFragment.id;

  // Setting the location header
  res.header('Location', location);

  // Logging
  logger.info('New Fragment Request Successful');

  // Sending out the response
  res.status(200).json(createSuccessResponse({ fragment: newFragment }));
};
