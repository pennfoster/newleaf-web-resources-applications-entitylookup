import { IXrmWebApi } from "@pennfoster/newleaf-web-resources-core/IXrmWebApi";
import { XrmWebApi } from "@pennfoster/newleaf-web-resources-core/XrmWebApi";
import { retrieveRecordByIdAndExpand } from "@pennfoster/newleaf-web-resources-services-dynamics/LookupService";
import { GrandParentLookup } from "@pennfoster/newleaf-web-resources-domain/LookupFilter/GrandParentLookup";
import { IGrandParentLookup } from "@pennfoster/newleaf-web-resources-domain/LookupFilter/IGrandParentLookup";
import { Filter } from "@pennfoster/newleaf-web-resources-domain/LookupFilter/Filter";
import { ISingleParentLookup } from "@pennfoster/newleaf-web-resources-domain/LookupFilter/ISingleParentLookup";
import { SingleParentLookup } from "@pennfoster/newleaf-web-resources-domain/LookupFilter/SingleParentLookup";
import { getSourceLookupId } from "@pennfoster/newleaf-web-resources-domain/LookupFilter/GetSourceLookupId";
import { formatGuid } from "@pennfoster/newleaf-web-resources-domain/FormatProvider";

class EntityLookup {
    grandParents = {};
    private readonly webApi: IXrmWebApi;
    private readonly iSingleParentLookup: ISingleParentLookup;
    private readonly iGrandParentLookup: IGrandParentLookup;

    constructor(webApi: IXrmWebApi, iSingleParentLookup: ISingleParentLookup, iGrandParentLookup: IGrandParentLookup) {
        this.webApi = webApi;
        this.iSingleParentLookup = iSingleParentLookup;
        this.iGrandParentLookup = iGrandParentLookup;
    }

    public SingleParentLookupLoad(
        executionContext: Xrm.Events.EventContext,
        columnName: string,
        parentColumnName: string,
        attribute: string,
        operator: string,
        uiType: string,
    ): void {
        const formattedGuid = formatGuid("{12345678-1234-1234-1234-123456789012}");

        const formContext = executionContext.getFormContext();
        const filter = new Filter(attribute, operator, "", uiType);
        this.iSingleParentLookup.AddFilterToLookup(formContext, columnName, parentColumnName, filter);
    }

    public async GrandParentLookupLoad(
        executionContext: Xrm.Events.EventContext,
        destinationColumnLogicalName: string,
        parentEntityLogicalName: string,
        grandParentEntityLogicalName: string,
        grandParentColumnLogicalName: string,
        attribute: string,
        operator: string,
        uiType: string,
    ): Promise<any> {
        const formattedGuid = formatGuid("{12345678-1234-1234-1234-123456789012}");

        const formContext = executionContext.getFormContext();
        const filter = new Filter(attribute, operator, "", uiType);

        const key = `${destinationColumnLogicalName}-${parentEntityLogicalName}-${grandParentColumnLogicalName}-${grandParentEntityLogicalName}`;

        const lookup = this.grandParents[key];
        let grandParentColumnValue: string = "";

        if (!lookup) {
            //get grand parent column value for filter
            const columnLookupId = getSourceLookupId(formContext, parentEntityLogicalName);
            grandParentColumnValue =
                (await retrieveRecordByIdAndExpand(
                    this.webApi,
                    parentEntityLogicalName,
                    columnLookupId,
                    grandParentEntityLogicalName,
                    grandParentColumnLogicalName,
                )) ?? "";

            this.grandParents[key] = this.iGrandParentLookup;
            await this.iGrandParentLookup.AddFilterToLookup(
                formContext,
                destinationColumnLogicalName,
                parentEntityLogicalName,
                grandParentColumnValue,
                filter,
            );
        } else {
            await (lookup as GrandParentLookup).SetFilterValue(
                formContext,
                parentEntityLogicalName,
                destinationColumnLogicalName,
                grandParentColumnValue,
                filter,
            );
        }
    }
}

const entityLookup =
    typeof window === "undefined"
        ? {}
        : /* istanbul ignore next */ new EntityLookup(new XrmWebApi(Xrm.WebApi), new SingleParentLookup(), new GrandParentLookup());
export { entityLookup, EntityLookup };
