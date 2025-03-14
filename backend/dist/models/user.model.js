"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserModel {
    constructor() {
        this.users = [];
    }
    getAllUser() {
        return this.users;
    }
    findByUsername(username) {
        const user = this.users.find((u) => u.username === username);
        if (!user)
            return false;
        return user;
    }
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this.users);
            const user = this.users.find((u) => u.username === username);
            if (!user)
                return false;
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch)
                return false;
            return user;
        });
    }
    create(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password, firstname, lastname } = newUser;
            const foundIndex = this.users.findIndex((u) => u.username === username);
            if (foundIndex !== -1)
                return false;
            const hashedPassword = yield bcrypt_1.default.hash(password, 12);
            const user = {
                id: (0, uuid_1.v4)(),
                username,
                password: hashedPassword,
                firstname,
                lastname,
            };
            this.users.push(user);
            return user;
        });
    }
}
exports.default = new UserModel();
