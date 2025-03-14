import { IUser } from "../types/user";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
class UserModel {
  private users: IUser[] = [];

  getAllUser() {
    return this.users;
  }

  findByUsername(username: string) {
    const user = this.users.find((u) => u.username === username);
    if (!user) return false;
    return user;
  }

  async login(username: string, password: string) {
    console.log(this.users);
    const user = this.users.find((u) => u.username === username);
    if (!user) return false;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return false;

    return user;
  }

  async create(newUser: Omit<IUser, "id">) {
    const { username, password, firstname, lastname } = newUser;
    const foundIndex = this.users.findIndex((u) => u.username === username);
    if (foundIndex !== -1) return false;

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = {
      id: uuidv4(),
      username,
      password: hashedPassword,
      firstname,
      lastname,
    };
    this.users.push(user);
    return user;
  }
}

export default new UserModel();
