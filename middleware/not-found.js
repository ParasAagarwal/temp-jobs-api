const notFound = (req, res) => {
  return res.status(404).send("Route Does Not Exist");
};

module.exports = notFound;