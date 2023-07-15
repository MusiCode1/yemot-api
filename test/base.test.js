import assert from "node:assert";
import { expect, describe, it } from "@jest/globals";


import { YemotApi } from "../dist/index.js";
import { mocks } from "./mock.js";

mocks();

export const success_obj = {
    yemotAPIVersion: 6,
    responseStatus: "OK"
  };

describe("tset", () => {
    const yemotApi = new YemotApi("0773137770", "1234");

    it("Login", async () => {

        expect(yemotApi.login()).resolves.toBeUndefined();
    })

    it("Set password",async () => {

        const r = await yemotApi.set_password("1234", "5678");

        expect(r.data).toEqual(success_obj);
    })
});


