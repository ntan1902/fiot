const WidgetTypeService = require("../services/widgetType");
const EntityService = require("../services/entity");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

const generateAlias = (title) => {
  const alias = title.trim().toLowerCase().replace(/\s/g, "_");
  return alias;
};

module.exports = {
  async getWidgetTypes(req, res) {
    const { authorities, userId } = req;

    const userEntity = await EntityService.getUserEntity(userId, authorities);
    if (!userEntity) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      });
      return;
    }

    const { tenantId } = userEntity;

    const result = await WidgetTypeService.getAllByTenantId(tenantId);

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not get widget types!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async getWidgetType(req, res) {
    const widgetId = req.params.widgetId;
    const result = await WidgetTypeService.getById(widgetId);

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: `Can not get widget type with UUID: ${widgetId}!`,
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async createWidgetType(req, res) {
    const options = req.body;
    const { userId, authorities } = req;
    const userEntity = await EntityService.getUserEntity(userId, authorities);
    if (!userEntity) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      });
      return;
    }

    const { name, bundleAlias } = options;
    if (!name) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Widget Type's name can not be empty",
      });
      return;
    }

    const alias = generateAlias(name);
    if (await EntityService.isExistedWidgetTypeAlias(alias)) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Widget Type's alias has already existed.",
      });
      return;
    }

    if (!(await EntityService.isExistedWidgetsBundleAlias(bundleAlias))) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: `Can not find Widgets Bundle with alias: ${bundleAlias}.`,
      });
      return;
    }

    const { tenantId } = userEntity;
    const result = await WidgetTypeService.create(
      { tenantId, userId },
      { alias, ...options }
    );

    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not create widget type!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async updateWidgetType(req, res) {
    const widgetId = req.params.widgetId;
    const options = req.body;
    const { userId, authorities } = req;

    const userEntity = await EntityService.getUserEntity(userId, authorities);
    if (!userEntity) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Can't find entity information with provided token.",
      });
      return;
    }

    const { name } = options;
    if (!name) {
      res.status(StatusCodes.BAD_REQUEST).send({
        message: "Widget Type's name can not be empty",
      });
    }

    const result = await WidgetTypeService.update(widgetId, options);
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not update widget type!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send(result);
  },

  async deleteWidgetType(req, res) {
    const widgetId = req.params.widgetId;

    const result = await WidgetTypeService.delete(widgetId);
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: "Can not delete widget type!",
        status: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        statusValue: StatusCodes.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(StatusCodes.OK).send({
      message: "Delete widget type successful!",
    });
  },
};
