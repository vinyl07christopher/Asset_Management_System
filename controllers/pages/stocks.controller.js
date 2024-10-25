const AssetCategory = require("../../models/asset-category.model");
const Asset = require("../../models/asset.model");

const home = async (req, res) => {
  const process = {
    ...(req.query.process && { type: req.query.process }),
    ...(req.query.message && { message: req.query.message }),
  };
  const data = {};
  try {
    data.assetsInStock = await Asset.findAll({
      where: { status: "in stock" },
      include: [{ model: AssetCategory, as: "category", attributes: ["id", "name"] }],
    });

    const branchWiseSummary = {};

    const allStocksSummary = {
      count: data.assetsInStock.length,
      total: data.assetsInStock.reduce((acc, asset) => {
        const value = Number(Number(asset.value).toFixed(2)) * 100;

        if (!branchWiseSummary[asset.branch]) {
          branchWiseSummary[asset.branch] = {
            count: 0,
            total: 0,
          };
        }

        branchWiseSummary[asset.branch].count++;
        branchWiseSummary[asset.branch].total = (branchWiseSummary[asset.branch].total * 100 + value) / 100;

        return (acc * 100 + value) / 100;
      }, 0),
    };
    data.summary = { branchWiseSummary, allStocksSummary };
  } catch (error) {
    process.type = "fail";
    process.message = "Error retrieving data";
  } finally {
    res.render("stocks/home", { data, process });
  }
};

module.exports = { home };
