import {
    Filter,
    getSourceLookupId,
    GrandParentLookup,
    IGrandParentLookup,
    ISingleParentLookup,
    SingleParentLookup,
} from "@pennfoster/newleaf-web-resources-domain";
import { IXrmWebApi, XrmWebApi } from "@pennfoster/newleaf-web-resources-core";
import { retrieveRecordByIdAndExpand } from "@pennfoster/newleaf-web-resources-services-dynamics";

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
        const formContext = executionContext.getFormContext();
        const filter = new Filter(attribute, operator, "", uiType);
        const addFilterLookup = this.iSingleParentLookup;
        addFilterLookup.AddFilterToLookup(formContext, columnName, parentColumnName, filter);
    }

    public async GrandParentLookupLoad(
        executionContext: Xrm.Events.EventContext,
        destinationColumnName: string,
        parentColumnName: string,
        grandParentColumn: string,
        grandParentEntity: string,
        attribute: string,
        operator: string,
        uiType: string,
    ): Promise<any> {
        const formContext = executionContext.getFormContext();
        const filter = new Filter(attribute, operator, "", uiType);

        const key = `${destinationColumnName}-${parentColumnName}-${grandParentColumn}-${grandParentEntity}`;

        const lookup = this.grandParents[key];
        let grandParentColumnValue: string = "";

        if (!lookup) {
            //get grand parent column value for filter
            const columnLookupId = getSourceLookupId(formContext, parentColumnName);
            grandParentColumnValue =
                (await retrieveRecordByIdAndExpand(this.webApi, columnLookupId, grandParentColumn, grandParentEntity, grandParentColumn)) ??
                "";

            this.grandParents[key] = this.iGrandParentLookup;
            await this.iGrandParentLookup.AddFilterToLookup(
                formContext,
                destinationColumnName,
                parentColumnName,
                grandParentColumnValue,
                filter,
            );
        } else {
            await (lookup as GrandParentLookup).SetFilterValue(
                formContext,
                parentColumnName,
                destinationColumnName,
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
