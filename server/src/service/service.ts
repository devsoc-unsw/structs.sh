import { users } from '../models/users'

const authRegister = async (username, password) => {
  const user = await users.findOne({ username });
  if (user) {
    return false;
  }

  const ds = users.build({ username, password });
  await ds.save()
  return true;
};

const authLogin = async (username, password) => {
  const user = await users.findOne({ username });
  if (user) {
    if (password != user.password) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

export { authLogin, authRegister }