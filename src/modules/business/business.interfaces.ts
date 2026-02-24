import { BUSINESS_CONTEXT_TYPE } from './business.constants';

export interface BusinessSummary {
  id: string;
  name: string;
}

export interface CreateBusinessData extends BusinessSummary {
  contextSwitch: {
    contextType: typeof BUSINESS_CONTEXT_TYPE;
    contextId: string;
  };
}
