const WidgetsBundleService = require("../services/widgetsBundle");
const EntityService = require("../services/entity");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

const generateAlias = (title) => {
  const alias = title.trim().toLowerCase().replace(" ", "_");
  return alias;
};

module.exports = {
  async getWidgetsBundles(req, res) {
    const { authorities, userId } = req;
    const userEntity = await EntityService.getUserEntity(userId, authorities);
    if (!userEntity) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      });
      return;
    }

    const { tenantId } = userEntity;

    const result = await WidgetsBundleService.getAllByTenantId(tenantId);

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not get widgets bundle!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async getWidgetsBundle(req, res) {
    const bundleId = req.params.bundleId;
    const result = await WidgetsBundleService.getById(bundleId);

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: `Can not get widgets bundle with UUID: ${bundleId}!`,
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async createWidgetsBundle(req, res) {
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
        message: "Widgets Bundle's title can not be empty",
      });
      return;
    }

    const alias = generateAlias(title);
    if (await EntityService.isExistedWidgetsBundleAlias(alias)) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Widgets Bundle's alias has already existed.",
      });
      return;
    }

    const { tenantId } = userEntity;
    const result = await WidgetsBundleService.create(
      { tenantId, userId },
      { alias, ...options }
    );

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not create widgets bundle!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async updateWidgetsBundle(req, res) {
    const bundleId = req.params.bundleId;
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
        message: "Widgets Bundle's title can not be empty",
      });
      return;
    }

    const result = await WidgetsBundleService.update(bundleId, options);
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not update widgets bundle!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async deleteWidgetsBundle(req, res) {
    const bundleId = req.params.bundleId;

    const result = await WidgetsBundleService.delete(bundleId);
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not delete widgets bundle!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send({
      message: "Delete widgets bundle successful!",
    });
  },
};
