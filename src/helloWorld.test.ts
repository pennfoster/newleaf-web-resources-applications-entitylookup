import { formatGuid } from "@pennfoster/newleaf-web-resources-domain/FormatProvider";
import { Printer } from "./helloWorld.ts";
describe("Hello World Debugging", () => {
    it("should allow debugger breakpoints to be hit", async () => {
        const formattedGuid = formatGuid("{12345678-1234-1234-1234-123456789012}");
        //const formattedGuid = "{12345678-1234-1234-1234-123456789012}";
        const printer = new Printer();
        printer.printMessage(`Formatted GUID: ${formattedGuid}`);
    });
});
