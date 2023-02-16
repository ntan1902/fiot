const DashboardService = require("../services/dashboard");
const EntityService = require("../services/entity");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

module.exports = {
  async getDashboards(req, res) {
    const { authorities, userId, isAdmin } = req;
    const userEntity = await EntityService.getUserEntity(userId, authorities);
    if (!userEntity && !isAdmin) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      });
      return;
    }

    const result = await DashboardService.getAll({...userEntity, authorities});
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not get dashboards!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async getDashboard(req, res) {
    const dashboardId = req.params.dashboardId;
    const result = await DashboardService.getById(dashboardId);

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: `Can not get dashboards with UUID: ${dashboardId}!`,
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async createDashboard(req, res) {
    const options = req.body;
    const { userId, authorities } = req;
    const userEntity = await EntityService.getUserEntity(userId, authorities);
    if (!userEntity) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      });
      return;
    }

    const { title } = options;
    if (!title) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Dashboard's title can not be empty",
      });
      return;
    }

    if (await EntityService.isExistedDashboardTitle(title)) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Dashboard title has already existed.",
      });
      return;
    }

    const { id, firstTenantId } = userEntity;
    const result = await DashboardService.create({ id, userId, firstTenantId }, options);

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not create dashboards!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async updateDashboard(req, res) {
    const dashboardId = req.params.dashboardId;
    const options = req.body;
    const { userId, authorities } = req;

    const userEntity = await EntityService.getUserEntity(userId, authorities);
    if (!userEntity) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      });
      return;
    }

    const { title } = options;
    if (!title) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Dashboard's title can not be empty",
      });
      return;
    }

    if (await EntityService.isExistedDashboardTitle(title, dashboardId)) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Dashboard title has already existed.",
      });
      return;
    }

    const result = await DashboardService.update(dashboardId, options);
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not update dashboard!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async updateDashboardConfiguration(req, res) {
    const dashboardId = req.params.dashboardId;
    const options = req.body;
    const { userId, authorities } = req;

    const userEntity = await EntityService.getUserEntity(userId, authorities);
    if (!userEntity) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      });
      return;
    }

    const result = await DashboardService.updateConfiguration(dashboardId, options);
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not update dashboard!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async deleteDashboard(req, res) {
    const dashboardId = req.params.dashboardId;

    const result = await DashboardService.delete(dashboardId);
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not delete dashboard!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send({
      message: "Delete dashboards successful!",
    });
  },

  async assignDashboardCustomer(req, res) {
    const dashboardId = req.params.dashboardId
    const {customers} = req.body
    const str_customers = JSON.stringify(customers)

    const result = await DashboardService.assignCustomers(str_customers, dashboardId)
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not assign customers to dashboard!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send({
      message: "Assign customers to dashboard successful!",
    });
  }
};
