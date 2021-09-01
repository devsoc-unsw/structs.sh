import jwt from 'jsonwebtoken';
import { User } from 'src/model/user/User';

export const generateToken = (user: User) => {
  const payload = {
    _id: user._id,
    username: user.username,
    permissions: user.permissions,
    email: user.email,
    config: user.config,
    childrenIds: user.childrenIds,
    activeChildId: user.activeChildId,
  };
  const token = jwt.sign(payload, process.env.JWT_GALACTICED_SECRET);
  return token;
};

/**
 * Determines whether the given ID can be casted to an ObjectId
 * Source: https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id
 */
export const isValidObjectId = (id: string): boolean => {
  if (!id) return false;
  return !!String(id).match(/^[0-9a-fA-F]{24}$/);
};

/**
 * If the given ID is not a valid ObjectId, then throw an error indicating so
 */
export const checkObjectIdIsValid = (id: string): void => {
  if (!isValidObjectId(id)) throw new Error(`Invalid ID: '${id}'`);
};
