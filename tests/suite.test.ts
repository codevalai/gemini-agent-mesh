import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AgentOrchestrator } from '../src/agents/orchestrator.js';

test('AgentOrchestrator initializes without errors', () => {
  const orchestrator = new AgentOrchestrator(null);
  assert.ok(orchestrator);
});

test('Orchestrator executes pipeline and returns structured plan', async () => {
  const orchestrator = new AgentOrchestrator(null);
  const result = await orchestrator.executePipeline('Deploy autonomous data normalizer');

  assert.equal(result.status, 'completed');
  assert.ok(result.plan.length >= 3);
  assert.ok(result.auditHash.startsWith('sha256:'));
  assert.ok(result.taskId.startsWith('task-'));
});
