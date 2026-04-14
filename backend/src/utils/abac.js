import { ActivityPermissionModel, UserModel, PermissionModel, ActivityMasterModel } from "../models/associations.js";
import logger from "./logger.js";

/**
 * Check if user has permission on an activity
 * @param {Object} user - Current logged-in user
 * @param {String} action - Permission name (e.g., "create", "read", "update")
 * @param {String} activityName - The activity we are checking (e.g., Dashboard)
 * @returns {Boolean} - True if user has permission, false otherwise
 */
async function hasPermission(user, action, activityName) {
  try {
    if (!user || !user.id) return false;

    // Get user's role
    const userData = await UserModel.findOne({ where: { id: user.id } });
    if (!userData || !userData.roleId) return false;
    const userRoleId = userData.roleId;

    // Get activity by name
    const activityData = await ActivityMasterModel.findOne({
      where: { name: activityName },
    });
    if (!activityData || !activityData.id) return false;

    // Get permission by name
    const permissionData = await PermissionModel.findOne({
      where: { name: action },
    });
    if (!permissionData || !permissionData.id) return false;

    // Get activity permissions for the user's role
    const activityPermissions = await ActivityPermissionModel.findAll({
      where: { roleId: userRoleId, activityId: activityData.id },
    });
    if (!activityPermissions.length) return false;

    // Check if permission.id exists inside permissionIds
    for (const ap of activityPermissions) {
      let ids = [];

      // Handle permissionIds stored as JSON array or string
      if (Array.isArray(ap.permissionIds)) {
        ids = ap.permissionIds.map((id) => id.toString());
      } else if (typeof ap.permissionIds === "string") {
        ids = ap.permissionIds.split(",").map((id) => id.trim());
      }

      if (ids.includes(permissionData.id.toString())) {
        return true;
      }
    }

    return false;
  } catch (error) {
    logger.error("Error in evaluating permission: " + error.message);
    return false;
  }
}

export default hasPermission;
