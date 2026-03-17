/**
 * Core Loader — Scenario package loading and registration
 * Discovers scenarios, parses manifests, registers commands dynamically
 */

const fs = require('fs');
const path = require('path');

// In-memory scenario registry
const scenarioRegistry = {};
const commandRegistry = {};

/**
 * loadScenarios(gsdRoot)
 *
 * Discover and load all scenario packages from scenarios/ directory.
 *
 * @param {string} gsdRoot - Path to .claude/get-shit-done/
 * @returns {object} { scenarios: Map<name, manifest>, errors: Array }
 */
function loadScenarios(gsdRoot) {
  const scenariosDir = path.join(gsdRoot, 'scenarios');
  const results = { scenarios: {}, errors: [] };

  if (!fs.existsSync(scenariosDir)) {
    results.errors.push('scenarios/ directory not found');
    return results;
  }

  const scenarioDirs = fs.readdirSync(scenariosDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const scenarioName of scenarioDirs) {
    const scenarioPath = path.join(scenariosDir, scenarioName);
    const manifestPath = path.join(scenarioPath, 'manifest.json');

    try {
      // Load and parse manifest.json
      if (!fs.existsSync(manifestPath)) {
        results.errors.push(`${scenarioName}: manifest.json not found`);
        continue;
      }

      const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
      const manifest = JSON.parse(manifestContent);

      // Validate manifest structure
      const validation = validateManifest(manifest, scenarioPath);
      if (!validation.valid) {
        results.errors.push(`${scenarioName}: ${validation.errors.join(', ')}`);
        continue;
      }

      // Store in registry
      scenarioRegistry[manifest.name] = {
        manifest,
        path: scenarioPath,
        loaded: new Date()
      };

      results.scenarios[manifest.name] = manifest;

    } catch (error) {
      results.errors.push(`${scenarioName}: ${error.message}`);
    }
  }

  return results;
}

/**
 * validateManifest(manifest, scenarioPath)
 *
 * Validate manifest structure and referenced files exist.
 *
 * @param {object} manifest - Parsed manifest.json
 * @param {string} scenarioPath - Path to scenario directory
 * @returns {object} { valid: boolean, errors: Array }
 */
function validateManifest(manifest, scenarioPath) {
  const errors = [];

  // Check required fields
  if (!manifest.name) errors.push('missing name');
  if (!manifest.version) errors.push('missing version');
  if (!manifest.commands || !Array.isArray(manifest.commands)) {
    errors.push('missing or invalid commands array');
  }

  // Validate workflow files exist
  if (manifest.commands) {
    for (const cmd of manifest.commands) {
      const workflowPath = path.join(scenarioPath, cmd.workflow);
      if (!fs.existsSync(workflowPath)) {
        errors.push(`workflow not found: ${cmd.workflow}`);
      }
    }
  }

  // Validate template files exist
  if (manifest.templates) {
    for (const tpl of manifest.templates) {
      const tplPath = path.join(scenarioPath, tpl.path);
      if (!fs.existsSync(tplPath)) {
        errors.push(`template not found: ${tpl.path}`);
      }
    }
  }

  // Validate reference files exist
  if (manifest.references) {
    for (const ref of manifest.references) {
      const refPath = path.join(scenarioPath, ref.path);
      if (!fs.existsSync(refPath)) {
        errors.push(`reference not found: ${ref.path}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * getScenario(name)
 *
 * Retrieve loaded scenario by name.
 *
 * @param {string} name - Scenario name
 * @returns {object|null} Scenario registry entry or null
 */
function getScenario(name) {
  return scenarioRegistry[name] || null;
}

/**
 * getWorkflowPath(commandName)
 *
 * Get absolute workflow path for a command.
 *
 * @param {string} commandName - Command name (e.g., "gsd:new-project")
 * @returns {string|null} Absolute workflow path or null
 */
function getWorkflowPath(commandName) {
  const cmdEntry = commandRegistry[commandName];
  return cmdEntry ? cmdEntry.workflow : null;
}

module.exports = {
  loadScenarios,
  validateManifest,
  getScenario,
  getWorkflowPath,
  scenarioRegistry,
  commandRegistry
};
