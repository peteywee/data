import { ViabilityAnalyst } from './viability.js';
import { ExecutionDesigner } from './executionDesigner.js';
import { PMO } from './pmo.js';
import { OperationsArchitect } from './operationsArchitect.js';
import { CommunicationStrategist } from './communicationStrategist.js';
import { ExecutionAuditor } from './executionAuditor.js';
import { Researcher } from './researcher.js';

export const agents = { Researcher: Researcher,
  ViabilityAnalyst,
  ExecutionDesigner,
  PMO,
  OperationsArchitect,
  CommunicationStrategist,
  ExecutionAuditor,
};

export const ResearcherAgent = Researcher;
