const Job = require("../models/jobs");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const job = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ job, count: job.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id },
  } = req;
  const job = await Job.findOne({
    _id: id,
    createdBy: userId,
  });
  if (!job) {
    throw new NotFoundError(`No Job with id${id}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id },
  } = req;
  if (company === "" || position === "") {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }

  const job = await Job.findOneAndUpdate(
    { _id: id, createdBy: userId },
    { company: company, position: position },
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`No Job with id${id}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id },
  } = req;
  const job = await Job.findOneAndDelete({ _id: id, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No Job with id${id}`);
  }
  res.status(StatusCodes.OK).send(`Job Deleted`);
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
