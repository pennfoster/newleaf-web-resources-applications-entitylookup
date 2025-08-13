import { mock, instance, when, anything, verify } from "ts-mockito";
import { EntityLookup } from "./pf_EntityLookup.ts";
import { IXrmWebApi } from "@pennfoster/newleaf-web-resources-core/IXrmWebApi";
import { ISingleParentLookup } from "@pennfoster/newleaf-web-resources-domain/LookupFilter/ISingleParentLookup";
import { IGrandParentLookup } from "@pennfoster/newleaf-web-resources-domain/LookupFilter/IGrandParentLookup";

describe("EntityLookup", () => {
    let mockWebApi: IXrmWebApi;
    let mockSingleParent: ISingleParentLookup;
    let mockGrandParent: IGrandParentLookup;
    let entityLookup: EntityLookup;
    let mockEventContext: Xrm.Events.EventContext;
    let mockFormContext: Xrm.FormContext;

    beforeEach(() => {
        mockWebApi = mock<IXrmWebApi>();
        mockSingleParent = mock<ISingleParentLookup>();
        mockGrandParent = mock<IGrandParentLookup>();
        mockEventContext = mock<Xrm.Events.EventContext>();
        mockFormContext = mock<Xrm.FormContext>();

        when(mockEventContext.getFormContext()).thenReturn(instance(mockFormContext));
        entityLookup = new EntityLookup(instance(mockWebApi), instance(mockSingleParent), instance(mockGrandParent));
    });

    it("should call AddFilterToLookup in SingleParentLookupLoad", () => {
        const columnName = "col";
        const parentColumnName = "parentCol";
        const attribute = "attr";
        const operator = "eq";
        const uiType = "type";

        entityLookup.SingleParentLookupLoad(instance(mockEventContext), columnName, parentColumnName, attribute, operator, uiType);

        verify(mockSingleParent.AddFilterToLookup(anything(), columnName, parentColumnName, anything())).once();
    });

    it("should call AddFilterToLookup in GrandParentLookupLoad when not cached", async () => {
        // Setup for getSourceLookupId and retrieveRecordByIdAndExpand
        const parentColumnName = "parentCol";
        const destinationColumnName = "destCol";
        const grandParentColumn = "grandCol";
        const grandParentEntity = "grandEntity";
        const attribute = "attr";
        const operator = "eq";
        const uiType = "type";

        // Mock getSourceLookupId and retrieveRecordByIdAndExpand globally if needed

        when(mockGrandParent.AddFilterToLookup(anything(), destinationColumnName, parentColumnName, anything(), anything())).thenResolve(
            {},
        );
        entityLookup.grandParents = {}; // Ensure cache is empty

        await entityLookup.GrandParentLookupLoad(
            instance(mockEventContext),
            destinationColumnName,
            parentColumnName,
            grandParentColumn,
            grandParentEntity,
            attribute,
            operator,
            uiType,
        );

        verify(mockGrandParent.AddFilterToLookup(anything(), destinationColumnName, parentColumnName, anything(), anything())).once();
    });

    it("should call SetFilterValue in GrandParentLookupLoad when cached", async () => {
        const parentColumnName = "parentCol";
        const destinationColumnName = "destCol";
        const grandParentColumn = "grandCol";
        const grandParentEntity = "grandEntity";
        const attribute = "attr";
        const operator = "eq";
        const uiType = "type";

        // Simulate cache
        const key = `${destinationColumnName}-${parentColumnName}-${grandParentColumn}-${grandParentEntity}`;
        entityLookup.grandParents[key] = instance(mockGrandParent);

        when(mockGrandParent.SetFilterValue(anything(), parentColumnName, destinationColumnName, anything(), anything())).thenResolve({});

        await entityLookup.GrandParentLookupLoad(
            instance(mockEventContext),
            destinationColumnName,
            parentColumnName,
            grandParentColumn,
            grandParentEntity,
            attribute,
            operator,
            uiType,
        );

        verify(mockGrandParent.SetFilterValue(anything(), parentColumnName, destinationColumnName, anything(), anything())).once();
    });
});
