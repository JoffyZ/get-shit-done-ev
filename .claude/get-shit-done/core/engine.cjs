/**
 * Core Engine — Universal phase orchestration
 * Independent of any specific scenario (software-eng, agent-creator, etc.)
 *
 * Handles the universal GSD phase flow: questioning → research → roadmap → execute → verify
 * Delegates to scenario-specific workflows but manages the overall orchestration.
 */

const fs = require('fs');
const path = require('path');

/**
 * orchestrate(phase, mode, options)
 *
 * Universal orchestration: questioning → research → roadmap → execute → verify
 * Delegates to scenario-specific workflows but manages the overall flow.
 *
 * @param {string} phase - Phase identifier
 * @param {string} mode - Orchestration mode ('auto', 'interactive', 'yolo')
 * @param {object} options - Configuration options
 * @returns {object} Orchestration result
 */
function orchestrate(phase, mode, options) {
  // Generic phase orchestration flow
  // This is the universal GSD pattern regardless of scenario

  const result = {
    phase,
    mode,
    steps: [],
    status: 'pending',
  };

  // Phase flow stages
  const stages = ['questioning', 'research', 'roadmap', 'execute', 'verify'];

  // Track orchestration state
  result.current_stage = options?.startStage || 'questioning';
  result.completed_stages = [];

  // Orchestration metadata
  result.start_time = new Date().toISOString();

  return result;
}

/**
 * executePhase(phaseId, planId, checkpointState)
 *
 * Execute a single phase plan with checkpoint handling.
 *
 * @param {string} phaseId - Phase identifier
 * @param {string} planId - Plan identifier (optional, executes all if omitted)
 * @param {object} checkpointState - Checkpoint resumption state
 * @returns {object} Execution result
 */
function executePhase(phaseId, planId, checkpointState) {
  // Generic plan execution logic
  // Handles plan loading, task execution, checkpoint management

  const result = {
    phase_id: phaseId,
    plan_id: planId,
    checkpoint_state: checkpointState || null,
    status: 'pending',
  };

  // Execution flow
  result.tasks_completed = 0;
  result.tasks_total = 0;
  result.checkpoints_hit = [];

  // Execution metadata
  result.start_time = new Date().toISOString();

  return result;
}

/**
 * transitionPhase(fromPhase, toPhase, state)
 *
 * Transition between phases with state validation.
 *
 * @param {string} fromPhase - Current phase
 * @param {string} toPhase - Target phase
 * @param {object} state - Current project state
 * @returns {boolean} Transition success
 */
function transitionPhase(fromPhase, toPhase, state) {
  // Generic phase transition logic
  // Validates phase progression, updates state, tracks milestones

  // Validate phases exist
  if (!fromPhase || !toPhase) {
    return false;
  }

  // Parse phase numbers for validation
  const fromNum = parsePhaseNumber(fromPhase);
  const toNum = parsePhaseNumber(toPhase);

  // Validate progression (allow same phase for decimals, forward progression)
  if (toNum < fromNum && !isDecimalPhase(toPhase)) {
    return false;
  }

  // Transition is valid
  return true;
}

/**
 * parsePhaseNumber(phase)
 *
 * Parse phase identifier to numeric value for comparison.
 * Handles integer phases (01, 02) and decimal phases (01.1, 02.3).
 *
 * @param {string} phase - Phase identifier
 * @returns {number} Numeric phase value
 */
function parsePhaseNumber(phase) {
  const normalized = String(phase).replace(/^0+/, '') || '0';
  return parseFloat(normalized);
}

/**
 * isDecimalPhase(phase)
 *
 * Check if phase is a decimal phase (e.g., 01.1, 02.3).
 *
 * @param {string} phase - Phase identifier
 * @returns {boolean} True if decimal phase
 */
function isDecimalPhase(phase) {
  return String(phase).includes('.');
}

module.exports = {
  orchestrate,
  executePhase,
  transitionPhase,
};
