import { generateDependencyReport } from "@discordjs/voice";
import { describe } from "node:test";

describe("discord.js/voice dependency check", () => {
    test("report test", () => {
        const report = generateDependencyReport();
        console.log(report);
    });
});
