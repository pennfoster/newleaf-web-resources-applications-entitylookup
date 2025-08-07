import { expect } from "chai";
import { mock, instance, when, anyString, verify, resetCalls, anyFunction, anything } from "ts-mockito";
import { Filter, GrandParentLookup, SingleParentLookup } from "@pennfoster/newleaf-web-resources-domain";
import { EntityLookup } from "./pf_EntityLookup";
import { IXrmWebApi } from "@pennfoster/newleaf-web-resources-core";

describe("Entity Lookup", () => {
    const guid = "b5a54c3e-6372-4e75-b835-69e64217a24a";
    const bracketedGuid = `{${guid}}`;
    const destinationColumnName = "pf_productofferingfundsource";
    const grandParentColumn = "pf_ProductOffering";
    const grandParentEntity = "pf_productofferingid";
    const MockEntityType = "pf_productofferingfundsource";

    const MockXrmWebApi = mock<IXrmWebApi>();
    when(MockXrmWebApi.retrieveRecord(anyString(), anyString(), anyString())).thenResolve({
        pf_ProductOffering: {
            pf_productofferingid: guid,
        },
    });

    const MockLookupControl = mock<Xrm.Controls.LookupControl>();
    when(MockLookupControl.addPreSearch(anyFunction()));
    when(MockLookupControl.removePreSearch(anyFunction()));
    when(MockLookupControl.addCustomFilter(anyFunction())).thenReturn(anyString());

    const MockAttribute = mock<Xrm.Attributes.Attribute>();
    when(MockAttribute.getValue()).thenReturn([
        {
            entityType: MockEntityType,
            id: bracketedGuid,
        },
    ]);

    const MockFormContext = mock<Xrm.FormContext>();
    when(MockFormContext.getControl(anyString())).thenReturn(instance(MockLookupControl));
    when(MockFormContext.getAttribute(anyString())).thenReturn(instance(MockAttribute));

    const MockEventContext = mock<Xrm.Events.EventContext>();
    when(MockEventContext.getFormContext()).thenReturn(instance(MockFormContext));

    const MockFilter = mock<Filter>();

    const MockSingleParentLookup = mock<SingleParentLookup>();
    when(MockSingleParentLookup.AddFilterToLookup(anything(), anyString(), anyString(), anything())).thenReturn();

    const MockGrandParentLookup = mock<GrandParentLookup>();
    when(MockGrandParentLookup.AddFilterToLookup(anything(), anyString(), anyString(), anyString(), anything())).thenResolve({});
    when(MockGrandParentLookup.SetFilterValue(anything(), anyString(), anyString(), anyString(), anything())).thenResolve({});

    beforeEach(() => {
        resetCalls(MockEventContext);
        resetCalls(MockFormContext);
        resetCalls(MockLookupControl);
        resetCalls(MockAttribute);
        resetCalls(MockSingleParentLookup);
        resetCalls(MockGrandParentLookup);
        resetCalls(MockFilter);
        resetCalls(MockXrmWebApi);
    });

    it("should successfully execute SingleParentLookupLoad ", () => {
        const columnName = "pf_processstage";
        const parentColumnName = "pf_process";
        const attribute = "processid";
        const operator = "eq";
        const uitype = "workflow";
        const entityLookup = new EntityLookup(instance(MockXrmWebApi), instance(MockSingleParentLookup), instance(MockGrandParentLookup));

        entityLookup.SingleParentLookupLoad(instance(MockEventContext), columnName, parentColumnName, attribute, operator, uitype);
        verify(MockSingleParentLookup.AddFilterToLookup(anything(), anyString(), anyString(), anything())).once();
    });

    it("should successfully execute GrandParentLookupLoad ", async () => {
        const parentColumnName = "pf_productofferingchangerequest";
        const attribute = "pf_productoffering";
        const operator = "eq";
        const uitype = "pf_productoffering";
        const entityLookup = new EntityLookup(instance(MockXrmWebApi), instance(MockSingleParentLookup), instance(MockGrandParentLookup));

        await entityLookup.GrandParentLookupLoad(
            instance(MockEventContext),
            destinationColumnName,
            parentColumnName,
            grandParentColumn,
            grandParentEntity,
            attribute,
            operator,
            uitype,
        );

        verify(MockGrandParentLookup.AddFilterToLookup(anything(), anyString(), anyString(), anyString(), anything())).once();
        verify(MockGrandParentLookup.SetFilterValue(anything(), anyString(), anyString(), anyString(), anything())).never();
    });

    it("should successfully re-execute GrandParentLookupLoad ", async () => {
        const parentColumnName = "pf_productofferingchangerequest";
        const attribute = "pf_productoffering";
        const operator = "eq";
        const uitype = "pf_productoffering";
        const entityLookup = new EntityLookup(instance(MockXrmWebApi), instance(MockSingleParentLookup), instance(MockGrandParentLookup));

        await entityLookup.GrandParentLookupLoad(
            instance(MockEventContext),
            destinationColumnName,
            parentColumnName,
            grandParentColumn,
            grandParentEntity,
            attribute,
            operator,
            uitype,
        );
        const secondresult = await entityLookup.GrandParentLookupLoad(
            instance(MockEventContext),
            destinationColumnName,
            parentColumnName,
            grandParentColumn,
            grandParentEntity,
            attribute,
            operator,
            uitype,
        );
        expect(secondresult).to.equal(undefined);
        verify(MockGrandParentLookup.AddFilterToLookup(anything(), anyString(), anyString(), anyString(), anything())).once();
        verify(MockGrandParentLookup.SetFilterValue(anything(), anyString(), anyString(), anyString(), anything())).once();
    });
});
