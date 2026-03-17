/**
 * Core Scheduler — Universal agent scheduling and Task() mechanism
 * Agent lifecycle management, model profile resolution
 *
 * Independent of scenario specifics - provides generic agent scheduling
 * that works across all GSD scenarios.
 */

const fs = require('fs');
const path = require('path');

/**
 * scheduleAgent(role, workflow, context, modelProfile)
 *
 * Schedule an agent for execution.
 *
 * @param {string} role - Agent role (e.g., 'gsd-planner', 'gsd-executor')
 * @param {string} workflow - Workflow file path
 * @param {object} context - Execution context
 * @param {string} modelProfile - Model profile ('quality', 'balanced', 'budget')
 * @returns {object} Agent execution handle
 */
function scheduleAgent(role, workflow, context, modelProfile) {
  // Generic agent scheduling logic
  // Not tied to software-eng specific agents

  return {
    role,
    workflow,
    context,
    model_profile: modelProfile || 'balanced',
    status: 'scheduled',
    scheduled_at: new Date().toISOString(),
  };
}

/**
 * executeTask(taskDefinition, agentContext)
 *
 * Execute a Task() with given agent context.
 *
 * @param {object} taskDefinition - Task specification
 * @param {object} agentContext - Agent execution context
 * @returns {object} Task result
 */
function executeTask(taskDefinition, agentContext) {
  // Universal Task() mechanism
  // Executes tasks regardless of scenario

  return {
    task: taskDefinition,
    context: agentContext,
    status: 'pending',
    started_at: new Date().toISOString(),
  };
}

/**
 * manageLifecycle(agentHandle, state)
 *
 * Manage agent lifecycle (start, pause, resume, complete).
 *
 * @param {object} agentHandle - Agent execution handle
 * @param {string} state - Lifecycle state ('start', 'pause', 'resume', 'complete')
 * @returns {boolean} Lifecycle transition success
 */
function manageLifecycle(agentHandle, state) {
  // Agent lifecycle state machine
  // Generic transitions, not scenario-specific

  const validTransitions = {
    scheduled: ['start', 'cancel'],
    running: ['pause', 'complete', 'error'],
    paused: ['resume', 'cancel'],
    complete: [],
    error: ['retry'],
    cancelled: [],
  };

  const currentState = agentHandle.status || 'scheduled';
  const allowedTransitions = validTransitions[currentState] || [];

  if (!allowedTransitions.includes(state)) {
    return false;
  }

  // Transition is valid
  agentHandle.status = state === 'start' ? 'running' : state;
  agentHandle.last_transition = new Date().toISOString();

  return true;
}

/**
 * resolveModel(role, profile, scenarioConfig)
 *
 * Resolve model for agent role using profile and scenario config.
 *
 * @param {string} role - Agent role
 * @param {string} profile - Model profile ('quality', 'balanced', 'budget')
 * @param {object} scenarioConfig - Scenario-specific model overrides
 * @returns {string} Resolved model identifier
 */
function resolveModel(role, profile, scenarioConfig) {
  // Default model profiles
  const defaultProfiles = {
    quality: 'opus',
    balanced: 'sonnet',
    budget: 'haiku',
  };

  // Check scenario overrides first
  if (scenarioConfig && scenarioConfig.model_overrides && scenarioConfig.model_overrides[role]) {
    return scenarioConfig.model_overrides[role];
  }

  // Check role-specific profiles (if scenario provides them)
  if (scenarioConfig && scenarioConfig.role_models && scenarioConfig.role_models[role]) {
    const roleProfile = scenarioConfig.role_models[role][profile];
    if (roleProfile) {
      return roleProfile;
    }
  }

  // Fall back to default profile
  const normalizedProfile = (profile || 'balanced').toLowerCase();
  return defaultProfiles[normalizedProfile] || 'sonnet';
}

module.exports = {
  scheduleAgent,
  executeTask,
  manageLifecycle,
  resolveModel,
};
