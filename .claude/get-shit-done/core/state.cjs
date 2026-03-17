/**
 * Core State — Universal state persistence and management
 * Handles STATE.md, ROADMAP.md, checkpoint persistence
 *
 * Independent of scenario specifics - provides generic state operations
 * that work across all GSD scenarios.
 */

const fs = require('fs');
const path = require('path');

/**
 * loadState(cwd)
 *
 * Load STATE.md and parse project state.
 *
 * @param {string} cwd - Current working directory
 * @returns {object} Parsed state object
 */
function loadState(cwd) {
  const statePath = path.join(cwd, '.planning', 'STATE.md');

  if (!fs.existsSync(statePath)) {
    return {
      exists: false,
      error: 'STATE.md not found',
    };
  }

  try {
    const content = fs.readFileSync(statePath, 'utf-8');

    // Parse frontmatter if present (YAML between --- markers)
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    let frontmatter = {};
    if (frontmatterMatch) {
      // Simple YAML parsing for basic fields
      const yamlText = frontmatterMatch[1];
      const lines = yamlText.split('\n');
      for (const line of lines) {
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          const key = match[1].trim();
          let value = match[2].trim();
          // Remove quotes if present
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          frontmatter[key] = value;
        }
      }
    }

    return {
      exists: true,
      raw_content: content,
      frontmatter,
      path: statePath,
    };
  } catch (error) {
    return {
      exists: false,
      error: error.message,
    };
  }
}

/**
 * saveState(cwd, stateUpdates)
 *
 * Update STATE.md with new state.
 *
 * @param {string} cwd - Current working directory
 * @param {object} stateUpdates - State fields to update
 * @returns {boolean} Save success
 */
function saveState(cwd, stateUpdates) {
  const statePath = path.join(cwd, '.planning', 'STATE.md');

  if (!fs.existsSync(statePath)) {
    return false;
  }

  try {
    let content = fs.readFileSync(statePath, 'utf-8');

    // Update each field in stateUpdates
    for (const [field, value] of Object.entries(stateUpdates)) {
      // Try **Field:** bold format first
      const boldPattern = new RegExp(`(\\*\\*${escapeRegex(field)}:\\*\\*\\s*)(.*)`, 'i');
      if (boldPattern.test(content)) {
        content = content.replace(boldPattern, `$1${value}`);
        continue;
      }

      // Try plain Field: format
      const plainPattern = new RegExp(`(^${escapeRegex(field)}:\\s*)(.*)`, 'im');
      if (plainPattern.test(content)) {
        content = content.replace(plainPattern, `$1${value}`);
      }
    }

    fs.writeFileSync(statePath, content, 'utf-8');
    return true;
  } catch {
    return false;
  }
}

/**
 * updatePhase(cwd, phaseId, status, metadata)
 *
 * Update current phase position in STATE.md.
 *
 * @param {string} cwd - Current working directory
 * @param {string} phaseId - Phase identifier
 * @param {string} status - Phase status ('planning', 'executing', 'complete')
 * @param {object} metadata - Additional metadata
 * @returns {boolean} Update success
 */
function updatePhase(cwd, phaseId, status, metadata = {}) {
  const updates = {
    'Current Phase': phaseId,
    'Status': status,
  };

  // Add metadata fields if provided
  if (metadata.phase_name) {
    updates['Current Phase Name'] = metadata.phase_name;
  }

  if (metadata.last_activity) {
    updates['Last Activity'] = metadata.last_activity;
  }

  return saveState(cwd, updates);
}

/**
 * recordCheckpoint(cwd, checkpointData)
 *
 * Persist checkpoint for resumption.
 *
 * @param {string} cwd - Current working directory
 * @param {object} checkpointData - Checkpoint state
 * @returns {boolean} Record success
 */
function recordCheckpoint(cwd, checkpointData) {
  const checkpointDir = path.join(cwd, '.planning', 'checkpoints');

  try {
    // Ensure checkpoint directory exists
    if (!fs.existsSync(checkpointDir)) {
      fs.mkdirSync(checkpointDir, { recursive: true });
    }

    // Create checkpoint file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const checkpointFile = path.join(
      checkpointDir,
      `checkpoint-${checkpointData.phase}-${checkpointData.plan}-${timestamp}.json`
    );

    fs.writeFileSync(checkpointFile, JSON.stringify(checkpointData, null, 2), 'utf-8');

    // Update STATE.md with checkpoint info
    const updates = {
      'Paused At': checkpointData.task || 'checkpoint',
      'Resume File': path.relative(cwd, checkpointFile),
    };

    saveState(cwd, updates);

    return true;
  } catch {
    return false;
  }
}

/**
 * loadRoadmap(cwd)
 *
 * Load and parse ROADMAP.md.
 *
 * @param {string} cwd - Current working directory
 * @returns {object} Parsed roadmap structure
 */
function loadRoadmap(cwd) {
  const roadmapPath = path.join(cwd, '.planning', 'ROADMAP.md');

  if (!fs.existsSync(roadmapPath)) {
    return {
      exists: false,
      error: 'ROADMAP.md not found',
    };
  }

  try {
    const content = fs.readFileSync(roadmapPath, 'utf-8');

    // Extract phases from content
    const phasePattern = /#{2,4}\s*Phase\s+(\d+[A-Z]?(?:\.\d+)*)\s*:\s*([^\n]+)/gi;
    const phases = [];
    let match;

    while ((match = phasePattern.exec(content)) !== null) {
      phases.push({
        number: match[1],
        name: match[2].trim(),
      });
    }

    return {
      exists: true,
      raw_content: content,
      phases,
      path: roadmapPath,
    };
  } catch (error) {
    return {
      exists: false,
      error: error.message,
    };
  }
}

/**
 * updateRoadmap(cwd, phaseId, updates)
 *
 * Update ROADMAP.md phase entry.
 *
 * @param {string} cwd - Current working directory
 * @param {string} phaseId - Phase identifier
 * @param {object} updates - Fields to update (status, plans, etc.)
 * @returns {boolean} Update success
 */
function updateRoadmap(cwd, phaseId, updates) {
  const roadmapPath = path.join(cwd, '.planning', 'ROADMAP.md');

  if (!fs.existsSync(roadmapPath)) {
    return false;
  }

  try {
    let content = fs.readFileSync(roadmapPath, 'utf-8');

    // Find the phase section
    const phaseEscaped = escapeRegex(phaseId);
    const phaseSectionPattern = new RegExp(
      `(#{2,4}\\s*Phase\\s+${phaseEscaped}[\\s\\S]*?)(?=#{2,4}\\s*Phase\\s+|$)`,
      'i'
    );

    const sectionMatch = content.match(phaseSectionPattern);
    if (!sectionMatch) {
      return false;
    }

    let section = sectionMatch[0];

    // Apply updates
    if (updates.status) {
      // Update checkbox: - [ ] → - [x]
      const checkboxPattern = /(-\s*\[)[ ](])/;
      if (updates.status === 'complete') {
        section = section.replace(checkboxPattern, '$1x$2');
      }
    }

    if (updates.plan_count !== undefined) {
      // Update plan count
      const planPattern = /(\*\*Plans:\*\*\s*)(.+)/i;
      section = section.replace(planPattern, `$1${updates.plan_count}`);
    }

    // Replace section in content
    content = content.replace(phaseSectionPattern, section);

    fs.writeFileSync(roadmapPath, content, 'utf-8');
    return true;
  } catch {
    return false;
  }
}

/**
 * escapeRegex(str)
 *
 * Escape special regex characters in string.
 *
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  loadState,
  saveState,
  updatePhase,
  recordCheckpoint,
  loadRoadmap,
  updateRoadmap,
};
