const home = async (req, res) => {
  const process = {
    ...(req.query.process && { type: req.query.process }),
    ...(req.query.message && { message: req.query.message }),
  };
  const data = {};
  try {
    data.assetsInUse = await Asset.findAll({
      where: { status: "issued" },
      include: [{ model: AssetCategory, as: "category", attributes: ["id", "name"] }],
    });
  } catch (error) {
    process.type = "fail";
    process.message = "Error retrieving data";
  } finally {
    res.render("assets/return/home", { data, process });
  }
};

module.exports = { home };
